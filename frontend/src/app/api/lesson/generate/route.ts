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
                            "content": `Kamu adalah Dosen Expert yang mengajar dengan gaya santai tapi profesional. Ajarkan topik "${topic}" untuk track "${track}" (Level ${level}).

ATURAN PENULISAN:
1. Gunakan Bahasa Indonesia sehari-hari yang natural dan enak dibaca
2. Buat penjelasan dengan analogi atau contoh kehidupan nyata
3. Hindari bahasa formal yang kaku - tulis seperti sedang ngobrol dengan mahasiswa
4. Gunakan emoji sesekali untuk membuat lebih engaging (📊, 💡, ⚡, dll)
5. Buat paragraf pendek (2-3 kalimat) agar mudah dibaca
6. Sertakan code example yang lengkap dan ada komentar penjelasannya
7. Struktur: Teori → Implementasi → Aplikasi Nyata

Format response HANYA JSON (tanpa teks lain):
{
  "sections": [
    { 
      "heading": "🎯 Konsep Dasar", 
      "content": "Penjelasan teori dengan analogi mudah dipahami. Jelaskan 'kenapa' konsep ini penting dan 'gimana' cara kerjanya. Gunakan bahasa santai.", 
      "code": "-- Code example dengan komentar\nSELECT * FROM table; -- Penjelasan singkat" 
    },
    { 
      "heading": "💻 Implementasi Praktis", 
      "content": "Panduan step-by-step cara pakai. Kasih tips & tricks yang berguna.", 
      "code": "-- Code example lengkap dengan best practice" 
    },
    { 
      "heading": "🚀 Studi Kasus Real", 
      "content": "Aplikasi di dunia nyata dengan skenario bisnis konkret. Jelaskan value-nya untuk pekerjaan.", 
      "code": "-- Advanced example untuk production" 
    }
  ]
}

PENTING: Output HARUS valid JSON, tidak ada markdown atau teks tambahan!`
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
