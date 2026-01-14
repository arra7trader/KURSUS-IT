import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { topic, track, level } = await req.json();

        // Use OpenRouter if available
        if (process.env.OPENROUTER_API_KEY) {
            console.log("Using OpenRouter for generation...");
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://data-academy.vercel.app",
                        "X-Title": "Data Academy"
                    },
                    body: JSON.stringify({
                        "model": "meta-llama/llama-3-8b-instruct:free", // Free tier model
                        "messages": [
                            {
                                "role": "system",
                                "content": `You are an expert Professor (Dosen). Teach "${topic}" for "${track}" (Level ${level}).
                                
                                RULES:
                                1. Language: INDONESIAN (Bahasa Indonesia).
                                2. Create 3 Detailed Sections.
                                3. Output Valid JSON ONLY. Structure: { "sections": [{ "heading": "...", "content": "...", "code": "..." }] }`
                            },
                            {
                                "role": "user",
                                "content": `Jelaskan materi "${topic}" secara mendalam (Level Universitas).`
                            }
                        ]
                    })
                });

                if (!response.ok) {
                    const err = await response.text();
                    console.error("OpenRouter API Error:", err);
                    throw new Error("OpenRouter Failed: " + response.statusText);
                }

                const data = await response.json();
                if (data.choices && data.choices[0]) {
                    const content = data.choices[0].message.content;
                    // Extract JSON
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        return NextResponse.json(JSON.parse(jsonMatch[0]));
                    } else {
                        // Fallback if AI fails to output JSON
                        return NextResponse.json({
                            sections: [
                                { heading: "Penjelasan", content: content, code: "" }
                            ]
                        });
                    }
                }
            } catch (e) {
                console.error("OpenRouter Error", e);
                return NextResponse.json({ error: "OpenRouter Failed" }, { status: 500 });
            }
        }

        return NextResponse.json({ error: "No API Key" }, { status: 500 });

    } catch (error) {
        console.error("AI Gen Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
