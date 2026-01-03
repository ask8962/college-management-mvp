'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { noticeApi, examApi, placementApi, attendanceApi, Notice, Exam, Placement, AttendanceRecord } from '@/lib/api';
import NoticeCard from '@/components/NoticeCard';
import ExamCard from '@/components/ExamCard';
import PlacementCard from '@/components/PlacementCard';
import BunkManager from '@/components/BunkManager';
import StreakCard from '@/components/StreakCard';
import { Bell, BookOpen, Briefcase, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [placements, setPlacements] = useState<Placement[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!token) return;

        // Don't set loading to true here to avoid flickering on updates
        try {
            const [noticesData, examsData, placementsData, attendanceData] = await Promise.all([
                noticeApi.getAll(token).catch(() => []),
                examApi.getUpcoming(token).catch(() => []),
                placementApi.getActive(token).catch(() => []),
                attendanceApi.getMyAttendance(token).catch(() => []),
            ]);

            setNotices(noticesData.slice(0, 3));
            setExams(examsData.slice(0, 3));
            setPlacements(placementsData.slice(0, 3));
            setAttendance(attendanceData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const stats = [
        { icon: BookOpen, label: 'Upcoming Exams', value: exams.length, color: 'text-primary-400' },
        { icon: Bell, label: 'New Notices', value: notices.length, color: 'text-accent-400' },
        { icon: Briefcase, label: 'Active Placements', value: placements.length, color: 'text-orange-400' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-gray-400">Here&apos;s what&apos;s happening in your college</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bunk-o-Meter Widget (Takes 1 column on large screens) */}
                <div className="lg:col-span-1">
                    <BunkManager attendance={attendance} onUpdate={fetchData} />
                </div>

                {/* Other Stats (Takes 2 columns) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 content-start">
                    {stats.map((stat, index) => (
                        <div key={index} className="glass rounded-2xl p-6 card-hover flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <TrendingUp className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activity Streak & Heatmap */}
            <StreakCard />

            {/* Latest Notices */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Latest Notices</h2>
                {notices.length === 0 ? (
                    <div className="glass rounded-2xl p-8 text-center text-gray-400">
                        No notices available
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {notices.map(notice => (
                            <NoticeCard key={notice.id} notice={notice} />
                        ))}
                    </div>
                )}
            </section>

            {/* Upcoming Exams */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>
                {exams.length === 0 ? (
                    <div className="glass rounded-2xl p-8 text-center text-gray-400">
                        No upcoming exams
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {exams.map(exam => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                )}
            </section>

            {/* Active Placements */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Active Placement Drives</h2>
                {placements.length === 0 ? (
                    <div className="glass rounded-2xl p-8 text-center text-gray-400">
                        No active placement drives
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {placements.map(placement => (
                            <PlacementCard key={placement.id} placement={placement} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
