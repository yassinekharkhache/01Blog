package talent._Blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PostDto(

    @NotBlank(message = "content required")
    String content,

    @NotBlank(message = "Title is required")
    String title,

    @NotNull(message = "image is required")
    byte[] image

) {}