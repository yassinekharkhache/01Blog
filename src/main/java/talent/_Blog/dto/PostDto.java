package talent._Blog.dto;

import jakarta.validation.constraints.NotBlank;

public record PostDto(

    @NotBlank(message = "content required")
    String content,

    @NotBlank(message = "Title is required")
    String title,

    @NotBlank(message = "paths in required")
    String pathsToImages

    

) {}