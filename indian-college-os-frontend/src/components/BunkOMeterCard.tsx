'use client';

import { Subject, subjectApi } from '@/lib/api';
import { Plus, Minus, X, Trash2, AlertTriangle, PartyPopper } from 'lucide-react';
import { useState } from 'react';

interface Props {
    subject: Subject;
    onUpdate: () => void;
}

export default function BunkOMeterCard({ subject, onUpdate }: Props) {
    const [loading, setLoading] = useState(false);

    const handleMark = async (status: 'PRESENT' | 'ABSENT' | 'CANCELLED') => {
        setLoading(true);
        try {
            await subjectApi.markAttendance(subject.id, status);
            onUpdate();
        } catch (error) {
            console.error('Failed to update attendance', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this subject?')) return;
        try {
            await subjectApi.delete(subject.id);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const isSafe = subject.currentPercentage >= subject.targetAttendance;
    const percentage = Math.round(subject.currentPercentage);

    // Circular Progress Calculation
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="glass rounded-2xl p-6 relative group transition-all hover:scale-[1.02]">
            <button
                onClick={handleDelete}
                className="absolute top-4 right-4 p-2 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold truncate pr-4">{subject.name}</h3>
                    <p className="text-sm text-gray-400">Target: {subject.targetAttendance}%</p>
                </div>

                {/* Ring Chart */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="transform -rotate-90 w-16 h-16">
                        <circle
                            className="text-gray-700"
                            strokeWidth="6"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="32"
                            cy="32"
                        />
                        <circle
                            className={`transition-all duration-1000 ease-out ${isSafe ? 'text-green-500' : 'text-red-500'}`}
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="32"
                            cy="32"
                        />
                    </svg>
                    <span className="absolute text-sm font-bold">{percentage}%</span>
                </div>
            </div>

            {/* Smart Message */}
            <div className={`p-3 rounded-xl mb-6 text-sm flex items-start gap-2 ${isSafe ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
                }`}>
                {isSafe ? <PartyPopper className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <p>{subject.message}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={() => handleMark('PRESENT')}
                    disabled={loading}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                >
                    <Plus className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">Present</span>
                </button>
                <button
                    onClick={() => handleMark('ABSENT')}
                    disabled={loading}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                    <Minus className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">Absent</span>
                </button>
                <button
                    onClick={() => handleMark('CANCELLED')}
                    disabled={loading}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                >
                    <X className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">Off</span>
                </button>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500 font-mono">
                {subject.attendedClasses} / {subject.totalClasses} Classes
            </div>
        </div>
    );
}
