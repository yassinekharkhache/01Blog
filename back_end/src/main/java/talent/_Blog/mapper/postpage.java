package talent._Blog.mapper;

import talent._Blog.Model.Post;
import talent._Blog.dto.postpagedto;

public class postpage {
    public static postpagedto toPage(Post post) {
        return new postpagedto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getUser().getUsername(),
                post.getUser().getPic(),
                post.getCreatedAt().toString(),
                post.getUpdatedAt().toString()
        );
    }
}