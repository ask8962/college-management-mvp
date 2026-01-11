'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { usersApi, UserInfo } from '@/lib/api';
import { ArrowLeft, Users, Edit, X, Check } from 'lucide-react';
import Link from 'next/link';

export default function AdminStudentsPage() {
    const { user } = useAuth();
    const [students, setStudents] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStudentId, setEditStudentId] = useState('');

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const data = await usersApi.getAllStudents();
            setStudents(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStudentId = async (userId: string) => {
        try {
            await usersApi.updateStudentId(userId, editStudentId);
            setEditingId(null);
            loadStudents();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const startEditing = (student: UserInfo) => {
        setEditingId(student.id);
        setEditStudentId(student.studentId || '');
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
            <div className="flex items-center gap-4">
                <Link href="/admin" className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">View Students</h1>
                    <p className="text-gray-400">View all registered students and manage their IDs</p>
                </div>
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
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    No students found.
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium">{student.name}</td>
                                    <td className="px-6 py-4 text-gray-400">{student.email}</td>
                                    <td className="px-6 py-4">
                                        {editingId === student.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editStudentId}
                                                    onChange={(e) => setEditStudentId(e.target.value)}
                                                    className="input-field py-1 px-2 w-32"
                                                    placeholder="Student ID"
                                                />
                                                <button
                                                    onClick={() => handleUpdateStudentId(student.id)}
                                                    className="p-1 rounded hover:bg-green-500/20 text-green-400"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="p-1 rounded hover:bg-white/10 text-gray-400"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={student.studentId ? 'text-cyan-400' : 'text-gray-500 italic'}>
                                                {student.studentId || 'Not set'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.role === 'ADMIN'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-cyan-500/20 text-cyan-400'
                                            }`}>
                                            {student.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId !== student.id && (
                                            <button
                                                onClick={() => startEditing(student)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-cyan-400 transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
