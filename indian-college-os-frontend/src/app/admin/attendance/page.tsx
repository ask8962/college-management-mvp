'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { attendanceApi } from '@/lib/api';
import { Calendar, CheckCircle } from 'lucide-react';

export default function AdminAttendancePage() {
    const { token } = useAuth();
    const [studentId, setStudentId] = useState('');
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState<'PRESENT' | 'ABSENT'>('PRESENT');
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
            await attendanceApi.create(token, {
                studentId,
                subject,
                date,
                status,
            });
            setSuccess(true);
            setStudentId('');
            setSubject('');
            setDate('');
            setStatus('PRESENT');
        } catch (err: any) {
            setError(err.message || 'Failed to add attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                    <Calendar className="h-8 w-8 text-primary-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Manage Attendance</h1>
                    <p className="text-gray-400">Add attendance records for students</p>
                </div>
            </div>

            <div className="glass rounded-2xl p-8">
                {success && (
                    <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl mb-6">
                        <CheckCircle className="h-5 w-5" />
                        Attendance record added successfully!
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Student ID</label>
                        <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                            placeholder="Enter student ID"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                            placeholder="e.g., Data Structures, DBMS"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'PRESENT' | 'ABSENT')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary-500 transition-colors"
                            >
                                <option value="PRESENT" className="bg-slate-800">Present</option>
                                <option value="ABSENT" className="bg-slate-800">Absent</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="spinner"></div> : 'Add Attendance Record'}
                    </button>
                </form>
            </div>
        </div>
    );
}
