package talent._Blog.Controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;

import talent._Blog.Service.UserService;
import talent._Blog.mapper.UserMapper;
import talent._Blog.Model.User;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    UserMapper userMapper;

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserData(
        @PathVariable String username,
        @AuthenticationPrincipal User user
        ) {
        
        User target_user = userService.getUserByName(username);
        if (target_user == null) {
            return ResponseEntity.notFound().build();
        }

        userMapper.toProfileDto(user);

        Map<String, Object> userData = Map.of(
                "username", target_user.getUsername(),
                "email", target_user.getEmail(),
                "age", target_user.getAge(),
                "role", target_user.getRole(),
                "pic", target_user.getPic(),
                "followers", target_user.getFollowers() != null ? target_user.getFollowers().size() : 0,
                "following", target_user.getFollowing() != null ? target_user.getFollowing().size() : 0
        );

        return ResponseEntity.ok(userData);
    }
}