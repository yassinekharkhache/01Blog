package talent._Blog.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import talent._Blog.Model.Post;
import talent._Blog.Model.Status;
import talent._Blog.Model.User;
import talent._Blog.Repository.PostRepository;
import talent._Blog.Service.PostService;
import talent._Blog.dto.PostDto;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;
    @PostMapping("/add")
    public ResponseEntity<?> addPost(
            @RequestBody PostDto data,
            @AuthenticationPrincipal User user) {
        
        postService.savePost(data,user);
        System.out.println("added post");
        return ResponseEntity.ok("Post submitted successfully");
    }

    @GetMapping("/Post/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }
}
