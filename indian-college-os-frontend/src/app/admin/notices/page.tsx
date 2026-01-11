'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { noticeApi, Notice } from '@/lib/api';
import { Plus, Edit, Trash2, ArrowLeft, X, Bell, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminNoticesPage() {
    const { token } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        file: null as File | null,
    });

    useEffect(() => {
        if (token) {
            loadNotices();
        }
    }, [token]);

    const loadNotices = async () => {
        try {
            const data = await noticeApi.getAll();
            setNotices(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            if (editingNotice) {
                await noticeApi.update(editingNotice.id, formData.title, formData.file || undefined);
            } else {
                if (!formData.file) {
                    setError('Please select a file');
                    setSubmitting(false);
                    return;
                }
                await noticeApi.create(formData.title, formData.file);
            }
            setShowModal(false);
            setEditingNotice(null);
            resetForm();
            loadNotices();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notice?')) return;

        try {
            await noticeApi.delete(id);
            loadNotices();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const openEditModal = (notice: Notice) => {
        setEditingNotice(notice);
        setFormData({
            title: notice.title,
            file: null,
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingNotice(null);
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            file: null,
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Manage Notices</h1>
                        <p className="text-gray-400">Upload, edit, and delete notices with AI summaries</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Upload Notice
                </button>
            </div>

            {error && (
                <div className="p-4 glass rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notices.length === 0 ? (
                    <div className="col-span-full glass rounded-2xl p-12 text-center">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-500 opacity-50" />
                        <p className="text-gray-400">No notices found. Click "Upload Notice" to create one.</p>
                    </div>
                ) : (
                    notices.map((notice) => (
                        <div key={notice.id} className="glass rounded-2xl p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-1">{notice.title}</h3>
                                    <p className="text-sm text-gray-500">{formatDate(notice.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={notice.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-white/10 text-purple-400 transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                    <button
                                        onClick={() => openEditModal(notice)}
                                        className="p-2 rounded-lg hover:bg-white/10 text-cyan-400 transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(notice.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl">
                                <p className="text-sm text-gray-300 font-medium mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-purple-400" />
                                    AI Summary
                                </p>
                                <p className="text-sm text-gray-400 leading-relaxed">{notice.summary}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl p-6 w-full max-w-md animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {editingNotice ? 'Edit Notice' : 'Upload New Notice'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter notice title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {editingNotice ? 'New File (optional)' : 'File (PDF or Image)'}
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                                    className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30"
                                    required={!editingNotice}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    PDF files will get AI-generated summaries
                                </p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary flex-1"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            {editingNotice ? 'Updating...' : 'Uploading...'}
                                        </span>
                                    ) : (
                                        editingNotice ? 'Update' : 'Upload'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
