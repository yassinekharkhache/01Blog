package talent._Blog.Controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import talent._Blog.Service.UserService;
import talent._Blog.Model.Role;
import talent._Blog.Model.User;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/ban")
    public ResponseEntity<?> Baneuser(@RequestBody BanRequest request, @AuthenticationPrincipal User user){
        if (user == null || user.getRole() != Role.ADMIN ){
            return ResponseEntity.status(403).body(Map.of("not authrized",403));
        }
        userService.banUser(request.username());
        return ResponseEntity.ok(Map.of("valid",200));
    }
    private record BanRequest(String username) {
    }

    @DeleteMapping("/delete/{username}")
    public ResponseEntity<?> Deleteuser(@PathVariable String username, @AuthenticationPrincipal User user){

        if (user == null || user.getRole() != Role.ADMIN ){
            return ResponseEntity.status(403).body(Map.of("not authrized",403));
        }
        userService.deleteUser(username);
        return ResponseEntity.ok(Map.of("valid",200));
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) Integer age,
            @RequestParam(required = false) MultipartFile pic
    ) throws IOException {

        if (currentUser == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String picPath = currentUser.getPic(); // keep old picture if none uploaded
        if (pic != null && !pic.isEmpty()) {
            String fileName = currentUser.getUsername() + pic.getOriginalFilename().substring(pic.getOriginalFilename().lastIndexOf('.'));
            Path path = Paths.get("/home/yassine/project/01Blog/back_end/uploads/profiles/" + fileName);
            Files.createDirectories(path.getParent());
            pic.transferTo(path.toFile());
            picPath = "/profiles/" + fileName;
        }

        // Update user fields
        currentUser.setEmail(currentUser.getEmail());
        if (email != null){
            currentUser.setEmail(email);
        }
        currentUser.setPassword(password != null && !password.isBlank() ? password : currentUser.getPassword());
        currentUser.setAge(age != null ? age : currentUser.getAge());
        currentUser.setPic(picPath);
        userService.updateUser(currentUser);

        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/get/{username}")
    public ResponseEntity<?> getUserData(
        @PathVariable String username,
        @AuthenticationPrincipal User user
        ) {
        
        User target_user = userService.getUserByName(username);
        if (target_user == null) {
            return ResponseEntity.notFound().build();
        }

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