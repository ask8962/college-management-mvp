package com.collegeos.service;

import com.collegeos.dto.request.GigRequest;
import com.collegeos.dto.response.GigResponse;
import com.collegeos.model.Gig;
import com.collegeos.model.User;
import com.collegeos.repository.GigRepository;
import com.collegeos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GigService {

    private final GigRepository gigRepository;
    private final UserRepository userRepository;

    public GigResponse create(GigRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Gig gig = Gig.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .budget(request.getBudget())
                .contactInfo(request.getContactInfo())
                .postedBy(userId)
                .postedByName(user.getName())
                .status(Gig.Status.OPEN)
                .createdAt(LocalDateTime.now())
                .deadline(request.getDeadline() != null ? LocalDate.parse(request.getDeadline()).atStartOfDay() : null)
                .build();

        gig = gigRepository.save(gig);
        return GigResponse.fromGig(gig, userId);
    }

    public List<GigResponse> getAll(String currentUserId) {
        return gigRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(gig -> GigResponse.fromGig(gig, currentUserId))
                .collect(Collectors.toList());
    }

    public List<GigResponse> getOpen(String currentUserId) {
        return gigRepository.findByStatusOrderByCreatedAtDesc(Gig.Status.OPEN).stream()
                .map(gig -> GigResponse.fromGig(gig, currentUserId))
                .collect(Collectors.toList());
    }

    public List<GigResponse> getByCategory(String category, String currentUserId) {
        return gigRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, Gig.Status.OPEN).stream()
                .map(gig -> GigResponse.fromGig(gig, currentUserId))
                .collect(Collectors.toList());
    }

    public List<GigResponse> getMyGigs(String userId) {
        return gigRepository.findByPostedByOrderByCreatedAtDesc(userId).stream()
                .map(gig -> GigResponse.fromGig(gig, userId))
                .collect(Collectors.toList());
    }

    public GigResponse updateStatus(String gigId, String status, String userId) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new RuntimeException("Gig not found"));

        if (!gig.getPostedBy().equals(userId)) {
            throw new RuntimeException("You can only update your own gigs");
        }

        gig.setStatus(Gig.Status.valueOf(status));
        gig = gigRepository.save(gig);
        return GigResponse.fromGig(gig, userId);
    }

    public void delete(String gigId, String userId) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new RuntimeException("Gig not found"));

        if (!gig.getPostedBy().equals(userId)) {
            throw new RuntimeException("You can only delete your own gigs");
        }

        gigRepository.deleteById(gigId);
    }
}
