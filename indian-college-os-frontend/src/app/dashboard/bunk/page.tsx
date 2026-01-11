'use client';

import { useEffect, useState } from 'react';
import { Subject, subjectApi } from '@/lib/api';
import BunkOMeterCard from '@/components/BunkOMeterCard';
import { Plus, Calculator } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function BunkOMeterPage() {
    const { token } = useAuth();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newSubject, setNewSubject] = useState({ name: '', target: 75 });

    const loadSubjects = async () => {
        if (!token) return;
        try {
            const data = await subjectApi.getAll();
            setSubjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubjects();
    }, [token]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await subjectApi.create(newSubject.name, newSubject.target);
            setNewSubject({ name: '', target: 75 });
            setShowForm(false);
            loadSubjects();
        } catch (error) {
            alert('Failed to add subject');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Calculator className="w-8 h-8 text-primary-400" />
                        Bunk-o-Meter
                    </h1>
                    <p className="text-gray-400">Strategically plan your bunks. Stay safe, stay chill.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Subject
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="spinner"></div></div>
            ) : subjects.length === 0 ? (
                <div className="glass p-12 text-center rounded-2xl">
                    <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold mb-2">No Subjects Added</h3>
                    <p className="text-gray-400 mb-6">Add your subjects to start tracking attendance.</p>
                    <button onClick={() => setShowForm(true)} className="btn-primary">
                        Add First Subject
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map(sub => (
                        <BunkOMeterCard key={sub.id} subject={sub} onUpdate={loadSubjects} />
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass p-6 rounded-2xl w-full max-w-sm animate-slide-up">
                        <h2 className="text-xl font-bold mb-4">Add Subject</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="input-label">Subject Name</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. Mathematics"
                                    required
                                    value={newSubject.name}
                                    onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="input-label">Target Attendance (%)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={newSubject.target}
                                    onChange={e => setNewSubject({ ...newSubject, target: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
