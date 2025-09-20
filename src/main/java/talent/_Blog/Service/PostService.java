package talent._Blog.Service;

import org.springframework.beans.factory.annotation.Autowired;

import jakarta.validation.Valid;
import talent._Blog.Model.Post;
import talent._Blog.Repository.PostRepository;
import talent._Blog.dto.PostDto;
import talent._Blog.dto.RegisterDto;

public class PostService {
    @Autowired
    private final PostRepository postRepo;

    public PostService(PostRepository postRepo) {
        this.postRepo = postRepo;
    }

    public void savePost(@Valid PostDto data) {
        Post Post = new Post();
        Post.setTitle(data.title());
        Post.setContent(data.content());
        Post.setPathsToImages(data.pathsToImages());
        Post.setCreatedAt(java.time.LocalDateTime.now());
        Post.setUpdatedAt(java.time.LocalDateTime.now());
        postRepo.save(Post);
    }


    
}
