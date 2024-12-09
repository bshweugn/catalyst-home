package itmo.localpiper.backend.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ResourceUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import itmo.localpiper.backend.util.FeatureDefinition;

@Configuration
public class DeviceFeatureRegistryConfig {
    
    @Bean
    @SuppressWarnings("unused")
    Map<String, FeatureDefinition> featureRegistry() throws IOException {
        Path path = ResourceUtils.getFile("classpath:feature_definitions.json").toPath();
        String jsonContent = Files.readString(path);

        ObjectMapper objectMapper = new ObjectMapper();

        Map<String, FeatureDefinition> featureMap = objectMapper.readValue(
            jsonContent,
            new TypeReference<Map<String, FeatureDefinition>>() {}
        );
    
        return featureMap;        
    }
}
