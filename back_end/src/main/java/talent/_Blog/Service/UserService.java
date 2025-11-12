package talent._Blog.Service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.stereotype.Service;

import talent._Blog.Exception.EmailAlreadyExistsException;
import talent._Blog.Exception.UnAuthorizedException;
import talent._Blog.Exception.UserNotFoundException;
import talent._Blog.Exception.UsernameAlreadyExistsException;
import talent._Blog.Model.Role;
import talent._Blog.Model.Status;
import talent._Blog.Model.User;
import talent._Blog.Repository.UserRepository;
import talent._Blog.dto.RegisterDto;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Transactional
    public Map<String, Object> getUserData(String username) {
        User user = getUserByName(username);
        Map<String, Object> userData = Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "age", user.getAge(),
                "role", user.getRole(),
                "pic", user.getPic(),
                "followers", user.getFollowers().size(),
                "following", user.getFollowing().size());
        return userData;
    }

    @Transactional
    public List<User> searchUsers(String query, Integer lastId) {

        Pageable pageable = PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "id"));
        boolean noQuery = query == null || query.isEmpty();
        if (lastId == 0) {
            return noQuery
                    ? userRepository.findAll(pageable).getContent()
                    : userRepository.findByUserNameContainingIgnoreCase(query, pageable);
        }

        return noQuery
                ? userRepository.findByIdLessThan(lastId, pageable)
                : userRepository.findByUserNameContainingIgnoreCaseAndIdLessThan(query, lastId, pageable);
    }

    @Transactional
    public void banUser(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("user not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new UnAuthorizedException("Admin cannot be banned");
        }
        user.setBannedUntil(java.time.LocalDateTime.now().plusDays(7));
        user.setStatus(Status.Banned);
        userRepository.save(user);
    }

    @Transactional
    public void UnbanUser(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("user not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new UnAuthorizedException("Admin cannot be banned");
        }
        user.setBannedUntil(null);
        user.setStatus(Status.Active);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String username) {
        if(userRepository.findByUserName(username).get().getRole() == Role.ADMIN){
            throw new UnAuthorizedException("Admin cannot be deleted");
        }
        userRepository.deleteByUserName(username).orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Transactional
    public void updateUser(User user) {
        if (!userRepository.existsByUserName(user.getUsername())) {
            throw new UserNotFoundException("User not found");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Transactional
    public User getUserByName(String username) {
        var user = userRepository.findByUserName(username).orElse(null);
        
        if (user == null) {
            return null;
        }

        user.getFollowers();
        user.getFollowing();
        return user;
    }

    public String hashCode(String s) {
        return encoder.encode(s);
    }

    @Transactional
    public void saveUser(@Valid RegisterDto data) {
        if (userRepository.existsByEmail(data.email().toLowerCase())) {
            throw new EmailAlreadyExistsException("Email '" + data.email().toLowerCase() + "' is already registered.");
        } else if (userRepository.existsByUserName(data.name())) {
            throw new UsernameAlreadyExistsException("Username '" + data.name() + "' is already registered.");
        }

        User user = new User();
        user.setUserName(data.name());
        user.setEmail(data.email().toLowerCase());
        user.setPassword(encoder.encode(data.password()));
        user.setAge(data.age());
        user.setRole(Role.USER);
        user.setStatus(Status.Active);
        user.setPic("/default.png");

        userRepository.save(user);
    }
}