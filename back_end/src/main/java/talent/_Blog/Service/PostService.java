package talent._Blog.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.Valid;
import talent._Blog.Repository.PostRepository;
import talent._Blog.Repository.FollowRepository;
import talent._Blog.dto.PostCardDto;
import talent._Blog.dto.PostDto;
import talent._Blog.Exception.MediaLimitExceededException;
import talent._Blog.Exception.PostNotFoundException;
import talent._Blog.Model.*;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

@Service
public class PostService {

    private final NotificationService notificationService;
    private final PostRepository postRepo;
    private final FollowRepository subscribeRepository;

    private static final int PAGE_SIZE = 6;

    @Transactional
    public List<PostCardDto> searchPosts(String query, Integer lastId) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"));
        boolean noQuery = query == null || query.isEmpty();
        if (lastId == 0) {
            return noQuery
                    ? postRepo.findAll(pageable).getContent().stream().map(PostCardDto::toDto).toList()
                    : postRepo.findByTitleContainingIgnoreCase(query, pageable).stream().map(PostCardDto::toDto).toList();
        }
        return noQuery ? postRepo.findByIdLessThan(lastId, pageable).stream().map(PostCardDto::toDto).toList()
                : postRepo.findByTitleContainingIgnoreCaseAndIdLessThan(query, lastId, pageable).stream().map(PostCardDto::toDto).toList();
    }

    // @Transactional
    // public List<User> searchUsers(String query, Integer lastId) {

    //     Pageable pageable = PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "id"));
    //     boolean noQuery = query == null || query.isEmpty();
    //     if (lastId == 0) {
    //         return noQuery
    //                 ? userRepository.findAll(pageable).getContent()
    //                 : userRepository.findByUserNameContainingIgnoreCase(query, pageable);
    //     }

    //     return noQuery
    //             ? userRepository.findByIdLessThan(lastId, pageable)
    //             : userRepository.findByUserNameContainingIgnoreCaseAndIdLessThan(query, lastId, pageable);
    // }

    public PostService(NotificationService notificationService, PostRepository postRepo,
            FollowRepository subscribeRepository) {
        this.notificationService = notificationService;
        this.postRepo = postRepo;
        this.subscribeRepository = subscribeRepository;
    }

    public List<Post> getAllPosts() {
        return postRepo.findAll();
    }

    @Transactional
    public void hidePost(Integer PostId) {
        Post post = postRepo.findPostById(PostId).orElseThrow(() -> new PostNotFoundException("Post not found"));
        post.setVisible(false);
        postRepo.save(post);

    }

    public void deletePost(Long id, User user) {
        Post existingPost = postRepo.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found"));
        if (!existingPost.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this post");
        }
        postRepo.deleteById(id);
    }

    public List<String> extractMediaUrls(String content) {
        List<String> urls = new ArrayList<>();

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
    public void deleteFile(String type, String fileName) {// my image is here abs path :
                                                          // file:/home/yassine/project/01Blog/back_end/uploads/images/
        String folder = type.equals("image") ? "/home/ykharkha/Desktop/01Blog/back_end/uploads/images/"
                : "/home/ykharkha/Desktop/01Blog/back_end/uploads/videos/";
        File file = new File(folder + fileName);
        if (file.exists())
            file.delete();
    }

    // edit
    public Post editPost(Long id, @Valid PostDto data, User user) {
        Post existingPost = postRepo.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        if (!existingPost.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to edit this post");
        }
        existingPost.setTitle(data.title());
        existingPost.setContent(data.content());
        existingPost.setUpdatedAt(java.time.LocalDateTime.now());
        if (data.image() != null) {
            existingPost.setPostPreviewImage(data.image());
        }
        existingPost.setUpdatedAt(java.time.LocalDateTime.now());
        return postRepo.save(existingPost);
    }

    @Transactional(readOnly = true)
    public List<Post> getUserPosts(String username, Long lastId) {
        Pageable pageable = PageRequest.of(0, 10);
        if (lastId == null || lastId == 0) {
            return postRepo.findByUser_userNameAndVisibleTrueOrderByIdDesc(username, pageable);
        }
        return postRepo.findByUser_userNameAndIdLessThanAndVisibleTrueOrderByIdDesc(username, lastId, pageable);
    }

    @Transactional
    public List<Post> getFollowingPosts(User user, Long lastId, int pageSize) {
        List<User> followingUsers = subscribeRepository.findByFollower(user)
                .stream()
                .map(Follow::getFollowed)
                .toList();

        Pageable pageable = PageRequest.of(0, pageSize, Sort.by(Sort.Direction.DESC, "id"));

        if (lastId == null) {
            return postRepo.findByUserInAndVisibleTrueOrderByIdDesc(followingUsers, pageable);
        } else {
            return postRepo.findByUserInAndIdLessThanAndVisibleTrueOrderByIdDesc(followingUsers, lastId, pageable);
        }
    }

    public Post getPostById(Long id) {
        return postRepo.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found"));
    }

    @Transactional(readOnly = true)
    public List<Post> getPosts(Long lastId) {
        Pageable pageable = PageRequest.of(0, PAGE_SIZE);

        if (lastId == null) {
            return postRepo.findAllByVisibleTrueOrderByIdDesc(pageable);
        }

        return postRepo.findByIdLessThanAndVisibleTrueOrderByIdDesc(lastId, pageable);
    }

    @Transactional(readOnly = true)
    public List<Post> getFollowingPosts(List<User> following, Long lastId) {
        Pageable pageable = PageRequest.of(0, PAGE_SIZE);
        if (following.isEmpty()) {
            return List.of();
        }

        if (lastId == null) {
            return postRepo.findByUserInAndVisibleTrueOrderByIdDesc(following, pageable);
        }

        return postRepo.findByUserInAndIdLessThanAndVisibleTrueOrderByIdDesc(following, lastId, pageable);
    }

    public ContentMediaCount handle_image_paths(String content) {
        String regex = "<img src=\"http://localhost:8081/images/tmp/(.*?)@";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(content);

        int count = 0;
        while (matcher.find()) {
            count++;
            String imagename = matcher.group(1) + "@.png";
            Path source = Paths.get("/home/ykharkha/Desktop/01Blog/back_end/uploads/images/tmp/" + imagename);
            Path destination = Paths.get("/home/ykharkha/Desktop/01Blog/back_end/uploads/images/" + imagename);
            try {
                // Move the file (will overwrite if file already exists)
                Files.move(source, destination, StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception e) {
                System.out.println("Error moving file: " + e.getMessage());
            }
        }
        String videoRegex = "<source src=\"http://localhost:8081/videos/tmp/(.*?)@";
        Pattern videoPattern = Pattern.compile(videoRegex);
        Matcher videoMatcher = videoPattern.matcher(content);

        int videoCount = 0;
        while (videoMatcher.find()) {
            videoCount++;
            String videoname = videoMatcher.group(1) + "@.mp4";
            Path source = Paths.get("/home/ykharkha/Desktop/01Blog/back_end/uploads/videos/tmp/" + videoname);
            Path destination = Paths.get("/home/ykharkha/Desktop/01Blog/back_end/uploads/videos/" + videoname);
            try {
                Files.move(source, destination, StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception e) {
                System.out.println("Error moving video file: " + e.getMessage());
            }
        }
        content = content.replace("<img src=\"http://localhost:8081/images/tmp/",
                "<img src=\"http://localhost:8081/images/");
        content = content.replace("<source src=\"http://localhost:8081/videos/tmp/",
                "<source src=\"http://localhost:8081/videos/");

        return new ContentMediaCount(count, videoCount, content);
    }

    @Transactional
    public Post savePost(@Valid PostDto data, User user) {
        Post Post = new Post();

        Post.setTitle(data.title());
        var content = data.content();
        var contentAndtImageCount = handle_image_paths(content);
        if (contentAndtImageCount.ImageCount() > 10 || contentAndtImageCount.VideoCount() >= 1) {
            throw new MediaLimitExceededException("you can't load more than 10 images and 1 video");
        }

        String safeHtml = Jsoup.clean(contentAndtImageCount.content(), Safelist.relaxed());

        Post.setContent(safeHtml);
        Post.setPostPreviewImage(data.image());
        Post.setCreatedAt(java.time.LocalDateTime.now());
        Post.setStatus(Status.Active);
        Post.setVisible(true);
        Post.setUser(user);
        var post = postRepo.save(Post);
        notificationService.notifyFollowers(user, post);
        return post;
    }

    public record ContentMediaCount(Integer ImageCount, Integer VideoCount, String content) {
    }
}