package itmo.localpiper.backend.command.aspect;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class SimulationValidationAspect {
    @Before("execution(* itmo.localpiper.backend.controller.SimulationController.*(..))")
    public void validateSimulationRequest() {
        // TODO: validation
    }
}
