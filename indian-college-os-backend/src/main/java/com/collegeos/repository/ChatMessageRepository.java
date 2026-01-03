package com.collegeos.repository;

import com.collegeos.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(String roomId);

    List<ChatMessage> findTop50ByRoomIdOrderByCreatedAtDesc(String roomId);
}
