package talent._Blog.mapper;

import org.springframework.stereotype.Component;
import talent._Blog.Model.Post;
import talent._Blog.Model.User;
import talent._Blog.dto.PostCardDto;
import talent._Blog.Service.LikeService;

@Component
public class Postcard {
 
    private final LikeService likeService;

    Postcard(LikeService likeService){
        this.likeService = likeService;
    }

    public PostCardDto toCard(Post post, User user) {
        boolean isLiked = false;
        Integer likeCount = 0;
        if (user != null){
            isLiked = likeService.isLiked(user, post.getId());
        }
        likeCount = likeService.getLikesCount(post.getId());
        return new PostCardDto(
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
