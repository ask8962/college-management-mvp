'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { gigApi, Gig } from '@/lib/api';
import { Plus, X, Clock, DollarSign, MessageCircle, Filter, Trash2, CheckCircle, User } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
    { value: 'ASSIGNMENT', label: '📝 Assignment', color: 'bg-blue-500/20 text-blue-400' },
    { value: 'LAB_RECORD', label: '🧪 Lab Record', color: 'bg-green-500/20 text-green-400' },
    { value: 'PROJECT', label: '💻 Project', color: 'bg-purple-500/20 text-purple-400' },
    { value: 'NOTES', label: '📚 Notes', color: 'bg-yellow-500/20 text-yellow-400' },
    { value: 'PRESENTATION', label: '📊 Presentation', color: 'bg-pink-500/20 text-pink-400' },
    { value: 'OTHER', label: '🔧 Other', color: 'bg-gray-500/20 text-gray-400' },
];

export default function HustlePage() {
    const { user } = useAuth();
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'ASSIGNMENT',
        budget: 100,
        contactInfo: '',
        deadline: '',
    });
    const [filter, setFilter] = useState<'ALL' | 'MY'>('ALL'); // Added filter state

    useEffect(() => {
        loadGigs();
    }, [activeFilter, filter]); // Removed token from dependencies

    const loadGigs = async () => {
        try {
            const data = filter === 'MY'
                ? await gigApi.getMyGigs()
                : activeFilter && activeFilter !== 'ALL'
                    ? await gigApi.getByCategory(activeFilter)
                    : await gigApi.getAll();
            setGigs(data);
        } catch (error) {
            console.error('Failed to load gigs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await gigApi.create(formData);
            setShowForm(false);
            setFormData({ title: '', description: '', category: 'ASSIGNMENT', budget: 100, contactInfo: '', deadline: '' });
            loadGigs();
        } catch (error) {
            alert('Failed to post gig');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this listing?')) return;
        try {
            await gigApi.delete(id);
            loadGigs();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleMarkComplete = async (id: string) => {
        try {
            await gigApi.updateStatus(id, 'COMPLETED');
            loadGigs();
        } catch (error) {
            alert('Failed to update');
        }
    };

    const getCategoryInfo = (cat: string) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[5];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 0) return 'Overdue';
        if (diffHours < 24) return `${diffHours}h left`;
        return `${Math.floor(diffHours / 24)}d left`;
    };

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
                    <h1 className="text-3xl font-bold">🤝 Assignment Hustle</h1>
                    <p className="text-gray-400">Peer-to-peer task marketplace. Need help? Post it. Got skills? Earn.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Post a Request
                </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveFilter(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!activeFilter ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    All
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => setActiveFilter(cat.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === cat.value ? cat.color : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Gig Cards */}
            {gigs.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-gray-400 text-lg mb-4">No requests yet. Be the first to post!</p>
                    <button onClick={() => setShowForm(true)} className="btn-primary">
                        Post a Request
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map(gig => {
                        const catInfo = getCategoryInfo(gig.category);
                        return (
                            <div key={gig.id} className="glass rounded-2xl p-6 card-hover relative group">
                                {gig.isOwner && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleMarkComplete(gig.id)}
                                            className="p-2 glass rounded-lg hover:bg-green-500/20 text-green-400"
                                            title="Mark Complete"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(gig.id)}
                                            className="p-2 glass rounded-lg hover:bg-red-500/20 text-red-400"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${catInfo.color}`}>
                                        {catInfo.label}
                                    </span>
                                    <span className="text-2xl font-bold text-green-400">₹{gig.budget}</span>
                                </div>

                                <h3 className="text-lg font-semibold mb-2">{gig.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{gig.description}</p>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {gig.postedByName}
                                    </span>
                                    {gig.deadline && (
                                        <span className="flex items-center gap-1 text-orange-400">
                                            <Clock className="h-4 w-4" />
                                            {formatDate(gig.deadline)}
                                        </span>
                                    )}
                                </div>

                                <a
                                    href={gig.contactInfo.includes('@') ? `mailto:${gig.contactInfo}` : `https://wa.me/${gig.contactInfo.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full py-2 flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Contact
                                </a>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Post Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Post a Request</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/10">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Need 50 pages of Physics lab record"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    className="input-field min-h-[80px]"
                                    placeholder="Describe exactly what you need..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        className="input-field"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget (₹)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        min="10"
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Contact (WhatsApp or Email)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., 9876543210 or your@email.com"
                                    value={formData.contactInfo}
                                    onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Deadline (Optional)</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.deadline}
                                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    Post Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
