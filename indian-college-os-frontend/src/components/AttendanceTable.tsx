import { AttendanceRecord } from '@/lib/api';
import { CheckCircle, XCircle } from 'lucide-react';

interface AttendanceTableProps {
    records: AttendanceRecord[];
}

export default function AttendanceTable({ records }: AttendanceTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Group by subject
    const groupedBySubject = records.reduce((acc, record) => {
        if (!acc[record.subject]) {
            acc[record.subject] = [];
        }
        acc[record.subject].push(record);
        return acc;
    }, {} as Record<string, AttendanceRecord[]>);

    // Calculate attendance percentage
    const calculatePercentage = (subjectRecords: AttendanceRecord[]) => {
        const present = subjectRecords.filter(r => r.status === 'PRESENT').length;
        return Math.round((present / subjectRecords.length) * 100);
    };

    if (records.length === 0) {
        return (
            <div className="glass rounded-2xl p-8 text-center">
                <p className="text-gray-400">No attendance records found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(groupedBySubject).map(([subject, subjectRecords]) => {
                    const percentage = calculatePercentage(subjectRecords);
                    const isLow = percentage < 75;
                    return (
                        <div
                            key={subject}
                            className={`glass rounded-2xl p-4 ${isLow ? 'border-2 border-red-500/50' : ''}`}
                        >
                            <h4 className="font-semibold mb-2">{subject}</h4>
                            <div className="flex items-center justify-between">
                                <span className={`text-3xl font-bold ${isLow ? 'text-red-400' : 'text-green-400'}`}>
                                    {percentage}%
                                </span>
                                <span className="text-sm text-gray-400">
                                    {subjectRecords.filter(r => r.status === 'PRESENT').length}/{subjectRecords.length}
                                </span>
                            </div>
                            {isLow && (
                                <p className="text-xs text-red-400 mt-2">Below 75% minimum</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Detailed Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="text-left px-6 py-4 font-semibold">Date</th>
                            <th className="text-left px-6 py-4 font-semibold">Subject</th>
                            <th className="text-left px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">{formatDate(record.date)}</td>
                                <td className="px-6 py-4">{record.subject}</td>
                                <td className="px-6 py-4">
                                    {record.status === 'PRESENT' ? (
                                        <span className="inline-flex items-center gap-2 text-green-400">
                                            <CheckCircle className="h-4 w-4" />
                                            Present
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 text-red-400">
                                            <XCircle className="h-4 w-4" />
                                            Absent
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
