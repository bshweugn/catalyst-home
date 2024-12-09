package itmo.localpiper.backend.service.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import itmo.localpiper.backend.repository.UserDeviceActionRelRepository;

@Service
public class UserDeviceActionRelService {
    
    @Autowired
    private UserDeviceActionRelRepository repository;

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
