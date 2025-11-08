package talent._Blog.dto;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.web.multipart.MultipartFile;

public record AddPostRequestDto(

        @NotEmpty(message = "Title cannot be empty.") @Size(min = 4, max = 100, message = "Title must be between 4 and 100 characters.")
        String title,

        @NotEmpty(message = "Content cannot be empty.") @Size(min = 4, max = 4000, message = "Content must be between 4 and 4000 characters.")
        String content,

        MultipartFile image
        ) {
}
