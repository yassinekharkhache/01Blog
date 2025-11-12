package talent._Blog.Service;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import talent._Blog.Model.Post;
import talent._Blog.Model.Report;
import talent._Blog.Model.User;
import talent._Blog.Repository.ReportRepository;
import talent._Blog.dto.ReportRequestDto;
@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostService postService;
    private final UserService userService;
    
    public ReportService(ReportRepository reportRepository, PostService postService, UserService userService) {
        this.reportRepository = reportRepository;
        this.postService = postService;
        this.userService = userService;
    }

    public void delete(Long reportId) {
        reportRepository.deleteById(reportId);
    }

    public Report saveReport(ReportRequestDto ReportReq, User user) {
        User reportedUser;
        Post reportedPost;
        Report report = new Report();
        if(ReportReq.ReportType().equals("USER")){
            reportedUser = userService.getUserById(ReportReq.Id());
            report.setReported(reportedUser);
        }else if (ReportReq.ReportType().equals("POST")){
            reportedPost = postService.getPostById(ReportReq.Id());
            report.setPost(reportedPost);
        }
        report.setType(ReportReq.ReportType());
        report.setReason(ReportReq.reason());
        report.setReporter(user);
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