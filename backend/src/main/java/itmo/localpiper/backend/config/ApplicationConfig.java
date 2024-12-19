package itmo.localpiper.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import itmo.localpiper.backend.aspect.ValidateUserAspect;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.service.handling.state.manager.CameraChargeManager;
import itmo.localpiper.backend.service.handling.state.manager.LeakDetectorChargeManager;
import itmo.localpiper.backend.service.handling.state.manager.RelayChargeManager;
import itmo.localpiper.backend.service.handling.state.manager.TemperatureSensorChargeManager;
import itmo.localpiper.backend.service.handling.state.manager.ThermostatHeatManager;
import itmo.localpiper.backend.service.handling.state.manager.ValveChargeManager;
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

    @Bean
    @SuppressWarnings("unused")
    RelayChargeManager relayChargeManager() {
        RelayChargeManager manager = RelayChargeManager.getInstance();
        manager.start();
        return manager;
    }

    @Bean
    @SuppressWarnings("unused")
    ValveChargeManager valveChargeManager() {
        ValveChargeManager manager = ValveChargeManager.getInstance();
        manager.start();
        return manager;
    }

    @Bean
    @SuppressWarnings("unused")
    LeakDetectorChargeManager leakDetectorChargeManager() {
        LeakDetectorChargeManager manager = LeakDetectorChargeManager.getInstance();
        manager.start();
        return manager;
    }

    @Bean
    @SuppressWarnings("unused")
    TemperatureSensorChargeManager temperatureSensorChargeManager() {
        TemperatureSensorChargeManager manager = TemperatureSensorChargeManager.getInstance();
        manager.start();
        return manager;
    }

    @Bean
    @SuppressWarnings("unused")
    ThermostatHeatManager thermostatHeatManager() {
        ThermostatHeatManager manager = ThermostatHeatManager.getInstance();
        manager.start();
        return manager;
    }

    @PreDestroy
    @SuppressWarnings("unused")
    void stopManagers() {
        CameraChargeManager cameraChargeManager = CameraChargeManager.getInstance();
        RelayChargeManager relayChargeManager = RelayChargeManager.getInstance();
        ValveChargeManager valveChargeManager = ValveChargeManager.getInstance();
        ThermostatHeatManager thermostatHeatManager = ThermostatHeatManager.getInstance();
        LeakDetectorChargeManager leakDetectorChargeManager = LeakDetectorChargeManager.getInstance();
        TemperatureSensorChargeManager temperatureSensorChargeManager = TemperatureSensorChargeManager.getInstance();
        cameraChargeManager.stop();
        relayChargeManager.stop();
        valveChargeManager.stop();
        thermostatHeatManager.stop();
        leakDetectorChargeManager.stop();
        temperatureSensorChargeManager.stop();
    }
    
    @Bean 
    @SuppressWarnings("unused")
    ValidateUserAspect validateUserAspect(UserRepository userRepository, JwtService jwtService) {
        ValidateUserAspect myAspect = new ValidateUserAspect(userRepository, jwtService);
        return myAspect;
    }
}
