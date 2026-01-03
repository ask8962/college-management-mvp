package com.collegeos.service;

import com.collegeos.dto.request.ChatMessageRequest;
import com.collegeos.dto.request.ChatRoomRequest;
import com.collegeos.dto.response.ChatMessageResponse;
import com.collegeos.dto.response.ChatRoomResponse;
import com.collegeos.model.ChatMessage;
import com.collegeos.model.ChatRoom;
import com.collegeos.model.User;
import com.collegeos.repository.ChatMessageRepository;
import com.collegeos.repository.ChatRoomRepository;
import com.collegeos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

        private final ChatRoomRepository roomRepository;
        private final ChatMessageRepository messageRepository;
        private final UserRepository userRepository;
        private final AiSummaryService aiService;

        // Room operations
        public ChatRoomResponse createRoom(ChatRoomRequest request, String userId) {
                ChatRoom room = ChatRoom.builder()
                                .name(request.getName())
                                .description(request.getDescription())
                                .createdBy(userId)
                                .broadcastMode(request.isBroadcastMode())
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();

                room = roomRepository.save(room);
                return ChatRoomResponse.fromRoom(room, "ADMIN");
        }

        public List<ChatRoomResponse> getAllRooms(String userId, String userRole) {
                return roomRepository.findAllByOrderByCreatedAtDesc().stream()
                                .map(room -> ChatRoomResponse.fromRoom(room, userRole))
                                .collect(Collectors.toList());
        }

        public ChatRoomResponse getRoom(String roomId, String userRole) {
                ChatRoom room = roomRepository.findById(roomId)
                                .orElseThrow(() -> new RuntimeException("Room not found"));
                return ChatRoomResponse.fromRoom(room, userRole);
        }

        public ChatRoomResponse toggleBroadcastMode(String roomId, String userId) {
                ChatRoom room = roomRepository.findById(roomId)
                                .orElseThrow(() -> new RuntimeException("Room not found"));

                room.setBroadcastMode(!room.isBroadcastMode());
                room.setUpdatedAt(LocalDateTime.now());
                room = roomRepository.save(room);

                // Add system message
                ChatMessage systemMsg = ChatMessage.builder()
                                .roomId(roomId)
                                .senderId("SYSTEM")
                                .senderName("System")
                                .senderRole("SYSTEM")
                                .content(room.isBroadcastMode()
                                                ? "🔒 Broadcast mode enabled. Only admins can send messages."
                                                : "🔓 Broadcast mode disabled. Everyone can send messages.")
                                .type(ChatMessage.MessageType.SYSTEM)
                                .createdAt(LocalDateTime.now())
                                .build();
                messageRepository.save(systemMsg);

                return ChatRoomResponse.fromRoom(room, "ADMIN");
        }

        // Message operations
        public ChatMessageResponse sendMessage(String roomId, ChatMessageRequest request, String userId,
                        String userRole) {
                ChatRoom room = roomRepository.findById(roomId)
                                .orElseThrow(() -> new RuntimeException("Room not found"));

                // Check if user can send message
                if (room.isBroadcastMode() && !"ADMIN".equals(userRole)) {
                        throw new RuntimeException("Only admins can send messages in broadcast mode");
                }

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                ChatMessage message = ChatMessage.builder()
                                .roomId(roomId)
                                .senderId(userId)
                                .senderName(user.getName())
                                .senderRole(userRole)
                                .content(request.getContent())
                                .type(ChatMessage.MessageType
                                                .valueOf(request.getType() != null ? request.getType() : "TEXT"))
                                .fileUrl(request.getFileUrl())
                                .fileName(request.getFileName())
                                .createdAt(LocalDateTime.now())
                                .build();

                message = messageRepository.save(message);
                ChatMessageResponse response = ChatMessageResponse.fromMessage(message, userId);

                // Check if message contains @AI mention
                if (request.getContent() != null && request.getContent().toLowerCase().contains("@ai")) {
                        handleAiMention(roomId, request.getContent());
                }

                return response;
        }

        private void handleAiMention(String roomId, String userMessage) {
                // Extract the question after @AI
                String query = userMessage.toLowerCase().replace("@ai", "").trim();

                // Generate AI response
                String aiResponse = aiService.generateChatResponse(query);

                // Save AI response as a message
                ChatMessage aiMessage = ChatMessage.builder()
                                .roomId(roomId)
                                .senderId("AI")
                                .senderName("🤖 College AI")
                                .senderRole("AI")
                                .content(aiResponse)
                                .type(ChatMessage.MessageType.TEXT)
                                .createdAt(LocalDateTime.now())
                                .build();
                messageRepository.save(aiMessage);
        }

        public List<ChatMessageResponse> getMessages(String roomId, String userId) {
                List<ChatMessage> messages = messageRepository.findTop50ByRoomIdOrderByCreatedAtDesc(roomId);
                Collections.reverse(messages); // Show oldest first

                return messages.stream()
                                .map(msg -> ChatMessageResponse.fromMessage(msg, userId))
                                .collect(Collectors.toList());
        }
}
