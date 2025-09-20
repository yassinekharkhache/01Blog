package talent._Blog.Model;
import java.util.List;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
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

    
    // images paths separated by ","
    @Column(name = "paths_to_images", nullable = false, columnDefinition = "TEXT")
    private String pathsToImages;

    
    // created_at
    @Column(name = "created_at", nullable = false)
    private java.time.LocalDateTime createdAt;

    // updated_at
    @Column(name = "updated_at", nullable = false)
    private java.time.LocalDateTime updatedAt;
}

