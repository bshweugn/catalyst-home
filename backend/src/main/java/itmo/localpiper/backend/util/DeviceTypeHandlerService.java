package itmo.localpiper.backend.util;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import itmo.localpiper.backend.util.enums.DeviceType;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class DeviceTypeHandlerService {
    
    private final Map<String, JsonNode> deviceRegistry;

    private final Map<String, Map<String, FeatureDefinition>> defsRegistry;

    private final Map<String, List<String>> actionRegistry;
    
    public String parseSerialNumber(String number) {
        JsonNode node = deviceRegistry.get(number);
        String type = node.get("type").asText();
        String first2Digits = number.substring(0, 2);
        String next4Digits = number.substring(2);

        return String.format("%s_%s_%s", type, first2Digits, next4Digits);
    }

    public DeviceType extractDeviceType(String typeString) {
        return DeviceType.valueOf(typeString.split("_")[0]);
    }

    public List<String> retrieveFeatures(String number) {
        JsonNode node = deviceRegistry.get(number);
        ArrayNode featuresNode = (ArrayNode) node.get("features");
        return StreamSupport.stream(featuresNode.spliterator(), false)
        .map(JsonNode::asText)
        .collect(Collectors.toList());
    }

    public Map<String, FeatureDefinition> retrieveFeaturesWithDefinitions(String number) {
        return defsRegistry.get(number);
    }

    public List<String> retrieveActionList(String number) {
        return actionRegistry.get(number);
    }
}
