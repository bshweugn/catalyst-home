package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Action;
import itmo.localpiper.backend.repository.ActionRepository;

@Service
public class ActionService {
    
    @Autowired
    private ActionRepository actionRepository;

    public void rename(Long id, String newName) {
        Action action = actionRepository.findById(id).get();
        action.setName(newName);
        actionRepository.save(action);
    }

    public void delete(Long id) {
        actionRepository.deleteById(id);
    }
    
}
