package itmo.localpiper.backend.util;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

@Service
public class JwtService {

    private final SecretKey secretKey;

    // Secret key initialization
    public JwtService() {
        this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Generates a secure random key
    }

    /**
     * Generates a JWT token for the given username.
     */
    public String generateToken(String username, long expirationMillis) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMillis);

        Map<String, Object> claims = Map.of(
            "sub", username,
            "iat", now,
            "exp", expiration
        );

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(secretKey)
                .compact();
    }


    /**
     * Validates a JWT token.
     *
     * @param token the JWT token to validate
     * @return true if the token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);
            return true; // If parsing succeeds, the token is valid
        } catch (ExpiredJwtException e) {
            System.err.println("Token has expired");
        } catch (MalformedJwtException | UnsupportedJwtException | SignatureException | IllegalArgumentException e) {
            System.err.println("Token validation error: " + e.getMessage());
        }
        return false;
    }

    /**
     * Extracts the username from a JWT token.
     *
     * @param token the JWT token
     * @return the username (subject) stored in the token
     */
    public String extractEmail(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getSubject(); // 'sub' is used for the username
        } catch (Exception e) {
            System.err.println("Failed to extract username: " + e.getMessage());
            return null;
        }
    }

    /**
     * Extracts all claims from a JWT token.
     *
     * @param token the JWT token
     * @return the claims
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Retrieves the secret key for use in other services if needed.
     */
    public SecretKey getSecretKey() {
        return secretKey;
    }
}

