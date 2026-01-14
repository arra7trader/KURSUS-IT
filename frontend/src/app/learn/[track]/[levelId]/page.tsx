'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import Link from 'next/link';
import {
    ChevronRight,
    Play,
    Send,
    Terminal,
    CheckCircle2,
    XCircle,
    Loader2,
    Code2,
    MessageSquare,
    Zap,
    Target,
    Lightbulb,
    BarChart3,
    Brain,
    Home,
    BookOpen,
    ArrowRight,
    GraduationCap,
} from 'lucide-react';
import { curricula } from '@/data/curricula';

// Types
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

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function LessonPage({
    params,
}: {
    params: { track: string; levelId: string };
}) {
    const { track, levelId } = params;
    const isAnalyst = track === 'analyst';
    const mentor = isAnalyst ? 'Rendy' : 'Abdul';

    // Get dynamic content
    const currentData = curricula[levelId] || curricula['level-1'];

    // Separate content based on track
    const lectureContent = isAnalyst ? currentData.analyst : currentData.scientist;

    // Try to get track-specific challenge, fallback to shared challenge
    // Note: curricula.ts generator now puts challenge inside analyst/scientist object for levels 6+
    // But baseCurricula (1-5) uses shared 'challenge' property.
    // Logic: Look for `lectureContent.challenge`, if fail look for `currentData.challenge`.
    const challengeData = (lectureContent as any).challenge || currentData.challenge;

    // State
    const [mode, setMode] = useState<'lecture' | 'practice'>('lecture');
    const [code, setCode] = useState(challengeData.starterCode);
    const [output, setOutput] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);
    const [isGrading, setIsGrading] = useState(false);
    const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);

    const [generatedSections, setGeneratedSections] = useState<any[] | null>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    // Initial code update when level changes
    useEffect(() => {
        setCode(challengeData.starterCode);
        setMode('lecture');
        setOutput('');
        setGradeResult(null);
        setChatMessages([]);
        setGeneratedSections(null); // Reset

        // Fetch AI Lesson if flagged
        if ((lectureContent as any).isGenerated) {
            setIsLoadingAI(true);
            const topic = (lectureContent as any).topic;

            fetch('/api/lesson/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    track: isAnalyst ? 'Data Analyst' : 'Data Scientist',
                    level: levelId
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.sections) {
                        setGeneratedSections(data.sections);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoadingAI(false));
        }

    }, [levelId, challengeData, lectureContent, isAnalyst]);

    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isSendingChat, setIsSendingChat] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Warna tema
    const theme = isAnalyst
        ? {
            primary: 'blue',
            gradient: 'from-blue-600 to-cyan-500',
            bg: 'bg-blue-50',
            bgDark: 'bg-blue-600',
            border: 'border-blue-200',
            text: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-500',
            icon: BarChart3,
        }
        : {
            primary: 'purple',
            gradient: 'from-purple-600 to-pink-500',
            bg: 'bg-purple-50',
            bgDark: 'bg-purple-600',
            border: 'border-purple-200',
            text: 'text-purple-600',
            button: 'bg-purple-600 hover:bg-purple-500',
            icon: Brain,
        };

    // Mulai praktek
    const startPractice = () => {
        setMode('practice');
        setChatMessages([
            {
                id: '1',
                role: 'assistant',
                content: `Oke, sekarang waktunya praktek! 💪\n\nKerjakan tantangan di sebelah kanan. Kalau ada yang bingung, tanya aja di sini.`,
                timestamp: new Date(),
            },
        ]);
    };

    // Jalankan code
    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput('Menjalankan query...\n');

        await new Promise((r) => setTimeout(r, 800)); // Simulate processing

        // 1. Basic Validation (Empty or Default)
        if (code.trim() === challengeData.starterCode.trim() || !code.trim()) {
            setOutput(`Error: Query masih kosong atau belum diubah.\nHint: Lengkapi query sesuai instruksi!`);
            setIsRunning(false);
            return;
        }

        // 2. Keyword Validation (Client-side)
        if (challengeData.validation) {
            const upperCode = code.toUpperCase();
            const missingKeywords = challengeData.validation.requiredKeywords.filter((k: string) => !upperCode.includes(k));

            if (missingKeywords.length > 0) {
                setOutput(`Error: Syntax Error.\n\nQuery kamu sepertinya kurang lengkap.\nKeyword yang hilang: ${missingKeywords.join(', ')}\n\nCoba cek lagi logika SQL-nya!`);
                setIsRunning(false);
                return;
            }

            const forbidden = challengeData.validation.forbiddenKeywords.filter((k: string) => upperCode.includes(k));
            if (forbidden.length > 0) {
                setOutput(`Error: Security Alert.\n\nKamu menggunakan keyword terlarang: ${forbidden.join(', ')}`);
                setIsRunning(false);
                return;
            }
        }

        // 3. Success (Mock Execution Result)
        // In the future, this would send to a real SQL sandbox.
        // For now, if keywords pass, we assume 'Valid Syntax' enough to show result.
        setOutput(challengeData.expectedOutput || '> Query berhasil dijalankan');
        setIsRunning(false);
    };

    // Submit ke AI Grader
    const handleSubmit = async () => {
        setIsGrading(true);
        setGradeResult(null);

        try {
            const response = await fetch('/api/grade/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    challengeTitle: challengeData.title,
                    challengeDescription: challengeData.description,
                    language: 'sql',
                    difficulty: 1,
                    passingScore: 70
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Gagal menilai code');
            }

            const result: GradeResult = await response.json();
            setGradeResult(result);

            // Save Progress if passed
            if (result.passed) {
                fetch('/api/user/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ levelId, track })
                }).catch(console.error);
            }

            // Auto-scroll to result
            setTimeout(() => {
                const element = document.getElementById('grade-result');
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (error: any) {
            console.error(error);
            alert('Terjadi kesalahan saat menilai: ' + error.message);
        } finally {
            setIsGrading(false);
        }
    };

    // Chat
    const handleSendChat = async () => {
        if (!chatInput.trim()) return;
        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput, timestamp: new Date() };
        setChatMessages((prev) => [...prev, userMessage]);
        setChatInput('');
        setIsSendingChat(true);
        await new Promise((r) => setTimeout(r, 1500));
        const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: isAnalyst
                ? `Pertanyaan bagus! 👍\n\nUntuk menghitung total, pakai SUM():\n\nSUM(o.order_value) AS total_value\n\nIngat, pastikan query-nya cepat karena bos gak mau nunggu lama!`
                : `Pertanyaan bagus!\n\nPakai SUM() untuk agregasi:\n\nSUM(o.order_value) AS total_value\n\nKompleksitas agregasi adalah O(n). Dengan GROUP BY yang tepat, query-mu akan efisien.`,
            timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiResponse]);
        setIsSendingChat(false);
    };

    // ==================== LECTURE MODE ====================
    if (mode === 'lecture') {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-gray-400 hover:text-gray-600">
                                <Home className="w-5 h-5" />
                            </Link>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                                <theme.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-gray-900 font-semibold">{lectureContent.title}</h1>
                                <p className="text-gray-500 text-sm">Mentor: {mentor}</p>
                            </div>
                        </div>

                        {/* Track Switcher */}
                        <Link
                            href={`/learn/${isAnalyst ? 'scientist' : 'analyst'}/${levelId}`}
                            className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.text} text-sm font-medium hover:bg-gray-50 transition-colors`}
                        >
                            Switch to {isAnalyst ? 'Data Scientist' : 'Data Analyst'}
                        </Link>
                    </div>
                </header>

                {/* Lecture Content */}
                <main className="container mx-auto px-6 py-8 max-w-4xl">
                    {/* Title Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${theme.bg} ${theme.border} border rounded-2xl p-8 mb-8`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-14 h-14 rounded-full ${theme.bgDark} flex items-center justify-center text-white text-xl font-bold`}>
                                {mentor[0]}
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Kuliah dari {mentor}</div>
                                <h2 className="text-2xl font-bold text-gray-900">{lectureContent.title}</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <GraduationCap className="w-4 h-4" />
                            <span>{lectureContent.sections.length} bagian materi</span>
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        {isLoadingAI && (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900">Mentor AI sedang menyusun materi...</h3>
                                <p className="text-gray-500">Menulis kurikulum tingkat universitas khusus untukmu.</p>
                            </div>
                        )}

                        {(generatedSections || lectureContent.sections).map((section: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl border border-gray-200 p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-8 h-8 rounded-lg ${theme.bg} ${theme.text} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.heading}</h3>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>

                                        {section.code && (
                                            <div className="mt-4 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                                <pre className="text-green-400 text-sm font-mono">{section.code}</pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Start Practice Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <button
                            onClick={startPractice}
                            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl ${theme.button} text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all`}
                        >
                            <BookOpen className="w-6 h-6" />
                            Mulai Praktek
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        <p className="text-gray-500 text-sm mt-3">Kerjakan tantangan untuk menguji pemahamanmu</p>
                    </motion.div>
                </main>
            </div>
        );
    }

    // ==================== PRACTICE MODE ====================
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMode('lecture')} className="text-gray-400 hover:text-gray-600">
                            <Home className="w-5 h-5" />
                        </button>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-gray-900 font-semibold">{challengeData.title}</h1>
                            <p className="text-gray-500 text-sm">Tantangan Level {levelId?.split('-')[1] || '1'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/learn/${isAnalyst ? 'scientist' : 'analyst'}/${levelId}`}
                            className={`px-3 py-1.5 rounded-lg border ${theme.border} ${theme.text} text-xs font-medium hover:bg-gray-50 transition-colors`}
                        >
                            Switch Branch
                        </Link>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${theme.bg}`}>
                            <div className={`w-2 h-2 rounded-full ${theme.bgDark}`} />
                            <span className={`text-sm ${theme.text}`}>Mentor: {mentor}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="grid grid-cols-12 gap-0 h-[calc(100vh-65px)]">
                {/* Chat Column */}
                <div className="col-span-3 border-r border-gray-200 flex flex-col bg-white">
                    <div className={`flex items-center gap-2 px-4 py-3 border-b border-gray-200`}>
                        <MessageSquare className={`w-5 h-5 ${theme.text}`} />
                        <h2 className="text-gray-900 font-semibold">Tanya {mentor}</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? `${theme.button} text-white` : 'bg-white border border-gray-200 text-gray-700'}`}>
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
                            <button onClick={handleSendChat} disabled={isSendingChat} className={`p-2 rounded-xl ${theme.button} text-white`}>
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Editor Column */}
                <div className="col-span-5 flex flex-col bg-white">
                    <div className={`p-4 border-b border-gray-200 ${theme.bg}`}>
                        <h3 className="text-gray-900 font-semibold mb-2">{challengeData.title}</h3>
                        <p className="text-gray-600 text-sm whitespace-pre-line">{challengeData.description}</p>
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                        <span className="text-sm text-gray-500">SQL</span>
                        <button onClick={handleRunCode} disabled={isRunning} className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium">
                            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Jalankan
                        </button>
                    </div>

                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language="sql"
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            theme="vs-dark"
                            options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 16, bottom: 16 } }}
                        />
                    </div>
                </div>

                {/* Output Column */}
                <div className="col-span-4 border-l border-gray-200 flex flex-col bg-white">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <Terminal className="w-5 h-5 text-gray-500" />
                        <h2 className="text-gray-900 font-semibold">Output</h2>
                    </div>

                    <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-gray-900">
                        {output ? <pre className="text-green-400 whitespace-pre-wrap">{output}</pre> : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                <Terminal className="w-8 h-8 opacity-50" />
                                <p>Klik "Jalankan" untuk melihat hasil</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 p-4 space-y-3">
                        <button onClick={handleSubmit} disabled={isGrading} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${theme.button} text-white font-semibold shadow-lg hover:bg-opacity-90 transition-all disabled:opacity-50`}>
                            {isGrading ? <><Loader2 className="w-5 h-5 animate-spin" />Menilai...</> : <><Zap className="w-5 h-5" />Submit untuk Dinilai AI</>}
                        </button>

                        {/* Next Level Button (Only if passed) */}
                        <AnimatePresence>
                            {gradeResult?.passed && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    {curricula[`level-${parseInt(levelId.split('-')[1] || '1') + 1}`] ? (
                                        <Link
                                            href={`/learn/${track}/level-${parseInt(levelId.split('-')[1] || '1') + 1}`}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition-all"
                                        >
                                            Lanjut ke Level {parseInt(levelId.split('-')[1] || '1') + 1} <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    ) : (
                                        <div className="w-full text-center py-3 bg-gray-100 rounded-xl text-gray-500 font-medium">
                                            🎉 Kamu telah menyelesaikan semua materi saat ini!
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Grade Result */}
                    <AnimatePresence>
                        {gradeResult && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="border-t border-gray-200 p-4 max-h-[50%] overflow-y-auto">
                                <div className={`flex items-center justify-between p-4 rounded-xl mb-4 ${gradeResult.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                    <div className="flex items-center gap-3">
                                        {gradeResult.passed ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
                                        <div>
                                            <div className={`text-lg font-bold ${gradeResult.passed ? 'text-green-600' : 'text-red-600'}`}>{gradeResult.passed ? 'Lulus!' : 'Belum Lulus'}</div>
                                            <div className="text-sm text-gray-500">Minimum: 70</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-bold text-gray-900">{gradeResult.score}</div>
                                        <div className="text-sm text-gray-500">/ 100</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-gray-900 font-semibold text-sm">Rincian</h4>
                                    {[
                                        { label: 'Kebenaran', value: gradeResult.criteria.correctness, max: 40, icon: Target },
                                        { label: 'Efisiensi', value: gradeResult.criteria.efficiency, max: 25, icon: Zap },
                                        { label: 'Gaya', value: gradeResult.criteria.style, max: 15, icon: Code2 },
                                        { label: 'Bisnis', value: gradeResult.criteria.business_insight, max: 20, icon: Lightbulb },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4 text-gray-400" />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">{item.label}</span>
                                                    <span className="text-gray-900 font-medium">{item.value}/{item.max}</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-200 rounded-full"><div className={`h-full bg-${theme.primary}-500 rounded-full`} style={{ width: `${(item.value / item.max) * 100}%` }} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                                    <p className="text-gray-600 text-sm">{gradeResult.feedback_text}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
