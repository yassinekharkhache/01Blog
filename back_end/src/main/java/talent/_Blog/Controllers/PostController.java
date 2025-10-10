package talent._Blog.Controllers;

// import org.apache.tomcat.util.http.parser.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
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
    @PostMapping(path = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> editPost(
            @PathVariable Long id,
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal User user) throws IOException {
        byte[] imageData = image != null ? image.getBytes() : null;
        PostDto data = new PostDto(content, title, imageData);
        var updatedPost = postService.editPost(id, data, user);
        return ResponseEntity.status(200)
                .body(Map.of("message", "Post updated successfully", "id", updatedPost.getId().toString()));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> get(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
        ) {
        return ResponseEntity.ok(postPageMapper.toPage(postService.getPostById(id),user));
    }

    @GetMapping("/following")
    public List<postcarddto> getFollowing(
            @RequestParam(required = false) Long lastId,
            @AuthenticationPrincipal User user) {
        return postService.getFollowingPosts(user.getUsername(), lastId, 10)
                .stream()
                .map(post -> postcard.toCard(post, user))
                .toList();
    }

    @GetMapping("/all")
    public List<postcarddto> getAllPosts(
            @RequestParam(required = false) Long lastId,
            @AuthenticationPrincipal User user) {
        return postService.getPosts(lastId).stream()
                .map(post -> postcard.toCard(post, user))
                .toList();
    }

    @GetMapping("/my_posts")
    public List<postcarddto> getMyPosts(@AuthenticationPrincipal User user) {
        return postService.getUserPosts(user.getUsername()).stream()
                .map(post -> postcard.toCard(post, user))
                .toList();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            // 1. Retrieve post
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

            // 4. Delete post
            postService.deletePost(id);
            return ResponseEntity.ok(Map.of("message", "Post and all media deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to delete post", "error", e.getMessage()));
        }
    }

}
