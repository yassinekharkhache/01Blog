package talent._Blog.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

import talent._Blog.Model.Follow;
import talent._Blog.Model.User;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    List<Follow> findByFollowed(User followed);
    List<Follow> findByFollower(User follower);
    boolean existsByFollowerAndFollowed(User follower, User followed);
    Follow findByFollowerAndFollowed(User follower, User followed);
    @Modifying
    @Transactional
    @Query("DELETE FROM Follow f WHERE f.follower = :follower AND f.followed = :followed")
    void deleteByFollowerAndFollowed(User follower, User followed);
}
