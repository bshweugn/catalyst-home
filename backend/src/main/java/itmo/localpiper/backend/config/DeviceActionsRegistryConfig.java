package itmo.localpiper.backend.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ResourceUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class DeviceActionsRegistryConfig {
    
    @Bean
    @SuppressWarnings("unused")
    Map<String, List<String>> actionRegistry() throws IOException {
        Path path = ResourceUtils.getFile("classpath:device_actions.json").toPath();
        String jsonContent = Files.readString(path);
    
        ObjectMapper objectMapper = new ObjectMapper();
        
        Map<String, List<String>> deviceActions = objectMapper.readValue(
            jsonContent,
            new TypeReference<Map<String, List<String>>>() {}
        );

        return deviceActions;
    }
}
