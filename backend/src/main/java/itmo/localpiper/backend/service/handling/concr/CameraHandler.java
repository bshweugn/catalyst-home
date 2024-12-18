package itmo.localpiper.backend.service.handling.concr;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.service.entity.VideoRecordingService;
import itmo.localpiper.backend.service.handling.abstr.AbstractCameraHanlder;
import itmo.localpiper.backend.service.handling.state.RecordingStateManager;

public class CameraHandler extends AbstractCameraHanlder {

    private final Camera camera;
    private final CameraRepository repository;
    private final VideoRecordingService service;
    private final RecordingStateManager recordingStateManager = RecordingStateManager.getInstance();

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
            case "ROTATE_X" -> rotateX((int)arg);
            case "ROTATE_Y" -> rotateY((int)arg);
            case "CHARGE" -> charge();
            case "UNPLUG" -> unplug();
            default -> {
            }
        }
    }

    @Override
    protected void turnOn() {
        checkCommand("TURN_ON");
        camera.setStatus("ON");
        repository.save(camera);
    }

    @Override
    protected void turnOff() {
        checkCommand("TURN_OFF");
        stopRecording();
        camera.setStatus("OFF");
        repository.save(camera);
    }

    @Override
    @Transactional(propagation=Propagation.REQUIRES_NEW)
    protected void startRecording() {
        checkCommand("START_RECORDING");
        if (!"OFF".equals(camera.getStatus())) {
            camera.setIsRecording(true);
            repository.save(camera);
            if (!recordingStateManager.isRecording(camera.getId())) recordingStateManager.startRecording(camera.getId());
        }
    }

    @Override
    @Transactional(propagation=Propagation.REQUIRES_NEW)
    protected void stopRecording() {
        checkCommand("STOP_RECORDING");
        if (!"OFF".equals(camera.getStatus())) {
            camera.setIsRecording(false);
            repository.save(camera);
            if (recordingStateManager.isRecording(camera.getId())) {
                ZonedDateTime startTime = recordingStateManager.getRecordingStartTime(camera.getId());
                service.create(camera.getId(), startTime, ZonedDateTime.now());
                recordingStateManager.stopRecording(camera.getId());
            }
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
    protected void rotateX(int x) {
        checkCommand("ROTATE_X");
        if (x < 0 || x > 100) throw new IllegalArgumentException("X must be between 0 and 100");
        if (!"OFF".equals(camera.getStatus())) {
            camera.setXRotatePercent(x);
        }
        repository.save(camera);
    }

    @Override
    protected void rotateY(int y) {
        checkCommand("ROTATE_Y");
        if (y < 0 || y > 100) throw new IllegalArgumentException("Y must be between 0 and 100");
        if (!"OFF".equals(camera.getStatus())) {
            camera.setXRotatePercent(y);
        }
        repository.save(camera);
    }

    @Override
    protected void charge() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'charge'");
    }

    @Override
    protected void unplug() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'unplug'");
    }
    
}
