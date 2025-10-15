package talent._Blog.dto;

import java.util.Map;

public record CommentResponseDto(
    Long id,
    String content,
    Map<String, Object> user,
    String createdAt,
    String updatedAt,
    Long postId
) {

}
