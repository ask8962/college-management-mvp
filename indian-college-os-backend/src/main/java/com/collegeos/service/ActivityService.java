package com.collegeos.service;

import com.collegeos.dto.response.ActivityResponse;
import com.collegeos.model.UserActivity;
import com.collegeos.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final UserActivityRepository activityRepository;

    private static final int XP_PER_CHECKIN = 10;
    private static final int XP_STREAK_BONUS = 5; // Extra XP per streak day

    public ActivityResponse getActivity(String userId) {
        UserActivity activity = getOrCreateActivity(userId);
        Map<String, Integer> heatmap = buildHeatmap(activity);
        boolean checkedInToday = activity.getActiveDates().contains(LocalDate.now().toString());

        return ActivityResponse.fromActivity(activity, heatmap, checkedInToday);
    }

    public ActivityResponse checkIn(String userId) {
        UserActivity activity = getOrCreateActivity(userId);
        LocalDate today = LocalDate.now();
        String todayStr = today.toString();

        // Already checked in today
        if (activity.getActiveDates().contains(todayStr)) {
            Map<String, Integer> heatmap = buildHeatmap(activity);
            return ActivityResponse.fromActivity(activity, heatmap, true);
        }

        // Add today to active dates
        activity.getActiveDates().add(todayStr);
        activity.setTotalActiveDays(activity.getTotalActiveDays() + 1);

        // Calculate streak
        if (activity.getLastActiveDate() != null) {
            long daysBetween = ChronoUnit.DAYS.between(activity.getLastActiveDate(), today);
            if (daysBetween == 1) {
                // Consecutive day - extend streak
                activity.setCurrentStreak(activity.getCurrentStreak() + 1);
            } else if (daysBetween > 1) {
                // Streak broken - reset
                activity.setCurrentStreak(1);
            }
        } else {
            activity.setCurrentStreak(1);
        }

        // Update longest streak
        if (activity.getCurrentStreak() > activity.getLongestStreak()) {
            activity.setLongestStreak(activity.getCurrentStreak());
        }

        // Award XP
        int xpEarned = XP_PER_CHECKIN + (activity.getCurrentStreak() * XP_STREAK_BONUS);
        activity.setTotalXP(activity.getTotalXP() + xpEarned);

        // Award badges
        awardBadges(activity);

        activity.setLastActiveDate(today);
        activityRepository.save(activity);

        Map<String, Integer> heatmap = buildHeatmap(activity);
        return ActivityResponse.fromActivity(activity, heatmap, true);
    }

    private UserActivity getOrCreateActivity(String userId) {
        return activityRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserActivity newActivity = UserActivity.builder()
                            .userId(userId)
                            .currentStreak(0)
                            .longestStreak(0)
                            .totalActiveDays(0)
                            .totalXP(0)
                            .activeDates(new HashSet<>())
                            .badges(new HashSet<>())
                            .build();
                    return activityRepository.save(newActivity);
                });
    }

    private Map<String, Integer> buildHeatmap(UserActivity activity) {
        Map<String, Integer> heatmap = new HashMap<>();

        // Get last 365 days
        LocalDate today = LocalDate.now();
        for (int i = 0; i < 365; i++) {
            String dateStr = today.minusDays(i).toString();
            heatmap.put(dateStr, activity.getActiveDates().contains(dateStr) ? 1 : 0);
        }

        return heatmap;
    }

    private void awardBadges(UserActivity activity) {
        // Streak badges
        if (activity.getCurrentStreak() >= 7 && !activity.getBadges().contains("WEEK_WARRIOR")) {
            activity.getBadges().add("WEEK_WARRIOR");
        }
        if (activity.getCurrentStreak() >= 30 && !activity.getBadges().contains("MONTH_MASTER")) {
            activity.getBadges().add("MONTH_MASTER");
        }
        if (activity.getCurrentStreak() >= 100 && !activity.getBadges().contains("CENTURY_LEGEND")) {
            activity.getBadges().add("CENTURY_LEGEND");
        }

        // XP badges
        if (activity.getTotalXP() >= 1000 && !activity.getBadges().contains("XP_MASTER")) {
            activity.getBadges().add("XP_MASTER");
        }

        // Activity badges
        if (activity.getTotalActiveDays() >= 50 && !activity.getBadges().contains("DEDICATED")) {
            activity.getBadges().add("DEDICATED");
        }
    }
}
