'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
    LayoutDashboard,
    Calendar,
    Bell,
    BookOpen,
    Briefcase,
    LogOut,
    Plus,
    Target,
    Shield,
    MessageSquare,
    DollarSign
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const studentLinks = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/attendance', icon: Calendar, label: 'Attendance' },
        { href: '/gigs', icon: DollarSign, label: 'Marketplace' },
        { href: '/dashboard/notices', icon: Bell, label: 'Notices' },
        { href: '/dashboard/exams', icon: BookOpen, label: 'Exams' },
        { href: '/dashboard/placements', icon: Briefcase, label: 'Placements' },
        { href: '/dashboard/tasks', icon: Target, label: 'Tasks & Goals' },
        { href: '/dashboard/chat', icon: MessageSquare, label: 'Discussion' },
        { href: '/dashboard/security', icon: Shield, label: 'Security' },
    ];

    const adminLinks = [
        { href: '/admin', icon: LayoutDashboard, label: 'Admin Panel' },
        { href: '/admin/notices', icon: Plus, label: 'Upload Notice' },
        { href: '/admin/exams', icon: Plus, label: 'Create Exam' },
        { href: '/admin/placements', icon: Plus, label: 'Add Placement' },
        { href: '/admin/gigs', icon: DollarSign, label: 'Gig Moderation' },
        { href: '/admin/attendance', icon: Calendar, label: 'Manage Attendance' },
        { href: '/dashboard/chat', icon: MessageSquare, label: 'Discussions' },
    ];

    const links = isAdmin ? adminLinks : studentLinks;

    return (
        <aside className="fixed left-0 top-0 h-full w-56 bg-white border-r border-neutral-200 flex flex-col z-40">
            {/* Logo */}
            <div className="h-16 flex items-center px-5 border-b border-neutral-200">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CO</span>
                    </div>
                    <span className="font-semibold text-neutral-900">College OS</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
                <div className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="nav-link-icon" />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-neutral-200">
                <div className="px-3 py-2 mb-2">
                    <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="nav-link w-full text-left hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="nav-link-icon" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
