package itmo.localpiper.backend.service.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.TriggerCondition;
import itmo.localpiper.backend.repository.TriggerConditionRepository;

@Service
public class TriggerConditionService {

    @Autowired
    private TriggerConditionRepository triggerConditionRepository;

    public void rename(Long id, String newName) {
        TriggerCondition triggerCondition = triggerConditionRepository.findById(id).get();
        triggerCondition.setName(newName);
        triggerConditionRepository.save(triggerCondition);
    }

    public List<TriggerCondition> read() {
        return triggerConditionRepository.findAll();
    }
    
    public TriggerCondition create(String name, String condition) {
        TriggerCondition triggerCondition = new TriggerCondition();
        triggerCondition.setName(name);
        triggerCondition.setCondition(condition);

        triggerConditionRepository.save(triggerCondition);
        return triggerCondition;
    }

    public void delete(Long id) {
        triggerConditionRepository.deleteById(id);
    }
}
