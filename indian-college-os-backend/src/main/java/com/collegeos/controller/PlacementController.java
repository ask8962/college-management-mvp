package com.collegeos.controller;

import com.collegeos.dto.request.PlacementRequest;
import com.collegeos.dto.response.PlacementResponse;
import com.collegeos.service.PlacementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/placements")
@RequiredArgsConstructor
public class PlacementController {

    private final PlacementService placementService;

    @PostMapping
    public ResponseEntity<PlacementResponse> create(@Valid @RequestBody PlacementRequest request) {
        return ResponseEntity.ok(placementService.create(request));
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
