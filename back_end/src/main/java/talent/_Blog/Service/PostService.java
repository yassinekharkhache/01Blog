package talent._Blog.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.validation.Valid;
import talent._Blog.Model.Post;
import talent._Blog.Model.Status;
import talent._Blog.Repository.PostRepository;
import talent._Blog.dto.PostDto;
import talent._Blog.Model.*;;
@Service
public class PostService {
    @Autowired
    private final PostRepository postRepo;


    public PostService(PostRepository postRepo) {
        this.postRepo = postRepo;
    }

    public Post getPostById(Long id) {
        return postRepo.findById(id).orElse(null);
    }

    public void savePost(@Valid PostDto data,User user) {
        Post Post = new Post();
        Post.setTitle(data.title());
        Post.setContent(data.content());
        // Post.setPathsToImages(data.pathsToImages()); << todo:post
        Post.setCreatedAt(java.time.LocalDateTime.now());
        Post.setUpdatedAt(java.time.LocalDateTime.now());
        Post.setStatus(Status.Active);
        Post.setUser(user);
        postRepo.save(Post);
    }
}
