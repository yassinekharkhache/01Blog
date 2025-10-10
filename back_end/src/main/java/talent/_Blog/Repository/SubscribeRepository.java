package talent._Blog.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import talent._Blog.Model.Subscription;

public interface SubscribeRepository extends JpaRepository<Subscription, Long> {
    // List<Subscription> findBySubscriberUserName(String username);
    List<Subscription> findBySubscriberUserName(String username);

}
