package talent._Blog.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import talent._Blog.Model.Post;
import talent._Blog.Model.User;
import talent._Blog.dto.postcarddto;
import talent._Blog.Service.LikeService;

@Component
public class Postcard {
    @Autowired
    private LikeService likeService;

    public postcarddto toCard(Post post, User user) {
        boolean isLiked = false;
        Integer likeCount = 0;
        if (user != null){
            isLiked = likeService.isLiked(user, post.getId());
        }
        likeCount = likeService.getLikesCount(post.getId());
        return new postcarddto(
            post.getId(),
            post.getTitle(),
            post.getContent(),
            post.getPostPreviewImage(),
            post.getUser().getUsername(),
            post.getUser().getPic(),
            isLiked,
            likeCount,
            post.getCreatedAt().toString(),
            post.getUpdatedAt().toString()
        );
    }
}
