package talent._Blog.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import talent._Blog.Model.Post;
import talent._Blog.Model.Report;
import talent._Blog.Model.User;
import talent._Blog.Repository.ReportRepository;
@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PostService postService;

    public void delete(Long reportId) {
        reportRepository.deleteById(reportId);
    }

    public Report saveReport(String reason, Long postId, User user) {
        Post post = postService.getPostById(postId);
        Report report = new Report();
        report.setReason(reason);
        report.setPost(post);
        report.setUser(user);
        report.setVisible(true);
        report.setCreatedAt(java.time.LocalDateTime.now());
        return reportRepository.save(report);
    }

    @Transactional
    public List<Report> getReports(Long lastId) {
        var pageable = PageRequest.of(0, 12, Sort.by(Sort.Direction.DESC, "id"));
        if (lastId == null) {
            return reportRepository.findByOrderByIdDesc(pageable);
        } else {
            return reportRepository.findByIdLessThanOrderByIdDesc(lastId, pageable);
        }
    }
}