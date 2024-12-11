package itmo.localpiper.backend.service.entity;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.exceptions.NonUniqueValueException;
import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> read() {
        return userRepository.findAll();
    }

    public void rename(Long id, String newName) {
        User user = userRepository.findById(id).get();
        user.setName(newName);
        userRepository.save(user);
    }

    public User create(String name, String email, byte[] profilePicture) {
        if (userRepository.findByEmail(email).isPresent()) throw new NonUniqueValueException("User with given email already exists!");
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setProfilePicture(profilePicture);

        userRepository.save(user);
        return user;
    }
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
