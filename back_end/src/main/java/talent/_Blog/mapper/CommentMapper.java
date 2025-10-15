package talent._Blog.mapper;

import org.springframework.stereotype.Component;
import talent._Blog.Model.Comment;
import talent._Blog.Model.User;
import talent._Blog.dto.CommentResponseDto;

import java.util.Map;

@Component
public class CommentMapper {

    public CommentResponseDto toDto(Comment comment) {
        User user = comment.getUser();
        return new CommentResponseDto(
            comment.getId(),
            comment.getContent(),
            Map.of(
                "id", user.getId(),
                "userName", user.getUsername(),
                "pic", user.getPic()
            ),
            comment.getCreatedAt().toString(),
            comment.getUpdatedAt().toString(),
            comment.getPost().getId()
        );
    }
}
