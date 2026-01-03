package com.collegeos.service;

import com.collegeos.dto.request.TaskRequest;
import com.collegeos.dto.response.TaskResponse;
import com.collegeos.model.Task;
import com.collegeos.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskResponse create(TaskRequest request, String userId) {
        Task task = Task.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory() != null ? request.getCategory() : "PERSONAL")
                .priority(Task.Priority.valueOf(request.getPriority() != null ? request.getPriority() : "MEDIUM"))
                .completed(false)
                .dueDate(request.getDueDate())
                .createdAt(LocalDateTime.now())
                .build();

        task = taskRepository.save(task);
        return TaskResponse.fromTask(task);
    }

    public List<TaskResponse> getAll(String userId) {
        return taskRepository.findByUserIdOrderByDueDateAsc(userId).stream()
                .map(TaskResponse::fromTask)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getByStatus(String userId, boolean completed) {
        return taskRepository.findByUserIdAndCompletedOrderByDueDateAsc(userId, completed).stream()
                .map(TaskResponse::fromTask)
                .collect(Collectors.toList());
    }

    public TaskResponse update(String taskId, TaskRequest request, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCategory(request.getCategory());
        task.setPriority(Task.Priority.valueOf(request.getPriority() != null ? request.getPriority() : "MEDIUM"));
        task.setDueDate(request.getDueDate());

        task = taskRepository.save(task);
        return TaskResponse.fromTask(task);
    }

    public TaskResponse toggleComplete(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        task.setCompleted(!task.isCompleted());
        task.setCompletedAt(task.isCompleted() ? LocalDateTime.now() : null);

        task = taskRepository.save(task);
        return TaskResponse.fromTask(task);
    }

    public void delete(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        taskRepository.delete(task);
    }

    public Map<String, Long> getStats(String userId) {
        long completed = taskRepository.countByUserIdAndCompletedTrue(userId);
        long pending = taskRepository.countByUserIdAndCompletedFalse(userId);
        long overdue = taskRepository.findByUserIdAndDueDateBeforeAndCompletedFalse(userId, LocalDateTime.now()).size();

        return Map.of(
                "completed", completed,
                "pending", pending,
                "overdue", overdue,
                "total", completed + pending);
    }
}
