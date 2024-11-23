package itmo.localpiper.backend.command.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.command.dto.CommandDTO;
import itmo.localpiper.backend.command.dto.CommandScriptDTO;
import itmo.localpiper.backend.command.service.SimulationExecutorService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/simul")
public class SimulationController {
    @Autowired
    private SimulationExecutorService simulationExecutorService;
    
    @PostMapping("/executeAction")
    public String executeAction(@Valid @RequestBody CommandDTO commandDTO) {
        simulationExecutorService.executeCommand(commandDTO.getCommand());
        return "Command executed: " + commandDTO.getCommand();
    }

    // GUESS WHO'S BACK, BACK AGAIN
    @PostMapping("/executeScript")
    public String executeScript(@Valid @RequestBody CommandScriptDTO commandScriptDTO) {
        simulationExecutorService.executeScript(commandScriptDTO.getCommands());
        return "Script executed with " + commandScriptDTO.getCommands().size() + " commands.";
    }
    
}
