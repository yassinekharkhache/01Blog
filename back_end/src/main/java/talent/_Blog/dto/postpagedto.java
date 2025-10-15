package talent._Blog.dto;

// fill page of one single post with all details
public record postpagedto(
                Long id,
                String title,
                String content,
                String authorUsername,
                String authorProfileImageUrl,
                Integer likecount,
                boolean isliked,
                boolean isfollow,
                Long authorId,
                String createdAt,
                String updatedAt
                ) {
}