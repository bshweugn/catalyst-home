package itmo.localpiper.backend.service.handling.abstr;

import java.util.List;

import itmo.localpiper.backend.service.handling.Handler;

public abstract class AbstractCurtainHandler implements Handler {

    protected List<String> supportedCommands;

    public AbstractCurtainHandler(List<String> supportedCommands) {
        this.supportedCommands = supportedCommands;
    }
    
    protected void checkCommand(String command) {
        if (!supportedCommands.contains(command)) {
            throw new UnsupportedOperationException("Command not supported: " + command);
        }
    }

    public abstract void pickCommand(String command, Object arg);
    protected abstract void open();
    protected abstract void close();
    protected abstract void changePercentage(int percentage);
}
