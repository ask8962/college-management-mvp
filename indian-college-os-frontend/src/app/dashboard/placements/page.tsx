'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { placementApi, Placement } from '@/lib/api';
import PlacementCard from '@/components/PlacementCard';
import { Briefcase } from 'lucide-react';

export default function PlacementsPage() {
    const { token } = useAuth();
    const [placements, setPlacements] = useState<Placement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlacements = async () => {
            if (!token) return;

            try {
                const data = await placementApi.getAll(token);
                setPlacements(data);
            } catch (error) {
                console.error('Failed to fetch placements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlacements();
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
                <div className="p-3 bg-accent-500/20 rounded-xl">
                    <Briefcase className="h-8 w-8 text-accent-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Placement Drives</h1>
                    <p className="text-gray-400">Explore opportunities from top companies</p>
                </div>
            </div>

            {placements.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <Briefcase className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No placement drives available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {placements.map(placement => (
                        <PlacementCard key={placement.id} placement={placement} />
                    ))}
                </div>
            )}
        </div>
    );
}
