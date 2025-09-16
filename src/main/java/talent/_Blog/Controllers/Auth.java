package talent._Blog.Controllers;

import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import talent._Blog.Model.User;
import talent._Blog.Service.UserService;
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

    @PostMapping("/login")
    public String loginUser(@Valid @RequestBody UserDto data) {
        User user = userService.getUserByEmail(data.email());
        if (user == null || !user.getPassword().equals(userService.hashCode(data.password()))) {
            return "Invalid email or password or User";
        }
        
        return "User " + user.getName() + " logged in successfully!";
        
    }
}