package talent._Blog.Controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import talent._Blog.Service.UserService;
import talent._Blog.dto.UserCardDto;
import talent._Blog.dto.UserDto;
import talent._Blog.Model.User;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/search/{lastId}")
    public ResponseEntity<List<UserCardDto>> searchUsers(@RequestParam("q") String query, @PathVariable Integer lastId) {
        List<User> users = userService.searchUsers(query, lastId);
        return ResponseEntity.ok(users.stream().map(UserCardDto::toDto).toList());
    }

    @PostMapping("/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> Baneuser(@RequestBody BanRequest request, @AuthenticationPrincipal User user) {
        userService.banUser(request.username());
        return ResponseEntity.ok(Map.of("valid", 200));
    }

    @PostMapping("/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> UnBaneUser(@RequestBody BanRequest request, @AuthenticationPrincipal User user) {
        userService.UnbanUser(request.username());
        return ResponseEntity.ok(Map.of("valid", 200));
    }

    private record BanRequest(String username) {
    }

    @DeleteMapping("/delete/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> Deleteuser(@PathVariable String username, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(403).body(Map.of("forbidden", 403));
        }
        userService.deleteUser(username);
        return ResponseEntity.ok(Map.of("valid", 200));
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) Integer age,
            @RequestParam(required = false) MultipartFile pic) throws IOException {

        if (currentUser == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String picPath = currentUser.getPic(); // keep old picture if none uploaded
        if (pic != null && !pic.isEmpty()) {
            String fileName = currentUser.getUsername()
                    + pic.getOriginalFilename().substring(pic.getOriginalFilename().lastIndexOf('.'));
            Path path = Paths.get("/home/ykharkha/01Blog/back_end/uploads/profiles/" + fileName);
            Files.createDirectories(path.getParent());
            pic.transferTo(path.toFile());
            picPath = "/profiles/" + fileName;
        }

        currentUser.setEmail(currentUser.getEmail());
        if (email != null) {
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
            @AuthenticationPrincipal User user) {
        User targetUser = userService.getUserByName(username);
        if (targetUser == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(UserDto.toDto(targetUser));
    }
}