package talent._Blog.dto;

public record ReportResDto(

        Long ReportId,
        Long PostId,
        String Type,
        String Reason,
        String PostTitle,
        String ReporterUsername,
        String ReportedUsername,
        String ReportedRole,
        String ReporterPicPath,
        String ReportedPicPath,
        String createdAt) {
}
