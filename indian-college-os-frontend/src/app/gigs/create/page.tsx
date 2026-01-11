'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { gigApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CreateGigPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Notes',
        budget: '',
        contactInfo: user?.email || '',
        deadline: ''
    });

    const categories = ['Notes', 'Assignment', 'Project', 'Tutoring', 'Other'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await gigApi.create({
                ...formData,
                budget: Number(formData.budget)
            });
            router.push('/gigs');
        } catch (error) {
            console.error('Failed to create gig', error);
            alert(error instanceof Error ? error.message : 'Failed to post gig. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in">
            <Link href="/gigs" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Marketplace
            </Link>

            <div className="glass p-8 rounded-2xl border border-primary-500/20 shadow-xl shadow-primary-500/5">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary-400" />
                        Post a New Gig
                    </h1>
                    <p className="text-gray-400">Describe what you need help with, or what you're selling.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="input-label">Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Need help with Physics Record / Selling 1st Sem Notes"
                            className="input-field"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Category</label>
                            <select
                                className="input-field"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Budget (₹)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="e.g. 50"
                                className="input-field font-mono"
                                value={formData.budget}
                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Description</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Provide Details..."
                            className="input-field"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="input-label">Contact Info</label>
                            <input
                                type="text"
                                required
                                placeholder="Phone / Insta / Email"
                                className="input-field"
                                value={formData.contactInfo}
                                onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">Visible to everyone</p>
                        </div>
                        <div>
                            <label className="input-label">Deadline (Optional)</label>
                            <input
                                type="date"
                                className="input-field"
                                value={formData.deadline}
                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-3 text-lg font-semibold"
                    >
                        {loading ? 'Posting...' : 'Post Gig 🚀'}
                    </button>
                </form>
            </div>
        </div>
    );
}
