package talent._Blog.Repository;

import java.util.List;
import java.util.Optional;

// import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import talent._Blog.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUserName(String UserName);
    Optional<User> findByUserName(String name);
    Optional<User> findByEmail(String email);
    Optional<User> deleteByUserName(String userName);
    List<User> findByUserNameContainingIgnoreCase(String username);
}
