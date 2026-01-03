package com.collegeos.service;

import com.collegeos.dto.request.ProfessorReviewRequest;
import com.collegeos.dto.response.ProfessorReviewResponse;
import com.collegeos.model.ProfessorReview;
import com.collegeos.repository.ProfessorReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessorReviewService {

    private final ProfessorReviewRepository reviewRepository;

    public ProfessorReviewResponse create(ProfessorReviewRequest request, String userId) {
        // Check if user already reviewed this professor
        if (reviewRepository.findByProfessorNameIgnoreCaseAndPostedBy(request.getProfessorName(), userId).isPresent()) {
            throw new RuntimeException("You have already reviewed this professor");
        }

        ProfessorReview review = ProfessorReview.builder()
                .professorName(request.getProfessorName().trim())
                .department(request.getDepartment())
                .subject(request.getSubject())
                .chillFactor(request.getChillFactor())
                .attendanceStrictness(request.getAttendanceStrictness())
                .marksGenerosity(request.getMarksGenerosity())
                .teachingQuality(request.getTeachingQuality())
                .review(request.getReview())
                .postedBy(userId)
                .createdAt(LocalDateTime.now())
                .build();

        review = reviewRepository.save(review);
        return ProfessorReviewResponse.fromReview(review);
    }

    public List<ProfessorReviewResponse> getAll() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ProfessorReviewResponse::fromReview)
                .collect(Collectors.toList());
    }

    public List<ProfessorReviewResponse> searchByName(String name) {
        return reviewRepository.findByProfessorNameContainingIgnoreCaseOrderByCreatedAtDesc(name).stream()
                .map(ProfessorReviewResponse::fromReview)
                .collect(Collectors.toList());
    }

    public List<ProfessorReviewResponse> getByDepartment(String department) {
        return reviewRepository.findByDepartmentOrderByCreatedAtDesc(department).stream()
                .map(ProfessorReviewResponse::fromReview)
                .collect(Collectors.toList());
    }

    // Get aggregated stats per professor
    public List<Map<String, Object>> getProfessorStats() {
        List<ProfessorReview> allReviews = reviewRepository.findAll();

        return allReviews.stream()
                .collect(Collectors.groupingBy(ProfessorReview::getProfessorName))
                .entrySet().stream()
                .map(entry -> {
                    String name = entry.getKey();
                    List<ProfessorReview> reviews = entry.getValue();

                    double avgChill = reviews.stream().mapToInt(ProfessorReview::getChillFactor).average().orElse(0);
                    double avgStrictness = reviews.stream().mapToInt(ProfessorReview::getAttendanceStrictness).average()
                            .orElse(0);
                    double avgMarks = reviews.stream().mapToInt(ProfessorReview::getMarksGenerosity).average()
                            .orElse(0);
                    double avgTeaching = reviews.stream().mapToInt(ProfessorReview::getTeachingQuality).average()
                            .orElse(0);
                    double overall = (avgChill + avgMarks + avgTeaching + (6 - avgStrictness)) / 4.0;

                    Map<String, Object> stats = new java.util.HashMap<>();
                    stats.put("professorName", name);
                    stats.put("department", reviews.get(0).getDepartment());
                    stats.put("reviewCount", reviews.size());
                    stats.put("avgChillFactor", Math.round(avgChill * 10.0) / 10.0);
                    stats.put("avgAttendanceStrictness", Math.round(avgStrictness * 10.0) / 10.0);
                    stats.put("avgMarksGenerosity", Math.round(avgMarks * 10.0) / 10.0);
                    stats.put("avgTeachingQuality", Math.round(avgTeaching * 10.0) / 10.0);
                    stats.put("overallRating", Math.round(overall * 10.0) / 10.0);
                    return stats;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("overallRating"), (Double) a.get("overallRating")))
                .collect(Collectors.toList());
    }
}
