'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { attendanceApi, AttendanceRecord } from '@/lib/api';
import { AlertCircle } from 'lucide-react';

export default function AttendancePage() {
    const { user } = useAuth();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAttendance = async () => {
            // Token check removed - using cookies
            try {
                const data = await attendanceApi.getMyAttendance();
                setRecords(data);
            } catch (error) {
                console.error('Failed to load attendance:', error);
            } finally {
                setLoading(false);
            }
        };
        loadAttendance();
    }, [user]);

    const totalClasses = records.length;
    const presentCount = records.filter(r => r.status === 'PRESENT').length;
    const absentCount = records.filter(r => r.status === 'ABSENT').length;
    const percentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return <span className="badge badge-success">Present</span>;
            case 'ABSENT':
                return <span className="badge badge-error">Absent</span>;
            case 'LATE':
                return <span className="badge badge-warning">Late</span>;
            default:
                return <span className="badge badge-neutral">{status}</span>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Attendance</h1>
                <p className="page-subtitle">Track your class attendance records.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card">
                    <div className="stat-value text-primary-500">{percentage}%</div>
                    <div className="stat-label">Overall Attendance</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{totalClasses}</div>
                    <div className="stat-label">Total Classes</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value text-success-600">{presentCount}</div>
                    <div className="stat-label">Present</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value text-error-500">{absentCount}</div>
                    <div className="stat-label">Absent</div>
                </div>
            </div>

            {/* Warning if below 75% */}
            {percentage < 75 && totalClasses > 0 && (
                <div className="alert alert-warning">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                        <strong>Low Attendance Warning:</strong> Your attendance is below 75%.
                        You need {Math.ceil((0.75 * totalClasses - presentCount) / 0.25)} more classes to reach 75%.
                    </div>
                </div>
            )}

            {/* Attendance Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center text-neutral-500 py-8">
                                    No attendance records found.
                                </td>
                            </tr>
                        ) : (
                            records.map((record) => (
                                <tr key={record.id}>
                                    <td>{formatDate(record.date)}</td>
                                    <td>{record.subject}</td>
                                    <td>{getStatusBadge(record.status)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
