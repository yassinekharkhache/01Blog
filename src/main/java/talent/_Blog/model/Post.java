package talent._Blog.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // owner_id
    @Column(nullable = false)
    private Long ownerId;

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

    
    // created_at
    @Column(nullable = false)
    private String createdAt;

    // updated_at
    @Column(nullable = false)
    private String updatedAt;
}

