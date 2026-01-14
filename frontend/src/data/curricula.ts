import { analystTopics, scientistTopics } from './topics';

// Basic Levels 1-5 (High Quality Manual Content)
const baseCurricula: any = {
    'level-1': {
        analyst: {
            title: 'Dasar-dasar SQL: Menguasai SELECT Query',
            isGenerated: true,
            topic: 'SQL SELECT Statement & Fundamentals',
            sections: [], // AI will fill this
            challenge: {
                title: 'Query Data Customer',
                description: `Tulis query SQL untuk menemukan 5 customer teratas berdasarkan total nilai order.\n1. Join tabel customers dan orders\n2. Hitung total nilai order\n3. Urutkan descending`,
                starterCode: `-- Tulis query SQL kamu di sini\nSELECT \n  c.customer_name,\n  -- Hitung total nilai order\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\n-- Tambahkan logika di sini\n`,
                expectedOutput: `Query berhasil dijalankan`,
                validation: {
                    requiredKeywords: ['SELECT'],
                    forbiddenKeywords: ['DELETE', 'DROP'],
                    minLines: 4
                }
            }
        },
        scientist: {
            title: 'SQL untuk Data Science: Deep Dive',
            isGenerated: true,
            topic: 'SQL Data Retrieval & Filtering for Data Science',
            sections: [], // AI will fill this
            challenge: {
                title: 'Query Data Customer',
                description: `Tulis query SQL untuk menemukan 5 customer teratas berdasarkan total nilai order.`,
                starterCode: `-- Tulis query SQL kamu di sini`,
                expectedOutput: `Query berhasil dijalankan`,
                validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: ['DELETE'], minLines: 4 }
            }
        },
    },
    'level-2': {
        // We will generate Level 2-5 dynamically too, keeping titles.
        'level-2': {
            analyst: {
                title: 'Level 2: Advanced JOIN & Reporting',
                isGenerated: true,
                topic: 'Advanced SQL Joins (LEFT, RIGHT, FULL) & Reporting',
                sections: [],
                challenge: { title: 'Laporan Penjualan', description: 'Buat laporan penjualan.', starterCode: 'SELECT ...', expectedOutput: 'Success', validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: [], minLines: 1 } }
            },
            scientist: {
                title: 'Level 2: Data Pipelines & Cleaning',
                isGenerated: true,
                topic: 'Data Pipelines, Cleaning & Missing Value Handling',
                sections: [], // AI Fill
                challenge: { title: 'Pipeline Cleaning', description: 'Bersihkan data.', starterCode: 'SELECT ...', expectedOutput: 'Success', validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: [], minLines: 1 } }
            }
        },
        'level-3': {
            analyst: { title: 'Level 3: Window Functions', isGenerated: true, topic: 'Advanced Window Functions (RANK, LEAD, LAG)', sections: [], challenge: { title: 'Window Func', description: '.', starterCode: '', expectedOutput: '', validation: { requiredKeywords: [], forbiddenKeywords: [], minLines: 0 } } },
            scientist: { title: 'Level 3: Feature Engineering', isGenerated: true, topic: 'Feature Engineering within SQL', sections: [], challenge: { title: 'Feature Eng', description: '.', starterCode: '', expectedOutput: '', validation: { requiredKeywords: [], forbiddenKeywords: [], minLines: 0 } } }
        },
        'level-4': {
            analyst: { title: 'Level 4: CTE & Subqueries', isGenerated: true, topic: 'Common Table Expressions (CTE) & Complex Subqueries', sections: [], challenge: { title: 'Analysis with CTE', description: '.', starterCode: '', expectedOutput: '', validation: { requiredKeywords: [], forbiddenKeywords: [], minLines: 0 } } },
            scientist: { title: 'Level 4: Data Prep Pipelines', isGenerated: true, topic: 'Complex Data Preparation Pipelines for ML', sections: [], challenge: { title: 'Prep Pipeline', description: '.', starterCode: '', expectedOutput: '', validation: { requiredKeywords: [], forbiddenKeywords: [], minLines: 0 } } }
        },
        'level-5': {
            analyst: { title: 'Level 5: Data Validation', isGenerated: true, topic: 'Data Validation & Case Statements', sections: [], challenge: { title: 'Validation', description: '.', starterCode: '', expectedOutput: '', validation: { requiredKeywords: [], forbiddenKeywords: [], minLines: 0 } } },
            scientist: { title: 'Level 5: Outlier Detection', isGenerated: true, topic: 'Statistical Outlier Detection in SQL', sections: [], challenge: { title: 'Outliers', description: '.', starterCode: '', expectedOutput: '', validation: { requiredKeywords: [], forbiddenKeywords: [], minLines: 0 } } }
        },
    };

    // Generating Levels 6-100
    const generatedCurricula: any = {};

    // Generate Analyst Levels (6-100)
    analystTopics.forEach((topic, index) => {
        const levelNum = index + 6;
        const levelKey = `level-${levelNum}`;

        if (!generatedCurricula[levelKey]) generatedCurricula[levelKey] = {};

        generatedCurricula[levelKey].analyst = {
            isGenerated: true,
            topic: topic, // Pass topic for AI prompt
            title: `Level ${levelNum}: ${topic}`,
            sections: [
                {
                    heading: `Pengantar ${topic}`,
                    content: `Di Level ${levelNum} ini, kita akan mempelajari ${topic} secara mendalam. Topik ini dipilih khusus untuk memperkuat skill Data Analytics anda.`,
                },
                {
                    heading: 'Konsep Bisnis & Teknis',
                    content: `Sebagai Analyst, pemahaman ${topic} membantu dalam pengambilan keputusan bisnis yang lebih akurat.`,
                    code: `-- Contoh query untuk analisis ${topic}\nSELECT * FROM analysis_table WHERE type = '${topic}';`
                },
                {
                    heading: 'Implementasi Nyata',
                    content: `Studi kasus: Bagaimana perusahaan Unicorn menggunakan ${topic} untuk efisiensi.`
                }
            ],
            challenge: {
                title: `Tantangan: ${topic}`,
                description: `Selesaikan masalah bisnis berikut menggunakan konsep ${topic}.\n\n1. Pahami kebutuhan user\n2. Gunakan query yang efisien\n3. Sajikan data yang relevan`,
                starterCode: `-- Query ${topic}\nSELECT ...`,
                expectedOutput: `Analisis ${topic} selesai.`,
                validation: {
                    requiredKeywords: ['SELECT'],
                    forbiddenKeywords: ['DROP'],
                    minLines: 1
                }
            }
        };
    });

    // Generate Scientist Levels (6-100)
    scientistTopics.forEach((topic, index) => {
        const levelNum = index + 6;
        const levelKey = `level-${levelNum}`;

        if (!generatedCurricula[levelKey]) generatedCurricula[levelKey] = {};

        generatedCurricula[levelKey].scientist = {
            title: `Level ${levelNum}: ${topic}`,
            sections: [
                {
                    heading: `Konsep Dasar ${topic}`,
                    content: `Dalam Data Science, ${topic} adalah fondasi penting. Kita akan membedah matematikanya dan implementasi codenya.`,
                },
                {
                    heading: 'Algoritma & Logika',
                    content: `Pelajari bagaimana ${topic} bekerja di balik layar.`,
                    code: `# Contoh pseudo-code Python untuk ${topic}\ndef ${topic.toLowerCase().replace(/ /g, '_')}():\n    pass`
                },
                {
                    heading: 'Aplikasi AI/ML',
                    content: `Bagaimana ${topic} digunakan dalam model State-of-the-Art saat ini.`
                }
            ],
            challenge: {
                title: `Lab: ${topic}`,
                description: `Implementasikan algoritma atau logika untuk ${topic}.`,
                starterCode: `# Scientist Algorithm\n# ...`,
                expectedOutput: `Model Converged`,
                validation: { requiredKeywords: [], forbiddenKeywords: [], minLines: 1 }
            }
        };
    });

    export const curricula = {
        ...baseCurricula,
        ...generatedCurricula
    };
