package itmo.localpiper.backend.service.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.Script;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.ScriptRepository;
import itmo.localpiper.backend.repository.UserRepository;

@Service
public class ScriptService {
    
    @Autowired
    private ScriptRepository scriptRepository;

    @Autowired
    private UserRepository userRepository;

    public void rename(Long id, String newName) {
        Script script = scriptRepository.findById(id).get();
        script.setName(newName);
        scriptRepository.save(script);
    }

    public List<Script> read() {
        return scriptRepository.findAll();
    }

    public void create(String name, Long userId, String file, Boolean isActive) {
        Script script = new Script();
        User user = userRepository.findById(userId).get();
        script.setName(name);
        script.setUser(user);
        script.setFile(file);
        script.setIsActive(isActive);

        scriptRepository.save(script);
    }

    public void delete(Long id) {
        scriptRepository.deleteById(id);
    }
}
