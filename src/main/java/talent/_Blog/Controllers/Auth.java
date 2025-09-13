package talent._Blog.Controllers;

import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import talent._Blog.Repository.UserRepository;
import talent._Blog.model.User;
import talent._Blog.model.dto.UserDto;
import talent._Blog.Service.UserService;
@RestController
public class Auth {
    private final UserRepository repo;
    private final UserService userService;

    public Auth(UserRepository repo, UserService userService) {
        this.repo = repo;
        this.userService = userService;
    }

    @PostMapping("/register")
    public String registerUser(@Valid @RequestBody UserDto data) {
        // go to servise
        userService.saveUser(data);
        return "User " + data.name() + " registered successfully!";

    }

    @PostMapping("/login")
    public String loginUser(@RequestBody User data) {
        // User user = repo.findByEmail(data.getEmail());
        // if (user != null && user.getPassword().equals(data.getPassword())) {
        //     return "User " + user.getName() + " logged in successfully!";
        // } else {
            return "Invalid email or password.";
        // }
    }
}