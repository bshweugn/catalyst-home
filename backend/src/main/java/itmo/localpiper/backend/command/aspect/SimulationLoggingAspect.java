package itmo.localpiper.backend.command.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class SimulationLoggingAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(SimulationLoggingAspect.class);

    @Before("execution(* itmo.localpiper.backend.Command.execute(..))")
    public void logBeforeCommandExecution(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        logger.info("Executing command: {}", className);
        logger.info("Arguments: {}", args.length > 0 ? args : "No arguments provided");
    }

    @After("execution(* itmo.localpiper.backend.Command.execute(..))")
    public void logAfterCommandExecution(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        logger.info("Completed execution of command: {}", className);
    }
}
