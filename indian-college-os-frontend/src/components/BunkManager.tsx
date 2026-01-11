import { useState } from 'react';
import { AttendanceRecord, attendanceApi } from '@/lib/api';
import { Plus, Calculator, CheckCircle, XCircle, AlertTriangle, Battery, BatteryCharging, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface BunkManagerProps {
    attendance: AttendanceRecord[];
    onUpdate: () => void;
}

export default function BunkManager({ attendance, onUpdate }: BunkManagerProps) {
    const { user } = useAuth();
    const [isMarking, setIsMarking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [status, setStatus] = useState<'PRESENT' | 'ABSENT'>('PRESENT');

    // Stats
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === 'PRESENT').filter(a => a.date).length; // Filter valid
    // Fix: Some records might be legacy without status, assume present if not absent? No, standard is PRESENT/ABSENT
    const presentCount = attendance.filter(a => a.status === 'PRESENT').length;

    let percentage = 0;
    if (totalClasses > 0) {
        percentage = Math.round((presentCount / totalClasses) * 100);
    }

    // Bunk Logic
    let bunkMessage = '';
    let bunkColor = '';

    if (totalClasses === 0) {
        bunkMessage = "No classes recorded yet.";
        bunkColor = "text-gray-400";
    } else if (percentage >= 75) {
        // Calculate safe bunks
        // p / (t + x) >= 0.75  =>  x <= p/0.75 - t
        const safeBunks = Math.floor((presentCount / 0.75) - totalClasses);
        if (safeBunks > 0) {
            bunkMessage = `You can safely bunk ${safeBunks} classes! 🎉`;
            bunkColor = "text-green-400";
        } else {
            bunkMessage = "You are on the edge! Don't miss next class. 😬";
            bunkColor = "text-yellow-400";
        }
    } else {
        // Calculate catchup
        // (p + x) / (t + x) >= 0.75 => x >= (0.75t - p) / 0.25 => x >= 3t - 4p
        const required = Math.ceil(3 * totalClasses - 4 * presentCount);
        if (required > 0) {
            bunkMessage = `Attend next ${required} classes to hit 75%. 🚨`;
        } else {
            bunkMessage = `Attend next 1 class to hit 75%. 🚨`; // math edge case
        }
        bunkColor = "text-red-400";
    }

    const handleMark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject) return;
        setLoading(true);

        try {
            await attendanceApi.create({
                studentId: 'SELF', // Backend handles this now
                subject: subject,
                date: new Date().toISOString().split('T')[0],
                status: status
            });
            setSubject('');
            setIsMarking(false);
            onUpdate();
        } catch (error) {
            alert('Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-all duration-500"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <BatteryCharging className={`h-5 w-5 ${percentage >= 75 ? 'text-green-400' : 'text-red-400'}`} />
                        Bunk-o-Meter
                    </h3>
                    <p className="text-gray-400 text-sm">Target: 75% Attendance</p>
                </div>
                <div className={`text-3xl font-bold ${percentage >= 75 ? 'text-green-400' : 'text-red-400'}`}>
                    {percentage}%
                </div>
            </div>

            <div className={`p-4 rounded-xl bg-white/5 border border-white/10 mb-6 ${bunkColor} font-medium flex items-center gap-3`}>
                {percentage < 75 ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                {bunkMessage}
            </div>

            {!isMarking ? (
                <button
                    onClick={() => setIsMarking(true)}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Quick Mark Attendance
                </button>
            ) : (
                <form onSubmit={handleMark} className="space-y-4 animate-slide-up">
                    <input
                        type="text"
                        placeholder="Subject (e.g., Math)"
                        className="input-field"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        autoFocus
                        required
                    />
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setStatus('PRESENT')}
                            className={`flex-1 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${status === 'PRESENT'
                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                : 'border-white/10 hover:bg-white/5 text-gray-400'
                                }`}
                        >
                            <CheckCircle className="h-4 w-4" /> Present
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('ABSENT')}
                            className={`flex-1 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${status === 'ABSENT'
                                ? 'bg-red-500/20 border-red-500 text-red-400'
                                : 'border-white/10 hover:bg-white/5 text-gray-400'
                                }`}
                        >
                            <XCircle className="h-4 w-4" /> Absent
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setIsMarking(false)}
                            className="flex-1 btn-secondary py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary py-2"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
