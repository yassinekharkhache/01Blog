package talent._Blog.model.dto;

import jakarta.validation.constraints.NotBlank;

public record UserDto(
    @NotBlank(message = "name is requared") String name,
    String email,
    String password,
    int age) {
}
