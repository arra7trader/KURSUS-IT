'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import Link from 'next/link';
import {
    ChevronDown,
    ChevronRight,
    Play,
    Send,
    Terminal,
    CheckCircle2,
    XCircle,
    Loader2,
    BookOpen,
    Code2,
    MessageSquare,
    Award,
    Zap,
    Target,
    Lightbulb,
    BarChart3,
    Brain,
    Home,
} from 'lucide-react';

// Types
interface Module {
    id: string;
    title: string;
    type: 'video' | 'text' | 'challenge';
    completed: boolean;
    duration?: string;
}

interface Level {
    id: string;
    name: string;
    modules: Module[];
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface GradeResult {
    score: number;
    criteria: {
        correctness: number;
        efficiency: number;
        style: number;
        business_insight: number;
    };
    feedback_text: string;
    strengths: string[];
    improvements: string[];
    passed: boolean;
}

// Data kurikulum (Bahasa Indonesia)
const mockCurriculum: Level[] = [
    {
        id: 'level-1',
        name: 'Level 1: Dasar-dasar SQL',
        modules: [
            { id: 'm1', title: 'Pengenalan Database', type: 'video', completed: true, duration: '12 menit' },
            { id: 'm2', title: 'Perintah SELECT', type: 'text', completed: true },
            { id: 'm3', title: 'Tantangan: Query Data Customer', type: 'challenge', completed: false },
        ],
    },
    {
        id: 'level-2',
        name: 'Level 2: JOIN & Agregasi',
        modules: [
            { id: 'm4', title: 'Memahami JOIN', type: 'video', completed: false, duration: '18 menit' },
            { id: 'm5', title: 'GROUP BY & HAVING', type: 'text', completed: false },
            { id: 'm6', title: 'Tantangan: Laporan Penjualan', type: 'challenge', completed: false },
        ],
    },
    {
        id: 'level-3',
        name: 'Level 3: Query Lanjutan',
        modules: [
            { id: 'm7', title: 'Subquery', type: 'video', completed: false, duration: '15 menit' },
            { id: 'm8', title: 'Window Functions', type: 'text', completed: false },
            { id: 'm9', title: 'Tantangan: Analisis Cohort', type: 'challenge', completed: false },
        ],
    },
];

// Data tantangan
const mockChallenge = {
    title: 'Query Data Customer',
    description: `Tulis query SQL untuk menemukan 5 customer teratas berdasarkan total nilai order.

Query kamu harus:
1. Join tabel customers dan orders
2. Hitung total nilai order untuk setiap customer
3. Tampilkan nama customer dan total nilai
4. Urutkan berdasarkan total nilai (terbesar dulu)
5. Batasi hasil hanya 5 teratas`,
    starterCode: `-- Tulis query SQL kamu di sini
SELECT 
  c.customer_name,
  -- Hitung total nilai order
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
-- Tambahkan logika di sini
`,
    language: 'sql' as const,
};

export default function LessonPage({
    params,
}: {
    params: { track: string; levelId: string };
}) {
    const { track } = params;
    const isAnalyst = track === 'analyst';
    const mentor = isAnalyst ? 'Rendy' : 'Abdul';

    // State
    const [expandedLevels, setExpandedLevels] = useState<string[]>(['level-1']);
    const [code, setCode] = useState(mockChallenge.starterCode);
    const [language, setLanguage] = useState<'python' | 'sql'>('sql');
    const [output, setOutput] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);
    const [isGrading, setIsGrading] = useState(false);
    const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);

    // Chat state - Mentor langsung memberikan kuliah, bukan menunggu pertanyaan
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: isAnalyst
                ? `📚 **KULIAH: Dasar-dasar SQL - SELECT Query**

Halo! Saya Rendy, dan hari ini kita mulai dari yang paling fundamental: **SELECT statement**.

---

**Apa itu SELECT?**
SELECT adalah perintah untuk mengambil data dari database. Analoginya seperti kamu lagi belanja di supermarket - SELECT adalah daftar belanjamu.

**Struktur Dasar:**
\`\`\`sql
SELECT kolom1, kolom2
FROM nama_tabel
WHERE kondisi;
\`\`\`

**Contoh Nyata di Dunia Kerja:**
Misal bos kamu minta: "Kasih saya daftar customer yang order lebih dari Rp10 juta"

\`\`\`sql
SELECT customer_name, total_order
FROM customers
WHERE total_order > 10000000;
\`\`\`

---

**💡 Tips dari Saya:**
Di dunia nyata, query yang lambat = bos marah = karir terhambat. Jadi selalu pikirkan efisiensi!

Sekarang coba kerjakan tantangan di sebelah kanan. Kamu perlu gabungkan 2 tabel pakai JOIN. Kalau bingung, tanya saja!`
                : `📚 **KULIAH: Dasar-dasar SQL untuk Data Science**

Halo! Saya Abdul. Mari kita mulai dengan memahami SQL dari perspektif Data Scientist.

---

**Kenapa SQL Penting untuk Data Science?**
Sebelum kamu bisa training model ML, kamu butuh **data yang bersih**. Dan 90% data perusahaan ada di database relasional.

**Konsep Fundamental:**
\`\`\`sql
SELECT kolom1, kolom2
FROM tabel_a
JOIN tabel_b ON tabel_a.id = tabel_b.id
GROUP BY kolom1;
\`\`\`

**Kompleksitas Query (Big O):**
- SELECT tanpa index: O(n) - linear scan
- SELECT dengan index: O(log n) - binary search
- JOIN tanpa index: O(n×m) - worst case!

---

**Studi Kasus: Feature Engineering**
Misal kamu mau prediksi customer churn. Kamu butuh fitur seperti:
- Total order per customer
- Rata-rata nilai order
- Frekuensi order

Semua ini bisa dihitung dengan SQL:
\`\`\`sql
SELECT customer_id,
       COUNT(*) as order_count,
       AVG(order_value) as avg_order,
       SUM(order_value) as total_spent
FROM orders
GROUP BY customer_id;
\`\`\`

---

**📝 Tantangan:**
Sekarang coba kerjakan challenge di samping. Kamu perlu menemukan top 5 customer. Pikirkan kompleksitas query-nya!`,
            timestamp: new Date(),
        },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isSendingChat, setIsSendingChat] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Scroll ke bawah chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Toggle level
    const toggleLevel = (levelId: string) => {
        setExpandedLevels((prev) =>
            prev.includes(levelId)
                ? prev.filter((id) => id !== levelId)
                : [...prev, levelId]
        );
    };

    // Jalankan code
    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput('Menjalankan query...\n');

        await new Promise((r) => setTimeout(r, 1500));

        setOutput(`> Query berhasil dijalankan
    
┌────────────────────┬──────────────┐
│ customer_name      │ total_value  │
├────────────────────┼──────────────┤
│ Acme Corporation   │ Rp125.450    │
│ Tech Solutions     │ Rp98.230     │
│ Global Industries  │ Rp87.100     │
│ Prime Retail       │ Rp72.890     │
│ Metro Services     │ Rp65.420     │
└────────────────────┴──────────────┘

5 baris dalam 0.042 detik`);
        setIsRunning(false);
    };

    // Submit untuk grading
    const handleSubmit = async () => {
        setIsGrading(true);
        setGradeResult(null);

        await new Promise((r) => setTimeout(r, 2500));

        setGradeResult({
            score: 85,
            criteria: {
                correctness: 36,
                efficiency: 22,
                style: 13,
                business_insight: 14,
            },
            feedback_text: "Kerja bagus! Query kamu berhasil mengidentifikasi 5 customer teratas berdasarkan total nilai order. Logika JOIN dan agregasinya sudah benar. Coba gunakan table alias secara konsisten biar lebih mudah dibaca.",
            strengths: [
                "Penggunaan JOIN antara customers dan orders sudah benar",
                "Clause GROUP BY sudah tepat",
                "Penggunaan ORDER BY dan LIMIT sudah bagus",
            ],
            improvements: [
                "Tambahkan alias kolom untuk SUM(order_value) jadi 'total_value'",
                "Pertimbangkan menambah WHERE untuk filter order yang dibatalkan",
                "Gunakan alias tabel secara konsisten",
            ],
            passed: true,
        });
        setIsGrading(false);
    };

    // Kirim pesan chat
    const handleSendChat = async () => {
        if (!chatInput.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: chatInput,
            timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, userMessage]);
        setChatInput('');
        setIsSendingChat(true);

        await new Promise((r) => setTimeout(r, 1500));

        const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: isAnalyst
                ? `Pertanyaan bagus! 👍\n\nUntuk masalah ini, kamu perlu pakai SUM() untuk hitung total. Contoh:\n\n\`\`\`sql\nSUM(o.order_value) AS total_value\n\`\`\`\n\nIngat ya, pastikan query-nya cepat karena di dunia nyata, bos gak mau nunggu lama buat laporan!`
                : `Pertanyaan bagus! Mari kita breakdown secara matematis.\n\nFungsi agregasi SUM() punya kompleksitas O(n) di mana n adalah jumlah baris. Dengan indexing yang tepat di kolom JOIN, kompleksitas query jadi O(n log n).\n\n\`\`\`sql\nSUM(o.order_value) AS total_value\n\`\`\`\n\nBerapa Big O dari approach kamu sekarang?`,
            timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, aiResponse]);
        setIsSendingChat(false);
    };

    // Warna tema berdasarkan track
    const theme = isAnalyst
        ? {
            primary: 'blue',
            gradient: 'from-blue-600 to-cyan-500',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-500',
            icon: BarChart3,
        }
        : {
            primary: 'purple',
            gradient: 'from-purple-600 to-pink-500',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-600',
            button: 'bg-purple-600 hover:bg-purple-500',
            icon: Brain,
        };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                            <Home className="w-5 h-5" />
                        </Link>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                            <theme.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-gray-900 font-semibold">{mockChallenge.title}</h1>
                            <p className="text-gray-500 text-sm">Level 1 • Dasar-dasar SQL</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${theme.bg}`}>
                            <div className={`w-2 h-2 rounded-full bg-${theme.primary}-500`} />
                            <span className={`text-sm ${theme.text}`}>Mentor: {mentor}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - 3 Column Grid */}
            <main className="grid grid-cols-12 gap-0 h-[calc(100vh-65px)]">
                {/* Kolom Kiri - Kurikulum & Chat */}
                <div className="col-span-3 border-r border-gray-200 flex flex-col bg-white">
                    {/* Section Kurikulum */}
                    <div className="flex-1 overflow-y-auto p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className={`w-5 h-5 ${theme.text}`} />
                            <h2 className="text-gray-900 font-semibold">Kurikulum</h2>
                        </div>

                        <div className="space-y-2">
                            {mockCurriculum.map((level) => (
                                <div key={level.id} className="rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleLevel(level.id)}
                                        className={`w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 transition-colors ${expandedLevels.includes(level.id) ? 'bg-gray-50' : ''
                                            }`}
                                    >
                                        {expandedLevels.includes(level.id) ? (
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span className="text-sm text-gray-700 font-medium">{level.name}</span>
                                    </button>

                                    <AnimatePresence>
                                        {expandedLevels.includes(level.id) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-6 pr-3 pb-2 space-y-1">
                                                    {level.modules.map((module) => (
                                                        <div
                                                            key={module.id}
                                                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${module.type === 'challenge' && !module.completed
                                                                ? `${theme.bg} ${theme.border} border`
                                                                : 'hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {module.completed ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                            ) : module.type === 'challenge' ? (
                                                                <Code2 className={`w-4 h-4 ${theme.text}`} />
                                                            ) : (
                                                                <div className="w-4 h-4 rounded-full border border-gray-300" />
                                                            )}
                                                            <span className={`text-sm ${module.completed ? 'text-gray-400' : 'text-gray-700'}`}>
                                                                {module.title}
                                                            </span>
                                                            {module.duration && (
                                                                <span className="text-xs text-gray-400 ml-auto">{module.duration}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section Chat */}
                    <div className="h-[45%] flex flex-col">
                        <div className={`flex items-center gap-2 px-4 py-3 border-b border-gray-200`}>
                            <MessageSquare className={`w-5 h-5 ${theme.text}`} />
                            <h2 className="text-gray-900 font-semibold">Chat dengan {mentor}</h2>
                        </div>

                        {/* Pesan Chat */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                            ? `${theme.button} text-white`
                                            : 'bg-white border border-gray-200 text-gray-700'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isSendingChat && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Chat */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                    placeholder={`Tanya ${mentor}...`}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300"
                                />
                                <button
                                    onClick={handleSendChat}
                                    disabled={isSendingChat}
                                    className={`p-2 rounded-xl ${theme.button} text-white transition-colors disabled:opacity-50`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom Tengah - Code Editor */}
                <div className="col-span-5 flex flex-col bg-white">
                    {/* Deskripsi Tantangan */}
                    <div className={`p-4 border-b border-gray-200 ${theme.bg}`}>
                        <h3 className="text-gray-900 font-semibold mb-2">{mockChallenge.title}</h3>
                        <p className="text-gray-600 text-sm whitespace-pre-line">{mockChallenge.description}</p>
                    </div>

                    {/* Header Editor */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-4">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'python' | 'sql')}
                                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none"
                            >
                                <option value="sql">SQL</option>
                                <option value="python">Python</option>
                            </select>
                        </div>

                        <button
                            onClick={handleRunCode}
                            disabled={isRunning}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {isRunning ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                            Jalankan
                        </button>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: 'JetBrains Mono, monospace',
                                lineNumbers: 'on',
                                roundedSelection: true,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 16, bottom: 16 },
                                tabSize: 2,
                            }}
                        />
                    </div>
                </div>

                {/* Kolom Kanan - Output & Feedback */}
                <div className="col-span-4 border-l border-gray-200 flex flex-col bg-white">
                    {/* Section Output */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <Terminal className="w-5 h-5 text-gray-500" />
                            <h2 className="text-gray-900 font-semibold">Output</h2>
                        </div>

                        <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-gray-900">
                            {output ? (
                                <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
                            ) : (
                                <p className="text-gray-500">Jalankan code untuk lihat output di sini...</p>
                            )}
                        </div>
                    </div>

                    {/* Section Submit */}
                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isGrading}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${theme.button} text-white font-semibold transition-all disabled:opacity-50`}
                        >
                            {isGrading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    AI sedang menilai...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Submit untuk Dinilai AI
                                </>
                            )}
                        </button>
                    </div>

                    {/* Kartu Nilai */}
                    <AnimatePresence>
                        {gradeResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="border-t border-gray-200 p-4 max-h-[50%] overflow-y-auto"
                            >
                                {/* Header Nilai */}
                                <div className={`flex items-center justify-between p-4 rounded-xl mb-4 ${gradeResult.passed
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        {gradeResult.passed ? (
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        ) : (
                                            <XCircle className="w-8 h-8 text-red-500" />
                                        )}
                                        <div>
                                            <div className={`text-lg font-bold ${gradeResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                {gradeResult.passed ? 'Lulus!' : 'Belum Lulus'}
                                            </div>
                                            <div className="text-sm text-gray-500">Minimum: 70 poin</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-bold text-gray-900">{gradeResult.score}</div>
                                        <div className="text-sm text-gray-500">/ 100</div>
                                    </div>
                                </div>

                                {/* Breakdown Nilai */}
                                <div className="space-y-3 mb-4">
                                    <h4 className="text-gray-900 font-semibold text-sm">Rincian Nilai</h4>
                                    {[
                                        { label: 'Kebenaran', value: gradeResult.criteria.correctness, max: 40, icon: Target },
                                        { label: 'Efisiensi', value: gradeResult.criteria.efficiency, max: 25, icon: Zap },
                                        { label: 'Gaya Penulisan', value: gradeResult.criteria.style, max: 15, icon: Code2 },
                                        { label: 'Pemahaman Bisnis', value: gradeResult.criteria.business_insight, max: 20, icon: Lightbulb },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4 text-gray-400" />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">{item.label}</span>
                                                    <span className="text-gray-900 font-medium">{item.value}/{item.max}</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-${theme.primary}-500 rounded-full transition-all duration-500`}
                                                        style={{ width: `${(item.value / item.max) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Feedback */}
                                <div className="space-y-3">
                                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                                        <h4 className="text-gray-900 font-semibold text-sm mb-2">Feedback AI</h4>
                                        <p className="text-gray-600 text-sm">{gradeResult.feedback_text}</p>
                                    </div>

                                    {/* Kelebihan */}
                                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                        <h4 className="text-green-700 font-semibold text-sm mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Kelebihan
                                        </h4>
                                        <ul className="space-y-1">
                                            {gradeResult.strengths.map((s, i) => (
                                                <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                                                    <span className="text-green-500 mt-1">•</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Saran Perbaikan */}
                                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                        <h4 className="text-yellow-700 font-semibold text-sm mb-2 flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4" />
                                            Saran Perbaikan
                                        </h4>
                                        <ul className="space-y-1">
                                            {gradeResult.improvements.map((s, i) => (
                                                <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                                                    <span className="text-yellow-500 mt-1">•</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
