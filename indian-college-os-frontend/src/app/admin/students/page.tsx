'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { usersApi, UserInfo } from '@/lib/api';
import { Users, Search, Edit2, Check, X, Hash } from 'lucide-react';

export default function AdminStudentsPage() {
    const { token } = useAuth();
    const [students, setStudents] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            loadStudents();
        }
    }, [token]);

    const loadStudents = async () => {
        try {
            const data = await usersApi.getAllStudents(token!);
            setStudents(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (student: UserInfo) => {
        setEditingId(student.id);
        setEditValue(student.studentId || '');
    };

    const handleSave = async (userId: string) => {
        try {
            const updated = await usersApi.updateStudentId(token!, userId, editValue);
            setStudents(students.map(s => s.id === userId ? updated : s));
            setEditingId(null);
            setEditValue('');
        } catch (err: any) {
            setError(err.message || 'Failed to update student ID');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValue('');
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                    <Users className="h-8 w-8 text-primary-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">All Students</h1>
                    <p className="text-gray-400">View and manage student information</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            <div className="glass rounded-2xl p-6">
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, email, or student ID..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        {searchTerm ? 'No students found matching your search.' : 'No students registered yet.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-400 border-b border-white/10">
                                    <th className="pb-4 font-medium">Student ID</th>
                                    <th className="pb-4 font-medium">Name</th>
                                    <th className="pb-4 font-medium">Email</th>
                                    <th className="pb-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-white/5">
                                        <td className="py-4">
                                            {editingId === student.id ? (
                                                <div className="flex items-center gap-2">
                                                    <Hash className="h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="bg-white/10 border border-primary-500 rounded-lg px-3 py-1 text-white w-32"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Hash className="h-4 w-4 text-gray-400" />
                                                    {student.studentId || <span className="text-gray-500 italic">Not set</span>}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4">{student.name}</td>
                                        <td className="py-4 text-gray-400">{student.email}</td>
                                        <td className="py-4">
                                            {editingId === student.id ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleSave(student.id)}
                                                        className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="p-2 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 hover:text-white transition-colors"
                                                    title="Edit Student ID"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-white/10 text-sm text-gray-400">
                    Total Students: {filteredStudents.length}
                </div>
            </div>
        </div>
    );
}
