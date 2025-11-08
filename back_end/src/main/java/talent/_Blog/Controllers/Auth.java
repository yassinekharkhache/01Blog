package talent._Blog.Controllers;

import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import talent._Blog.Model.User;
import talent._Blog.Service.JwtService;
import talent._Blog.Service.UserService;
import talent._Blog.dto.LoginDto;
import talent._Blog.dto.RegisterDto;

@RestController
public class Auth {

    private final UserService userService;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwtService;

    Auth(UserService userService, BCryptPasswordEncoder encoder, JwtService jwtService) {
        this.userService = userService;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterDto data) {
        if (!data.name().matches("[A-Za-z]+")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username should contain only letters"));
        }
        userService.saveUser(data);
        return ResponseEntity
                .status(201)
                .body(Map.of("created", data.name() + " registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@Valid @RequestBody LoginDto data) {
        User user = userService.getUserByName(data.username());

        if (user == null || !encoder.matches(data.password(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid password or User"));
        }

        if (user.getBannedUntil() != null && user.getBannedUntil().isAfter(java.time.LocalDateTime.now())) {
            return ResponseEntity.status(403).body(Map.of("error", "User is banned until " + user.getBannedUntil()));
        }
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/userdata")
    public ResponseEntity<?> getUserData(String token, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(200).body(null);
        }

        var userData = userService.getUserData(user.getUsername());
        return ResponseEntity.ok(userData);
    }
}
