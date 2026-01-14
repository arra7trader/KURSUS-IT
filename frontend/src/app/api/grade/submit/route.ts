import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_MODEL = 'llama-3.1-70b-versatile';

const GRADING_SYSTEM_PROMPT = `Kamu adalah code reviewer expert untuk platform edukasi Data Analytics dan Data Science.

Tugasmu adalah mengevaluasi code submission murid berdasarkan 4 kriteria:

1. CORRECTNESS / KEBENARAN (0-40 poin): Apakah code menghasilkan output yang benar?
2. EFFICIENCY / EFISIENSI (0-25 poin): Apakah code sudah optimal?
3. STYLE / GAYA PENULISAN (0-15 poin): Apakah code readable dan rapi?
4. BUSINESS INSIGHT / PEMAHAMAN BISNIS (0-20 poin): Apakah code menunjukkan pemahaman bisnis?

Kamu HARUS mengembalikan JSON object dengan struktur:
{
  "score": <total_skor_0_sampai_100>,
  "criteria": {
    "correctness": <0-40>,
    "efficiency": <0-25>,
    "style": <0-15>,
    "business_insight": <0-20>
  },
  "feedback_text": "<feedback dalam bahasa Indonesia yang friendly/santai>",
  "strengths": ["<kelebihan1>", "<kelebihan2>"],
  "improvements": ["<saran1>", "<saran2>"],
  "passed": <true kalau score >= passing_threshold>
}

Berikan feedback yang encouraging tapi jujur. Pakai bahasa Indonesia yang santai.`;

export async function POST(req: NextRequest) {
    try {
        const {
            code,
            challengeTitle,
            challengeDescription,
            language,
            difficulty = 1,
            passingScore = 70,
        } = await req.json();

        // Validate
        if (!code || !language) {
            return NextResponse.json(
                { error: 'Code dan language required' },
                { status: 400 }
            );
        }

        // Create prompt
        const prompt = ChatPromptTemplate.fromMessages([
            ['system', GRADING_SYSTEM_PROMPT],
            [
                'human',
                `INFO CHALLENGE:
- Judul: {title}
- Deskripsi: {description}
- Bahasa: {language}
- Difficulty: {difficulty}/5
- Skor Minimum: {passingScore}

CODE YANG DISUBMIT:
\`\`\`{language}
{code}
\`\`\`

Tolong evaluasi submission ini.`,
            ],
        ]);

        // Create LLM with JSON output
        const llm = new ChatGroq({
            modelName: GROQ_MODEL,
            temperature: 0.2, // Low for consistent grading
            apiKey: GROQ_API_KEY,
        });

        const parser = new JsonOutputParser();
        const chain = prompt.pipe(llm).pipe(parser);

        // Get grading result
        const result = await chain.invoke({
            title: challengeTitle || 'Coding Challenge',
            description: challengeDescription || 'Selesaikan challenge sesuai instruksi',
            language,
            difficulty,
            passingScore,
            code,
        });

        // Ensure passed is calculated correctly
        result.passed = result.score >= passingScore;

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error in grading API:', error);
        return NextResponse.json(
            { error: 'Gagal melakukan grading', details: error.message },
            { status: 500 }
        );
    }
}
