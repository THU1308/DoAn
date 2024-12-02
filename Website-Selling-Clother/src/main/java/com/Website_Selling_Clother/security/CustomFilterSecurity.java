package com.Website_Selling_Clother.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
public class CustomFilterSecurity {

    @Value("${api.prefix}")
    private String apiPrefix;

    @Autowired
    CustomUserDetailService customUserDetailService;

    @Autowired
    CustomJwtFilter customJwtFilter;

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity httpSecurity) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = httpSecurity.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(customUserDetailService).passwordEncoder(passwordEncoder());

        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .addFilterBefore(customJwtFilter, UsernamePasswordAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {
                    CorsConfiguration configuration = new CorsConfiguration();
                    configuration.setAllowedOrigins(List.of("http://localhost:4200"));
                    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
                    configuration.setExposedHeaders(List.of("x-auth-token"));
                    configuration.setAllowCredentials(true);  // Cho phép credentials
                    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                    source.registerCorsConfiguration("/**", configuration);
                    cors.configurationSource(source);
                })
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(String.format("%s/login/signin", apiPrefix)).permitAll()
                            .requestMatchers(POST, String.format("%s/login/signup", apiPrefix)).permitAll()
                            .requestMatchers(POST, String.format("%s/user/resetPw", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/category/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/product/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/tag/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/blog/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/image/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/order/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/user/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/size/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/banner/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/product-size/**", apiPrefix)).permitAll()
                            .requestMatchers(GET, String.format("%s/admin/**", apiPrefix)).fullyAuthenticated()
                            .requestMatchers(GET, String.format("%s/dashboard/**", apiPrefix)).fullyAuthenticated()
                            .requestMatchers(POST, String.format("%s/admin/**", apiPrefix)).fullyAuthenticated()
                            .requestMatchers(POST, String.format("%s/dashboard/**", apiPrefix)).fullyAuthenticated()
                            .requestMatchers(PUT, String.format("%s/admin/**", apiPrefix)).fullyAuthenticated()
                            .requestMatchers(PUT, String.format("%s/dashboard/**", apiPrefix)).fullyAuthenticated()
                            .requestMatchers(DELETE, String.format("%s/admin/**", apiPrefix)).fullyAuthenticated()
                            .requestMatchers(DELETE, String.format("%s/dashboard/**", apiPrefix)).fullyAuthenticated()
                            .requestMatchers("/ws/**").permitAll()  // Cho phép tất cả các yêu cầu WebSocket không cần xác thực
                            .anyRequest().authenticated();
                })
                // Thêm xử lý cho lỗi Unauthorized và Access Denied
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling
                                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                                .accessDeniedHandler(new CustomAccessDeniedHandler())
                );

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
