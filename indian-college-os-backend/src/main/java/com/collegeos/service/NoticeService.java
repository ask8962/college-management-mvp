package com.collegeos.service;

import com.collegeos.dto.response.NoticeResponse;
import com.collegeos.model.Notice;
import com.collegeos.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private static final Logger log = LoggerFactory.getLogger(NoticeService.class);

    private final NoticeRepository noticeRepository;
    private final CloudinaryService cloudinaryService;
    private final AiSummaryService aiSummaryService;

    public NoticeResponse create(String title, MultipartFile file) {
        log.info("Creating notice: {}", title);

        // Validate input
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Notice title cannot be empty");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Notice file cannot be empty");
        }

        // Upload file to Cloudinary
        String fileUrl = cloudinaryService.uploadFile(file);
        log.info("File uploaded to: {}", fileUrl);

        // Generate summary if PDF
        String summary = generateSummaryForFile(file);

        Notice notice = Notice.builder()
                .title(title.trim())
                .fileUrl(fileUrl)
                .summary(summary)
                .createdAt(LocalDateTime.now())
                .build();

        notice = noticeRepository.save(notice);
        log.info("Notice created with ID: {}", notice.getId());

        return mapToResponse(notice);
    }

    public NoticeResponse update(String id, String title, MultipartFile file) {
        log.info("Updating notice: {}", id);

        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + id));

        if (title != null && !title.trim().isEmpty()) {
            notice.setTitle(title.trim());
        }

        if (file != null && !file.isEmpty()) {
            // Upload new file to Cloudinary
            String fileUrl = cloudinaryService.uploadFile(file);
            notice.setFileUrl(fileUrl);

            // Regenerate summary
            String summary = generateSummaryForFile(file);
            notice.setSummary(summary);

            log.info("Notice file updated: {}", fileUrl);
        }

        notice = noticeRepository.save(notice);
        return mapToResponse(notice);
    }

    public void delete(String id) {
        log.info("Deleting notice: {}", id);

        if (!noticeRepository.existsById(id)) {
            throw new NoticeNotFoundException("Notice not found with ID: " + id);
        }
        noticeRepository.deleteById(id);
        log.info("Notice deleted: {}", id);
    }

    public List<NoticeResponse> getAll() {
        return noticeRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public NoticeResponse getById(String id) {
        return noticeRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + id));
    }

    private String generateSummaryForFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();

        if (fileName != null && fileName.toLowerCase().endsWith(".pdf")) {
            try {
                String extractedText = aiSummaryService.extractTextFromPdf(file);
                if (extractedText != null && !extractedText.trim().isEmpty()) {
                    String summary = aiSummaryService.generateSummary(extractedText);
                    if (summary != null && !summary.isEmpty()) {
                        return summary;
                    }
                }
                return "PDF notice uploaded successfully.";
            } catch (Exception e) {
                log.warn("Failed to generate AI summary: {}", e.getMessage());
                return "PDF notice uploaded successfully.";
            }
        }

        return "Image notice uploaded successfully.";
    }

    private NoticeResponse mapToResponse(Notice notice) {
        return NoticeResponse.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .fileUrl(notice.getFileUrl())
                .summary(notice.getSummary())
                .createdAt(notice.getCreatedAt())
                .build();
    }

    /**
     * Custom exception for notice not found scenarios
     */
    public static class NoticeNotFoundException extends RuntimeException {
        public NoticeNotFoundException(String message) {
            super(message);
        }
    }
}
