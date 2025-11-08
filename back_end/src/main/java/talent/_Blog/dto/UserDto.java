package talent._Blog.dto;

import talent._Blog.Model.Role;
import talent._Blog.Model.User;

public record UserDto(
    Long id,
    String username,
    String email,
    Integer age,
    Role role,
    String pic,
    int followers,
    int following
) {
    public static UserDto toDto(User user) {
        return new UserDto(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getAge(),
            user.getRole(),
            user.getPic(),
            user.getFollowers() != null ? user.getFollowers().size() : 0,
            user.getFollowing() != null ? user.getFollowing().size() : 0
        );
    }
}
