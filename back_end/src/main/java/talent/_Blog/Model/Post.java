package talent._Blog.Model;

import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

    // // images paths separated by ","
    // @ElementCollection
    // @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    // @Column(name = "image_path")
    // private List<String> pathsToImages;

    @CreationTimestamp
    private java.time.LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private java.time.LocalDateTime updatedAt;
}
