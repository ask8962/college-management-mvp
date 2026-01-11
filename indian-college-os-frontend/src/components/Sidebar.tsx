'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
    LayoutDashboard,
    CalendarCheck,
    BookOpen,
    Bell,
    LogOut,
    Briefcase,
    Shield,
    MessageSquare,
    DollarSign,
    CheckSquare
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const links = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
        { href: '/gigs', label: 'Marketplace', icon: DollarSign },
        { href: '/notices', label: 'Notices', icon: Bell },
        { href: '/exams', label: 'Exams', icon: BookOpen },
        { href: '/tasks', label: 'My Tasks', icon: CheckSquare },
        { href: '/placements', label: 'Placements', icon: Briefcase },
        { href: '/dashboard/chat', label: 'Chat Rooms', icon: MessageSquare },
        { href: '/dashboard/settings', label: 'Settings', icon: Shield },
    ];

    if (user?.role === 'ADMIN') {
        links.push({ href: '/admin', label: 'Admin Panel', icon: Shield });
    }

    return (
        <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-neutral-200">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CO</span>
                    </div>
                    <span className="font-bold text-lg text-neutral-900">College OS</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                }`}
                        >
                            <link.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-neutral-500'}`} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-200">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
