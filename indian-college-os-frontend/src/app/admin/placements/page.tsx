'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { placementApi } from '@/lib/api';
import { Briefcase, CheckCircle } from 'lucide-react';

export default function AdminPlacementsPage() {
    const { token } = useAuth();
    const [companyName, setCompanyName] = useState('');
    const [role, setRole] = useState('');
    const [eligibility, setEligibility] = useState('');
    const [deadline, setDeadline] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await placementApi.create(token, {
                companyName,
                role,
                eligibility,
                deadline,
            });
            setSuccess(true);
            setCompanyName('');
            setRole('');
            setEligibility('');
            setDeadline('');
        } catch (err: any) {
            setError(err.message || 'Failed to add placement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-500/20 rounded-xl">
                    <Briefcase className="h-8 w-8 text-accent-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Add Placement Drive</h1>
                    <p className="text-gray-400">Post new placement opportunities for students</p>
                </div>
            </div>

            <div className="glass rounded-2xl p-8">
                {success && (
                    <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl mb-6">
                        <CheckCircle className="h-5 w-5" />
                        Placement drive added successfully!
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                            placeholder="e.g., Google, Microsoft, TCS"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                            placeholder="e.g., Software Engineer, Data Analyst"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Eligibility Criteria</label>
                        <input
                            type="text"
                            value={eligibility}
                            onChange={(e) => setEligibility(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                            placeholder="e.g., CGPA > 7.0, CSE & IT branches only"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Application Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="spinner"></div> : 'Add Placement Drive'}
                    </button>
                </form>
            </div>
        </div>
    );
}
