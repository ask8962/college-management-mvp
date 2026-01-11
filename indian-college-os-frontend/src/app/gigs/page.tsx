'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { gigApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Plus, Search, DollarSign, Calendar, Tag } from 'lucide-react';

export default function MarketplacePage() {
    const { user } = useAuth();
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchGigs();
    }, [filter]);

    const fetchGigs = async () => {
        // if (!user) return; // Optional: if we want to wait for user load
        setLoading(true);
        try {
            let data;
            if (filter === 'MY') {
                data = await gigApi.getMyGigs();
            } else if (filter !== 'ALL') {
                data = await gigApi.getByCategory(filter);
            } else {
                data = await gigApi.getAll();
            }
            setGigs(data);
        } catch (error) {
            console.error('Failed to fetch gigs', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['ALL', 'MY', 'Notes', 'Assignment', 'Project', 'Tutoring', 'Other'];

    const filteredGigs = gigs.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        Assignment Hustle
                    </h1>
                    <p className="text-gray-400">The Student Marketplace. Buy, sell, survive.</p>
                </div>
                <Link
                    href="/gigs/create"
                    className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Post a Gig
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full text-gray-400 focus-within:text-primary-400">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for notes, assignments..."
                        className="input-field pl-10 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${filter === cat
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                                }`}
                        >
                            {cat === 'MY' ? 'My Gigs' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass rounded-xl p-6 h-48 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredGigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGigs.map((gig) => (
                        <div key={gig.id} className="glass rounded-xl p-6 hover:translate-y-[-4px] transition-transform duration-300 border border-white/5 flex flex-col group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs font-bold rounded uppercase tracking-wider">
                                    {gig.category}
                                </span>
                                <span className="text-xl font-bold text-green-400 font-mono">
                                    ₹{gig.budget}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                                {gig.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                {gig.description}
                            </p>

                            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Tag className="w-4 h-4" />
                                    <span>{gig.postedByName}</span>
                                </div>
                                {gig.deadline && (
                                    <div className="flex items-center gap-1 text-orange-400/80">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(gig.deadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-dashed border-white/10 text-xs text-center text-gray-500 bg-white/5 py-2 rounded">
                                Contact: <span className="text-gray-300 select-all">{gig.contactInfo}</span>
                            </div>

                            {/* Delete button for owner */}
                            {(user?.id === gig.postedBy || user?.role === 'ADMIN') && (
                                <button className="mt-2 text-red-400 text-xs hover:underline text-right w-full">
                                    Manage
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glass rounded-xl">
                    <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Gigs Found</h3>
                    <p className="text-gray-400 mb-6">Be the first to post a gig in this category!</p>
                    <Link href="/gigs/create" className="btn btn-primary">
                        Post First Gig
                    </Link>
                </div>
            )}
        </div>
    );
}
