package talent._Blog.Model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "my_follows", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "follower", "followed" })
})
@Data
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower", nullable = false)
    private User follower;

    @ManyToOne
    @JoinColumn(name = "followed", nullable = false)
    private User followed;
}