package talent._Blog.Service;

import org.springframework.stereotype.Service;

import talent._Blog.Repository.UserRepository;
import talent._Blog.model.User;
import talent._Blog.model.dto.UserDto;
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void saveUser(UserDto data) {
        // Convert UserDto to User entity and save
        User user = new User();
        user.setName(data.name());
        user.setEmail(data.email());
        user.setPassword(data.password());
        user.setAge(data.age());
        user.setRole(null); // Set default role or handle accordingly
        user.setStatus(null); // Set default status or handle accordingly
        userRepository.save(user);
    }

}
