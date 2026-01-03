package com.collegeos.dto.response;

import com.collegeos.model.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private boolean completed;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private boolean overdue;

    public static TaskResponse fromTask(Task task) {
        boolean isOverdue = task.getDueDate() != null
                && task.getDueDate().isBefore(LocalDateTime.now())
                && !task.isCompleted();

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .category(task.getCategory())
                .priority(task.getPriority() != null ? task.getPriority().name() : "MEDIUM")
                .completed(task.isCompleted())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .completedAt(task.getCompletedAt())
                .overdue(isOverdue)
                .build();
    }
}
