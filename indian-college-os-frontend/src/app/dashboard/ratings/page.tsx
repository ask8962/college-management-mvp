'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { professorReviewApi, ProfessorStats } from '@/lib/api';
import { Plus, X, Search, Star, AlertTriangle, Smile, Book, Award, Users } from 'lucide-react';

const DEPARTMENTS = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Humanities',
    'Management',
    'Other',
];

export default function RatingsPage() {
    const { token } = useAuth();
    const [stats, setStats] = useState<ProfessorStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        professorName: '',
        department: 'Computer Science',
        subject: '',
        chillFactor: 3,
        attendanceStrictness: 3,
        marksGenerosity: 3,
        teachingQuality: 3,
        review: '',
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await professorReviewApi.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await professorReviewApi.create(formData);
            setShowForm(false);
            setFormData({
                professorName: '',
                department: 'Computer Science',
                subject: '',
                chillFactor: 3,
                attendanceStrictness: 3,
                marksGenerosity: 3,
                teachingQuality: 3,
                review: '',
            });
            loadStats();
        } catch (error: any) {
            alert(error.message || 'Failed to submit review');
        }
    };

    const filteredStats = stats.filter(s =>
        s.professorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'text-green-400';
        if (rating >= 3) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getStrictnessLabel = (level: number) => {
        if (level >= 4) return '🚨 Very Strict';
        if (level >= 3) return '⚠️ Moderate';
        return '😎 Chill';
    };

    const RatingSlider = ({ label, icon: Icon, value, onChange, inverse = false }: any) => (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                </label>
                <span className={`text-lg font-bold ${getRatingColor(inverse ? 6 - value : value)}`}>
                    {value}/5
                </span>
            </div>
            <input
                type="range"
                min="1"
                max="5"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">🎓 Rate My Khadoos</h1>
                    <p className="text-gray-400">Anonymous professor reviews. Help juniors make smart choices!</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Rate a Professor
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search professors or departments..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input-field pl-12"
                />
            </div>

            {/* Professor Cards */}
            {filteredStats.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-gray-400 text-lg mb-4">
                        {stats.length === 0 ? 'No reviews yet. Be the first!' : 'No professors match your search.'}
                    </p>
                    {stats.length === 0 && (
                        <button onClick={() => setShowForm(true)} className="btn-primary">
                            Add First Review
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStats.map((prof, i) => (
                        <div key={i} className="glass rounded-2xl p-6 card-hover">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold">{prof.professorName}</h3>
                                    <p className="text-gray-400 text-sm">{prof.department}</p>
                                </div>
                                <div className={`text-3xl font-bold ${getRatingColor(prof.overallRating)}`}>
                                    {prof.overallRating}
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Smile className="h-4 w-4" /> Chill Factor
                                    </span>
                                    <span className={getRatingColor(prof.avgChillFactor)}>{prof.avgChillFactor}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" /> Attendance
                                    </span>
                                    <span className="text-orange-400">{getStrictnessLabel(prof.avgAttendanceStrictness)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Award className="h-4 w-4" /> Marks Generosity
                                    </span>
                                    <span className={getRatingColor(prof.avgMarksGenerosity)}>{prof.avgMarksGenerosity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Book className="h-4 w-4" /> Teaching
                                    </span>
                                    <span className={getRatingColor(prof.avgTeachingQuality)}>{prof.avgTeachingQuality}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {prof.reviewCount} reviews
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-up my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Rate a Professor</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/10">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Professor Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Dr. Sharma"
                                    value={formData.professorName}
                                    onChange={e => setFormData({ ...formData, professorName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                                    <select
                                        className="input-field"
                                        value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    >
                                        {DEPARTMENTS.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject (Optional)</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="e.g., Data Structures"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 p-4 bg-white/5 rounded-xl">
                                <RatingSlider
                                    label="Chill Factor"
                                    icon={Smile}
                                    value={formData.chillFactor}
                                    onChange={(v: number) => setFormData({ ...formData, chillFactor: v })}
                                />
                                <RatingSlider
                                    label="Attendance Strictness"
                                    icon={AlertTriangle}
                                    value={formData.attendanceStrictness}
                                    onChange={(v: number) => setFormData({ ...formData, attendanceStrictness: v })}
                                    inverse
                                />
                                <RatingSlider
                                    label="Marks Generosity"
                                    icon={Award}
                                    value={formData.marksGenerosity}
                                    onChange={(v: number) => setFormData({ ...formData, marksGenerosity: v })}
                                />
                                <RatingSlider
                                    label="Teaching Quality"
                                    icon={Book}
                                    value={formData.teachingQuality}
                                    onChange={(v: number) => setFormData({ ...formData, teachingQuality: v })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Review (Optional)</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    placeholder="Share your experience anonymously..."
                                    value={formData.review}
                                    onChange={e => setFormData({ ...formData, review: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
