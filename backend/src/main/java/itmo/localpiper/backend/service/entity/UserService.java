package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public void rename(Long id, String newName) {
        User user = userRepository.findById(id).get();
        user.setName(newName);
        userRepository.save(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
