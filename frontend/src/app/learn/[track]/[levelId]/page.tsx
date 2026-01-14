'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
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
    Clock,
    Target,
    Lightbulb,
    BarChart3,
    Brain,
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

// Mock data for curriculum
const mockCurriculum: Level[] = [
    {
        id: 'level-1',
        name: 'Level 1: SQL Fundamentals',
        modules: [
            { id: 'm1', title: 'Introduction to Databases', type: 'video', completed: true, duration: '12 min' },
            { id: 'm2', title: 'SELECT Statements', type: 'text', completed: true },
            { id: 'm3', title: 'Challenge: Query Customer Data', type: 'challenge', completed: false },
        ],
    },
    {
        id: 'level-2',
        name: 'Level 2: JOINs & Aggregations',
        modules: [
            { id: 'm4', title: 'Understanding JOINs', type: 'video', completed: false, duration: '18 min' },
            { id: 'm5', title: 'GROUP BY & HAVING', type: 'text', completed: false },
            { id: 'm6', title: 'Challenge: Sales Report', type: 'challenge', completed: false },
        ],
    },
    {
        id: 'level-3',
        name: 'Level 3: Advanced Queries',
        modules: [
            { id: 'm7', title: 'Subqueries', type: 'video', completed: false, duration: '15 min' },
            { id: 'm8', title: 'Window Functions', type: 'text', completed: false },
            { id: 'm9', title: 'Challenge: Cohort Analysis', type: 'challenge', completed: false },
        ],
    },
];

// Challenge data
const mockChallenge = {
    title: 'Query Customer Data',
    description: `Write a SQL query to find the top 5 customers by total order value.

Your query should:
1. Join the customers and orders tables
2. Calculate the total order value for each customer
3. Return customer name and total value
4. Order by total value descending
5. Limit to top 5 results`,
    starterCode: `-- Write your SQL query here
SELECT 
  c.customer_name,
  -- Calculate total order value
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
-- Add your logic here
`,
    language: 'sql' as const,
};

export default function LessonPage({
    params,
}: {
    params: { track: string; levelId: string };
}) {
    const { track, levelId } = params;
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

    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: isAnalyst
                ? `Halo! Saya Rendy, mentor Data Analyst kamu. 👋\n\nSekarang kita akan belajar tentang SQL queries untuk mengambil data customer. Ingat, "Data is only useful if it makes money or saves time." Jadi pastikan query kamu efisien!\n\nAda yang bisa saya bantu?`
                : `Welcome! I'm Abdul, your Data Science mentor. 👋\n\nToday we'll explore SQL fundamentals. Remember, "Understand the math behind the black box." Even in SQL, understanding query optimization complexity matters.\n\nHow can I assist you?`,
            timestamp: new Date(),
        },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isSendingChat, setIsSendingChat] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Toggle level expansion
    const toggleLevel = (levelId: string) => {
        setExpandedLevels((prev) =>
            prev.includes(levelId)
                ? prev.filter((id) => id !== levelId)
                : [...prev, levelId]
        );
    };

    // Run code
    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput('Executing query...\n');

        // Simulate execution
        await new Promise((r) => setTimeout(r, 1500));

        setOutput(`> Query executed successfully
    
┌────────────────────┬──────────────┐
│ customer_name      │ total_value  │
├────────────────────┼──────────────┤
│ Acme Corporation   │ $125,450.00  │
│ Tech Solutions     │ $98,230.50   │
│ Global Industries  │ $87,100.00   │
│ Prime Retail       │ $72,890.25   │
│ Metro Services     │ $65,420.00   │
└────────────────────┴──────────────┘

5 rows returned in 0.042s`);
        setIsRunning(false);
    };

    // Submit for grading
    const handleSubmit = async () => {
        setIsGrading(true);
        setGradeResult(null);

        // Simulate API call to grading service
        await new Promise((r) => setTimeout(r, 2500));

        // Mock grade result
        setGradeResult({
            score: 85,
            criteria: {
                correctness: 36,
                efficiency: 22,
                style: 13,
                business_insight: 14,
            },
            feedback_text: "Great job! Your query correctly identifies the top 5 customers by total order value. The JOIN and aggregation logic is sound. Consider using table aliases consistently for better readability.",
            strengths: [
                "Correct use of JOIN between customers and orders",
                "Proper GROUP BY clause",
                "Good use of ORDER BY and LIMIT",
            ],
            improvements: [
                "Add column alias for SUM(order_value) as 'total_value'",
                "Consider adding a WHERE clause to filter out cancelled orders",
                "Use consistent table aliasing throughout",
            ],
            passed: true,
        });
        setIsGrading(false);
    };

    // Send chat message
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

        // Simulate AI response
        await new Promise((r) => setTimeout(r, 1500));

        const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: isAnalyst
                ? `Pertanyaan bagus! 👍\n\nUntuk masalah ini, kamu perlu menggunakan SUM() untuk menghitung total. Contoh:\n\n\`\`\`sql\nSUM(o.order_value) AS total_value\n\`\`\`\n\nIngat, pastikan query-nya cepat karena di dunia nyata, CEO tidak mau menunggu lama untuk laporan!`
                : `Excellent question! Let me break this down mathematically.\n\nThe aggregation function SUM() has O(n) complexity where n is the number of rows. With proper indexing on the JOIN columns, your query complexity becomes O(n log n).\n\n\`\`\`sql\nSUM(o.order_value) AS total_value\n\`\`\`\n\nWhat's the Big O of your current approach?`,
            timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, aiResponse]);
        setIsSendingChat(false);
    };

    // Theme colors based on track
    const theme = isAnalyst
        ? {
            primary: 'analyst',
            accent: 'cyan',
            bg: 'from-analyst-900/20 to-gray-900',
            border: 'border-analyst-500/20',
            text: 'text-analyst-400',
            button: 'bg-analyst-600 hover:bg-analyst-500',
            icon: BarChart3,
        }
        : {
            primary: 'scientist',
            accent: 'pink',
            bg: 'from-scientist-900/20 to-gray-900',
            border: 'border-scientist-500/20',
            text: 'text-scientist-400',
            button: 'bg-scientist-600 hover:bg-scientist-500',
            icon: Brain,
        };

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <header className={`border-b ${theme.border} bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50`}>
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${theme.primary}-500 to-${theme.primary}-600 flex items-center justify-center`}>
                            <theme.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-semibold">{mockChallenge.title}</h1>
                            <p className="text-gray-500 text-sm">Level 1 • SQL Fundamentals</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800">
                            <div className={`w-2 h-2 rounded-full bg-${theme.primary}-500`} />
                            <span className="text-sm text-gray-300">Mentor: {mentor}</span>
                        </div>
                        <button className={`px-4 py-2 rounded-lg ${theme.button} text-white font-medium transition-colors`}>
                            Save Progress
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - 3 Column Grid */}
            <main className="grid grid-cols-12 gap-0 h-[calc(100vh-65px)]">
                {/* Left Column - Curriculum & Chat */}
                <div className={`col-span-3 border-r ${theme.border} flex flex-col bg-gray-900/50`}>
                    {/* Curriculum Section */}
                    <div className="flex-1 overflow-y-auto p-4 border-b border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className={`w-5 h-5 ${theme.text}`} />
                            <h2 className="text-white font-semibold">Curriculum</h2>
                        </div>

                        <div className="space-y-2">
                            {mockCurriculum.map((level) => (
                                <div key={level.id} className="rounded-lg overflow-hidden">
                                    {/* Level Header */}
                                    <button
                                        onClick={() => toggleLevel(level.id)}
                                        className={`w-full flex items-center gap-2 p-3 text-left hover:bg-gray-800/50 transition-colors ${expandedLevels.includes(level.id) ? 'bg-gray-800/30' : ''
                                            }`}
                                    >
                                        {expandedLevels.includes(level.id) ? (
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-500" />
                                        )}
                                        <span className="text-sm text-gray-300 font-medium">{level.name}</span>
                                    </button>

                                    {/* Modules */}
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
                                                                    ? `bg-${theme.primary}-500/10 border border-${theme.primary}-500/20`
                                                                    : 'hover:bg-gray-800/50'
                                                                }`}
                                                        >
                                                            {module.completed ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                            ) : module.type === 'challenge' ? (
                                                                <Code2 className={`w-4 h-4 ${theme.text}`} />
                                                            ) : (
                                                                <div className="w-4 h-4 rounded-full border border-gray-600" />
                                                            )}
                                                            <span className={`text-sm ${module.completed ? 'text-gray-500' : 'text-gray-300'}`}>
                                                                {module.title}
                                                            </span>
                                                            {module.duration && (
                                                                <span className="text-xs text-gray-600 ml-auto">{module.duration}</span>
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

                    {/* Chat Section */}
                    <div className="h-[45%] flex flex-col">
                        <div className={`flex items-center gap-2 px-4 py-3 border-b ${theme.border}`}>
                            <MessageSquare className={`w-5 h-5 ${theme.text}`} />
                            <h2 className="text-white font-semibold">Chat with {mentor}</h2>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                                ? `bg-${theme.primary}-600 text-white`
                                                : 'bg-gray-800 text-gray-200'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isSendingChat && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-800 rounded-2xl px-4 py-3">
                                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-gray-800">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                    placeholder={`Ask ${mentor} for help...`}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
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

                {/* Middle Column - Code Editor */}
                <div className="col-span-5 flex flex-col bg-gray-950">
                    {/* Challenge Description */}
                    <div className={`p-4 border-b ${theme.border} bg-gray-900/30`}>
                        <h3 className="text-white font-semibold mb-2">{mockChallenge.title}</h3>
                        <p className="text-gray-400 text-sm whitespace-pre-line">{mockChallenge.description}</p>
                    </div>

                    {/* Editor Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50">
                        <div className="flex items-center gap-4">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'python' | 'sql')}
                                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
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
                            Run Code
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

                {/* Right Column - Output & Feedback */}
                <div className={`col-span-4 border-l ${theme.border} flex flex-col bg-gray-900/30`}>
                    {/* Output Section */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                            <Terminal className="w-5 h-5 text-gray-500" />
                            <h2 className="text-white font-semibold">Output</h2>
                        </div>

                        <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                            {output ? (
                                <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
                            ) : (
                                <p className="text-gray-600">Run your code to see output here...</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className={`border-t ${theme.border} p-4`}>
                        <button
                            onClick={handleSubmit}
                            disabled={isGrading}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${theme.button} text-white font-semibold transition-all disabled:opacity-50`}
                        >
                            {isGrading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    AI is grading...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Submit for AI Grading
                                </>
                            )}
                        </button>
                    </div>

                    {/* Grade Card */}
                    <AnimatePresence>
                        {gradeResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className={`border-t ${theme.border} p-4 max-h-[50%] overflow-y-auto`}
                            >
                                {/* Score Header */}
                                <div className={`flex items-center justify-between p-4 rounded-xl mb-4 ${gradeResult.passed
                                        ? 'bg-green-500/10 border border-green-500/20'
                                        : 'bg-red-500/10 border border-red-500/20'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        {gradeResult.passed ? (
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        ) : (
                                            <XCircle className="w-8 h-8 text-red-500" />
                                        )}
                                        <div>
                                            <div className={`text-lg font-bold ${gradeResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                                                {gradeResult.passed ? 'Passed!' : 'Not Yet'}
                                            </div>
                                            <div className="text-sm text-gray-400">Minimum: 70 points</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-bold text-white">{gradeResult.score}</div>
                                        <div className="text-sm text-gray-500">/ 100</div>
                                    </div>
                                </div>

                                {/* Criteria Breakdown */}
                                <div className="space-y-3 mb-4">
                                    <h4 className="text-white font-semibold text-sm">Score Breakdown</h4>
                                    {[
                                        { label: 'Correctness', value: gradeResult.criteria.correctness, max: 40, icon: Target },
                                        { label: 'Efficiency', value: gradeResult.criteria.efficiency, max: 25, icon: Zap },
                                        { label: 'Style', value: gradeResult.criteria.style, max: 15, icon: Code2 },
                                        { label: 'Business Insight', value: gradeResult.criteria.business_insight, max: 20, icon: Lightbulb },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4 text-gray-500" />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-400">{item.label}</span>
                                                    <span className="text-white">{item.value}/{item.max}</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
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
                                    <div className="p-3 rounded-lg bg-gray-800/50">
                                        <h4 className="text-white font-semibold text-sm mb-2">AI Feedback</h4>
                                        <p className="text-gray-300 text-sm">{gradeResult.feedback_text}</p>
                                    </div>

                                    {/* Strengths */}
                                    <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                                        <h4 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Strengths
                                        </h4>
                                        <ul className="space-y-1">
                                            {gradeResult.strengths.map((s, i) => (
                                                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                                    <span className="text-green-500 mt-1">•</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Improvements */}
                                    <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                                        <h4 className="text-yellow-400 font-semibold text-sm mb-2 flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4" />
                                            Improvements
                                        </h4>
                                        <ul className="space-y-1">
                                            {gradeResult.improvements.map((s, i) => (
                                                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
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
