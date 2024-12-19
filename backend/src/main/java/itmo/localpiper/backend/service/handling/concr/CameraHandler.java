package itmo.localpiper.backend.service.handling.concr;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.service.entity.VideoRecordingService;
import itmo.localpiper.backend.service.handling.abstr.AbstractCameraHanlder;
import itmo.localpiper.backend.service.handling.state.CameraChargeManager;
import itmo.localpiper.backend.service.handling.state.RecordingStateManager;

public class CameraHandler extends AbstractCameraHanlder {

    private final Camera camera;
    private final CameraRepository repository;
    private final VideoRecordingService service;
    private final RecordingStateManager recordingStateManager = RecordingStateManager.getInstance();
    private final CameraChargeManager chargeManager = CameraChargeManager.getInstance();

    public CameraHandler(List<String> commands, Camera camera, VideoRecordingService videoRecordingService, CameraRepository cameraRepository) {
        super(commands);
        this.camera = camera;
        this.repository = cameraRepository;
        this.service = videoRecordingService;
    }

    @Override
    public void pickCommand(String command, Object arg) {
        if (null != command) switch (command) {
            case "TURN_ON" -> turnOn();
            case "TURN_OFF" -> turnOff();
            case "START_RECORDING" -> startRecording();
            case "STOP_RECORDING" -> stopRecording();
            case "ENABLE_MS" -> enableMotionSensor();
            case "DISABLE_MS" -> disableMotionSensor();
            case "ROTATE_X" -> rotateX((boolean)arg);
            case "ROTATE_Y" -> rotateY((boolean)arg);
            case "CHARGE" -> charge();
            case "UNPLUG" -> unplug();
            default -> {
            }
        }
    }

    @Override
    protected void turnOn() {
        checkCommand("TURN_ON");
        if (!"OFF".equals(camera.getStatus())) return;
        camera.setStatus("ON");
        repository.save(camera);
        chargeManager.registerCamera(camera, repository, service);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        if (!"ON".equals(camera.getStatus())) return;
        stopRecording();
        camera.setStatus("OFF");
        repository.save(camera);
        chargeManager.deregisterCamera(camera.getId());
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void startRecording() {
        checkCommand("START_RECORDING");
        if (!"ON".equals(camera.getStatus()) || camera.getIsRecording()) return;
        camera.setIsRecording(true);
        repository.save(camera);
        chargeManager.deregisterCamera(camera.getId());
        chargeManager.registerCamera(camera, repository, service);
        recordingStateManager.startRecording(camera.getId());
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void stopRecording() {
        checkCommand("STOP_RECORDING");
        if (!camera.getIsRecording()) return;
        camera.setIsRecording(false);
        repository.save(camera);
        if (recordingStateManager.isRecording(camera.getId())) {
            ZonedDateTime startTime = recordingStateManager.getRecordingStartTime(camera.getId());
            service.create(camera.getId(), startTime, ZonedDateTime.now());
            chargeManager.deregisterCamera(camera.getId());
            chargeManager.registerCamera(camera, repository, service);
            recordingStateManager.stopRecording(camera.getId());
        }
    }

    @Override
    protected void enableMotionSensor() {
        checkCommand("ENABLE_MS");
        if (!"OFF".equals(camera.getStatus())) {
            camera.setMotionSensorEnabled(true);
        }
        repository.save(camera);
    }

    @Override
    protected void disableMotionSensor() {
        checkCommand("DISABLE_MS");
        if (!"OFF".equals(camera.getStatus())) {
            camera.setMotionSensorEnabled(false);
        }
        repository.save(camera);
    }

    @Override
    protected void rotateX(boolean neg) {
        checkCommand("ROTATE_X");
        if (!"OFF".equals(camera.getStatus())) {
            if (!neg) {
                camera.setYRotatePercent(Math.max(100, camera.getYRotatePercent() + 8));
            } else {
                camera.setYRotatePercent(Math.min(0, camera.getYRotatePercent() - 8));
            }
        }
        repository.save(camera);
    }

    @Override
    protected void rotateY(boolean neg) {
        checkCommand("ROTATE_Y");
        if (!"OFF".equals(camera.getStatus())) {
            if (!neg) {
                camera.setYRotatePercent(Math.max(100, camera.getYRotatePercent() + 8));
            } else {
                camera.setYRotatePercent(Math.min(0, camera.getYRotatePercent() - 8));
            }
        }
        repository.save(camera);
    }

    @Override
    protected void charge() {
        checkCommand("CHARGE");
        if ("ON".equals(camera.getStatus())) {
            turnOff();
        }
        if (camera.getBatteryLevel() == 100) return; 
        camera.setCharging(true);
        repository.save(camera);

        chargeManager.registerCamera(camera, repository, service);
    }

    @Override
    protected void unplug() {
        checkCommand("UNPLUG");

        camera.setCharging(false);
        repository.save(camera);

        chargeManager.deregisterCamera(camera.getId());
    }
    
}
