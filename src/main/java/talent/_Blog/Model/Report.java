package talent._Blog.Model;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable = false)
    private boolean Done;

    @Column(nullable = false)
    private Long PostId;

    @Column(nullable = false)
    private Long ReporterId;

    @Column(nullable = false)
    private String Reason;

    @Column(nullable = false)
    private String CreatedAt;
}
