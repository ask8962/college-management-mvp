'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { activityApi, Activity } from '@/lib/api';
import { Flame, Trophy, Zap, Calendar, Award, CheckCircle } from 'lucide-react';

const BADGE_INFO: Record<string, { icon: string; label: string; color: string }> = {
    WEEK_WARRIOR: { icon: '⚔️', label: '7 Day Streak', color: 'bg-blue-500/20 text-blue-400' },
    MONTH_MASTER: { icon: '👑', label: '30 Day Streak', color: 'bg-purple-500/20 text-purple-400' },
    CENTURY_LEGEND: { icon: '🏆', label: '100 Day Streak', color: 'bg-yellow-500/20 text-yellow-400' },
    XP_MASTER: { icon: '⚡', label: '1000 XP', color: 'bg-orange-500/20 text-orange-400' },
    DEDICATED: { icon: '💪', label: '50 Active Days', color: 'bg-green-500/20 text-green-400' },
};

export default function StreakCard() {
    const { user } = useAuth();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        loadActivity();
    }, []);

    const loadActivity = async () => {
        try {
            const data = await activityApi.get();
            setActivity(data);
        } catch (error) {
            console.error('Failed to load activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (checking) return;
        setChecking(true);
        try {
            const data = await activityApi.checkIn();
            setActivity(data);
        } catch (error) {
            console.error('Check-in failed:', error);
        } finally {
            setChecking(false);
        }
    };

    // Generate heatmap grid (last 52 weeks)
    const heatmapWeeks = useMemo(() => {
        if (!activity?.heatmapData) return [];

        const weeks: { date: string; count: number }[][] = [];
        const today = new Date();

        for (let week = 0; week < 26; week++) { // 26 weeks = ~6 months
            const weekData: { date: string; count: number }[] = [];
            for (let day = 0; day < 7; day++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (week * 7 + day));
                const dateStr = date.toISOString().split('T')[0];
                weekData.push({
                    date: dateStr,
                    count: activity.heatmapData[dateStr] || 0,
                });
            }
            weeks.unshift(weekData);
        }

        return weeks;
    }, [activity?.heatmapData]);

    if (loading) {
        return (
            <div className="glass rounded-2xl p-6 animate-pulse">
                <div className="h-40 bg-white/5 rounded-lg"></div>
            </div>
        );
    }

    if (!activity) return null;

    return (
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

            {/* Header */}
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-400" />
                        Activity Streak
                    </h3>
                    <p className="text-gray-400 text-sm">Your daily progress</p>
                </div>

                {!activity.checkedInToday ? (
                    <button
                        onClick={handleCheckIn}
                        disabled={checking}
                        className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                    >
                        <CheckCircle className="h-4 w-4" />
                        {checking ? 'Checking...' : 'Check In'}
                    </button>
                ) : (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                        ✓ Checked in today!
                    </span>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 flex items-center justify-center gap-1">
                        <Flame className="h-6 w-6" />
                        {activity.currentStreak}
                    </div>
                    <p className="text-gray-500 text-xs">Current Streak</p>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">
                        {activity.longestStreak}
                    </div>
                    <p className="text-gray-500 text-xs">Best Streak</p>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">
                        {activity.totalActiveDays}
                    </div>
                    <p className="text-gray-500 text-xs">Active Days</p>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                        <Zap className="h-5 w-5" />
                        {activity.totalXP}
                    </div>
                    <p className="text-gray-500 text-xs">Total XP</p>
                </div>
            </div>

            {/* Level Progress */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">{activity.level}</span>
                    <span className="text-sm text-gray-400">
                        {activity.xpToNextLevel > 0 ? `${activity.xpToNextLevel} XP to next level` : 'Max level!'}
                    </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500"
                        style={{
                            width: activity.xpToNextLevel > 0
                                ? `${Math.min(100, (activity.totalXP % 500) / 5)}%`
                                : '100%'
                        }}
                    />
                </div>
            </div>

            {/* Heatmap */}
            <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Activity Heatmap (Last 6 months)</p>
                <div className="flex gap-[3px] overflow-x-auto pb-2">
                    {heatmapWeeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-[3px]">
                            {week.map((day, dayIdx) => (
                                <div
                                    key={`${weekIdx}-${dayIdx}`}
                                    className={`w-3 h-3 rounded-sm transition-colors ${day.count > 0
                                        ? 'bg-green-500'
                                        : 'bg-white/5'
                                        }`}
                                    title={`${day.date}: ${day.count > 0 ? 'Active' : 'Inactive'}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-white/5"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-500/50"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                    <span>More</span>
                </div>
            </div>

            {/* Badges */}
            {activity.badges.length > 0 && (
                <div>
                    <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                        <Award className="h-4 w-4" /> Badges Earned
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {activity.badges.map(badge => {
                            const info = BADGE_INFO[badge];
                            if (!info) return null;
                            return (
                                <span
                                    key={badge}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${info.color}`}
                                >
                                    {info.icon} {info.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
