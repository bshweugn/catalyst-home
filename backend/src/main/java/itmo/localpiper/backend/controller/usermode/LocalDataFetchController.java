package itmo.localpiper.backend.controller.usermode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import itmo.localpiper.backend.model.User;
import itmo.localpiper.backend.repository.UserRepository;
import itmo.localpiper.backend.util.JwtService;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/local")
public class LocalDataFetchController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/getUserData")
    public ResponseEntity<User> getUserData(HttpServletRequest servletRequest) {
        return ResponseEntity.ok(
            userRepository.findByEmail(
            jwtService.extractUsername(
            servletRequest.getHeader("Authorization").substring(7))).get());
    }
    
}
