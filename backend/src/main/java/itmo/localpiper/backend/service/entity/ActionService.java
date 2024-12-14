package itmo.localpiper.backend.service.entity;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ActionService {
    
    private final Map<String, List<String>> actionRegistry;

    public Map<String, List<String>> read() {
        return actionRegistry;
    }
    
}
