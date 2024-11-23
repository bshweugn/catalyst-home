package itmo.localpiper.backend.command.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import itmo.localpiper.backend.command.CommandRegistry;
import itmo.localpiper.backend.command.commands.CamMoDetCommand;
import itmo.localpiper.backend.command.commands.MoveToCommand;
import itmo.localpiper.backend.command.commands.PickUpRbCommand;
import itmo.localpiper.backend.service.CameraService;

@Configuration
public class CommandConfig {
    // I don't like this approach: config should not know of services that commands use
    @Autowired
    private CameraService cameraService;
    
    @Bean
    public CommandRegistry commandRegistry() {
        CommandRegistry registry = new CommandRegistry();
        registry.register("CAMMODET", args -> new CamMoDetCommand(Long.valueOf(args[0]), cameraService));
        registry.register("MOVTO", args -> new MoveToCommand(Long.valueOf(args[0]), Long.valueOf(args[1])));
        registry.register("PICKUPRB", args -> new PickUpRbCommand(Long.valueOf(args[0])));
        
        return registry;
    }
}
