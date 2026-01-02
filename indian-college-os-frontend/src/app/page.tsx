'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { GraduationCap, BookOpen, Bell, Briefcase, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push('/dashboard');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    const features = [
        { icon: Calendar, title: 'Attendance Tracking', desc: 'Monitor your attendance across all subjects' },
        { icon: BookOpen, title: 'Exams & Deadlines', desc: 'Never miss an exam or submission deadline' },
        { icon: Bell, title: 'Smart Notices', desc: 'AI-powered summaries of college notices' },
        { icon: Briefcase, title: 'Placement Drives', desc: 'Stay updated on placement opportunities' },
    ];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-accent-900/30"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center animate-fade-in">
                        <div className="flex justify-center mb-8">
                            <div className="p-4 glass rounded-2xl">
                                <GraduationCap className="h-16 w-16 text-primary-300" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="gradient-text">Indian College OS</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                            Your all-in-one student management platform. Track attendance, exams, notices, and placements effortlessly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login" className="btn-primary flex items-center justify-center gap-2 text-lg">
                                Login <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link href="/register" className="btn-secondary flex items-center justify-center gap-2 text-lg">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                    Everything You Need in One Place
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="glass rounded-2xl p-6 card-hover animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="p-3 bg-primary-500/20 rounded-xl w-fit mb-4">
                                <feature.icon className="h-8 w-8 text-primary-300" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
                    <p>© 2024 Indian College OS. Built for students, by students.</p>
                </div>
            </footer>
        </main>
    );
}
