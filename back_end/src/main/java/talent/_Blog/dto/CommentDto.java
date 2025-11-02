package talent._Blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CommentDto(
    @NotBlank(message = "Content is required")
    @Size(min = 2, max = 1000, message = "Content must be between 5 and 500 characters")
    String content,

    @NotNull(message = "Post id is required")
    Long postId
) {}
