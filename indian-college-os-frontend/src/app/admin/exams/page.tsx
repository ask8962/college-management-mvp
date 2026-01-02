'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { examApi } from '@/lib/api';
import { BookOpen, CheckCircle } from 'lucide-react';

export default function AdminExamsPage() {
    const { token } = useAuth();
    const [subject, setSubject] = useState('');
    const [examDate, setExamDate] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await examApi.create(token, {
                subject,
                examDate,
                deadline,
                description,
            });
            setSuccess(true);
            setSubject('');
            setExamDate('');
            setDeadline('');
            setDescription('');
        } catch (err: any) {
            setError(err.message || 'Failed to create exam');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                    <BookOpen className="h-8 w-8 text-primary-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Create Exam</h1>
                    <p className="text-gray-400">Schedule new exams and set deadlines</p>
                </div>
            </div>

            <div className="glass rounded-2xl p-8">
                {success && (
                    <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl mb-6">
                        <CheckCircle className="h-5 w-5" />
                        Exam created successfully!
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                            placeholder="e.g., Data Structures"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Exam Date</label>
                            <input
                                type="date"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Registration Deadline</label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors resize-none"
                            placeholder="Additional details about the exam..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="spinner"></div> : 'Create Exam'}
                    </button>
                </form>
            </div>
        </div>
    );
}
