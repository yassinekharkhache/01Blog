package talent._Blog.model;

import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "remports")
public class Reports {
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
