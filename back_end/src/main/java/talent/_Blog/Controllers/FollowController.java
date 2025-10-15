package talent._Blog.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import talent._Blog.Model.User;
import talent._Blog.Service.FollowService;
import talent._Blog.Service.UserService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    FollowService followService;

    @Autowired
    UserService userService;

    @PostMapping("/add")
    public ResponseEntity<?> subscribeUser(@RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        String usernameToFollow = body.get("username");
        if (user.getUsername().equals(usernameToFollow)) {
            return ResponseEntity.status(403).body("You cannot subscribe to yourself.");
        }
        try {

            User user2 = userService.getUserByName(usernameToFollow);
            boolean success = followService.subscribe(user, user2);

            return success
                    ? ResponseEntity.ok("You are now subscribed to: " + usernameToFollow)
                    : ResponseEntity.ok("Failed to subscribe to: " + usernameToFollow);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("user name not exist");
        }
    }

    @DeleteMapping("/delete/{followed}")
    public ResponseEntity<String> unsubscribeUser(@PathVariable String followed,
            @AuthenticationPrincipal User user) {
        if (user.getUsername().equals(followed)) {
            return ResponseEntity.status(403).body("You cannot unsubscribe to yourself.");
        }
        try {
            User user2 = userService.getUserByName(followed);

            // Ensure user2 was actually found before proceeding
            if (user2 == null) {
                return ResponseEntity.status(404).body("User to unsubscribe from does not exist.");
            }

            boolean success = followService.unSubscribe(user, user2);

            // Use 200 OK or 204 No Content for success
            return success
                    ? ResponseEntity.ok("You are now unsubscribed from: " + followed)
                    : ResponseEntity.status(409).body("Failed to unsubscribe: Follow relationship not found.");                                                                                                            // failure

        } catch (Exception e) {
            return ResponseEntity.status(500).body("An internal error occurred during unsubscription.");
        }
    }
}
