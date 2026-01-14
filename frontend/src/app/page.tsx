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

    const selectPath = (path: 'analyst' | 'scientist') => {
        router.push(`/learn/${path}/level-1`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            Data<span className="text-blue-600">Academy</span>
                        </span>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700 font-medium">🚀 Akademi AI dengan Standar Internasional</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Kuasai Skill Data bareng
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Mentor AI Pribadi Kamu
                        </span>
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
                        Pilih jalur karirmu. Belajar dari AI tutor yang adaptif.
                        Latihan dengan coding challenge nyata. Dapet feedback instan.
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
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="text-center"
                            >
                                <stat.icon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Path Selection */}
            <section className="container mx-auto px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Pilih Jalur Karirmu
                    </h2>
                    <p className="text-gray-600">
                        Dua perjalanan berbeda. Dua mentor AI. Satu tujuan: Kesuksesan kamu.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Data Analyst Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        onHoverStart={() => setHoveredSide('analyst')}
                        onHoverEnd={() => setHoveredSide(null)}
                        className={`relative bg-white rounded-2xl border-2 p-8 shadow-lg transition-all duration-300 cursor-pointer ${hoveredSide === 'scientist'
                                ? 'border-gray-200 opacity-70'
                                : 'border-blue-200 hover:border-blue-400 hover:shadow-blue-100'
                            }`}
                        onClick={() => selectPath('analyst')}
                    >
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>

                        {/* Mentor */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                R
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">Mentor: Rendy</div>
                                <div className="text-sm text-blue-600">Expert Data Analyst</div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-2">
                            Jalur Bisnis
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Data Analyst
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Ubah data mentah jadi insight bisnis yang actionable.
                            Kuasai SQL, visualisasi, dan storytelling dengan data.
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['SQL', 'Excel', 'Tableau', 'Power BI', 'Pandas'].map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                        {/* Philosophy */}
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6">
                            <p className="text-gray-700 italic text-sm">
                                "Data cuma berguna kalau bisa bikin duit atau hemat waktu."
                            </p>
                        </div>

                        {/* CTA */}
                        <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-200">
                            <Play className="w-5 h-5" />
                            Mulai Belajar
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>

                    {/* Data Scientist Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        onHoverStart={() => setHoveredSide('scientist')}
                        onHoverEnd={() => setHoveredSide(null)}
                        className={`relative bg-white rounded-2xl border-2 p-8 shadow-lg transition-all duration-300 cursor-pointer ${hoveredSide === 'analyst'
                                ? 'border-gray-200 opacity-70'
                                : 'border-purple-200 hover:border-purple-400 hover:shadow-purple-100'
                            }`}
                        onClick={() => selectPath('scientist')}
                    >
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
                            <Brain className="w-8 h-8 text-white" />
                        </div>

                        {/* Mentor */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                A
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">Mentor: Abdul</div>
                                <div className="text-sm text-purple-600">Expert Data Scientist</div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-sm text-purple-600 font-semibold uppercase tracking-wider mb-2">
                            Jalur Saintifik
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Data Scientist
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Bangun sistem cerdas yang bisa belajar dan prediksi.
                            Kuasai machine learning, deep learning, dan AI.
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Stats'].map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                        {/* Philosophy */}
                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 mb-6">
                            <p className="text-gray-700 italic text-sm">
                                "Pahami matematika di balik algoritmanya."
                            </p>
                        </div>

                        {/* CTA */}
                        <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-200">
                            <Play className="w-5 h-5" />
                            Mulai Belajar
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Kenapa Data Academy?
                        </h2>
                        <p className="text-gray-600">
                            Pengalaman belajar untuk profesional data modern
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                icon: Sparkles,
                                title: 'Feedback AI',
                                description: 'Dapet feedback instan dan personal dari AI tutor.',
                                color: 'text-yellow-600',
                                bg: 'bg-yellow-50',
                            },
                            {
                                icon: Code2,
                                title: 'IDE di Browser',
                                description: 'Tulis dan jalankan Python & SQL langsung di browser.',
                                color: 'text-blue-600',
                                bg: 'bg-blue-50',
                            },
                            {
                                icon: Award,
                                title: 'Sistem Level',
                                description: 'Unlock level baru setelah buktiin kemampuan kamu.',
                                color: 'text-purple-600',
                                bg: 'bg-purple-50',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-8">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">DataAcademy</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 Data Academy. Memberdayakan generasi profesional data.
                    </p>
                </div>
            </footer>
        </div>
    );
}
