package com.example.GesPro.Config;


import com.example.GesPro.Security.JwtAuthenticationFilter;
import com.example.GesPro.Security.JwtUtil;
import com.example.GesPro.Service.CustomUserDetailsService;

import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public JwtAuthenticationFilter authenticationJwtTokenFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userDetailsService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 👉 ajouter cette ligne
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/**").permitAll()  // ← Ajoute cette ligne EN PREMIER
                        .requestMatchers("/api/utilisateurs/**").permitAll()  // Public
                        .requestMatchers("/api/tasks/**").hasAnyRole("admin", "user")  // SEULEMENT ADMIN
                        .requestMatchers("/api/taches/**").hasAnyRole("admin", "user")//.permitAll()//.hasAnyRole("ADMIN", "USER") // ADMIN & USER
                        .requestMatchers("/api/projets/**").hasAnyRole("admin", "user")//.permitAll()//.hasAnyRole("admin")   // ADMIN & USER
                        .requestMatchers("/api/chat/**").permitAll()//.hasAnyRole("admin")   // ADMIN & USER
                      //  .requestMatchers("/ws/**").permitAll()
                      //  .requestMatchers("/api/tasks/**").hasAnyRole("admin", "user")//.permitAll()
                        .anyRequest().authenticated() // le reste authentifié
                )
                .addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration  configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List .of("http://localhost:4000", "http://localhost:8081","http://192.168.1.14:4000", "http://192.168.1.14:8081")); // autorise React
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // nécessaire si tu utilises les cookies ou l'authentification

        UrlBasedCorsConfigurationSource  source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
