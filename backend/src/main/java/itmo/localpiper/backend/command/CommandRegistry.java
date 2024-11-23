package itmo.localpiper.backend.command;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Component;

@Component
public class CommandRegistry {
    private final Map<String, Function<String[], Command>> commandMap = new HashMap<>();

    public void register(String commandName, Function<String[], Command> commandFactory) {
        commandMap.put(commandName, commandFactory);
    }

    public Command createCommand(String commandName, String[] args) {
        Function<String[], Command> commandFactory = commandMap.get(commandName);

        if (commandFactory == null) {
            throw new IllegalArgumentException("Unknown command: " + commandName);
        }

        return commandFactory.apply(args);
    }
}
