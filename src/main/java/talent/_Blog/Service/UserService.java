package talent._Blog.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import talent._Blog.Exception.EmailAlreadyExistsException;
import talent._Blog.Model.Role;
import talent._Blog.Model.Status;
import talent._Blog.Model.User;
import talent._Blog.Repository.UserRepository;
import talent._Blog.dto.UserDto;
import jakarta.validation.Valid;


@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public void saveUser(@Valid UserDto data) {
        if (userRepository.existsByEmail(data.email())) {
            throw new EmailAlreadyExistsException("Email '" + data.email() + "' is already registered.");
        }
        User user = new User();
        user.setName(data.name());
        user.setEmail(data.email());
        user.setPassword(data.password());
        user.setAge(data.age());
        user.setRole(Role.user);
        user.setStatus(Status.Active);
        System.out.println(user);
        userRepository.save(user);
    }

}
