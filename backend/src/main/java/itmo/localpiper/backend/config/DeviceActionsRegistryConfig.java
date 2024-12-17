package itmo.localpiper.backend.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


@Configuration
public class DeviceActionsRegistryConfig {
    
    @Bean
    @SuppressWarnings("unused")
    Map<String, List<String>> actionRegistry() throws IOException {
        // Use ClassPathResource to load the file from the classpath
        Resource resource = new ClassPathResource("device_actions.json");

        // Read the content from the resource using InputStream
        InputStream inputStream = resource.getInputStream();

        // Deserialize the JSON into a Map
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, List<String>> deviceActions = objectMapper.readValue(
            inputStream,
            new TypeReference<Map<String, List<String>>>() {}
        );

        return deviceActions;
    }
}

