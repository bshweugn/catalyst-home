package itmo.localpiper.backend.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import itmo.localpiper.backend.filter.JwtFilter;
import itmo.localpiper.backend.util.JwtService;

@Configuration
public class FilterConfig {

    @Bean
    FilterRegistrationBean<JwtFilter> jwtFilter(JwtService jwtService) {
        FilterRegistrationBean<JwtFilter> registrationBean = new FilterRegistrationBean<>();
        
        registrationBean.setFilter(new JwtFilter(jwtService));
        registrationBean.addUrlPatterns("/api/*");
        
        return registrationBean;
    }
}