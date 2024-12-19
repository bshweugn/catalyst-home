package itmo.localpiper.backend.service.handling.abstr;

import java.util.List;

import itmo.localpiper.backend.service.handling.Handler;

public abstract class AbstractHumidifierHandler implements Handler {
    
    protected List<String> supportedCommands;

    public AbstractHumidifierHandler(List<String> supportedCommands) {
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
    protected abstract void humidify(int target);
    protected abstract void changeMode(String mode);
}
