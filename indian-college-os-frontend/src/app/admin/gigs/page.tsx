'use client';

import { useState, useEffect } from 'react';
import { gigApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Trash2, ExternalLink, BadgeDollarSign } from 'lucide-react';

export default function GigModerationPage() {
    const { user } = useAuth();
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGigs();
    }, []);

    const fetchGigs = async () => {
        try {
            const data = await gigApi.getAll(); // Uses the /gigs endpoint (open gigs)
            // Ideally we'd have a specific admin endpoint for ALL gigs including closed/flagged
            setGigs(data);
        } catch (error) {
            console.error('Failed to fetch gigs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this gig? This action cannot be undone.')) return;

        try {
            await gigApi.delete(id);
            setGigs(gigs.filter(g => g.id !== id));
            alert('Gig deleted successfully by Admin.');
        } catch (error) {
            console.error('Failed to delete gig', error);
            alert('Failed to delete gig.');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <BadgeDollarSign className="w-8 h-8 text-green-400" />
                Gig Moderation
            </h1>

            {loading ? (
                <div className="text-center py-10">Loading gigs...</div>
            ) : (
                <div className="glass rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-300">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Posted By</th>
                                <th className="p-4">Budget</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {gigs.map((gig) => (
                                <tr key={gig.id} className="hover:bg-white/5">
                                    <td className="p-4">
                                        <div className="font-medium">{gig.title}</div>
                                        <div className="text-xs text-gray-500">{gig.category}</div>
                                    </td>
                                    <td className="p-4">{gig.postedByName}</td>
                                    <td className="p-4 font-mono">₹{gig.budget}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${gig.status === 'OPEN' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {gig.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(gig.id)}
                                            className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-500/10 transition-colors"
                                            title="Delete as Admin"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {gigs.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No active gigs found to moderate.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
