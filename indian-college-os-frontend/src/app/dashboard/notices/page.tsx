'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { noticeApi, Notice } from '@/lib/api';
import NoticeCard from '@/components/NoticeCard';
import { Bell } from 'lucide-react';

export default function NoticesPage() {
    const { token } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            if (!token) return;

            try {
                const data = await noticeApi.getAll(token);
                setNotices(data);
            } catch (error) {
                console.error('Failed to fetch notices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                    <Bell className="h-8 w-8 text-primary-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Notices</h1>
                    <p className="text-gray-400">College notices with AI-powered summaries</p>
                </div>
            </div>

            {notices.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No notices available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {notices.map(notice => (
                        <NoticeCard key={notice.id} notice={notice} />
                    ))}
                </div>
            )}
        </div>
    );
}
