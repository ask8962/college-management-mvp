'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { noticeApi, Notice } from '@/lib/api';
import { Bell, FileText, ExternalLink, Download } from 'lucide-react';

export default function NoticesPage() {
    const { token } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNotices = async () => {
            // Token check removed - using cookies
            try {
                const data = await noticeApi.getAll();
                setNotices(data);
            } catch (error) {
                console.error('Failed to load notices:', error);
            } finally {
                setLoading(false);
            }
        };
        loadNotices();
    }, []);

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
                <h1 className="page-title">Notices</h1>
                <p className="page-subtitle">Important announcements and documents from your institution.</p>
            </div>

            {/* Notices List */}
            {notices.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <Bell className="empty-state-icon" />
                        <p className="empty-state-title">No notices available</p>
                        <p className="empty-state-text">Check back later for updates.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {notices.map((notice) => (
                        <div key={notice.id} className="card">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-primary-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-neutral-900">{notice.title}</h3>
                                            <p className="text-sm text-neutral-500 mt-1">{formatDate(notice.createdAt)}</p>
                                        </div>
                                        {notice.fileUrl && (
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={notice.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    View
                                                </a>
                                                <a
                                                    href={notice.fileUrl}
                                                    download
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {notice.summary && (
                                        <div className="mt-4 p-3 bg-neutral-50 rounded border border-neutral-200">
                                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">AI Summary</p>
                                            <p className="text-sm text-neutral-700">{notice.summary}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
