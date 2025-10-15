package talent._Blog.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import talent._Blog.Model.Report;
import java.util.List;
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // First page
    List<Report> findByOrderByIdDesc(Pageable pageable);

    // Next pages (lazy load)
    List<Report> findByIdLessThanOrderByIdDesc(Long lastId, Pageable pageable);

    List<Report> findByUserId(Long userId);

    Report findReportById(Long id);
}