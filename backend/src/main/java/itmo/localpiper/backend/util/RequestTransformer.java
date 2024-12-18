package itmo.localpiper.backend.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class RequestTransformer {
    
    @Autowired
    private JwtService jwtService;

    public <T> RequestPair<T> transform(T body, HttpServletRequest servletRequest) {
        String token = servletRequest.getHeader("Authorization").substring(7);
        String email = jwtService.extractEmail(token);
        return new RequestPair<>(email, body);
    }
}
