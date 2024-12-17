package itmo.localpiper.backend.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import itmo.localpiper.backend.util.FeatureDefinition;

@Configuration
public class DeviceFeatureRegistryConfig {
    
    @Bean
    @SuppressWarnings("unused")
    Map<String, FeatureDefinition> featureRegistry() throws IOException {
        // Use ClassPathResource to load the file from the classpath
        Resource resource = new ClassPathResource("feature_definitions.json");

        // Read the content from the resource using InputStream
        InputStream inputStream = resource.getInputStream();

        ObjectMapper objectMapper = new ObjectMapper();

        Map<String, FeatureDefinition> featureMap = objectMapper.readValue(
            inputStream,
            new TypeReference<Map<String, FeatureDefinition>>() {}
        );
    
        return featureMap;        
    }
}
