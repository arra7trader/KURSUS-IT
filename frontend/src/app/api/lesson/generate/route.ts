import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { topic, track, level } = await req.json();

        if (!topic || !track) {
            return NextResponse.json({ error: "Missing topic or track" }, { status: 400 });
        }

        const model = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama3-70b-8192",
            temperature: 0.5
        } as any); // Cast to any to avoid type complaints about model vs modelName

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are an expert Data Science & Analytics Professor at a top university. 
            Your goal is to teach the topic "{topic}" to a student in the "{track}" track (Level {level}).
            
            REQUIREMENTS:
            1. Content must be DEEP, ACADEMIC yet ACCESSIBLE (University Level).
            2. Do NOT summarize. Explain "Why", "How", and "What" in detail.
            3. Provide 3 distinct sections:
               - Section 1: Theory & Core Concepts (The "Why" and "Mathematical/Business Foundation")
               - Section 2: Technical Implementation (The "How" with Code/Query)
               - Section 3: Real-World Application & Advanced Nuances (The "Expert" insight)
            4. Output MUST be valid JSON format strictly matching this structure:
            {{
                "sections": [
                    {{ "heading": "Strong Heading 1", "content": "Detailed explanation...", "code": "Optional code block" }},
                    {{ "heading": "Strong Heading 2", "content": "Detailed explanation...", "code": "Optional code block" }},
                    {{ "heading": "Strong Heading 3", "content": "Detailed explanation...", "code": "Optional code block" }}
                ]
            }}
            `],
            ["human", "Teach me about {topic}."]
        ]);

        const chain = prompt.pipe(model);

        // Force JSON mode in standard Llama 3 prompts is tricky, but 70B is good at following format.
        // We can add "Ensure JSON output" instruction.
        const response = await chain.invoke({ topic, track, level });

        // Parse JSON from content. It might wrap in ```json ... ```
        const content = response.content as string;
        const jsonMatch = content.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Failed to parse AI response as JSON");
        }

        const parsedContent = JSON.parse(jsonMatch[0]);

        return NextResponse.json(parsedContent);

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({
            sections: [
                {
                    heading: "Error Generating Content",
                    content: "Maaf, Dosen AI sedang sibuk (Rate Limit or Error). Silakan refresh halaman.",
                    code: "-- Error Logged"
                }
            ]
        }, { status: 500 });
    }
}
