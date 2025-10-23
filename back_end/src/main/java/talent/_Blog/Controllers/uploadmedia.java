package talent._Blog.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import talent._Blog.Model.User;
import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/api/upload")
public class uploadmedia {

    private final String IMAGE_UPLOAD_DIR = "uploads/images/tmp";
    private final String VIDEO_UPLOAD_DIR = "uploads/videos/tmp";

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile file,
            @AuthenticationPrincipal User user) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }

        try {
            Path uploadPath = Paths.get(IMAGE_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalName = StringUtils.cleanPath(file.getOriginalFilename());

            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex > 0) {
                originalName = originalName.substring(0, dotIndex);
            }

            String uniqueFileName = user.getUsername().replace("@", "") + "_" + originalName.replace("@", "") + "_" + System.currentTimeMillis()+"@" + ".png";

            Path filePath = uploadPath.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);


            String publicUrl = "http://localhost:8081/images/tmp/" + uniqueFileName;
            return ResponseEntity.ok().body("{\"url\": \"" + publicUrl + "\"}");

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("add >>>>>>>>>>>>>>");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store the file. Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{type}/{filename}")
    public ResponseEntity<?> deleteFile(
            @PathVariable("type") String type,
            @PathVariable("filename") String filename,
            @AuthenticationPrincipal User user) {
        if (!filename.startsWith(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed to delete this file");
        }

        try {
            Path filePath = Paths.get(type.equals("image") ? IMAGE_UPLOAD_DIR : VIDEO_UPLOAD_DIR).resolve(filename);
            Files.deleteIfExists(filePath);
            return ResponseEntity.ok().body("File deleted successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not delete the file. Error: " + e.getMessage());
        }
    }

    @PostMapping("/video")
    public ResponseEntity<?> uploadVideo(
            @RequestParam("video") MultipartFile file,
            @AuthenticationPrincipal User user) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }

        try {
            // Ensure directory exists
            Path uploadPath = Paths.get(VIDEO_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Clean original filename
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = "";
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex > 0) {
                extension = originalName.substring(dotIndex); // include dot
                originalName = originalName.substring(0, dotIndex);
            }

            // Generate unique filename: username_originalname_timestamp.ext
            String uniqueFileName = user.getUsername() + "_" + originalName + "_" + System.currentTimeMillis() + extension;

            // Save the file
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return public URL
            String publicUrl = "http://localhost:8081/videos/" + uniqueFileName;
            return ResponseEntity.ok("{\"url\": \"" + publicUrl + "\"}");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store the file. Error: " + e.getMessage());
        }
    }
}