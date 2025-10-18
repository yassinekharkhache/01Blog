// LikeService.java
package talent._Blog.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import talent._Blog.Model.Like;
import talent._Blog.Model.Post;
import talent._Blog.Model.User;
import talent._Blog.Repository.LikeRepository;
import talent._Blog.Repository.PostRepository;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
    }

    public boolean isLiked(User user, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        return likeRepository.existsByUserAndPost(user, post);
    }

    public boolean addLike(User user, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        if (likeRepository.existsByUserAndPost(user, post)) return false;
        Like like = new Like();
        like.setUser(user);
        like.setPost(post);
        likeRepository.save(like);
        return true;
    }

    @Transactional
    public boolean removeLike(User user, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        if (!likeRepository.existsByUserAndPost(user, post)) return false;

        likeRepository.deleteByUserAndPost(user, post);
        return true;
    }


    @Transactional
    public int getLikesCount(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        return likeRepository.findByPost(post).size();
    }
}
