package talent._Blog.dto;

import jakarta.persistence.criteria.CriteriaBuilder.In;

// fill page of one single post with all details
public record postpagedto(
        Long id,
        String title,
        String content,
        byte[] postPreviewImage,
        String authorUsername,
        String authorProfileImageUrl,
        Integer likeCount,
        String createdAt,
        String updatedAt
        ) {}