'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { noticeApi } from '@/lib/api';
import { Bell, Upload, CheckCircle } from 'lucide-react';

export default function AdminNoticesPage() {
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !file) return;

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await noticeApi.create(token, title, file);
            setSuccess(true);
            setTitle('');
            setFile(null);
            // Reset file input
            const fileInput = document.getElementById('file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (err: any) {
            setError(err.message || 'Failed to upload notice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                    <Bell className="h-8 w-8 text-primary-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Upload Notice</h1>
                    <p className="text-gray-400">Upload PDF or image notices with AI-powered summaries</p>
                </div>
            </div>

            <div className="glass rounded-2xl p-8">
                {success && (
                    <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl mb-6">
                        <CheckCircle className="h-5 w-5" />
                        Notice uploaded successfully! AI summary has been generated.
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Notice Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                            placeholder="e.g., Semester Exam Schedule 2024"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Notice File (PDF or Image)</label>
                        <div className="relative">
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                                className="hidden"
                            />
                            <label
                                htmlFor="file-input"
                                className="flex items-center justify-center gap-3 w-full bg-white/5 border-2 border-dashed border-white/20 rounded-xl py-8 px-4 cursor-pointer hover:border-primary-500/50 hover:bg-white/10 transition-all"
                            >
                                <Upload className="h-6 w-6 text-gray-400" />
                                <span className="text-gray-400">
                                    {file ? file.name : 'Click to upload PDF or image'}
                                </span>
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            PDF files will be automatically summarized by AI
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Uploading & Generating Summary...
                            </>
                        ) : (
                            'Upload Notice'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
