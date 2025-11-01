package talent._Blog.Controllers;

// import org.apache.tomcat.util.http.parser.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
            @RequestPart(value = "image", required = true) MultipartFile image,
            @AuthenticationPrincipal User user) throws IOException {

        System.out.println(content+" "+title);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not authenticated. Please log in to create a post."));
        }

        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Title cannot be empty."));
        }
        if (title.length() < 4 || title.length() > 100) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Title must be between 4 and 100 characters."));
        }

        // Validate content
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Content cannot be empty."));
        }
        if (content.length() < 4 || content.length() > 4000) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Content must be between 4 and 4000 characters."));
        }

        byte[] imageBytes = null;
        if (image != null && !image.isEmpty()) {
            if (image.getSize() > 1 * 1024 * 1024) { // 2 MB
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Image size exceeds the maximum limit of 5 MB."));
            }
            imageBytes = image.getBytes();
        }

        // Build DTO and save post
        PostDto data = new PostDto(content.trim(), title.trim(), imageBytes);
        var submittedPost = postService.savePost(data, user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Post submitted successfully.",
                        "postId", submittedPost.getId().toString(),
                        "author", user.getUsername()));
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

        var post = postPageMapper.toPage(postService.getPostById(id), user);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/following")
    public ResponseEntity<?> getFollowingPosts(
            @RequestParam(required = false) Long lastId,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(403).body(Map.of("valid", "ss"));
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

    @GetMapping("/profile/{username}")
    public ResponseEntity<List<postcarddto>> getPosts(@PathVariable String username,
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = true) Long lastId) {
        var posts = postService.getUserPosts(username, lastId);
        var dtoList = posts.stream()
                .map(post -> postcard.toCard(post, currentUser))
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long id, @AuthenticationPrincipal User user) {
        var post = postService.getPostById(id);
        if (post == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Post not found"));
        }
        if (!post.getUser().getUsername().equals(user.getUsername())) {
            return ResponseEntity.status(403).body(Map.of("message", "Not allowed"));
        }

        String content = post.getContent();
        List<String> mediaUrls = postService.extractMediaUrls(content); // implement in service

        for (String url : mediaUrls) {
            String fileName = url.substring(url.lastIndexOf('/') + 1);
            String type = url.matches(".*\\.(mp4|webm|ogg)$") ? "video" : "image";
            postService.deleteFile(type, fileName); // implement in service
        }

        postService.deletePost(id, user);
        return ResponseEntity.ok(Map.of("message", "Post and all media deleted successfully"));
    }

    @PostMapping("/hide")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> postMethodName(@RequestBody HideRequest request, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(403).body(Map.of("not authrized", 403));

        }
        postService.hidePost(request.PostId());
        return ResponseEntity.ok(Map.of("valid", "posthided"));
    }

    public record HideRequest(Integer PostId) {
    }

}
