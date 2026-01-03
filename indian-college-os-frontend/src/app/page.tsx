'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { GraduationCap, BookOpen, Bell, Briefcase, Calendar, ArrowRight, Sparkles, Zap, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-mesh">
                <div className="spinner"></div>
            </div>
        );
    }

    const features = [
        {
            icon: Calendar,
            title: 'Attendance Tracking',
            desc: 'Real-time attendance monitoring across all your subjects',
            iconClass: 'feature-icon-purple text-purple-400'
        },
        {
            icon: BookOpen,
            title: 'Exams & Deadlines',
            desc: 'Never miss an exam or submission with smart reminders',
            iconClass: 'feature-icon-cyan text-cyan-400'
        },
        {
            icon: Bell,
            title: 'AI-Powered Notices',
            desc: 'Get instant summaries of lengthy college notices',
            iconClass: 'feature-icon-orange text-orange-400'
        },
        {
            icon: Briefcase,
            title: 'Placement Drives',
            desc: 'Stay updated on the latest placement opportunities',
            iconClass: 'feature-icon-pink text-pink-400'
        },
    ];

    const stats = [
        { number: '10K+', label: 'Students' },
        { number: '50+', label: 'Colleges' },
        { number: '99%', label: 'Uptime' },
        { number: '4.9★', label: 'Rating' },
    ];

    return (
        <main className="min-h-screen bg-mesh relative overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="gradient-orb gradient-orb-1"></div>
            <div className="gradient-orb gradient-orb-2"></div>
            <div className="gradient-orb gradient-orb-3"></div>

            {/* Noise overlay for texture */}
            <div className="noise-overlay"></div>

            {/* Hero Section */}
            <div className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
                    {/* Nav */}
                    <nav className="flex justify-between items-center mb-20 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="p-2 glass rounded-xl">
                                <GraduationCap className="h-8 w-8 text-purple-400 icon-glow" />
                            </div>
                            <span className="font-display font-bold text-xl">CollegeOS</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-gray-400 hover:text-white transition-colors px-4 py-2">
                                Login
                            </Link>
                            <Link href="/register" className="btn-primary text-sm">
                                Get Started
                            </Link>
                        </div>
                    </nav>

                    {/* Hero Content */}
                    <div className="text-center animate-fade-in">
                        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
                            <Sparkles className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">AI-Powered Student Platform</span>
                            <span className="badge-new">NEW</span>
                        </div>

                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                            Your College Life,
                            <br />
                            <span className="gradient-text">Simplified</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            The ultimate student management platform. Track attendance, ace exams,
                            catch notices with AI summaries, and land your dream placement.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Link href="/register" className="btn-primary flex items-center justify-center gap-2 text-lg group">
                                Start Free
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/login" className="btn-secondary flex items-center justify-center gap-2 text-lg">
                                <Zap className="h-5 w-5 text-purple-400" />
                                Login to Dashboard
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-400" />
                                <span>100% Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple-400" />
                                <span>10,000+ Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-yellow-400" />
                                <span>AI-Powered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="glass rounded-3xl p-8 md:p-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="stat-number">{stat.number}</div>
                                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        One platform to manage your entire college journey
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="glass-card rounded-2xl p-8 animate-slide-up border-gradient"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`p-4 rounded-2xl w-fit mb-6 ${feature.iconClass.split(' ')[0]}`}>
                                <feature.icon className={`h-8 w-8 ${feature.iconClass.split(' ')[1]}`} />
                            </div>
                            <h3 className="font-display text-2xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10"></div>
                    <div className="relative">
                        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                            Ready to Level Up? 🚀
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                            Join thousands of students who are already managing their college life smarter.
                        </p>
                        <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-lg">
                            Create Free Account <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-6 w-6 text-purple-400" />
                        <span className="font-display font-semibold">CollegeOS</span>
                    </div>
                    <p className="text-gray-500 text-sm">© 2024 CollegeOS. Built with 💜 for students</p>
                </div>
            </footer>
        </main>
    );
}

