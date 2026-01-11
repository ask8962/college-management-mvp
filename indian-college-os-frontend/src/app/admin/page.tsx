'use client';

import { useAuth } from '@/lib/auth';
import {
    Bell,
    BookOpen,
    Briefcase,
    Calendar,
    Users,
    MessageSquare,
    DollarSign,
    ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const { user } = useAuth();

    const sections = [
        {
            title: 'Academic Control',
            color: 'text-blue-400',
            items: [
                { href: '/admin/exams', icon: BookOpen, label: 'Exams & Deadlines', desc: 'Schedule exams' },
                { href: '/admin/attendance', icon: Calendar, label: 'Attendance', desc: 'Manage records' },
                { href: '/admin/notices', icon: Bell, label: 'Notice Board', desc: 'Upload notices' },
            ]
        },
        {
            title: 'Student Life',
            color: 'text-purple-400',
            items: [
                { href: '/admin/placements', icon: Briefcase, label: 'Placements', desc: 'Job postings' },
                { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat Rooms', desc: 'Manage rooms' },
                { href: '/admin/gigs', icon: DollarSign, label: 'Gig Moderation', desc: 'Moderate marketplace' },
            ]
        },
        {
            title: 'User Management',
            color: 'text-green-400',
            items: [
                { href: '/admin/students', icon: Users, label: 'Students', desc: 'View database' },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Admin Command Center</h1>
                    <p className="text-gray-400">Welcome, {user?.name}. You have full control.</p>
                </div>
                <div className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 border border-red-500/20">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="text-sm font-semibold">Admin Mode Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {sections.map((section, sIndex) => (
                    <div key={sIndex}>
                        <h2 className={`text-xl font-semibold mb-4 ${section.color} flex items-center gap-2`}>
                            {section.title}
                            <div className="h-px bg-current opacity-20 flex-1 ml-4"></div>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="glass rounded-xl p-6 hover:bg-white/5 transition-all hover:scale-[1.02] border border-white/5 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg bg-neutral-800 text-neutral-200 group-hover:text-white transition-colors`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{item.label}</h3>
                                    <p className="text-sm text-gray-400">{item.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
