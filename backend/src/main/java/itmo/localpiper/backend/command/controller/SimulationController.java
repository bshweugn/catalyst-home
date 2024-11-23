package itmo.localpiper.backend.command.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/simul")
public class SimulationController {
    
    @PostMapping("/executeAction")
    public String executeAction(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }

    // GUESS WHO'S BACK, BACK AGAIN
    @PostMapping("/executeScript")
    public String executeScript(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }
    
}
