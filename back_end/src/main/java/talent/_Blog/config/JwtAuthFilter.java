package talent._Blog.config;

import talent._Blog.Model.User;
import talent._Blog.Repository.UserRepository;
import talent._Blog.Service.JwtService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull jakarta.servlet.http.HttpServletResponse response,
            @NonNull jakarta.servlet.FilterChain filterChain) throws jakarta.servlet.ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        try {
            final String userName = jwtService.extractUsername(jwt);
            User user = userRepository.findByUserName(userName).get();
            if (user == null || user.getBannedUntil() != null && user.getBannedUntil().isAfter(java.time.LocalDateTime.now())) {
                filterChain.doFilter(request, response);
                return;
            }

            if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailService.loadUserByUsername(userName);
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    var authToken = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            System.out.println("jwt in not valid : " + e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

}