package itmo.localpiper.backend.controller.usermode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.localpiper.backend.dto.auth.LoginRequest;
import itmo.localpiper.backend.dto.auth.RegisterRequest;
import itmo.localpiper.backend.dto.auth.TokenResponse;
import itmo.localpiper.backend.service.processing.LoginProcessor;
import itmo.localpiper.backend.service.processing.RegisterProcessor;
import jakarta.validation.Valid;



@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private LoginProcessor loginProcessor;

    @Autowired
    private RegisterProcessor registerProcessor;
    
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> loginUser(@Valid @RequestBody LoginRequest request) {
        TokenResponse response = loginProcessor.process(request);
        return response.getToken() == null? ResponseEntity.status(400).body(response) : ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        TokenResponse response = registerProcessor.process(request);
        return response.getToken() == null? ResponseEntity.status(400).body(response) : ResponseEntity.ok(response);
    }
    
    
}
