package talent._Blog.mapper;

import org.springframework.stereotype.Component;
import talent._Blog.Model.User;
import talent._Blog.dto.profileDto;

@Component
public class UserMapper {

    public profileDto toProfileDto(User user) {
        if (user == null) return null;

        int followers = (user.getFollowers() != null) ? user.getFollowers().size() : 0;
        int following = (user.getFollowing() != null) ? user.getFollowing().size() : 0;
        return new profileDto(
                user.getUsername(),
                user.getEmail(),
                user.getAge(),
                user.getRole().name(),
                user.getPic(),
                followers,
                following
        );
    }
}
