package com.Website_Selling_Clother.security;

import com.Website_Selling_Clother.entity.User;
import com.Website_Selling_Clother.utils.JwtUtilsHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class CustomJwtFilter extends OncePerRequestFilter {

    @Value("${api.prefix}")
    private String apiPrefix;

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    JwtUtilsHelper jwtUtilsHelper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            if (isBypassToken(request)) {
                filterChain.doFilter(request, response);
                return;
            }
            String token = getTokenFromHeader(request);
            if (token != null) {
                final String username = jwtUtilsHelper.extractPhoneNumber(token);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    User userDetails = (User) userDetailsService.loadUserByUsername(username);
                    if (jwtUtilsHelper.verifyToken(token)) {
                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(e.getMessage());
        }
    }

    private String getTokenFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = null;
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }
        return token;
    }

    private boolean isBypassToken(@NonNull HttpServletRequest request) {
        final List<Pair<String, String>> bypassTokens = Arrays.asList(
                Pair.of(String.format("%s/login/signin", apiPrefix), "POST"),
                Pair.of(String.format("%s/login/signup", apiPrefix), "POST"),
                Pair.of(String.format("%s/user/resetPw", apiPrefix), "POST"),
                Pair.of(String.format("%s/product", apiPrefix), "GET"),
                Pair.of(String.format("%s/product/quantity", apiPrefix), "GET"),
                Pair.of(String.format("%s/category", apiPrefix), "GET"),
                Pair.of(String.format("%s/tag", apiPrefix), "GET"),
                Pair.of(String.format("%s/blog", apiPrefix), "GET"),
                Pair.of(String.format("%s/image", apiPrefix), "GET"),
                Pair.of(String.format("%s/order", apiPrefix), "GET"),
                Pair.of(String.format("%s/order/revenue", apiPrefix), "GET"),
                Pair.of(String.format("%s/size", apiPrefix), "GET"),
                Pair.of(String.format("%s/banner", apiPrefix), "GET"),
                // Bypass xác thực cho WebSocket
                Pair.of("/ws", "GET")
        );

        for (Pair<String, String> bypassToken : bypassTokens) {
            if (request.getServletPath().contains(bypassToken.getFirst())
                    && request.getMethod().equalsIgnoreCase(bypassToken.getSecond())) {
                return true;
            }
        }
        return false;
    }
}
