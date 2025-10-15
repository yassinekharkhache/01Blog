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

    // Post FindById(Integer PostId);
    Post findPostById(Integer id);  

    // Only fetch if Visible = true
    Optional<Post> findByIdAndVisibleTrue(Long id);

    List<Post> findByUser_userNameAndVisibleTrue(String username);

    List<Post> findAllByVisibleTrueOrderByIdDesc(Pageable pageable);

    List<Post> findByIdLessThanAndVisibleTrueOrderByIdDesc(Long lastId, Pageable pageable);

    List<Post> findByUserInAndVisibleTrueOrderByIdDesc(List<User> users, Pageable pageable);

    List<Post> findByUserInAndIdLessThanAndVisibleTrueOrderByIdDesc(List<User> users, Long lastId, Pageable pageable);
}
