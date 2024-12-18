package itmo.localpiper.backend.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.util.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;

@Aspect
@AllArgsConstructor
public class ValidateUserAspect {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    @Pointcut("execution(* itmo.localpiper.backend.util.RequestTransformer.transform(..)) && args(body, servletRequest)")
    public void transformPointcut(Object body, HttpServletRequest servletRequest) {}

    @Before("transformPointcut(body, servletRequest)")
    public void validateUserExists(JoinPoint joinPoint, Object body, HttpServletRequest servletRequest) {
        String token = servletRequest.getHeader("Authorization").substring(7);
        String email = jwtService.extractEmail(token);

        userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + email));
    }
}

