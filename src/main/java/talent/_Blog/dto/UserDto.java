package talent._Blog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserDto(

    @Min(value = 13, message = "Age must be at least 13")
    @Max(value = 120, message = "Age must be less than or equal to 120")
    int age,

    @NotBlank(message = "Name is required")
    @Size(min = 6, message = "Name must be at least 6 characters long")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    String password

) {}

