package talent._Blog.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import talent._Blog.Model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Override
    Optional<Post> findById(Long id);
}
