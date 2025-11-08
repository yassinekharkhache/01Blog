package talent._Blog.dto;

import java.time.LocalDateTime;

import talent._Blog.Model.Role;
import talent._Blog.Model.User;

public record UserCardDto(
    Long Id,
    String username,
    String email,
    Integer age,
    Role role,
    String pic,
    boolean banned
) {
    public static UserCardDto toDto(User user) {
        var banned = false;
        if (user.getBannedUntil() != null && user.getBannedUntil().isAfter(LocalDateTime.now())){
            banned = true;
        }
        return new UserCardDto(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getAge(),
            user.getRole(),
            user.getPic(),
            banned
        );
    }
}