package com.collegeos.service;

import com.collegeos.dto.response.NoticeResponse;
import com.collegeos.model.Notice;
import com.collegeos.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final GcsStorageService storageService;
    private final AiSummaryService aiSummaryService;

    public NoticeResponse create(String title, MultipartFile file) {
        // Upload file to Google Cloud Storage
        String fileUrl = storageService.uploadFile(file);

        // Generate summary if PDF
        String summary = "";
        String fileName = file.getOriginalFilename();
        if (fileName != null && fileName.toLowerCase().endsWith(".pdf")) {
            String extractedText = aiSummaryService.extractTextFromPdf(file);
            summary = aiSummaryService.generateSummary(extractedText);
        } else {
            summary = "Image notice - no text summary available.";
        }

        Notice notice = Notice.builder()
                .title(title)
                .fileUrl(fileUrl)
                .summary(summary)
                .createdAt(LocalDateTime.now())
                .build();

        notice = noticeRepository.save(notice);
        return mapToResponse(notice);
    }

    public NoticeResponse update(String id, String title, MultipartFile file) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));

        notice.setTitle(title);

        if (file != null && !file.isEmpty()) {
            // Upload new file to GCS
            String fileUrl = storageService.uploadFile(file);
            notice.setFileUrl(fileUrl);

            // Regenerate summary if PDF
            String summary = "";
            String fileName = file.getOriginalFilename();
            if (fileName != null && fileName.toLowerCase().endsWith(".pdf")) {
                String extractedText = aiSummaryService.extractTextFromPdf(file);
                summary = aiSummaryService.generateSummary(extractedText);
            } else {
                summary = "Image notice - no text summary available.";
            }
            notice.setSummary(summary);
        }

        notice = noticeRepository.save(notice);
        return mapToResponse(notice);
    }

    public void delete(String id) {
        if (!noticeRepository.existsById(id)) {
            throw new RuntimeException("Notice not found");
        }
        noticeRepository.deleteById(id);
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
                .orElseThrow(() -> new RuntimeException("Notice not found"));
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
}
