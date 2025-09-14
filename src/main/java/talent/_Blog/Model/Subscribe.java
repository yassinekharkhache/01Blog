package talent._Blog.Model;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "subscribes")
public class Subscribe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long follower;

    @Column(nullable = false)
    private Long followed;

}