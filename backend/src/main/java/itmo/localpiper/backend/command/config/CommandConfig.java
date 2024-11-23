package itmo.localpiper.backend.command.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import itmo.localpiper.backend.command.CommandRegistry;
import itmo.localpiper.backend.command.commands.CamMoDetCommand;
import itmo.localpiper.backend.command.commands.MoveToCommand;

@Configuration
public class CommandConfig {
    
    @Bean
    public CommandRegistry commandRegistry() {
        CommandRegistry registry = new CommandRegistry();
        registry.register("CAMMODET", args -> new CamMoDetCommand(Long.valueOf(args[0])));
        registry.register("MOVTO", args -> new MoveToCommand(args[0], args[1]));
        
        return registry;
    }
}
