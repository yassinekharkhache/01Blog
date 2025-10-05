package talent._Blog.Repository;


import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import talent._Blog.Model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Override
    Optional<Post> findById(Long id);
    // List<Post> findPostsByFollowingUsername(String username);
}
