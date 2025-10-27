package talent._Blog.dto;

import talent._Blog.Model.Role;
import talent._Blog.Model.User;

public record UserCardDto(
    Long Id,
    String username,
    String email,
    Integer age,
    Role role,
    String pic
) {
    public static UserCardDto toDto(User user) {
        return new UserCardDto(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getAge(),
            user.getRole(),
            user.getPic()
        );
    }
}