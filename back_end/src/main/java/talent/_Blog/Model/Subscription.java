package talent._Blog.Model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "subscribes", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "subscriber_id", "subscribed_to_id" })
})
@Data
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "subscriber_id", nullable = false)
    private User subscriber;

    @ManyToOne
    @JoinColumn(name = "subscribed_to_id", nullable = false)
    private User subscribedTo;
}