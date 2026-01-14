import { analystTopics, scientistTopics } from './topics';

// Levels 1-5: Now using AI-Generated Content but with specific Titles/Topics
const baseCurricula: any = {
    'level-1': {
        analyst: {
            title: 'Dasar-dasar SQL: Menguasai SELECT Query',
            isGenerated: true,
            topic: 'SQL SELECT Statement, Filtering (WHERE), Sorting (ORDER BY), and Limits. Deep Dive into Relational Algebra concepts.',
            sections: [], // AI will fill this
            challenge: {
                title: 'Data Retrieval Foundation',
                description: `Tulis query SQL untuk mengambil data customer yang valid dan mengurutkannya.\n\nFokus:\n1. Filter data\n2. Sorting result`,
                starterCode: `-- Tulis query SQL kamu di sini\nSELECT * FROM customers WHERE ...`,
                expectedOutput: `Query berhasil dijalankan`,
                validation: { requiredKeywords: ['SELECT', 'FROM', 'WHERE'], forbiddenKeywords: ['DELETE', 'DROP'], minLines: 1 }
            }
        },
        scientist: {
            title: 'SQL untuk Data Science: Deep Dive',
            isGenerated: true,
            topic: 'SQL Data Retrieval & Filtering with a focus on Data Science datasets and performance.',
            sections: [], // AI will fill this
            challenge: {
                title: 'Data Retrieval for ML',
                description: `Ambil sample data untuk training model.`,
                starterCode: `-- Tulis query SQL kamu di sini\n`,
                expectedOutput: `Query berhasil dijalankan`,
                validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: ['DELETE'], minLines: 1 }
            }
        },
    },
    'level-2': {
        analyst: {
            title: 'Level 2: Advanced JOIN & Reporting',
            isGenerated: true,
            topic: 'SQL Joins (INNER, LEFT, RIGHT, FULL) and reporting strategies.',
            sections: [],
            challenge: { title: 'Laporan Penjualan', description: 'Buat laporan penjualan.', starterCode: 'SELECT ...', expectedOutput: 'Success', validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: [], minLines: 1 } }
        },
        scientist: {
            title: 'Level 2: Data Pipelines & Cleaning',
            isGenerated: true,
            topic: 'Building Data Pipelines, Handling Missing Values, and Data Cleaning for ML.',
            sections: [],
            challenge: { title: 'Pipeline Cleaning', description: 'Bersihkan data.', starterCode: 'SELECT ...', expectedOutput: 'Success', validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: [], minLines: 1 } }
        }
    },
    'level-3': {
        analyst: {
            title: 'Level 3: Window Functions',
            isGenerated: true,
            topic: 'Advanced Window Functions (RANK, DENSE_RANK, LEAD, LAG) for Analytic Queries.',
            sections: [],
            challenge: { title: 'Window Analysis', description: 'Gunakan Window Function.', starterCode: 'SELECT ... OVER ...', expectedOutput: 'Success', validation: { requiredKeywords: ['OVER'], forbiddenKeywords: [], minLines: 1 } }
        },
        scientist: {
            title: 'Level 3: Feature Engineering',
            isGenerated: true,
            topic: 'Feature Engineering directly within SQL (Rolling Averages, Cumulative Sums).',
            sections: [],
            challenge: { title: 'Feature Eng', description: 'Buat fitur baru.', starterCode: 'SELECT ...', expectedOutput: 'Success', validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: [], minLines: 1 } }
        }
    },
    'level-4': {
        analyst: {
            title: 'Level 4: CTE & Subqueries',
            isGenerated: true,
            topic: 'Common Table Expressions (CTE) and Recursive Queries for solving complex business problems.',
            sections: [],
            challenge: { title: 'CTE Analysis', description: 'Gunakan CTE.', starterCode: 'WITH ...', expectedOutput: 'Success', validation: { requiredKeywords: ['WITH'], forbiddenKeywords: [], minLines: 1 } }
        },
        scientist: {
            title: 'Level 4: Data Prep Pipelines',
            isGenerated: true,
            topic: 'Complex Data Preparation Steps for Machine Learning Models using SQL.',
            sections: [],
            challenge: { title: 'Data Prep', description: 'Siapkan data.', starterCode: 'SELECT ...', expectedOutput: 'Success', validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: [], minLines: 1 } }
        }
    },
    'level-5': {
        analyst: {
            title: 'Level 5: Data Validation',
            isGenerated: true,
            topic: 'Data Quality Assurance, Validation Techniques, and CASE Statements.',
            sections: [],
            challenge: { title: 'Data QA', description: 'Validasi data.', starterCode: 'SELECT CASE ...', expectedOutput: 'Success', validation: { requiredKeywords: ['CASE'], forbiddenKeywords: [], minLines: 1 } }
        },
        scientist: {
            title: 'Level 5: Outlier Detection',
            isGenerated: true,
            topic: 'Statistical Outlier Detection (Z-Score, IQR) using SQL.',
            sections: [],
            challenge: { title: 'Outlier Detection', description: 'Detect outliers.', starterCode: 'SELECT ...', expectedOutput: 'Success', validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: [], minLines: 1 } }
        }
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
        title: `Level ${levelNum}: ${topic}`,
        isGenerated: true,
        topic: topic,
        sections: [],
        challenge: {
            title: `Tantangan: ${topic}`,
            description: `Selesaikan masalah bisnis berikut menggunakan konsep ${topic}.`,
            starterCode: `-- Query ${topic}\nSELECT ...`,
            expectedOutput: `Analisis ${topic} selesai.`,
            validation: { requiredKeywords: ['SELECT'], forbiddenKeywords: ['DROP'], minLines: 1 }
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
        isGenerated: true,
        topic: topic,
        sections: [],
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
