package talent._Blog.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import talent._Blog.Model.Comment;
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId, Pageable pageable);
    List<Comment> findByPostIdAndIdLessThan(Long postId, Integer lastId, Pageable pageable);
    Comment getCommentById(Long id);
}
