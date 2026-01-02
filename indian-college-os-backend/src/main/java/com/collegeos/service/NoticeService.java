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
    private final CloudinaryService cloudinaryService;
    private final AiSummaryService aiSummaryService;

    public NoticeResponse create(String title, MultipartFile file) {
        // Upload file to Cloudinary
        String fileUrl = cloudinaryService.uploadFile(file);

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
