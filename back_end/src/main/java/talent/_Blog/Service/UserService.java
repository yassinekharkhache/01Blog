package talent._Blog.Service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import talent._Blog.Exception.EmailAlreadyExistsException;
import talent._Blog.Model.Role;
import talent._Blog.Model.Status;
import talent._Blog.Model.User;
import talent._Blog.Repository.UserRepository;
import talent._Blog.dto.RegisterDto;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void banUser(String username) {
        User user = userRepository.findByUserName(username).orElseThrow(() -> new RuntimeException("user not found"));
        user.setBannedUntil(java.time.LocalDateTime.now().plusDays(7));
        user.setStatus(Status.Banned);
        userRepository.save(user);
    }
    @Transactional
    public void deleteUser(String username) {
        System.out.println(">>>>>>>>>>>>>>"+username +"<<<<<<<<<<<<<<<<<<<<<<<<<<");
        userRepository.deleteByUserName(username);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByName(String username) {
        return userRepository.findByUserName(username).get();
    }

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    public String hashCode(String s) {
        return encoder.encode(s);
    }

    public void saveUser(@Valid RegisterDto data) {
        if (userRepository.existsByEmail(data.email())) {
            throw new EmailAlreadyExistsException("Email '" + data.email() + "' is already registered.");
        }

        User user = new User();
        user.setUserName(data.name());
        user.setEmail(data.email());
        user.setPassword(data.password());
        user.setAge(data.age());
        user.setRole(Role.USER);
        user.setStatus(Status.Active);
        user.setPic("/default.png");

        userRepository.save(user);
    }
}