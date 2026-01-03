package com.collegeos.controller;

import com.collegeos.dto.request.ChatMessageRequest;
import com.collegeos.dto.request.ChatRoomRequest;
import com.collegeos.dto.response.ChatMessageResponse;
import com.collegeos.dto.response.ChatRoomResponse;
import com.collegeos.security.JwtUtil;
import com.collegeos.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final JwtUtil jwtUtil;

    // Room endpoints
    @PostMapping("/rooms")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChatRoomResponse> createRoom(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ChatRoomRequest request) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(chatService.createRoom(request, userId));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponse>> getAllRooms(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        String role = jwtUtil.extractRole(token);
        return ResponseEntity.ok(chatService.getAllRooms(userId, role));
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ChatRoomResponse> getRoom(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String roomId) {
        String token = authHeader.substring(7);
        String role = jwtUtil.extractRole(token);
        return ResponseEntity.ok(chatService.getRoom(roomId, role));
    }

    @PatchMapping("/rooms/{roomId}/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChatRoomResponse> toggleBroadcast(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String roomId) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(chatService.toggleBroadcastMode(roomId, userId));
    }

    // Message endpoints
    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String roomId,
            @RequestBody ChatMessageRequest request) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        String role = jwtUtil.extractRole(token);
        return ResponseEntity.ok(chatService.sendMessage(roomId, request, userId, role));
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String roomId) {
        String token = authHeader.substring(7);
        String userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(chatService.getMessages(roomId, userId));
    }
}
