package talent._Blog.Model;
import java.util.List;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Like> likes;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Report> reports;

    // status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // title
    @Column(nullable = false)
    private String title;

    // content
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // images paths seperated by ","
    @Column(nullable = false,columnDefinition = "TEXT")
    private String paths_to_images;

    
    // created_at
    @Column(nullable = false)
    private String createdAt;

    // updated_at
    @Column(nullable = false)
    private String updatedAt;
}

