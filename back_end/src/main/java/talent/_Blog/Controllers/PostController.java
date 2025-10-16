package talent._Blog.Controllers;

// import org.apache.tomcat.util.http.parser.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import talent._Blog.Model.Role;
import talent._Blog.Model.User;
import talent._Blog.Service.PostService;
import talent._Blog.dto.PostDto;
import talent._Blog.dto.postcarddto;
import talent._Blog.mapper.Postcard;
import talent._Blog.mapper.postpage;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private Postcard postcard;

    @Autowired
    private postpage postPageMapper;

    @PostMapping(path = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPost(
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal User user) throws IOException {
        PostDto data = new PostDto(content, title, image.getBytes());
        var submittedPost = postService.savePost(data, user);
        return ResponseEntity.status(201)
                .body(Map.of("message", "Post submitted successfully", "id", submittedPost.getId().toString()));
    }

    // edit post
    @PutMapping(path = "/edit")
    public ResponseEntity<?> editPost(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {

        Long id = Long.valueOf(body.get("id").toString());
        String title = body.get("title").toString();
        String content = body.get("content").toString();
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        if (title == null || title.isBlank() || content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body("Title and content cannot be empty");
        }

        var updatedPost = postService.editPost(id, new PostDto(content, title, null), user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Post updated successfully",
                        "id", updatedPost.getId().toString()));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> get(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(postPageMapper.toPage(postService.getPostById(id), user));
    }

    @GetMapping("/following")
    public ResponseEntity<?> getFollowing(
            @RequestParam(required = false) Long lastId,
            @AuthenticationPrincipal User user) {
                if (user == null){
                    return ResponseEntity.status(403).body(Map.of("valid","ss"));
                }
        return ResponseEntity.ok(postService.getFollowingPosts(user, lastId, 10)
                .stream()
                .map(post -> postcard.toCard(post, user))
                .toList());
    }

    @GetMapping("/all")
    public List<postcarddto> getAllPosts(
            @RequestParam(required = false) Long lastId,
            @AuthenticationPrincipal User user) {
        return postService.getPosts(lastId).stream()
                .map(post -> postcard.toCard(post, user))
                .toList();
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<postcarddto>> getMyPosts(@PathVariable String username,
            @AuthenticationPrincipal User currentUser) {
        var posts = postService.getUserPosts(username);
        if (posts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var dtoList = posts.stream()
                .map(post -> postcard.toCard(post, currentUser))
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            // 1. Retrieve post
            var post = postService.getPostById(id);
            if (post == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Post not found"));
            }

            if (!post.getUser().getUsername().equals(user.getUsername()) && !user.getRole().equals(Role.ADMIN)) {
                return ResponseEntity.status(403).body(Map.of("message", "Not allowed"));
            }
            String content = post.getContent();
            List<String> mediaUrls = postService.extractMediaUrls(content); // implement in service

            for (String url : mediaUrls) {
                String fileName = url.substring(url.lastIndexOf('/') + 1);
                String type = url.matches(".*\\.(mp4|webm|ogg)$") ? "video" : "image";
                postService.deleteFile(type, fileName); // implement in service
            }

            // 4. Delete post
            postService.deletePost(id);
            return ResponseEntity.ok(Map.of("message", "Post and all media deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to delete post", "error", e.getMessage()));
        }
    }

    @PostMapping("/hide")
    public ResponseEntity<?> postMethodName(@RequestBody BanRequest request) {
        postService.hidePost(request.PostId());
        return ResponseEntity.ok(Map.of("valid", "posthided"));
    }

    public record BanRequest(
            Integer PostId) {
    }

}
