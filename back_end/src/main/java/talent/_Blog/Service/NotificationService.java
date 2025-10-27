package talent._Blog.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import talent._Blog.Model.*;
import talent._Blog.Repository.NotificationRepository;
import talent._Blog.Repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final UserRepository UserRepository;


    @Transactional
    public void notifyFollowers(User UserAuthor, Post post) {
        var author = UserRepository.findByUserName(UserAuthor.getUsername()).get();
        author.getFollowers().forEach(follower -> {
            Notification notif = Notification.builder()
                    .receiver(follower)
                    .sender(author)
                    .message(author.getUsername() + " just posted a new blog: " + post.getTitle())
                    .seen(false)
                    .build();
            notificationRepo.save(notif);
        });
    }

    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(String username, Integer lastId) {
        if (lastId == 0) {
            return notificationRepo.findTop10ByReceiverUserNameOrderByIdDesc(username);
        } else {
            return notificationRepo.findTop10ByReceiverUserNameAndIdLessThanOrderByIdDesc(username, lastId);
        }
    }

    @Transactional
    public void markAllAsSeen(String username) {
        List<Notification> notifs = notificationRepo.findBySeenIsFalseAndReceiverUserNameOrderByCreatedAtDesc(username);
        notifs.forEach(n -> n.setSeen(true));
        notificationRepo.saveAll(notifs);
    }
}
