'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { examApi, Exam } from '@/lib/api';
import ExamCard from '@/components/ExamCard';
import { BookOpen } from 'lucide-react';

export default function ExamsPage() {
    const { token } = useAuth();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            if (!token) return;

            try {
                const data = await examApi.getAll(token);
                setExams(data);
            } catch (error) {
                console.error('Failed to fetch exams:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                    <BookOpen className="h-8 w-8 text-primary-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Exams & Deadlines</h1>
                    <p className="text-gray-400">Stay on top of your exam schedule</p>
                </div>
            </div>

            {exams.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No exams scheduled</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {exams.map(exam => (
                        <ExamCard key={exam.id} exam={exam} />
                    ))}
                </div>
            )}
        </div>
    );
}
