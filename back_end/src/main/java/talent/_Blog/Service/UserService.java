package talent._Blog.Service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.security.crypto.bcrypt.*;
import org.springframework.stereotype.Service;

import talent._Blog.Exception.EmailAlreadyExistsException;
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

    public List<User> searchUsers(String query) {
        return userRepository.findByUserNameContainingIgnoreCase(query);
    }


    public void banUser(String username) {
        User user = userRepository.findByUserName(username).orElseThrow(() -> new UserNotFoundException("user not found"));
        user.setBannedUntil(java.time.LocalDateTime.now().plusDays(7));
        user.setStatus(Status.Banned);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String username) {
        userRepository.deleteByUserName(username).orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public void updateUser(User user) {
        if (!userRepository.existsByUserName(user.getUsername())){
            throw new UserNotFoundException("User not found");
        }
        userRepository.save(user);
    }

    

    public User getUserByName(String username) {
        return userRepository.findByUserName(username).orElseThrow(() -> new UserNotFoundException("User not found"));
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
        user.setPassword(encoder.encode(data.password())); // hash password
        user.setAge(data.age());
        user.setRole(Role.USER);
        user.setStatus(Status.Active);
        user.setPic("/default.png");

        userRepository.save(user);
    }
}