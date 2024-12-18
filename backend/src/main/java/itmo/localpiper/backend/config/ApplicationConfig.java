package itmo.localpiper.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import itmo.localpiper.backend.aspect.ValidateUserAspect;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.util.JwtService;

@Configuration
@EnableAspectJAutoProxy
public class ApplicationConfig {
    
    @Bean 
    @SuppressWarnings("unused")
    ValidateUserAspect validateUserAspect(UserRepository userRepository, JwtService jwtService) {
        ValidateUserAspect myAspect = new ValidateUserAspect(userRepository, jwtService);
        return myAspect;
    }
}
