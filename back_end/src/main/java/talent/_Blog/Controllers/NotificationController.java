package talent._Blog.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import talent._Blog.Model.User;
import talent._Blog.Service.NotificationService;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    NotificationController(NotificationService notificationService){
        this.notificationService = notificationService;
    }

    @GetMapping("/{username}/{LastId}")
    public ResponseEntity<?> getUserNotifications(@PathVariable String username,@PathVariable Integer LastId,@AuthenticationPrincipal User user) {
        if (user == null){
            return ResponseEntity.status(401).body("Unauthorized");
        }
        var notifications = notificationService.getUserNotifications(username,LastId);
        System.out.println(notifications);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/seen/all/{username}")
    public ResponseEntity<?> markAllAsSeen(@PathVariable String username,@AuthenticationPrincipal User user) {
        notificationService.markAllAsSeen(username);
        return ResponseEntity.ok(Map.of("Valid","Notifications are hided"));
    }

    @PostMapping("/seen/single/{id}")
    public ResponseEntity<?> markAsSeen(@PathVariable long id,@AuthenticationPrincipal User user) {
        notificationService.markAsSeen(id);
        return ResponseEntity.ok(Map.of("Valid","Notifications are hided"));
    }

    @GetMapping("/count")
    public ResponseEntity<?> getNotificationsCount(@AuthenticationPrincipal User user) {
        var count = notificationService.getNotificationsCount(user);
        return ResponseEntity.ok().body(Map.of("count", count));
    }

}
