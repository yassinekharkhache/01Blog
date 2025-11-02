package talent._Blog.dto;

public record ReportResDto(
        Long ReportId,
        Long PostId,
        String Reason,
        String PostTitle,
        String ReporterUsername,
        String ReportedUsername,
        String ReportedRole,
        String ReporterPicPath,
        String ReportedPicPath,
        String createdAt) {
}
