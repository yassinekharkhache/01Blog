package talent._Blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import talent._Blog.Model.Notification;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop10ByReceiverUserNameOrderByIdDesc(String username);
    List<Notification> findTop10ByReceiverUserNameAndIdLessThanOrderByIdDesc(String username,Integer LastId);
    List<Notification> findBySeenIsFalseAndReceiverUserNameOrderByCreatedAtDesc(String username);

}