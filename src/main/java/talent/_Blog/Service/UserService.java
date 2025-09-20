package talent._Blog.Service;



// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.core.userdetails.User;


import talent._Blog.Exception.EmailAlreadyExistsException;
import talent._Blog.Model.Role;
import talent._Blog.Model.Status;
import talent._Blog.Model.User;
import talent._Blog.Repository.UserRepository;
import talent._Blog.dto.UserDto;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
// import org.springframework.security.core.userdetails.UserDetailsService;


@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // @Override
    // public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
    //     Users user = userRepository.findByName(name);
    //     if (user == null) {
    //         throw new UsernameNotFoundException("User not found");
    //     }
    //     return User.withDefaultPasswordEncoder()
    //             .username(user.getEmail())
    //             .password(user.getPassword())
    //             .roles(user.getRole().name())
    //             .build();
        
    // }

    

    // public UserDetail

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    public String hashCode(String s){
        return encoder.encode(s);
    }
    public void saveUser(@Valid UserDto data) {
        if (userRepository.existsByEmail(data.email())) {
            throw new EmailAlreadyExistsException("Email '" + data.email() + "' is already registered.");
        }


        User user = new User();
        user.setUserName(data.name());
        user.setEmail(data.email());
        user.setPassword(hashCode(data.password()));
        user.setAge(data.age());
        user.setRole(Role.user);
        user.setStatus(Status.Active);
        userRepository.save(user);
    }

}
