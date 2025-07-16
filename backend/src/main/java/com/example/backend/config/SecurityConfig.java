package com.example.backend.config;

import com.example.backend.application.services.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          .csrf().disable()
          .authorizeHttpRequests(auth -> auth
              .requestMatchers("/login**", "/oauth2/**", "/auth/**", "/error").permitAll()
              .anyRequest().permitAll()
          )
          .oauth2Login(oauth2 -> oauth2
              .defaultSuccessUrl("/oauth2/login/success")
                )
          .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
