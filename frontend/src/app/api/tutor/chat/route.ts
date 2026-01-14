import { ChatGroq } from 'langchain-groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_MODEL = 'llama-3.1-70b-versatile';

const PERSONA_PROMPTS = {
    RENDY: `Kamu adalah Rendy, mentor AI yang asyik dan sant AI tapi tetap profesional. Spesialisasi: Data Analytics.

Filosofi lo: "Data cuma berguna kalau bisa bikin duit atau hemat waktu."

Gaya Bicara:
- Santai kayak ngobrol sama temen, pakai "lo/gue" atau "kamu/aku"
- Ekspresi: "Nah gini nih...", "Mantap!", "Gas terus!", "Oke fix"
- Muji: "Keren banget!", "Nailed it!"
- Kritik: "Hmm ini agak kurang tepat nih..."

Cara Ngajar:
SQL → Selalu hubungin sama bisnis, kritik query lemot
Visualisasi → Setiap chart harus jawab pertanyaan bisnis
Code Review → Bener tapi lemot? Kritik. Bener tapi berantakan? Suruh rapiin.

Inget: Lo ngajarin cara bikin duit pake data! 💰`,

    ABDUL: `Kamu adalah Abdul, mentor AI yang smart tapi tetap asik. Spesialisasi: Data Science & ML.

Filosofi lo: "Pahami matematika di balik algoritmanya."

Gaya Bicara:
- Indonesia santai tapi tetap ada nuansa akademis
- "Nah, coba kita pikirin bareng...", "Interesting nih!", "Oke jadi gini logikanya..."
- Muji: "Mantap! Lo udah mulai ngerti fundamentalnya"
- Jelasin math: "Jangan takut sama rumusnya, basically ini cuma..."

Cara Ngajar:
ML/AI → Mulai dari intuisi dulu, baru rumus
Algorithm → WAJIB kasih Big O complexity
Code Review → Gak efisien? Jelasin complexity-nya

Inget: Lo training scientist, bukan script kiddies. Understanding > Memorization! 🧠`,
};

export async function POST(req: NextRequest) {
    try {
        const { message, persona, context, history } = await req.json();

        // Validate
        if (!message || !persona) {
            return NextResponse.json(
                { error: 'Message dan persona required' },
                { status: 400 }
            );
        }

        // Get system prompt
        const systemPrompt = PERSONA_PROMPTS[persona as 'RENDY' | 'ABDUL'] || PERSONA_PROMPTS.RENDY;

        // Build context
        let fullPrompt = systemPrompt;
        if (context) {
            fullPrompt += `\n\nKONTEKS SAAT INI:\n${context}`;
        }
        if (history && history.length > 0) {
            const historyText = history
                .slice(-5)
                .map((msg: any) => `${msg.role === 'user' ? 'Murid' : 'Mentor'}: ${msg.content}`)
                .join('\n');
            fullPrompt += `\n\nPERCAKAPAN SEBELUMNYA:\n${historyText}`;
        }

        // Create LLM chain
        const llm = new ChatGroq({
            modelName: GROQ_MODEL,
            temperature: 0.7,
            apiKey: GROQ_API_KEY,
        });

        const prompt = ChatPromptTemplate.fromMessages([
            ['system', fullPrompt],
            ['human', '{input}'],
        ]);

        const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        // Get response
        const response = await chain.invoke({ input: message });

        return NextResponse.json({
            persona,
            message: response,
            suggestions: null,
        });
    } catch (error: any) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: 'Gagal dapat response dari AI', details: error.message },
            { status: 500 }
        );
    }
}
