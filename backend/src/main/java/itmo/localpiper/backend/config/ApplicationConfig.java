package itmo.localpiper.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import itmo.localpiper.backend.aspect.ValidateUserAspect;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.handling.state.CameraChargeManager;
import itmo.localpiper.backend.util.JwtService;
import jakarta.annotation.PreDestroy;

@Configuration
@EnableAspectJAutoProxy
public class ApplicationConfig {

    @Bean
    @SuppressWarnings("unused")
    CameraChargeManager cameraChargeManager() {
        CameraChargeManager manager = CameraChargeManager.getInstance();
        manager.start();
        return manager;
    }

    @PreDestroy
    public void stopCameraChargeManager() {
        CameraChargeManager manager = CameraChargeManager.getInstance();
        manager.stop();
    }
    
    @Bean 
    @SuppressWarnings("unused")
    ValidateUserAspect validateUserAspect(UserRepository userRepository, JwtService jwtService) {
        ValidateUserAspect myAspect = new ValidateUserAspect(userRepository, jwtService);
        return myAspect;
    }
}
