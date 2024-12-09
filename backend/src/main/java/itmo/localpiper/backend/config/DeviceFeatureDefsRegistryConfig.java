package itmo.localpiper.backend.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ResourceUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import itmo.localpiper.backend.util.FeatureDefinition;

@Configuration
public class DeviceFeatureDefsRegistryConfig {
    
    @Bean
    @SuppressWarnings("unused")
    Map<String, Map<String, FeatureDefinition>> defsRegistry(
        Map<String, FeatureDefinition> featureRegistry
    ) throws IOException {
        Path path = ResourceUtils.getFile("classpath:device_features.json").toPath();
        String jsonContent = Files.readString(path);

        ObjectMapper objectMapper = new ObjectMapper();

        Map<String, List<String>> rawDeviceFeatures = objectMapper.readValue(
            jsonContent,
            new TypeReference<Map<String, List<String>>>() {}
        );

        Map<String, Map<String, FeatureDefinition>> deviceFeatureMap = new HashMap<>();

        for (Map.Entry<String, List<String>> entry : rawDeviceFeatures.entrySet()) {
            String device = entry.getKey();
            List<String> featureKeys = entry.getValue();

            Map<String, FeatureDefinition> features = new HashMap<>();
            for (String featureKey : featureKeys) {
                FeatureDefinition featureDefinition = featureRegistry.get(featureKey);
                if (featureDefinition != null) {
                    features.put(featureKey, featureDefinition);
                } else {
                    throw new IllegalArgumentException("Feature not found in registry: " + featureKey);
                }
            }

            deviceFeatureMap.put(device, features);
        }

        return deviceFeatureMap;
    }
}

