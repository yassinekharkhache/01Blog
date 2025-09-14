package talent._Blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import talent._Blog.Model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    User findByEmail(String email);
}
