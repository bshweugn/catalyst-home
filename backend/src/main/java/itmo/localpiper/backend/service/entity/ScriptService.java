package itmo.localpiper.backend.service.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Script;
import itmo.localpiper.backend.repository.ScriptRepository;

@Service
public class ScriptService {
    
    @Autowired
    private ScriptRepository scriptRepository;

    public void rename(Long id, String newName) {
        Script script = scriptRepository.findById(id).get();
        script.setName(newName);
        scriptRepository.save(script);
    }

    public List<Script> read() {
        return scriptRepository.findAll();
    }

    public void delete(Long id) {
        scriptRepository.deleteById(id);
    }
}
