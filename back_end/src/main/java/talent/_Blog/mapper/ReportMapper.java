package talent._Blog.mapper;

import talent._Blog.Model.Report;
import talent._Blog.dto.ReportResDto;

public class ReportMapper {
    public static ReportResDto toReportRes(Report report){
        var reportResDto = new ReportResDto(
            report.getId(),
            report.getPost().getId(),
            report.getReason(),
            report.getPost().getTitle(),
            report.getUser().getUsername(),
            report.getPost().getUser().getUsername(),
            report.getPost().getUser().getRole().name(),
            report.getUser().getPic(),
            report.getPost().getUser().getPic(),
            report.getCreatedAt().toString()
        );
        return reportResDto;
    }
}