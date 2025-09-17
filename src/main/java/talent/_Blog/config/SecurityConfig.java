package talent._Blog.config;

import java.util.List;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable());
        http.authorizeHttpRequests(
                request -> request.requestMatchers("register", "login").permitAll().anyRequest().authenticated());
        http.httpBasic(Customizer.withDefaults());
        http.sessionManagement(Session -> Session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    
    // @Bean
    // CorsConfigurationSource corsConfigurationSource() {
    //     CorsConfiguration configuration = new CorsConfiguration();

    //     configuration.setAllowedOrigins(List.of("http://localhost:8081"));
    //     configuration.setAllowedMethods(List.of("GET", "POST", "DELETE", "PUT"));
    //     configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

    //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

    //     source.registerCorsConfiguration("/**", configuration);

    //     return source;
    // }

}
