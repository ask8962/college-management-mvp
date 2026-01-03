package com.collegeos.service;

import com.collegeos.dto.request.PlacementRequest;
import com.collegeos.dto.response.PlacementResponse;
import com.collegeos.model.Placement;
import com.collegeos.repository.PlacementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlacementService {

    private final PlacementRepository placementRepository;

    public PlacementResponse create(PlacementRequest request) {
        Placement placement = Placement.builder()
                .companyName(request.getCompanyName())
                .role(request.getRole())
                .eligibility(request.getEligibility())
                .deadline(request.getDeadline())
                .build();

        placement = placementRepository.save(placement);
        return mapToResponse(placement);
    }

    public PlacementResponse update(String id, PlacementRequest request) {
        Placement placement = placementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement not found"));

        placement.setCompanyName(request.getCompanyName());
        placement.setRole(request.getRole());
        placement.setEligibility(request.getEligibility());
        placement.setDeadline(request.getDeadline());

        placement = placementRepository.save(placement);
        return mapToResponse(placement);
    }

    public void delete(String id) {
        if (!placementRepository.existsById(id)) {
            throw new RuntimeException("Placement not found");
        }
        placementRepository.deleteById(id);
    }

    public List<PlacementResponse> getAll() {
        return placementRepository.findAllByOrderByDeadlineAsc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PlacementResponse> getActive() {
        return placementRepository.findByDeadlineAfterOrderByDeadlineAsc(LocalDate.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PlacementResponse mapToResponse(Placement placement) {
        return PlacementResponse.builder()
                .id(placement.getId())
                .companyName(placement.getCompanyName())
                .role(placement.getRole())
                .eligibility(placement.getEligibility())
                .deadline(placement.getDeadline())
                .build();
    }
}
