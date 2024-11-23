package itmo.localpiper.backend.command.aspect;

import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class SimulationLoggingAspect {
    
    @Before("execution(* itmo.localpiper.backend.Command.execute(..))")
    public void logBeforeCommandExecution() {
        System.out.println("Executing command...");
    }

    @After("execution(* itmo.localpiper.backend.Command.execute(..))")
    public void logAfterCommandExecution() {
        System.out.println("Command execution comleted.");
    }
}
