package talent._Blog.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import talent._Blog.model.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
}