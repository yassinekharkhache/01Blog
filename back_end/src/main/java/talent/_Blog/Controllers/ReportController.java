package talent._Blog.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import talent._Blog.Model.Report;
import talent._Blog.Model.User;
import talent._Blog.Service.ReportService;
import talent._Blog.dto.ReportRequestDto;
import talent._Blog.dto.ReportResDto;
import talent._Blog.mapper.ReportMapper;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Autowired
    ReportService reportService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addReport(@Valid @RequestBody ReportRequestDto request,
            @AuthenticationPrincipal User reporter) {
        reportService.saveReport(request.reason(), request.postId(), reporter);
        return ResponseEntity.ok(Map.of("valid","Report submitted"));
    }

    @GetMapping("/get")
    public ResponseEntity<List<ReportResDto>> getReports(
            @RequestParam(required = false) Long lastId) {
        List<Report> reports = reportService.getReports(lastId);
        return ResponseEntity.ok(reports.stream().map(ReportMapper::toReportRes).toList());
    }

    @DeleteMapping("/delete/{ReportId}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> markAsSeen(@PathVariable Long ReportId) {
        reportService.delete(ReportId);
        return ResponseEntity.ok(Map.of("Valid","Report is hided"));
    }

}
