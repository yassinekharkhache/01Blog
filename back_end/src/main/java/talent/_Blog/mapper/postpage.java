package talent._Blog.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import talent._Blog.Model.Post;
import talent._Blog.Model.User;
import talent._Blog.Service.LikeService;
import talent._Blog.dto.postpagedto;
@Component
public class postpage {

    @Autowired
    private LikeService likeService;

    public postpagedto toPage(Post post, User user) {
        boolean isLiked = false;
        Integer likeCount = 0;
        if (user != null) {
            isLiked = likeService.isLiked(user,post.getId());
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
                post.getCreatedAt().toString(),
                post.getUpdatedAt().toString());
    }
}