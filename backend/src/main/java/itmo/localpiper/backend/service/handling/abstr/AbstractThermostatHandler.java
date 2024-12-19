package itmo.localpiper.backend.service.handling.abstr;

import java.util.List;

import itmo.localpiper.backend.service.handling.Handler;
import itmo.localpiper.backend.util.enums.WorkMode;

public abstract class AbstractThermostatHandler implements Handler{

    protected List<String> supportedCommands;

    public AbstractThermostatHandler(List<String> supportedCommands) {
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
    protected abstract void heat();
    protected abstract void cool();
    protected abstract void changeMode(WorkMode mode);
}
