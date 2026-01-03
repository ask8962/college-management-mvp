'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
    GraduationCap,
    LayoutDashboard,
    Calendar,
    Bell,
    BookOpen,
    Briefcase,
    LogOut,
    Plus,
    Settings,
    User,
    Zap,
    Star
} from 'lucide-react';

interface SidebarProps {
    onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const studentLinks = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/attendance', icon: Calendar, label: 'Attendance' },
        { href: '/dashboard/notices', icon: Bell, label: 'Notices' },
        { href: '/dashboard/exams', icon: BookOpen, label: 'Exams' },
        { href: '/dashboard/placements', icon: Briefcase, label: 'Placements' },
        { href: '/dashboard/hustle', icon: Zap, label: '🔥 Hustle' },
        { href: '/dashboard/ratings', icon: Star, label: '⭐ Rate Profs' },
    ];

    const adminLinks = [
        { href: '/admin', icon: LayoutDashboard, label: 'Admin Panel' },
        { href: '/admin/notices', icon: Plus, label: 'Upload Notice' },
        { href: '/admin/exams', icon: Plus, label: 'Create Exam' },
        { href: '/admin/placements', icon: Plus, label: 'Add Placement' },
        { href: '/admin/attendance', icon: Calendar, label: 'Manage Attendance' },
    ];

    const links = isAdmin ? adminLinks : studentLinks;

    return (
        <aside className="fixed left-0 top-0 h-full w-64 glass-dark flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/20 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-primary-300" />
                    </div>
                    <span className="font-bold text-lg">College OS</span>
                </Link>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-primary-500/20 text-primary-300'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <link.icon className="h-5 w-5" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
