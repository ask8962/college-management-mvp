package com.collegeos.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);

    @Value("${cloudinary.cloud-name:#{null}}")
    private String cloudName;

    @Value("${cloudinary.api-key:#{null}}")
    private String apiKey;

    @Value("${cloudinary.api-secret:#{null}}")
    private String apiSecret;

    private Cloudinary cloudinary;
    private boolean configured = false;

    @PostConstruct
    public void init() {
        if (cloudName != null && !cloudName.isEmpty()
                && apiKey != null && !apiKey.isEmpty()
                && apiSecret != null && !apiSecret.isEmpty()) {

            cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true));
            configured = true;
            log.info("✅ Cloudinary configured successfully for cloud: {}", cloudName);
        } else {
            log.warn(
                    "⚠️ Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.");
        }
    }

    /**
     * Upload a file to Cloudinary
     * 
     * @param file   The file to upload
     * @param folder The folder path in Cloudinary (e.g., "notices")
     * @return The secure URL of the uploaded file
     * @throws StorageException if upload fails or service is not configured
     */
    public String uploadFile(MultipartFile file, String folder) {
        if (!configured) {
            throw new StorageException(
                    "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.");
        }

        if (file == null || file.isEmpty()) {
            throw new StorageException("Cannot upload empty file");
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String resourceType = determineResourceType(originalFilename);

            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", resourceType,
                    "use_filename", true,
                    "unique_filename", true));

            String secureUrl = (String) uploadResult.get("secure_url");
            log.info("✅ File uploaded successfully: {}", secureUrl);
            return secureUrl;

        } catch (IOException e) {
            log.error("❌ Failed to upload file to Cloudinary: {}", e.getMessage());
            throw new StorageException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    /**
     * Upload a file to the default "notices" folder
     */
    public String uploadFile(MultipartFile file) {
        return uploadFile(file, "college-os/notices");
    }

    /**
     * Delete a file from Cloudinary by its public ID
     */
    public void deleteFile(String publicId) {
        if (!configured) {
            log.warn("Cloudinary not configured, skipping delete");
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("✅ File deleted from Cloudinary: {}", publicId);
        } catch (IOException e) {
            log.error("❌ Failed to delete file from Cloudinary: {}", e.getMessage());
            // Don't throw - deletion failures shouldn't break the main flow
        }
    }

    public boolean isConfigured() {
        return configured;
    }

    private String determineResourceType(String filename) {
        if (filename == null)
            return "auto";

        String lower = filename.toLowerCase();
        if (lower.endsWith(".pdf")) {
            return "raw"; // PDFs should be uploaded as raw files
        } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")
                || lower.endsWith(".png") || lower.endsWith(".gif")
                || lower.endsWith(".webp")) {
            return "image";
        } else if (lower.endsWith(".mp4") || lower.endsWith(".mov")
                || lower.endsWith(".avi") || lower.endsWith(".webm")) {
            return "video";
        }
        return "auto";
    }

    /**
     * Custom exception for storage-related errors
     */
    public static class StorageException extends RuntimeException {
        public StorageException(String message) {
            super(message);
        }

        public StorageException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
