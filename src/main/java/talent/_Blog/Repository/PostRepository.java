package talent._Blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import talent._Blog.Model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}
