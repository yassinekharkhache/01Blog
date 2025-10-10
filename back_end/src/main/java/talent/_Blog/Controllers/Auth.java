package talent._Blog.Controllers;

import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
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
    UserDetails userDetails;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterDto data) {
        try {
            userService.saveUser(data);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
        return ResponseEntity
                .status(201)
                .body(Map.of("message", "User " + data.name() + " registered successfully!"));
    }

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    public String hashCode(String s) {
        return encoder.encode(s);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@Valid @RequestBody
    LoginDto data) {
    User user = userService.getUserByName(data.username());

    if (user == null || !user.getPassword().equals(data.password())) {
    return ResponseEntity.status(401).body(Map.of("error", "Invalid email orpassword or User"));
    }
    var jwtService = new JwtService();
    String token = jwtService.generateToken(user);
    return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/userdata")
    public ResponseEntity<?> getUserData(String token,@AuthenticationPrincipal User user) {

        try {
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            
            Map<String, Object> userData = Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "age", user.getAge(),
                "role", user.getRole(),
                "pic", user.getPic(),
                "followers", user.getFollowers().size(),
                "following", user.getFollowing().size()
                );

            return ResponseEntity.ok(userData);
            
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
    }

    @GetMapping("/isLoggedIn")
    public ResponseEntity<?> isLoggedIn(){
        return ResponseEntity.status(200).body(Map.of("auth", "true"));
    }

}
