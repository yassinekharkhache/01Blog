package talent._Blog.Service;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import talent._Blog.Model.User;
import talent._Blog.Repository.FollowRepository;
import talent._Blog.Model.Follow;

@Service
@Transactional
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    public boolean subscribe(User follower, User followed) {

        if (followed == null) {
            return false;
        }

        if (followRepository.existsByFollowerAndFollowed(follower, followed)) {
            System.out.println("2");
            return false;
        }

        Follow subscription = new Follow();
        subscription.setFollower(follower);
        subscription.setFollowed(followed);
        followRepository.save(subscription);
        return true;
    }

    public boolean is_subsciberd(User follower, User followed) {
        return followRepository.existsByFollowerAndFollowed(follower, followed);
    }

    @Transactional
    public boolean unSubscribe(User follower, User followed) {
        if (followed == null || follower.equals(followed)) {
            System.out.println("Invalid unsubscribe attempt: followed is null or same as follower");
            return false;
        }

        try {
            Follow existing = followRepository.findByFollowerAndFollowed(follower, followed);
            if (existing == null) {
                System.out.println("No follow relationship found to unsubscribe");
                return false;
            }

            followRepository.deleteByFollowerAndFollowed(follower, followed);
            followRepository.flush();

            return true;
        } catch (Exception e) {
            System.err.println("Error during unsubscribe operation: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

}
