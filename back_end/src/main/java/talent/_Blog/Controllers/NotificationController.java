package talent._Blog.Controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import talent._Blog.Model.User;
import talent._Blog.Service.NotificationService;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{username}/{LastId}")
    public ResponseEntity<?> getUserNotifications(@PathVariable String username,@PathVariable Integer LastId,@AuthenticationPrincipal User user) {
        if (user == null){
            return ResponseEntity.status(401).body("Unauthorized");
        }
        var notifications = notificationService.getUserNotifications(username,LastId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/seen/{username}")
    public ResponseEntity<?> markAsSeen(@PathVariable String username,@AuthenticationPrincipal User user) {
        
        notificationService.markAllAsSeen(username);
        return ResponseEntity.ok(Map.of("Valid","Notifications are hided"));
    }
}
