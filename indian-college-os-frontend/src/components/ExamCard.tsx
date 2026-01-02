import { Exam } from '@/lib/api';
import { BookOpen, Calendar, Clock } from 'lucide-react';

interface ExamCardProps {
    exam: Exam;
}

export default function ExamCard({ exam }: ExamCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getDaysUntil = (dateString: string) => {
        const today = new Date();
        const date = new Date(dateString);
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntilExam = getDaysUntil(exam.examDate);
    const isUrgent = daysUntilExam <= 7 && daysUntilExam > 0;
    const isPast = daysUntilExam < 0;

    return (
        <div className={`glass rounded-2xl p-6 card-hover ${isUrgent ? 'border-2 border-orange-500/50' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isUrgent ? 'bg-orange-500/20' : 'bg-primary-500/20'}`}>
                        <BookOpen className={`h-5 w-5 ${isUrgent ? 'text-orange-400' : 'text-primary-300'}`} />
                    </div>
                    <h3 className="font-semibold text-lg">{exam.subject}</h3>
                </div>
                {!isPast && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isUrgent
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-primary-500/20 text-primary-300'
                        }`}>
                        {daysUntilExam === 0 ? 'Today' : `${daysUntilExam} days`}
                    </span>
                )}
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Exam: {formatDate(exam.examDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Deadline: {formatDate(exam.deadline)}</span>
                </div>
            </div>

            {exam.description && (
                <p className="text-gray-400 text-sm">{exam.description}</p>
            )}
        </div>
    );
}
