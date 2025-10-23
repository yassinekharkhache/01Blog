package talent._Blog.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import talent._Blog.Model.Comment;
import talent._Blog.Model.User;
import talent._Blog.Service.CommentService;
import talent._Blog.dto.CommentDto;
import talent._Blog.dto.CommentResponseDto;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/comments")
public class CommentsController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/{postId}")
    public List<CommentResponseDto> getCommentsByPostId(
        @PathVariable Long postId,
        @RequestParam(required = false) Integer lastId
        ) {
        var comments =  commentService.getCommentsByPostId(postId,lastId);
        return comments.stream()
                .map(CommentResponseDto::toDto)
                .toList();
    }

    @PostMapping("/add")
    public ResponseEntity<Comment> saveComment(@Valid @RequestBody CommentDto commentDto,@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Comment savedComment = commentService.saveComment(commentDto.content(),commentDto.postId(),user);
        return ResponseEntity.ok(savedComment);
    }
}
