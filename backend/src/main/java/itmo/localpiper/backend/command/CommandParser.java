package itmo.localpiper.backend.command;

import org.springframework.stereotype.Component;

@Component
public class CommandParser {
    public String[] parse(String commandString) {
        return commandString.trim().split("\\s+");
    }
}
