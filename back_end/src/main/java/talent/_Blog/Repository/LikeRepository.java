package talent._Blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import talent._Blog.Model.Like;
import talent._Blog.Model.Post;
import talent._Blog.Model.User;
import java.util.List;


@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserAndPost(User user, Post post);
    void deleteByUserAndPost(User user, Post post);
    List<Like> findByUser(User user);
    List<Like> findByPost(Post post);
}
