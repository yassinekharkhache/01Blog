package talent._Blog.model;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotBlank(message = "Status is mandatory")
    private Status status;

    @Column(nullable = false)
    @NotBlank(message = "Name is mandatory")
    private String name;

    @Column(nullable = false)
    @NotBlank(message = "Age is mandatory")
    @Min(value = 0, message = "Age must be positive")
    private int age;


    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotBlank(message = "Role is mandatory")
    private Role role;

    @Column(nullable = false)
    @NotBlank(message = "Password is mandatory")
    private String password;
}
