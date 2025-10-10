package talent._Blog.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.Valid;
import talent._Blog.Repository.PostRepository;
import talent._Blog.Repository.SubscribeRepository;
import talent._Blog.dto.PostDto;
import talent._Blog.Model.*;;

@Service
public class PostService {
    @Autowired
    private final PostRepository postRepo;
    private static final int PAGE_SIZE = 6;

    @Autowired
    private SubscribeRepository subscribeRepository;

    public List<Post> getAllPosts() {
        return postRepo.findAll();
    }

    // delete post
    public void deletePost(Long id, User user) {
        Post existingPost = postRepo.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        if (!existingPost.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this post");
        }
        postRepo.deleteById(id);
    }

    // Extract media URLs from post content
    public List<String> extractMediaUrls(String content) {
        List<String> urls = new ArrayList<>();

        // images
        Matcher imgMatcher = Pattern.compile("<img[^>]+src=\"([^\"]+)\"").matcher(content);
        while (imgMatcher.find())
            urls.add(imgMatcher.group(1));

        // videos
        Matcher videoMatcher = Pattern.compile("<source[^>]+src=\"([^\"]+)\"").matcher(content);
        while (videoMatcher.find())
            urls.add(videoMatcher.group(1));

        return urls;
    }

    // Delete a file from filesystem
    public void deleteFile(String type, String fileName) {//my image is here abs path : file:/home/yassine/project/01Blog/back_end/uploads/images/
        String folder = type.equals("image") ? "/home/yassine/project/01Blog/back_end/uploads/images/" : "/home/yassine/project/01Blog/back_end/uploads/videos/";
        File file = new File(folder + fileName);
        if (file.exists())
            file.delete();
    }

    // Delete the post record
    public void deletePost(Long id) {
        postRepo.deleteById(id);
    }

    // edit
    public Post editPost(Long id, @Valid PostDto data, User user) {
        Post existingPost = postRepo.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        if (!existingPost.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to edit this post");
        }
        existingPost.setTitle(data.title());
        existingPost.setContent(data.content());
        if (data.image() != null) {
            existingPost.setPostPreviewImage(data.image());
        }
        existingPost.setUpdatedAt(java.time.LocalDateTime.now());
        return postRepo.save(existingPost);
    }

    @Transactional(readOnly = true)
    public List<Post> getUserPosts(String username) {
        return postRepo.findByUser_userName(username);
    }

    public List<Post> getFollowingPosts(String username, Long lastId, int pageSize) {
        // 1. Get all users that the current user follows
        List<User> followingUsers = subscribeRepository.findBySubscriberUserName(username)
                .stream()
                .map(Subscription::getSubscribedTo)
                .toList();

        Pageable pageable = PageRequest.of(0, pageSize, Sort.by(Sort.Direction.DESC, "id"));

        // 2. Fetch posts
        if (lastId == null) {
            return postRepo.findByUserInOrderByIdDesc(followingUsers, pageable);
        } else {
            return postRepo.findByUserInAndIdLessThanOrderByIdDesc(followingUsers, lastId, pageable);
        }
    }

    public PostService(PostRepository postRepo) {
        this.postRepo = postRepo;
    }

    public Post getPostById(Long id) {
        return postRepo.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Post> getPosts(Long lastId) {
        Pageable pageable = PageRequest.of(0, PAGE_SIZE);

        if (lastId == null) {
            return postRepo.findAllByOrderByIdDesc(pageable);
        }

        return postRepo.findByIdLessThanOrderByIdDesc(lastId, pageable);
    }

    @Transactional(readOnly = true)
    public List<Post> getFollowingPosts(List<User> following, Long lastId) {
        Pageable pageable = PageRequest.of(0, PAGE_SIZE);

        if (following.isEmpty()) {
            return List.of();
        }

        if (lastId == null) {
            return postRepo.findByUserInOrderByIdDesc(following, pageable);
        }

        return postRepo.findByUserInAndIdLessThanOrderByIdDesc(following, lastId, pageable);
    }

    public Post savePost(@Valid PostDto data, User user) {
        Post Post = new Post();
        Post.setTitle(data.title());
        Post.setContent(data.content());
        Post.setPostPreviewImage(data.image());
        Post.setCreatedAt(java.time.LocalDateTime.now());
        Post.setUpdatedAt(java.time.LocalDateTime.now());
        Post.setStatus(Status.Active);
        Post.setUser(user);
        var post = postRepo.save(Post);
        return post;
    }
}
