package com.collegeos.controller;

import com.collegeos.dto.response.NoticeResponse;
import com.collegeos.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NoticeResponse> create(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(noticeService.create(title, file));
    }

    @GetMapping
    public ResponseEntity<List<NoticeResponse>> getAll() {
        return ResponseEntity.ok(noticeService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(noticeService.getById(id));
    }
}
