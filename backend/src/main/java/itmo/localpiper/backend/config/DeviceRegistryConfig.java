package itmo.localpiper.backend.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ResourceUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class DeviceRegistryConfig {

    @Bean
    Map<String, JsonNode> deviceRegistry() throws IOException {
        Path path = ResourceUtils.getFile("classpath:devices.json").toPath();
        String jsonContent = Files.readString(path);
    
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonContent).get("devices");
    
        Map<String, JsonNode> deviceMap = new HashMap<>();
        Iterator<Map.Entry<String, JsonNode>> fields = rootNode.fields();
    
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> field = fields.next();
            deviceMap.put(field.getKey(), field.getValue());
        }
    
        return deviceMap;
    }
    
}
