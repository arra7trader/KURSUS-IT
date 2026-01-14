import { NextResponse } from "next/server";

// List of free models to try in order of preference
const FREE_MODELS = [
    "meta/llama-3-3-70b-instruct:free",      // Meta Llama 3.3 70B
    "google/gemma-3-27b:free",                // Google Gemma 3 27B
    "mistral/devstral-2-2512:free",          // Mistral Devstral
    "deepseek/r1-0528:free",                 // DeepSeek R1
];

export async function POST(req: Request) {
    try {
        const { topic, track, level } = await req.json();

        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json({
                error: "No OPENROUTER_API_KEY found in environment"
            }, { status: 500 });
        }

        // Try each model until one works
        let lastError = "";

        for (const modelId of FREE_MODELS) {
            console.log(`🔄 Trying model: ${modelId}`);

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
                        "model": modelId,
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
                    console.warn(`⚠️ Model ${modelId} failed:`, response.status, errorText);
                    lastError = `${modelId}: ${errorText.substring(0, 100)}`;
                    continue; // Try next model
                }

                const data = await response.json();
                console.log(`✅ Model ${modelId} succeeded!`);

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
                    console.warn(`⚠️ Invalid response structure from ${modelId}`);
                    lastError = `${modelId}: Invalid response structure`;
                    continue;
                }
            } catch (e: any) {
                console.error(`❌ Exception with model ${modelId}:`, e.message);
                lastError = `${modelId}: ${e.message}`;
                continue;
            }
        }

        // If all models failed
        return NextResponse.json({
            error: `All models failed. Last error: ${lastError}`
        }, { status: 500 });

    } catch (error: any) {
        console.error("❌ AI Gen Error:", error);
        return NextResponse.json({
            error: `Server Error: ${error.message}`
        }, { status: 500 });
    }
}
