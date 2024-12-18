package itmo.localpiper.backend.service.handling.abstr;

import java.util.List;

import itmo.localpiper.backend.service.handling.Handler;

public abstract class AbstractCameraHanlder implements Handler {

    protected List<String> supportedCommands;

    public AbstractCameraHanlder(List<String> supportedCommands) {
        this.supportedCommands = supportedCommands;
    }

    protected void checkCommand(String command) {
        if (!supportedCommands.contains(command)) {
            throw new UnsupportedOperationException("Command not supported: " + command);
        }
    }

    public abstract void pickCommand(String command, Object arg);
    protected abstract void turnOn();
    protected abstract void turnOff();
    protected abstract void startRecording();
    protected abstract void stopRecording();
    protected abstract void enableMotionSensor();
    protected abstract void disableMotionSensor();
    protected abstract void rotateX(int x);
    protected abstract void rotateY(int y);
    protected abstract void charge();
    protected abstract void unplug();   
}
