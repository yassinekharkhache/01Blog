package talent._Blog.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record ReportRequestDto(

    @Min(value = 0, message = "should be positive")
    Long postId,

    @NotBlank(message = "reason is required")
    @Size(min = 12, message = "reason must be at least 12 characters long")
    String reason

) {}

