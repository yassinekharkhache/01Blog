package talent._Blog.dto;

import jakarta.validation.constraints.NotBlank;

public record postcarddto(
        @NotBlank(message = "id required")
        Long id,
        @NotBlank(message = "title required")
        String title,
        @NotBlank(message = "content required")
        String content,
        @NotBlank(message = "image required")
        byte[] postPreviewImage,
        @NotBlank(message = "author username required")
        String authorUsername,
        @NotBlank(message = "author profile image URL required")
        String authorProfileImageUrl,
        @NotBlank(message = "is like required")
        boolean isLiked,
        @NotBlank(message = "likecount")
        Integer likecount,
        String createdAt,    
        String updatedAt
) {
}
