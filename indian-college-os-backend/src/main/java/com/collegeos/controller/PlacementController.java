package com.collegeos.controller;

import com.collegeos.dto.request.PlacementRequest;
import com.collegeos.dto.response.PlacementResponse;
import com.collegeos.service.PlacementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/placements")
@RequiredArgsConstructor
public class PlacementController {

    private final PlacementService placementService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlacementResponse> create(@Valid @RequestBody PlacementRequest request) {
        return ResponseEntity.ok(placementService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlacementResponse> update(
            @PathVariable String id,
            @Valid @RequestBody PlacementRequest request) {
        return ResponseEntity.ok(placementService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        placementService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PlacementResponse>> getAll() {
        return ResponseEntity.ok(placementService.getAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<PlacementResponse>> getActive() {
        return ResponseEntity.ok(placementService.getActive());
    }
}
