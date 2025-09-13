package talent._Blog;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import talent._Blog.Repository.UserRepository;
import talent._Blog.model.User;
@RestController
public class Register {
    private final UserRepository repo;

    public Register(UserRepository repo) {
        this.repo = repo;
    }
    @PostMapping("/register")
    public String registerUser(@RequestBody User data) {
        repo.save(data);
        return "User " + data.getName() + " registered successfully!";
    }
}