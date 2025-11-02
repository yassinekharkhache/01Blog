package talent._Blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import talent._Blog.Model.Post;

public record PostCardDto(

                @NotNull(message = "id is required") Long id,
                @NotBlank(message = "title is required") String title,
                @NotBlank(message = "content is required") String content,
                @NotNull(message = "image is required") byte[] postPreviewImage,
                @NotBlank(message = "author username is required") String authorUsername,
                @NotBlank(message = "author profile image URL is required") String authorProfileImageUrl,
                boolean isLiked,

                @NotNull(message = "like count is required") Integer likecount,

                String createdAt,
                String updatedAt) {
        public static PostCardDto toDto(Post post) {
                return new PostCardDto(
                                post.getId(),
                                post.getTitle(),
                                post.getContent(),
                                post.getPostPreviewImage(),
                                post.getUser().getUsername(),
                                post.getUser().getPic(),
                                false,
                                post.getLikes().size(),
                                post.getCreatedAt().toString(),
                                post.getUpdatedAt().toString());
        }
}
