package com.collegeos.dto.response;

import com.collegeos.model.UserActivity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    private int currentStreak;
    private int longestStreak;
    private int totalActiveDays;
    private int totalXP;
    private String level;
    private int xpToNextLevel;
    private Set<String> badges;
    private Map<String, Integer> heatmapData; // date -> activity count
    private boolean checkedInToday;

    public static ActivityResponse fromActivity(UserActivity activity, Map<String, Integer> heatmap,
            boolean checkedInToday) {
        int xp = activity.getTotalXP();
        String level = calculateLevel(xp);
        int nextLevelXP = calculateNextLevelXP(xp);

        return ActivityResponse.builder()
                .currentStreak(activity.getCurrentStreak())
                .longestStreak(activity.getLongestStreak())
                .totalActiveDays(activity.getTotalActiveDays())
                .totalXP(xp)
                .level(level)
                .xpToNextLevel(nextLevelXP)
                .badges(activity.getBadges())
                .heatmapData(heatmap)
                .checkedInToday(checkedInToday)
                .build();
    }

    private static String calculateLevel(int xp) {
        if (xp >= 5000)
            return "🏆 Legend";
        if (xp >= 2500)
            return "💎 Diamond";
        if (xp >= 1000)
            return "🥇 Gold";
        if (xp >= 500)
            return "🥈 Silver";
        if (xp >= 100)
            return "🥉 Bronze";
        return "🌱 Newbie";
    }

    private static int calculateNextLevelXP(int xp) {
        int[] thresholds = { 100, 500, 1000, 2500, 5000 };
        for (int threshold : thresholds) {
            if (xp < threshold)
                return threshold - xp;
        }
        return 0;
    }
}
