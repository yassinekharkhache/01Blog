package talent._Blog.Controllers;

// import org.apache.tomcat.util.http.parser.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import talent._Blog.Model.Post;
import talent._Blog.Model.Status;
import talent._Blog.Model.User;
import talent._Blog.Repository.PostRepository;
import talent._Blog.Service.PostService;
import talent._Blog.dto.PostDto;
import talent._Blog.dto.postcarddto;
import talent._Blog.mapper.Postcard;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping(path = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPost(
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal User user) throws IOException {
        PostDto data = new PostDto(content, title, image.getBytes());
        postService.savePost(data, user);
        return ResponseEntity.ok("Post submitted successfully");
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/following")
    public List<postcarddto> getFollowing(@RequestParam String username) {
        return postService.getFollowingPosts(username)
                .stream()
                .map(Postcard::toCard)
                .toList();
    }
    @GetMapping("/all")
    public List<postcarddto> getAllPosts() {
        return postService.getAllPosts()
                .stream()
                .map(Postcard::toCard)
                .toList();
    }
    

}
