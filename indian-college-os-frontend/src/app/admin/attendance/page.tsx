'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { attendanceApi, AttendanceRecord } from '@/lib/api';
import { Plus, Edit, Trash2, ArrowLeft, X, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminAttendancePage() {
    const { token } = useAuth();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
    const [formData, setFormData] = useState({
        studentId: '',
        subject: '',
        date: '',
        status: 'PRESENT' as 'PRESENT' | 'ABSENT',
    });

    useEffect(() => {
        if (token) {
            loadRecords();
        }
    }, [token]);

    const loadRecords = async () => {
        try {
            const data = await attendanceApi.getAll();
            setRecords(data);
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
            if (editingRecord) {
                await attendanceApi.update(editingRecord.id, formData);
            } else {
                await attendanceApi.create(formData);
            }
            setShowModal(false);
            setEditingRecord(null);
            resetForm();
            loadRecords();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this attendance record?')) return;

        try {
            await attendanceApi.delete(id);
            loadRecords();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const openEditModal = (record: AttendanceRecord) => {
        setEditingRecord(record);
        setFormData({
            studentId: record.studentId,
            subject: record.subject,
            date: record.date,
            status: record.status,
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingRecord(null);
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            studentId: '',
            subject: '',
            date: '',
            status: 'PRESENT',
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
                        <h1 className="text-3xl font-bold">Manage Attendance</h1>
                        <p className="text-gray-400">Create, edit, and delete attendance records</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add Record
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
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Subject</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    No attendance records found. Click "Add Record" to create one.
                                </td>
                            </tr>
                        ) : (
                            records.map((record) => (
                                <tr key={record.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium">{record.studentId}</td>
                                    <td className="px-6 py-4 text-gray-400">{record.subject}</td>
                                    <td className="px-6 py-4 text-gray-400">{record.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.status === 'PRESENT'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(record)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-cyan-400 transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(record.id)}
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
                                {editingRecord ? 'Edit Attendance' : 'Add Attendance Record'}
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Student ID</label>
                                <input
                                    type="text"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter student ID"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Mathematics, Physics"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'PRESENT' | 'ABSENT' })}
                                    className="input-field"
                                    required
                                >
                                    <option value="PRESENT">Present</option>
                                    <option value="ABSENT">Absent</option>
                                </select>
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
                                    {editingRecord ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
