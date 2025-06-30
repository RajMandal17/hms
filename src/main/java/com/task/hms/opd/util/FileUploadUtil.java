package com.task.hms.opd.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class FileUploadUtil {
    private static final String UPLOAD_DIR = "uploads/patient-photos";

    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        String ext = getFileExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID().toString() + (ext != null ? "." + ext : "");
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(filename);
        file.transferTo(filePath);
        return "/" + UPLOAD_DIR + "/" + filename;
    }

    private String getFileExtension(String filename) {
        if (filename == null) return null;
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex >= 0) ? filename.substring(dotIndex + 1) : null;
    }
}
