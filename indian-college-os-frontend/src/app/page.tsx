import Link from 'next/link';
import { ArrowRight, CheckCircle, Users, BookOpen, Bell, Calendar } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-neutral-200">
                <div className="container-narrow">
                    <div className="h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CO</span>
                            </div>
                            <span className="font-semibold text-neutral-900">College OS</span>
                        </Link>

                        <nav className="flex items-center gap-6">
                            <Link href="#features" className="text-sm text-neutral-600 hover:text-neutral-900">
                                Features
                            </Link>
                            <Link href="#about" className="text-sm text-neutral-600 hover:text-neutral-900">
                                About
                            </Link>
                            <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900">
                                Sign In
                            </Link>
                            <Link href="/register" className="btn btn-primary btn-sm">
                                Get Started
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 bg-neutral-50">
                <div className="container-narrow">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-3xl font-semibold text-neutral-900 mb-4">
                            Student Management Made Simple
                        </h1>
                        <p className="text-lg text-neutral-600 mb-8">
                            A reliable platform for managing attendance, exams, notices, and placements.
                            Built for educational institutions that value clarity and efficiency.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/register" className="btn btn-primary btn-lg">
                                Create Account
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/login" className="btn btn-secondary btn-lg">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-12 border-b border-neutral-200">
                <div className="container-narrow">
                    <div className="flex items-center justify-center gap-12">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-neutral-900">500+</div>
                            <div className="text-sm text-neutral-600">Active Students</div>
                        </div>
                        <div className="w-px h-10 bg-neutral-200"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-neutral-900">98%</div>
                            <div className="text-sm text-neutral-600">Uptime</div>
                        </div>
                        <div className="w-px h-10 bg-neutral-200"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-neutral-900">24/7</div>
                            <div className="text-sm text-neutral-600">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-16">
                <div className="container-narrow">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                            Core Features
                        </h2>
                        <p className="text-neutral-600">
                            Everything you need to manage your academic journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card">
                            <Calendar className="w-8 h-8 text-primary-500 mb-4" />
                            <h3 className="font-semibold text-neutral-900 mb-2">Attendance Tracking</h3>
                            <p className="text-sm text-neutral-600">
                                View your attendance records and monitor your presence in real-time.
                            </p>
                        </div>

                        <div className="card">
                            <Bell className="w-8 h-8 text-primary-500 mb-4" />
                            <h3 className="font-semibold text-neutral-900 mb-2">Notice Board</h3>
                            <p className="text-sm text-neutral-600">
                                Stay updated with important announcements and documents.
                            </p>
                        </div>

                        <div className="card">
                            <BookOpen className="w-8 h-8 text-primary-500 mb-4" />
                            <h3 className="font-semibold text-neutral-900 mb-2">Exam Schedule</h3>
                            <p className="text-sm text-neutral-600">
                                Track upcoming exams with detailed schedules and countdowns.
                            </p>
                        </div>

                        <div className="card">
                            <Users className="w-8 h-8 text-primary-500 mb-4" />
                            <h3 className="font-semibold text-neutral-900 mb-2">Placements</h3>
                            <p className="text-sm text-neutral-600">
                                Explore job opportunities and track placement drives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 bg-neutral-50">
                <div className="container-narrow">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-semibold text-neutral-900 mb-4 text-center">
                            About College OS
                        </h2>
                        <p className="text-neutral-600 text-center mb-8">
                            College OS is designed to simplify the academic management experience
                            for students and administrators. Our platform focuses on reliability,
                            ease of use, and data security.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                                <p className="text-neutral-700">Secure authentication with optional two-factor protection</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                                <p className="text-neutral-700">Real-time attendance and exam tracking</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                                <p className="text-neutral-700">Document management with AI-powered summaries</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-success-600 mt-0.5 flex-shrink-0" />
                                <p className="text-neutral-700">Mobile-friendly design for access anywhere</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container-narrow">
                    <div className="card text-center">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                            Ready to get started?
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            Create your account today and start managing your academic life.
                        </p>
                        <Link href="/register" className="btn btn-primary">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-neutral-200">
                <div className="container-narrow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">CO</span>
                            </div>
                            <span className="text-sm text-neutral-600">© 2024 College OS. All rights reserved.</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="#" className="text-sm text-neutral-600 hover:text-neutral-900">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-sm text-neutral-600 hover:text-neutral-900">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-sm text-neutral-600 hover:text-neutral-900">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
