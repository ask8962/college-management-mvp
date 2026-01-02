'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { attendanceApi, AttendanceRecord } from '@/lib/api';
import AttendanceTable from '@/components/AttendanceTable';
import { Calendar } from 'lucide-react';

export default function AttendancePage() {
    const { token } = useAuth();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!token) return;

            try {
                const data = await attendanceApi.getMyAttendance(token);
                setRecords(data);
            } catch (error) {
                console.error('Failed to fetch attendance:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
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
                    <Calendar className="h-8 w-8 text-primary-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Attendance</h1>
                    <p className="text-gray-400">Track your attendance across all subjects</p>
                </div>
            </div>

            <AttendanceTable records={records} />
        </div>
    );
}
