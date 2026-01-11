'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { examApi, Exam } from '@/lib/api';
import { BookOpen } from 'lucide-react';

export default function ExamsPage() {
    const { token } = useAuth();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

    useEffect(() => {
        const loadExams = async () => {
            // Token check removed - using cookies
            try {
                const data = await examApi.getAll();
                setExams(data);
            } catch (error) {
                console.error('Failed to load exams:', error);
            } finally {
                setLoading(false);
            }
        };
        loadExams();
    }, []);

    const now = new Date();
    const filteredExams = exams.filter(exam => {
        const examDate = new Date(exam.examDate);
        if (filter === 'upcoming') return examDate >= now;
        if (filter === 'past') return examDate < now;
        return true;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getDaysUntil = (dateString: string) => {
        const examDate = new Date(dateString);
        const diffTime = examDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
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
                <h1 className="page-title">Exam Schedule</h1>
                <p className="page-subtitle">View your upcoming and past examinations.</p>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {(['all', 'upcoming', 'past'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Exams Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExams.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center text-neutral-500 py-8">
                                    No exams found.
                                </td>
                            </tr>
                        ) : (
                            filteredExams.map((exam) => {
                                const daysUntil = getDaysUntil(exam.examDate);
                                const isPast = daysUntil < 0;

                                return (
                                    <tr key={exam.id}>
                                        <td className="font-medium">{exam.subject}</td>
                                        <td>{formatDate(exam.examDate)}</td>
                                        <td>{exam.description || '—'}</td>
                                        <td>
                                            {isPast ? (
                                                <span className="badge badge-neutral">Completed</span>
                                            ) : daysUntil === 0 ? (
                                                <span className="badge badge-warning">Today</span>
                                            ) : daysUntil === 1 ? (
                                                <span className="badge badge-warning">Tomorrow</span>
                                            ) : (
                                                <span className="badge badge-success">{daysUntil} days</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
