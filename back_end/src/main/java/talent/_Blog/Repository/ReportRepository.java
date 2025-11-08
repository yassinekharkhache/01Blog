package talent._Blog.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import talent._Blog.Model.Report;
import java.util.List;
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByOrderByIdDesc(Pageable pageable);

    List<Report> findByIdLessThanOrderByIdDesc(Long lastId, Pageable pageable);

    List<Report> findByReporter_Id(Long userId);  // <-- fixed

    Report findReportById(Long id);
}
