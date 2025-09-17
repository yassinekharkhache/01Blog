package talent._Blog.config;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.micrometer.common.lang.NonNull;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter  {
    
    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull jakarta.servlet.http.HttpServletResponse response,
        @NonNull jakarta.servlet.FilterChain filterChain
        ) throws jakarta.servlet.ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authHeader.substring(7);
        final String userEmail = null; // TODO: extract username from JWT token
    }
}