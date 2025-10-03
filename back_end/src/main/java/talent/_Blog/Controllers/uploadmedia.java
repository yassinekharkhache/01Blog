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

    private final String IMAGE_UPLOAD_DIR = "uploads/images/";
    private final String VIDEO_UPLOAD_DIR = "uploads/videos/";

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile file,
            @AuthenticationPrincipal User user) {
        if (file.isEmpty()) {
            System.out.println("adding >>>>>>>>>>>>>>");
            return ResponseEntity.badRequest().body("No file selected");
        }
        System.out.println("debug28 >>>>>>>>>>>>>>");

        try {
            Path uploadPath = Paths.get(IMAGE_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = "";

            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex > 0) {
                extension = originalName.substring(dotIndex);
                originalName = originalName.substring(0, dotIndex);
            }

            String uniqueFileName = user.getUsername() + "_" + originalName + "_" + System.currentTimeMillis() + extension;

            Path filePath = uploadPath.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("adder >>>>>>>>>>>>>>");

            String publicUrl = "/images/" + uniqueFileName;
            return ResponseEntity.ok().body("{\"url\": \"" + publicUrl + "\"}");

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("add >>>>>>>>>>>>>>");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store the file. Error: " + e.getMessage());
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
            String publicUrl = "/videos/" + uniqueFileName;
            return ResponseEntity.ok("{\"url\": \"" + publicUrl + "\"}");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store the file. Error: " + e.getMessage());
        }
    }
}