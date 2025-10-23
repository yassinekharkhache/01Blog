package talent._Blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record postcarddto(

        @NotNull(message = "id is required") Long id,

        @NotBlank(message = "title is required") String title,

        @NotBlank(message = "content is required") String content,

        @NotEmpty(message = "image is required") byte[] postPreviewImage,

        @NotBlank(message = "author username is required") String authorUsername,

        @NotBlank(message = "author profile image URL is required") String authorProfileImageUrl,

        boolean isLiked,

        @NotNull(message = "like count is required") Integer likecount,

        String createdAt,
        String updatedAt) {
}
