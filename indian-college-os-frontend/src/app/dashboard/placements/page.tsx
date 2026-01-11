'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { placementApi, Placement } from '@/lib/api';
import { Briefcase, Building2, Calendar, CheckCircle } from 'lucide-react';

export default function PlacementsPage() {
    const { user } = useAuth();
    const [placements, setPlacements] = useState<Placement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlacements = async () => {
            // Token check removed - using cookies
            try {
                const data = await placementApi.getAll();
                setPlacements(data);
            } catch (error) {
                console.error('Failed to load placements:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPlacements();
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
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
                <h1 className="page-title">Placement Opportunities</h1>
                <p className="page-subtitle">Explore job opportunities and placement drives.</p>
            </div>

            {/* Placements Grid */}
            {placements.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <Briefcase className="empty-state-icon" />
                        <p className="empty-state-title">No placements available</p>
                        <p className="empty-state-text">Check back later for new opportunities.</p>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {placements.map((placement) => (
                        <div key={placement.id} className="card">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-6 h-6 text-neutral-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-neutral-900">{placement.companyName}</h3>
                                    <p className="text-sm text-primary-500">{placement.role}</p>

                                    <div className="mt-3 space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                            <CheckCircle className="w-4 h-4" />
                                            Eligibility: {placement.eligibility}
                                        </div>
                                        {placement.deadline && (
                                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                <Calendar className="w-4 h-4" />
                                                Deadline: {formatDate(placement.deadline)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
