package talent._Blog.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.client.HttpClientErrorException.Unauthorized;

import talent._Blog.Exception.UnAuthorizedException;
import talent._Blog.Exception.UserNotFoundException;
import talent._Blog.Model.Comment;
import talent._Blog.Model.Post;
import talent._Blog.Model.User;
import talent._Blog.Repository.CommentRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostService postService;

    // @DeleteMapping("/delete/{commentId}")
    // public ResponseEntity<?> deleteComment(@PathVariable Long commentId,@AuthenticationPrincipal User user) {
        // return commentService.deleteComment(commentId, user);
    // }
    @Transactional
    public void deleteComment(Long commentId, User user){
        Comment comment = commentRepository.getCommentById(commentId);
        System.out.println(comment);
        if(comment == null){
            throw new talent._Blog.Exception.NotFoundException("Comment not found");
        }

        if(!comment.getUser().getId().equals(user.getId())){
            throw new UnAuthorizedException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Transactional(readOnly = true)
    public List<Comment> getCommentsByPostId(Long postId, Integer lastId) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"));
        if (lastId != null) {
            return commentRepository.findByPostIdAndIdLessThan(postId, lastId, pageable);
        } else {
            return commentRepository.findByPostId(postId, pageable);
        }
    }


    public Comment saveComment( String content, Long postId, User user) {
        Comment comment = new Comment();
        comment.setContent(content);
        Post post = postService.getPostById(postId);
        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }
}
