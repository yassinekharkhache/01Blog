package talent._Blog.mapper;

import talent._Blog.Model.Report;
import talent._Blog.dto.ReportResDto;

public class ReportMapper {
    public static ReportResDto toReportRes(Report report) {
        ReportResDto reportResDto;
        if (report.getType() != null && report.getType().equals("POST")) {
            reportResDto = new ReportResDto(
                    report.getId(),
                    report.getPost().getId(),
                    report.getType(),
                    report.getReason(),
                    report.getPost().getTitle(),
                    report.getReporter().getUsername(),
                    report.getPost().getUser().getUsername(),
                    report.getPost().getUser().getRole().name(),
                    report.getReporter().getPic(),
                    report.getPost().getUser().getPic(),
                    report.getCreatedAt().toString());
        } else {
            reportResDto = new ReportResDto(
                    report.getId(),
                    0L,
                    report.getType(),
                    report.getReason(),
                    "",
                    report.getReporter().getUsername(),
                    report.getReported().getUsername(),
                    report.getReported().getRole().name(),
                    report.getReporter().getPic(),
                    report.getReported().getPic(),
                    report.getCreatedAt().toString());
        }
        return reportResDto;
    }
}