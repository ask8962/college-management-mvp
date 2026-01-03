import { Notice } from '@/lib/api';
import { ExternalLink, FileText, Download, Eye } from 'lucide-react';
import { useState } from 'react';

interface NoticeCardProps {
    notice: Notice;
}

export default function NoticeCard({ notice }: NoticeCardProps) {
    const [showPreview, setShowPreview] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Check if file is a PDF
    const isPDF = notice.fileUrl?.toLowerCase().includes('.pdf');

    // Check if file is an image
    const isImage = notice.fileUrl?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)/);

    // For Cloudinary PDFs, convert image/upload to raw/upload for better viewing
    const getDirectUrl = () => {
        if (isPDF && notice.fileUrl?.includes('/image/upload/')) {
            return notice.fileUrl.replace('/image/upload/', '/raw/upload/');
        }
        return notice.fileUrl;
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
                <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    🤖 AI Summary
                </h4>
                <div className="text-gray-300 text-sm whitespace-pre-wrap bg-white/5 rounded-xl p-4">
                    {notice.summary || 'No summary available'}
                </div>
            </div>

            {/* Image Preview */}
            {isImage && (
                <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                        src={notice.fileUrl}
                        alt={notice.title}
                        className="w-full h-auto max-h-64 object-cover"
                    />
                </div>
            )}

            {/* PDF Preview Modal */}
            {showPreview && isPDF && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h3 className="font-semibold">{notice.title}</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 p-4">
                            <iframe
                                src={getDirectUrl()}
                                className="w-full h-full rounded-lg bg-white"
                                title={notice.title}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-3 flex-wrap">
                {isPDF ? (
                    <>
                        <button
                            onClick={() => setShowPreview(true)}
                            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium"
                        >
                            <Eye className="h-4 w-4" />
                            Preview PDF
                        </button>
                        <a
                            href={getDirectUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Open in New Tab
                        </a>
                        <a
                            href={getDirectUrl()}
                            download
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors font-medium"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </a>
                    </>
                ) : (
                    <a
                        href={notice.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium"
                    >
                        <ExternalLink className="h-4 w-4" />
                        View File
                    </a>
                )}
            </div>
        </div>
    );
}
