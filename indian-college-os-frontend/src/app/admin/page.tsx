'use client';

import { useAuth } from '@/lib/auth';
import { Bell, BookOpen, Briefcase, Calendar, Plus, Users, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const { user } = useAuth();

    const adminActions = [
        { href: '/admin/students', icon: Users, label: 'View Students', desc: 'View all registered students and their IDs' },
        { href: '/admin/notices', icon: Bell, label: 'Upload Notice', desc: 'Add new college notices with AI summaries' },
        { href: '/admin/exams', icon: BookOpen, label: 'Create Exam', desc: 'Schedule new exams and deadlines' },
        { href: '/admin/placements', icon: Briefcase, label: 'Add Placement', desc: 'Post new placement opportunities' },
        { href: '/admin/attendance', icon: Calendar, label: 'Manage Attendance', desc: 'Add attendance records for students' },
        { href: '/dashboard/chat', icon: MessageSquare, label: '💬 Chat Rooms', desc: 'Create chat rooms and toggle broadcast mode' },
    ];


    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                <p className="text-gray-400">Welcome, {user?.name}. Manage your college data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminActions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="glass rounded-2xl p-6 card-hover group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors">
                                <action.icon className="h-8 w-8 text-primary-300" />
                            </div>
                            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                <Plus className="h-4 w-4" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{action.label}</h3>
                        <p className="text-gray-400">{action.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
