'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { noticeApi, Notice, examApi, Exam } from '@/lib/api';
import { Calendar, BookOpen, Bell, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();
    const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
    const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            // Token check removed - using cookies
            try {
                const [notices, exams] = await Promise.all([
                    noticeApi.getAll(),
                    examApi.getAll()
                ]);
                setRecentNotices(notices.slice(0, 3));
                setUpcomingExams(exams.filter(e => new Date(e.examDate) > new Date()).slice(0, 3));
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
                <p className="page-subtitle">Here's an overview of your academic activity.</p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/attendance" className="stat-card hover:border-primary-500 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                            <div className="font-semibold text-neutral-900">Attendance</div>
                            <div className="text-sm text-neutral-500">View records</div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/exams" className="stat-card hover:border-primary-500 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-success-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-neutral-900">Exams</div>
                            <div className="text-sm text-neutral-500">{upcomingExams.length} upcoming</div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/notices" className="stat-card hover:border-primary-500 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-yellow-50 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-warning-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-neutral-900">Notices</div>
                            <div className="text-sm text-neutral-500">View all</div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/placements" className="stat-card hover:border-primary-500 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-purple-50 flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-neutral-900">Placements</div>
                            <div className="text-sm text-neutral-500">Opportunities</div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Notices */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h2 className="font-semibold text-neutral-900">Recent Notices</h2>
                        <Link href="/dashboard/notices" className="text-sm text-primary-500 hover:underline">
                            View all
                        </Link>
                    </div>
                    {recentNotices.length === 0 ? (
                        <p className="text-neutral-500 text-sm">No notices available.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentNotices.map((notice) => (
                                <div key={notice.id} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-0">
                                    <Bell className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">{notice.title}</p>
                                        <p className="text-xs text-neutral-500">{formatDate(notice.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Exams */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h2 className="font-semibold text-neutral-900">Upcoming Exams</h2>
                        <Link href="/dashboard/exams" className="text-sm text-primary-500 hover:underline">
                            View all
                        </Link>
                    </div>
                    {upcomingExams.length === 0 ? (
                        <p className="text-neutral-500 text-sm">No upcoming exams.</p>
                    ) : (
                        <div className="space-y-3">
                            {upcomingExams.map((exam) => (
                                <div key={exam.id} className="flex items-start gap-3 py-2 border-b border-neutral-100 last:border-0">
                                    <BookOpen className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">{exam.subject}</p>
                                        <p className="text-xs text-neutral-500">{formatDate(exam.examDate)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
