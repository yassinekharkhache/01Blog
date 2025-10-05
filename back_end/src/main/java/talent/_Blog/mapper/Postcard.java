package talent._Blog.mapper;

import talent._Blog.Model.Post;
import talent._Blog.dto.postcarddto;

public class Postcard {
    public static postcarddto toCard(Post post) {
        return new postcarddto(
            post.getId(),
            post.getTitle(),
            post.getContent(),
            post.getPostPreviewImage(),
            post.getUser().getUsername(),
            post.getUser().getPic(),
            (long) post.getLikes().size(),
            post.getCreatedAt().toString(),
            post.getUpdatedAt().toString()
        );
    }
}