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
        logger.info(buildLogMessage(joinPoint, "STARTED"));
    }

    @After("execution(* itmo.localpiper.backend.Command.execute(..))")
    public void logAfterCommandExecution(JoinPoint joinPoint) {
        logger.info(buildLogMessage(joinPoint, "COMPLETED"));
    }

    private String buildLogMessage(JoinPoint joinPoint, String status) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        return String.format(
            "Method %s.%s - Status: %s | Args: %s",
            className,
            methodName,
            status,
            args.length > 0 ? arrayToString(args) : "No arguments"
        );
    }

    private String arrayToString(Object[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < args.length; i++) {
            sb.append(args[i]);
            if (i < args.length - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }
}
