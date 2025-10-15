package talent._Blog.Repository;

import java.util.Optional;

// import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import talent._Blog.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByUserName(String name);
    Optional<User> findByEmail(String email);
    void deleteByUserName(String userName);

}
