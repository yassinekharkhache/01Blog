package talent._Blog.dto;

import java.util.Map;

import talent._Blog.Model.Comment;
import talent._Blog.Model.User;

public record CommentResponseDto(
    Long id,
    String content,
    Map<String, Object> user,
    String createdAt,
    String updatedAt,
    Long postId
) {
    public static CommentResponseDto toDto(Comment comment) {
        User user = comment.getUser();
        return new CommentResponseDto(
            comment.getId(),
            comment.getContent(),
            Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "pic", user.getPic()
            ),
            comment.getCreatedAt().toString(),
            comment.getUpdatedAt().toString(),
            comment.getPost().getId()
        );
    }

}
