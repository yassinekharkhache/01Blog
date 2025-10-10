package talent._Blog.dto;

public record profileDto(
        String username,
        String email,
        Integer age,
        String role,
        String pic,
        int followers,
        int following
) {

}
