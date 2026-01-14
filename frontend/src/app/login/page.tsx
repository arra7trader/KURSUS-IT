'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                name,
                redirect: false,
            });

            console.log('Login result:', result);

            if (result?.error) {
                alert(`Login gagal: ${result.error}\n\nPastikan email dan nama sudah benar.`);
                console.error('Login error details:', result);
            } else {
                router.push('/learn');
                router.refresh();
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Terjadi kesalahan saat login. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-gray-900 flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Kembali
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Masuk / Daftar</h1>
                    <p className="text-gray-500 mt-2">Simpan progress belajarmu sekarang</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900"
                            placeholder="Contoh: Budi Santoso"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900"
                            placeholder="budi@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mulai Belajar 🚀'}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                        *Karena ini mode demo, password tidak diperlukan. Akun akan dibuat otomatis jika belum ada.
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
