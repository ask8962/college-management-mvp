'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { examApi, Exam } from '@/lib/api';
import { Plus, Edit, Trash2, ArrowLeft, X, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AdminExamsPage() {
    const { user } = useAuth();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [formData, setFormData] = useState({
        subject: '',
        examDate: '',
        deadline: '',
        description: '',
    });

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            const data = await examApi.getAll();
            setExams(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (editingExam) {
                await examApi.update(editingExam.id, formData);
            } else {
                await examApi.create(formData);
            }
            setShowModal(false);
            setEditingExam(null);
            resetForm();
            loadExams();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this exam?')) return;

        try {
            await examApi.delete(id);
            loadExams();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const openEditModal = (exam: Exam) => {
        setEditingExam(exam);
        setFormData({
            subject: exam.subject,
            examDate: exam.examDate,
            deadline: exam.deadline,
            description: exam.description,
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingExam(null);
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            subject: '',
            examDate: '',
            deadline: '',
            description: '',
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
                        <h1 className="text-3xl font-bold">Manage Exams</h1>
                        <p className="text-gray-400">Create, edit, and delete exams</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add Exam
                </button>
            </div>

            {error && (
                <div className="p-4 glass rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Subject</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Exam Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Deadline</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {exams.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    No exams found. Click "Add Exam" to create one.
                                </td>
                            </tr>
                        ) : (
                            exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium">{exam.subject}</td>
                                    <td className="px-6 py-4 text-gray-400">{exam.examDate}</td>
                                    <td className="px-6 py-4 text-gray-400">{exam.deadline}</td>
                                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{exam.description}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(exam)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-cyan-400 transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exam.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl p-6 w-full max-w-md animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {editingExam ? 'Edit Exam' : 'Add New Exam'}
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Exam Date</label>
                                <input
                                    type="date"
                                    value={formData.examDate}
                                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field min-h-[100px]"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingExam ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
