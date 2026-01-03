package com.collegeos.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class GcsStorageService {

    @Value("${gcs.bucket-name:college-os-files}")
    private String bucketName;

    @Value("${gcs.project-id:#{null}}")
    private String projectId;

    @Value("${gcs.credentials-json:#{null}}")
    private String credentialsJson;

    private Storage storage;
    private boolean configured = false;

    @PostConstruct
    public void init() {
        try {
            if (credentialsJson != null && !credentialsJson.isEmpty() && projectId != null) {
                GoogleCredentials credentials = GoogleCredentials.fromStream(
                        new ByteArrayInputStream(credentialsJson.getBytes(StandardCharsets.UTF_8)));
                storage = StorageOptions.newBuilder()
                        .setProjectId(projectId)
                        .setCredentials(credentials)
                        .build()
                        .getService();
                configured = true;
                System.out.println("✅ Google Cloud Storage configured successfully");
            } else {
                System.out.println(
                        "⚠️ GCS not configured. Set GCS_PROJECT_ID and GCS_CREDENTIALS_JSON environment variables.");
            }
        } catch (IOException e) {
            System.out.println("❌ Failed to initialize GCS: " + e.getMessage());
        }
    }

    public String uploadFile(MultipartFile file) {
        if (!configured) {
            throw new RuntimeException(
                    "Google Cloud Storage is not configured. Please set GCS_PROJECT_ID, GCS_BUCKET_NAME, and GCS_CREDENTIALS_JSON environment variables.");
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String objectName = "notices/" + UUID.randomUUID().toString() + extension;

            BlobId blobId = BlobId.of(bucketName, objectName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(file.getContentType())
                    .build();

            storage.create(blobInfo, file.getBytes());

            // Return public URL
            return String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to GCS", e);
        }
    }

    public boolean isConfigured() {
        return configured;
    }
}
