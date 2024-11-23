package itmo.localpiper.backend.debug;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class EnvironmentCheck {
    
    @Value("${DB_DEV_URL}")
    private String dbUrl;
    
    @Value("${DB_DEV_USERNAME}")
    private String dbUsername;
    
    @Value("${DB_DEV_PASSWORD}")
    private String dbPassword;

    @PostConstruct
    public void init() {
        System.out.println("DB URL: " + dbUrl);
        System.out.println("DB Username: " + dbUsername);
        // Make sure not to print passwords to avoid leaking sensitive information
    }
}
