package talent._Blog.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import talent._Blog.Model.Post;
import talent._Blog.Model.User;
import talent._Blog.Service.FollowService;
import talent._Blog.Service.LikeService;
import talent._Blog.Service.UserService;
import talent._Blog.dto.postpagedto;
@Component
public class postpage {

    @Autowired
    private LikeService likeService;

    @Autowired
    private FollowService followService;

    @Autowired
    private UserService userService;

    public postpagedto toPage(Post post, User user) {
        boolean isLiked = false;
        Integer likeCount = 0;
        boolean isfollow = false;
        User author = userService.getUserByName(post.getUser().getUsername());
        if (user != null) {
            isLiked = likeService.isLiked(user,post.getId());
            isfollow = followService.is_subsciberd(user, author);
        }
        likeCount = likeService.getLikesCount(post.getId());

        return new postpagedto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getUser().getUsername(),
                post.getUser().getPic(),
                likeCount,
                isLiked,
                isfollow,
                author.getId(),
                post.getCreatedAt().toString(),
                post.getUpdatedAt().toString()
            );
    }
}