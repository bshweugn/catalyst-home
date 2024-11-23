package itmo.localpiper.backend.command.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.command.Command;
import itmo.localpiper.backend.command.CommandParser;
import itmo.localpiper.backend.command.CommandRegistry;

@Service
public class SumulationExecutorService {
    @Autowired
    private CommandRegistry commandRegistry;

    @Autowired
    private CommandParser commandParser;

    public void executeCommand(String commandString) {
        String[] parts = commandParser.parse(commandString);
        String commandName = parts[0];
        String[] args = parts.length > 1 ? parts[1].split("\\s+") : new String[0];
        
        Command command = commandRegistry.createCommand(commandName, args);
        command.execute();
    }

    public void executeScript(List<String> commandList) {
        for (String commandLine : commandList) {
            executeCommand(commandLine);
        }
    }
}
