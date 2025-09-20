package talent._Blog.Controllers;

import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import talent._Blog.Model.User;
import talent._Blog.Service.JwtService;
import talent._Blog.Service.UserService;
import talent._Blog.dto.LoginDto;
import talent._Blog.dto.UserDto;
// import org.springframework.http.*;
@RestController
public class Auth {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserDto data) {
        try{
            userService.saveUser(data);
        }catch(Exception e){
            return ResponseEntity.status(400).body("Registration failed: " + e.getMessage());
        }
        return ResponseEntity
                .status(201)
                .body("User " + data.name() + " registered successfully!");
    }

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    public String hashCode(String s){
        return encoder.encode(s);
    }
    @PostMapping("/login")
    public String loginUser(@Valid @RequestBody LoginDto data) {
        User user = userService.getUserByName(data.username());
        System.out.println(user);
        if (user == null || !user.getPassword().equals(data.password())) {
            return "Invalid email or password or User";
        }
        
        var jwtService = new JwtService();
        String token = jwtService.generateToken(user);

        return token;
        
    }


}

