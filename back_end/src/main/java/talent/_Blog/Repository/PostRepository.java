package talent._Blog.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import talent._Blog.Model.Post;
import talent._Blog.Model.User;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Override
    Optional<Post> findById(Long id);

    

    List<Post> findByUser_userName(String username);

    List<Post> findAllByOrderByIdDesc(Pageable pageable); // first page

    List<Post> findByIdLessThanOrderByIdDesc(Long lastId, Pageable pageable); // next pages

    // --- Posts from users the current user follows ---
    List<Post> findByUserInOrderByIdDesc(List<User> users, Pageable pageable);

    List<Post> findByUserInAndIdLessThanOrderByIdDesc(List<User> users, Long lastId, Pageable pageable);
}
