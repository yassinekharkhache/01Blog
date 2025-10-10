// LikeController.java
package talent._Blog.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import talent._Blog.Model.User;
import talent._Blog.Service.LikeService;

@RestController
@RequestMapping("/api/like")
public class LikeController {
    @Autowired
    private LikeService likeService;

    @PostMapping("/{postId}")
    public ResponseEntity<String> addLike(@AuthenticationPrincipal User user, @PathVariable Long postId) {
        boolean added = likeService.addLike(user, postId);
        return added ? ResponseEntity.ok("Like added") : ResponseEntity.badRequest().body("Post already liked");
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deleteLike(@AuthenticationPrincipal User user, @PathVariable Long postId) {
        boolean removed = likeService.removeLike(user, postId);
        return removed ? ResponseEntity.ok("Like removed") : ResponseEntity.badRequest().body("Post not liked yet");
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Integer> getLikesCount(@PathVariable Long postId) {
        int count = likeService.getLikesCount(postId);
        return ResponseEntity.ok(count);
    }
}
