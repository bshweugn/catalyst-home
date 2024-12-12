package itmo.localpiper.backend.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import itmo.localpiper.backend.util.JwtService;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtFilter implements Filter {

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Optionally initialize resources here (not necessary for JWT validation)
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        // Cast to HttpServletRequest since ServletRequest doesn't have getHeader method
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String authorizationHeader = httpRequest.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); // Extract token

            if (jwtService.validateToken(token)) {
                // Proceed with the request if the token is valid
                chain.doFilter(request, response);
            } else {
                httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            }
        } else {
            // If no Authorization header is present, reject the request
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header missing or incorrect");
        }
    }

    @Override
    public void destroy() {
        // Optionally release any resources here
    }
}
