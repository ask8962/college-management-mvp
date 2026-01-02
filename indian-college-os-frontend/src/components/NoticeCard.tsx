import { Notice } from '@/lib/api';
import { ExternalLink, FileText } from 'lucide-react';

interface NoticeCardProps {
    notice: Notice;
}

export default function NoticeCard({ notice }: NoticeCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="glass rounded-2xl p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/20 rounded-lg">
                        <FileText className="h-5 w-5 text-primary-300" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{notice.title}</h3>
                        <p className="text-sm text-gray-400">{formatDate(notice.createdAt)}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">AI Summary</h4>
                <div className="text-gray-300 text-sm whitespace-pre-wrap bg-white/5 rounded-xl p-4">
                    {notice.summary}
                </div>
            </div>

            <a
                href={notice.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
                <ExternalLink className="h-4 w-4" />
                View PDF
            </a>
        </div>
    );
}
