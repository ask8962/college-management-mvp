import { Placement } from '@/lib/api';
import { Briefcase, Calendar, Users } from 'lucide-react';

interface PlacementCardProps {
    placement: Placement;
}

export default function PlacementCard({ placement }: PlacementCardProps) {
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

    const daysLeft = getDaysUntil(placement.deadline);
    const isClosing = daysLeft <= 3 && daysLeft >= 0;

    return (
        <div className="glass rounded-2xl p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-500/20 rounded-lg">
                        <Briefcase className="h-5 w-5 text-accent-300" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{placement.companyName}</h3>
                        <p className="text-sm text-gray-400">{placement.role}</p>
                    </div>
                </div>
                {isClosing && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                        Closing Soon
                    </span>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{placement.eligibility || 'All eligible students'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Deadline: {formatDate(placement.deadline)}</span>
                </div>
            </div>
        </div>
    );
}
