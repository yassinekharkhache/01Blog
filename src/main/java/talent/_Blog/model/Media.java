package talent._Blog.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "media")
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "media_type")
    private String mediaType;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "caption")
    private String caption;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    @Column(name = "uploaded_at", nullable = false)
    private String uploadedAt;

    @Column(name = "updated_at", nullable = false)
    private String updatedAt;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}