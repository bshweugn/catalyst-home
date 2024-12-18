package itmo.localpiper.backend.service.handling.concr;

import java.util.List;

import itmo.localpiper.backend.model.Camera;
import itmo.localpiper.backend.repository.CameraRepository;
import itmo.localpiper.backend.service.handling.abstr.AbstractCameraHanlder;

public class CameraHandler extends AbstractCameraHanlder {

    private final Camera camera;
    private final CameraRepository repository;

    public CameraHandler(List<String> commands, Camera camera, CameraRepository cameraRepository) {
        super(commands);
        this.camera = camera;
        this.repository = cameraRepository;
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
    protected void startRecording() {
        checkCommand("START_RECORDING");
        if (!"OFF".equals(camera.getStatus())) {
            camera.setIsRecording(true);
            // TODO: start recording
        }
        repository.save(camera);
    }

    @Override
    protected void stopRecording() {
        checkCommand("STOP_RECORDING");
        if (!"OFF".equals(camera.getStatus())) {
            camera.setIsRecording(false);
            // TODO: stop recording
        }
        repository.save(camera);
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
