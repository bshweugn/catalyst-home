package itmo.localpiper.backend.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class DeviceRegistryConfig {

    @Bean
    @SuppressWarnings("unused")
    Map<String, JsonNode> deviceRegistry() throws IOException {
        // Use ClassPathResource to load the file from the classpath
        Resource resource = new ClassPathResource("devices.json");

        // Read the content from the resource using InputStream
        InputStream inputStream = resource.getInputStream();
    
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(inputStream).get("devices");
    
        Map<String, JsonNode> deviceMap = new HashMap<>();
        Iterator<Map.Entry<String, JsonNode>> fields = rootNode.fields();
    
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> field = fields.next();
            deviceMap.put(field.getKey(), field.getValue());
        }
    
        return deviceMap;
    }
    
}
