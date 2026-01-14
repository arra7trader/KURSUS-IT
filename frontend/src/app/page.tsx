'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    BarChart3,
    Brain,
    Sparkles,
    ChevronRight,
    Play,
    Award,
    Users,
    Code2,
    TrendingUp,
    Cpu
} from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();
    const [hoveredSide, setHoveredSide] = useState<'analyst' | 'scientist' | null>(null);

    const selectPath = (path: 'ANALYST' | 'SCIENTIST') => {
        // Simpan path yang dipilih dan redirect ke onboarding/dashboard
        localStorage.setItem('selectedPath', path);
        router.push(`/onboarding?path=${path.toLowerCase()}`);
    };

    return (
        <div className="min-h-screen bg-gray-950 overflow-hidden">
            {/* Hero Section */}
            <header className="relative z-10">
                <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-analyst-500 to-scientist-500 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display text-2xl font-bold text-white">
                            Data<span className="text-gradient-analyst">Academy</span>
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                            Masuk
                        </button>
                        <button className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all">
                            Mulai Belajar
                        </button>
                    </motion.div>
                </nav>

                {/* Hero Content */}
                <div className="container mx-auto px-6 py-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">🚀 Akademi Berbasis AI dengan Standar Internasional</span>
                        </div>

                        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Kuasai Skill Data bareng
                            <br />
                            <span className="bg-gradient-to-r from-analyst-400 via-scientist-400 to-pink-400 bg-clip-text text-transparent">
                                Mentor AI Pribadi Kamu
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                            Pilih jalur karirmu. Belajar dari AI tutor yang adaptif dengan gaya belajar kamu.
                            Latihan dengan coding challenge nyata. Dapet feedback instan yang bermanfaat.
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-12 mb-16">
                            {[
                                { icon: Users, label: 'Murid Aktif', value: '10.000+' },
                                { icon: Code2, label: 'Coding Challenge', value: '500+' },
                                { icon: Award, label: 'Tingkat Kelulusan', value: '94%' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="text-center"
                                >
                                    <stat.icon className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Split Screen Path Selection */}
            <section className="container mx-auto px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        Pilih Jalur Karirmu
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Dua perjalanan berbeda. Dua mentor AI. Satu tujuan: Kesuksesan kamu.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {/* Data Analyst Card - Rendy */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02 }}
                        onHoverStart={() => setHoveredSide('analyst')}
                        onHoverEnd={() => setHoveredSide(null)}
                        className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${hoveredSide === 'scientist' ? 'opacity-60' : 'opacity-100'
                            }`}
                    >
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-analyst-900/80 via-analyst-800/50 to-gray-900 z-0" />
                        <div className="absolute inset-0 bg-mesh-analyst z-0" />
                        <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0" />

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-10 w-20 h-20 rounded-2xl bg-analyst-500/20 backdrop-blur-sm border border-analyst-400/20 flex items-center justify-center z-10"
                        >
                            <BarChart3 className="w-10 h-10 text-analyst-400" />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-20 right-20 w-16 h-16 rounded-xl bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/20 flex items-center justify-center z-10"
                        >
                            <TrendingUp className="w-8 h-8 text-cyan-400" />
                        </motion.div>

                        {/* Content */}
                        <div className="relative z-20 p-10 min-h-[500px] flex flex-col">
                            {/* Mentor Badge */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-analyst-500 to-analyst-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-analyst-500/30">
                                    R
                                </div>
                                <div>
                                    <div className="text-white font-semibold">Mentor: Rendy</div>
                                    <div className="text-analyst-400 text-sm">Expert Data Analyst</div>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="mb-6">
                                <div className="text-analyst-400 text-sm font-semibold uppercase tracking-wider mb-2">
                                    Jalur Bisnis
                                </div>
                                <h3 className="font-display text-4xl font-bold text-white mb-3">
                                    Data Analyst
                                </h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Ubah data mentah jadi insight bisnis yang actionable.
                                    Kuasai SQL, visualisasi, dan storytelling dengan data.
                                </p>
                            </div>

                            {/* Skills */}
                            <div className="mb-8 flex-grow">
                                <div className="text-sm text-gray-400 mb-3">Yang Bakal Kamu Kuasai:</div>
                                <div className="flex flex-wrap gap-2">
                                    {['SQL', 'Excel', 'Tableau', 'Power BI', 'Python Pandas', 'Statistik'].map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 rounded-full bg-analyst-500/20 border border-analyst-400/30 text-analyst-300 text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Philosophy */}
                            <div className="mb-8 p-4 rounded-xl bg-black/20 border border-analyst-500/20">
                                <div className="text-analyst-400 text-sm mb-1">Filosofi Rendy:</div>
                                <p className="text-white italic">
                                    "Data cuma berguna kalau bisa bikin duit atau hemat waktu."
                                </p>
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => selectPath('ANALYST')}
                                className="btn-analyst flex items-center justify-center gap-3 w-full"
                            >
                                <Play className="w-5 h-5" />
                                Jadi Data Analyst
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Data Scientist Card - Abdul */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                        onHoverStart={() => setHoveredSide('scientist')}
                        onHoverEnd={() => setHoveredSide(null)}
                        className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${hoveredSide === 'analyst' ? 'opacity-60' : 'opacity-100'
                            }`}
                    >
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-scientist-900/80 via-scientist-800/50 to-gray-900 z-0" />
                        <div className="absolute inset-0 bg-mesh-scientist z-0" />
                        <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0" />

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-10 w-20 h-20 rounded-2xl bg-scientist-500/20 backdrop-blur-sm border border-scientist-400/20 flex items-center justify-center z-10"
                        >
                            <Brain className="w-10 h-10 text-scientist-400" />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-20 right-20 w-16 h-16 rounded-xl bg-pink-500/20 backdrop-blur-sm border border-pink-400/20 flex items-center justify-center z-10"
                        >
                            <Cpu className="w-8 h-8 text-pink-400" />
                        </motion.div>

                        {/* Content */}
                        <div className="relative z-20 p-10 min-h-[500px] flex flex-col">
                            {/* Mentor Badge */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-scientist-500 to-scientist-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-scientist-500/30">
                                    A
                                </div>
                                <div>
                                    <div className="text-white font-semibold">Mentor: Abdul</div>
                                    <div className="text-scientist-400 text-sm">Expert Data Scientist</div>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="mb-6">
                                <div className="text-scientist-400 text-sm font-semibold uppercase tracking-wider mb-2">
                                    Jalur Saintifik
                                </div>
                                <h3 className="font-display text-4xl font-bold text-white mb-3">
                                    Data Scientist
                                </h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Bangun sistem cerdas yang bisa belajar dan prediksi.
                                    Kuasai machine learning, deep learning, dan AI.
                                </p>
                            </div>

                            {/* Skills */}
                            <div className="mb-8 flex-grow">
                                <div className="text-sm text-gray-400 mb-3">Yang Bakal Kamu Kuasai:</div>
                                <div className="flex flex-wrap gap-2">
                                    {['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Statistik', 'Deep Learning'].map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 rounded-full bg-scientist-500/20 border border-scientist-400/30 text-scientist-300 text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Philosophy */}
                            <div className="mb-8 p-4 rounded-xl bg-black/20 border border-scientist-500/20">
                                <div className="text-scientist-400 text-sm mb-1">Filosofi Abdul:</div>
                                <p className="text-white italic">
                                    "Pahami matematika di balik algoritmanya."
                                </p>
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => selectPath('SCIENTIST')}
                                className="btn-scientist flex items-center justify-center gap-3 w-full"
                            >
                                <Play className="w-5 h-5" />
                                Jadi Data Scientist
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20 border-t border-white/5">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        Kenapa Data Academy?
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Pengalaman belajar yang dirancang khusus buat profesional data modern
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            icon: Sparkles,
                            title: 'Feedback Berbasis AI',
                            description: 'Dapet feedback instan dan personal dari AI tutor yang paham konteks kamu.',
                            gradient: 'from-yellow-500 to-orange-500',
                        },
                        {
                            icon: Code2,
                            title: 'IDE di Browser',
                            description: 'Tulis dan jalankan Python & SQL langsung di browser. Gak perlu install apa-apa.',
                            gradient: 'from-analyst-500 to-cyan-500',
                        },
                        {
                            icon: Award,
                            title: 'Sistem Level',
                            description: 'Unlock level baru setelah buktiin kemampuan kamu. Gak bisa skip tanpa lulus!',
                            gradient: 'from-scientist-500 to-pink-500',
                        },
                    ].map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 hover:bg-white/10 transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-analyst-500 to-scientist-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-display text-xl font-bold text-white">DataAcademy</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 Data Academy. Memberdayakan generasi profesional data masa depan.
                    </p>
                </div>
            </footer>
        </div>
    );
}
