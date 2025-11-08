package talent._Blog.dto;

import talent._Blog.Model.User;
public record UserProfileUpdateDto(
    String username,
    String email,
    Integer age,
    String role,
    String profilePicUrl,
    int followersCount,
    int followingCount
) {

    public static UserProfileUpdateDto from(User user) {
        int followersSize = user.getFollowers() != null ? user.getFollowers().size() : 0;
        int followingSize = user.getFollowing() != null ? user.getFollowing().size() : 0;
        
        return new UserProfileUpdateDto(
            user.getUsername(),
            user.getEmail(),
            user.getAge(),
            user.getRole().name(),
            user.getPic(),
            followersSize,
            followingSize
        );
    }
}