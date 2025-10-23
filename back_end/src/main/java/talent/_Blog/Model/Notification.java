package talent._Blog.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver; // the user who gets notified

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender; // the one who triggered it (e.g., posted)

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private boolean seen;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
