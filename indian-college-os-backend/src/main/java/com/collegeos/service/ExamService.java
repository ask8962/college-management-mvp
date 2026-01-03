package com.collegeos.service;

import com.collegeos.dto.request.ExamRequest;
import com.collegeos.dto.response.ExamResponse;
import com.collegeos.model.Exam;
import com.collegeos.repository.ExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;

    public ExamResponse create(ExamRequest request) {
        Exam exam = Exam.builder()
                .subject(request.getSubject())
                .examDate(request.getExamDate())
                .deadline(request.getDeadline())
                .description(request.getDescription())
                .build();

        exam = examRepository.save(exam);
        return mapToResponse(exam);
    }

    public ExamResponse update(String id, ExamRequest request) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        exam.setSubject(request.getSubject());
        exam.setExamDate(request.getExamDate());
        exam.setDeadline(request.getDeadline());
        exam.setDescription(request.getDescription());

        exam = examRepository.save(exam);
        return mapToResponse(exam);
    }

    public void delete(String id) {
        if (!examRepository.existsById(id)) {
            throw new RuntimeException("Exam not found");
        }
        examRepository.deleteById(id);
    }

    public List<ExamResponse> getAll() {
        return examRepository.findAllByOrderByExamDateAsc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ExamResponse> getUpcoming() {
        return examRepository.findByExamDateAfterOrderByExamDateAsc(LocalDate.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ExamResponse mapToResponse(Exam exam) {
        return ExamResponse.builder()
                .id(exam.getId())
                .subject(exam.getSubject())
                .examDate(exam.getExamDate())
                .deadline(exam.getDeadline())
                .description(exam.getDescription())
                .build();
    }
}
