package talent._Blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import talent._Blog.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
