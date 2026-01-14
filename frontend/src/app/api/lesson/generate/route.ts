import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { topic, track, level } = await req.json();

        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json({
                error: "No OPENROUTER_API_KEY found in environment"
            }, { status: 500 });
        }

        console.log(`🔄 Generating lesson for: ${topic}`);

        try {
            // Use OpenRouter's automatic free model routing
            // This uses their intelligent routing to find available free models
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://data-academy.vercel.app",
                    "X-Title": "Data Academy"
                },
                body: JSON.stringify({
                    "model": "openrouter/auto", // Auto-select cheapest/free available model
                    "route": "fallback", // Use fallback routing
                    "messages": [
                        {
                            "role": "user",
                            "content": `Kamu adalah Dosen Expert. Ajarkan topik "${topic}" untuk track "${track}" (Level ${level}) dalam Bahasa Indonesia.

Format response sebagai JSON dengan struktur ini:
{
  "sections": [
    { "heading": "Teori & Konsep", "content": "Penjelasan mendalam...", "code": "contoh code jika ada" },
    { "heading": "Implementasi", "content": "Cara praktis...", "code": "code example" },
    { "heading": "Aplikasi Nyata", "content": "Use case dunia nyata...", "code": "advanced code" }
  ]
}

Pastikan output HANYA JSON, tanpa teks tambahan.`
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ OpenRouter Error:`, response.status, errorText);

                return NextResponse.json({
                    error: `OpenRouter Error (${response.status}): ${errorText.substring(0, 200)}`
                }, { status: 500 });
            }

            const data = await response.json();
            console.log(`✅ OpenRouter Response received`);

            if (data.choices && data.choices[0]) {
                const content = data.choices[0].message.content;
                // Extract JSON
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    console.log("✅ JSON Parsed Successfully");
                    return NextResponse.json(parsed);
                } else {
                    console.warn("⚠️ No JSON found, returning raw content");
                    return NextResponse.json({
                        sections: [
                            {
                                heading: "Materi",
                                content: content,
                                code: ""
                            }
                        ]
                    });
                }
            } else {
                return NextResponse.json({
                    error: "Invalid OpenRouter response structure"
                }, { status: 500 });
            }
        } catch (e: any) {
            console.error(`❌ OpenRouter Exception:`, e.message);
            return NextResponse.json({
                error: `OpenRouter Failed: ${e.message}`
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("❌ AI Gen Error:", error);
        return NextResponse.json({
            error: `Server Error: ${error.message}`
        }, { status: 500 });
    }
}
