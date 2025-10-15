package talent._Blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentDto(

    @NotBlank(message = "Content is required")
    String content,
    @NotNull(message = "Post id is required")
    Long postId

) {}