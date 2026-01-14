// Basic Levels 1-5 (High Quality Manual Content)
const baseCurricula: any = {
    'level-1': {
        analyst: {
            title: 'Dasar-dasar SQL: Menguasai SELECT Query',
            sections: [
                {
                    heading: 'Kurikulum Pembelajaran',
                    content: 'Selamat datang di Level 1! Di sini kamu akan belajar fondasi utama SQL.\n\nFokus kita hari ini:\n1. Mengambil data (SELECT)\n2. Memfilter data (WHERE)\n3. Mengurutkan data (ORDER BY)\n4. Membatasi hasil (LIMIT)\n5. Menggabungkan data (JOIN)',
                },
                {
                    heading: '1. Mengambil Data (The Art of SELECT)',
                    content: 'SELECT adalah senjata utamamu. Jangan pakai `SELECT *` di production.\n\nKenapa?\n- Boros bandwidth\n- Bikin query lambat\n- Susah dibaca',
                    code: 'SELECT order_id, order_date FROM orders;',
                },
                {
                    heading: '2. Memfilter Data (WHERE)',
                    content: 'Gunakan WHERE untuk filter data yang relevan.',
                    code: "SELECT * FROM customers WHERE city = 'Jakarta';",
                },
                {
                    heading: '3. Menggabungkan Tabel (JOIN)',
                    content: 'INNER JOIN hanya mengambil data yang ada di kedua tabel.',
                    code: `SELECT c.name, o.amount 
FROM customers c 
JOIN orders o ON c.id = o.customer_id;`,
                },
                {
                    heading: 'Studi Kasus: RFM Analysis',
                    content: 'Menghitung total belanja customer (Monetary).',
                    code: `SELECT customer_name, SUM(amount) 
FROM orders 
GROUP BY customer_name 
ORDER BY 2 DESC 
LIMIT 5;`,
                },
            ],
        },
        scientist: {
            title: 'SQL untuk Data Science: Deep Dive',
            sections: [
                {
                    heading: 'Kurikulum: Data Retrieval',
                    content: 'Modul ini mencakup:\n1. Anatomi & Eksekusi Query\n2. Filtering & Indexing\n3. Sampling untuk ML',
                },
                {
                    heading: '1. Anatomi & Eksekusi Query',
                    content: 'Urutan eksekusi: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.',
                    code: `SELECT category, AVG(price)
FROM products
WHERE stock > 0
GROUP BY category;`,
                },
                {
                    heading: '2. Optimization (Big O)',
                    content: 'Index Scan O(log n) vs Full Table Scan O(n). Selalu cek kolom di WHERE clause.',
                },
                {
                    heading: '3. Sampling Data',
                    content: 'Ambil sampel acak untuk training model cepat.',
                    code: 'SELECT * FROM data ORDER BY RANDOM() LIMIT 1000;',
                },
            ],
        },
        challenge: {
            title: 'Query Data Customer',
            description: `Tulis query SQL untuk menemukan 5 customer teratas berdasarkan total nilai order.
1. Join tabel customers dan orders
2. Hitung total nilai order
3. Urutkan descending`,
            starterCode: `-- Tulis query SQL kamu di sini
SELECT 
  c.customer_name,
  -- Hitung total nilai order
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
-- Tambahkan logika di sini
`,
            expectedOutput: `Query berhasil dijalankan

┌────────────────────┬──────────────┐
│ customer_name      │ total_value  │
├────────────────────┼──────────────┤
│ Acme Corporation   │ Rp125.450    │
│ Tech Solutions     │ Rp98.230     │
│ Global Industries  │ Rp87.100     │
│ Prime Retail       │ Rp72.890     │
│ Metro Services     │ Rp65.420     │
└────────────────────┴──────────────┘

5 rows returned`,
        },
    },
    'level-2': {
        analyst: {
            title: 'Level 2: Advanced JOIN & Reporting',
            sections: [
                {
                    heading: 'Kurikulum Level 2',
                    content: 'Selamat di Level 2! Sekarang kita akan masuk ke teknik reporting yang lebih dalam.\n\nFokus:\n1. LEFT vs RIGHT JOIN\n2. Advanced Aggregation (COUNT, AVG, MIN, MAX)\n3. Filtering Agregasi (HAVING)\n4. Membuat Laporan Bulanan',
                },
                {
                    heading: '1. Jenis-jenis JOIN',
                    content: '• INNER JOIN: Irisan (Data harus ada di kedua tabel)\n• LEFT JOIN: Semua data di KIRI, data KANAN null jika tidak cocok.\n\nKapan pakai LEFT JOIN? Saat mau lihat customer yang BELUM pernah order.',
                    code: `SELECT c.name, o.order_id 
FROM customers c 
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.order_id IS NULL; -- Customer tanpa order`,
                },
                {
                    heading: '2. Menganalis Data dengan GROUP BY',
                    content: 'GROUP BY mengelompokkan baris yang memiliki nilai sama. Wajib dipakai jika menggunakan fungsi agregasi (SUM, COUNT).',
                    code: `SELECT city, COUNT(*) as user_count 
FROM users 
GROUP BY city;`,
                },
                {
                    heading: '3. Filter Setelah Agregasi (HAVING)',
                    content: 'WHERE tidak bisa dipakai untuk hasil agregasi. Gunakan HAVING.\n\nSalah: WHERE count(*) > 5\nBenar: HAVING count(*) > 5',
                    code: `SELECT category, AVG(price) 
FROM products 
GROUP BY category 
HAVING AVG(price) > 100000;`,
                },
            ],
        },
        scientist: {
            title: 'Level 2: Data Pipelines & Cleaning',
            sections: [
                {
                    heading: 'Data Pipelines',
                    content: 'Di level ini kita belajar membangun pipeline data bersih untuk dimakan model ML.',
                },
                {
                    heading: '1. Handling Missing Values',
                    content: 'Gunakan COALESCE untuk mengisi NULL values secara on-the-fly.',
                    code: `SELECT id, COALESCE(phone, 'No Phone') FROM users;`,
                },
                {
                    heading: '2. CTE (Common Table Expressions)',
                    content: 'CTE membuat query kompleks jadi lebih mudah dibaca dibanding subquery bertingkat.',
                    code: `WITH Sales_CTE AS (
  SELECT region, SUM(amount) as total
  FROM sales
  GROUP BY region
)
SELECT * FROM Sales_CTE WHERE total > 1000;`,
                },
            ],
        },
        challenge: {
            title: 'Laporan Penjualan Regional',
            description: `Buat laporan penjualan per kota yang memiliki lebih dari 2 transaksi.
1. Gunakan tabel 'sales' dan 'locations'
2. Hitung jumlah transaksi per kota
3. Hanya tampilkan kota dengan transaksi > 2
4. Urutkan berdasarkan jumlah transaksi`,
            starterCode: `-- Tulis query di sini
SELECT 
  l.city_name, 
  COUNT(*) as total_transaksi
FROM sales s
JOIN locations l ON s.location_id = l.id
-- Lanjutkan logika GROUP BY dan HAVING
`,
            expectedOutput: `Query berhasil dijalankan

┌─────────────┬─────────────────┐
│ city_name   │ total_transaksi │
├─────────────┼─────────────────┤
│ Jakarta     │ 45              │
│ Surabaya    │ 32              │
│ Bandung     │ 15              │
│ Medan       │ 8               │
└─────────────┴─────────────────┘

4 rows returned`,
        },
    },
    'level-3': {
        analyst: {
            title: 'Level 3: Window Functions (Analyst)',
            sections: [
                { heading: 'Pengantar Window Functions', content: 'Window Functions memungkinkanmu melakukan kalkulasi antar baris tanpa menyatukan baris (seperti GROUP BY). Ini SANGAT powerful untuk analisis tren.' },
                { heading: '1. Ranking Data (RANK, DENSE_RANK)', content: 'Bagaimana cara meranking sales tertinggi per kategori?\n\nRANK(): 1, 2, 2, skip ke 4\nDENSE_RANK(): 1, 2, 2, lanjut ke 3 (Tidak ada nomor urut yang lompat)', code: `SELECT category, product_name, price, RANK() OVER (PARTITION BY category ORDER BY price DESC) as rank FROM products;` },
                { heading: '2. Melihat Data Sebelumnya (LEAD & LAG)', content: 'Gunakan LAG() untuk melihat penjualan hari kemarin di baris hari ini. Berguna untuk menghitung Growth (WoW, MoM).', code: `SELECT month, sales, LAG(sales) OVER (ORDER BY month) as prev_month_sales FROM monthly_sales;` },
            ],
        },
        scientist: {
            title: 'Level 3: Advanced Feature Engineering',
            sections: [
                { heading: 'Feature Engineering dengan SQL', content: 'Sebelum data masuk ke SciKit-Learn, kita bisa buat fitur canggih langsung di database.' },
                { heading: '1. Moving Averages', content: 'Menghaluskan noise data time-series.', code: `AVG(value) OVER (ORDER BY time ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` },
                { heading: '2. Cumulative Sum (Running Total)', content: 'Menghitung total berjalan sampai titik tertentu.', code: `SUM(amount) OVER (ORDER BY date) as running_total` },
            ],
        },
        challenge: {
            title: 'Analisis Pertumbuhan Penjualan',
            description: `Hitung pertumbuhan penjualan (Growth) bulanan using LAG().`,
            starterCode: `SELECT bulan, total_sales, LAG(total_sales) OVER (ORDER BY bulan) as previous_sales FROM monthly_sales`,
            expectedOutput: `Query berhasil dijalankan`,
        },
    },
    'level-4': {
        analyst: {
            title: 'Level 4: Common Table Expressions (CTE)',
            sections: [
                { heading: 'Apa itu CTE?', content: 'CTE (`WITH`) adalah cara membuat tabel sementara yang hanya hidup selama query dijalankan.' },
                { heading: '1. From Subquery to CTE', content: 'Daripada `SELECT * FROM (SELECT ...)`, lebih baik pakai CTE untuk readability.', code: `WITH TopCustomers AS (SELECT customer_id, SUM(amount) as total FROM orders GROUP BY customer_id) SELECT * FROM TopCustomers WHERE total > 1000;` },
            ],
        },
        scientist: {
            title: 'Level 4: Complex Data Prep Pipelines',
            sections: [
                { heading: 'Multi-step Processing', content: 'Gunakan CTE bertingkat untuk membersihkan data, lalu mem-filter, lalu meng-agregasi.', code: `WITH CleanData AS (SELECT id, COALESCE(age, 25) as age FROM users), TargetUsers AS (SELECT * FROM CleanData WHERE age > 18) SELECT AVG(age) FROM TargetUsers;` },
            ],
        },
        challenge: {
            title: 'Analisis Kohort Sederhana',
            description: `Gunakan CTE untuk mencari rata-rata belanja user berdasarkan bulan pertama mereka mendaftar.`,
            starterCode: `WITH UserJoin AS (SELECT user_id, MIN(order_date) as first_order FROM orders GROUP BY user_id) SELECT * FROM orders;`,
            expectedOutput: `Query berhasil dijalankan`,
        },
    },
    'level-5': {
        analyst: {
            title: 'Level 5: Data Cleaning & Validation',
            sections: [
                { heading: 'Dirty Data is Everywhere', content: 'Data Analyst menghabiskan 60% waktu untuk cleaning data. Mari kita pelajari tekniknya.' },
                { heading: '1. Mengkategorikan Data (CASE WHEN)', content: 'Membuat grup baru dari data angka/teks.', code: `SELECT name, CASE WHEN amount > 1000 THEN 'VIP' ELSE 'Regular' END as status FROM sales;` },
            ],
        },
        scientist: {
            title: 'Level 5: Advanced Data Cleaning',
            sections: [
                { heading: 'Handling Outliers', content: 'Cara mendeteksi data aneh (anomali) menggunakan Z-Score sederhana atau Interquartile Range (IQR).' },
                { heading: '1. Filter Duplikat', content: 'Menggunakan `ROW_NUMBER() > 1` untuk hapus duplikat.', code: `WITH Duplicates AS (SELECT *, ROW_NUMBER() OVER(PARTITION BY email ORDER BY created_at) as rn FROM users) DELETE FROM users WHERE id IN (SELECT id FROM Duplicates WHERE rn > 1);` },
            ],
        },
        challenge: {
            title: 'Segmentasi Customer Otomatis',
            description: `Buat kategori customer berdasarkan total belanja menggunakan CASE WHEN.`,
            starterCode: `SELECT customer_name, total_spend, CASE WHEN total_spend > 1000 THEN 'High' ELSE 'Low' END FROM customer_spends`,
            expectedOutput: `Query berhasil dijalankan`,
        },
    },
};

// Generating Levels 6-100
const topics = [
    "Stored Procedures", "Triggers", "Views & Materialized Views", "JSON Handling in SQL", "Transaction Isolation",
    "Database Normalization", "Primary & Foreign Keys", "Indexing Strategies (B-Tree)", "Composite Indexes", "Query Execution Plans", // 15
    "Full Text Search", "Spatial Data (PostGIS)", "Array Data Types", "User Management (GRANT/REVOKE)", "SQL Injection Prevention", // 20
    "Partitioning Tables", "Sharding Concepts", "Replication Types", "High Availability", "Disaster Recovery", // 25
    "Vacuum & Maintenance", "Connection Pooling", "Time Series Analysis", "Graph Data Concepts", "Recursive Queries", // 30
    "Distributed SQL", "CAP Theorem", "ACID vs BASE", "NoSQL Integration", "Redis & Caching", // 35
    "Columnar Storage", "Data Warehousing Basics", "Star Schema Design", "Snowflake Schema", "ETL Pipelines", // 40
    "ELT vs ETL", "Data Lake Concepts", "Hadoop & Spark Basics", "Big Data File Formats (Parquet)", "Cloud Databases (AWS RDS)", // 45
    "Google BigQuery", "Azure SQL", "Serverless Databases", "Database Migration Strategies", "Zero Downtime Deployments", // 50
    "Data Governance", "GDPR & Compliance", "Audit Logging", "Encryption at Rest", "Masking Sensitive Data", // 55
    "Multi-tenancy Architecture", "Row Level Security", "Schema Validation", "API Integration", "GraphQL with SQL", // 60
    "ORM Best Practices", "N+1 Query Problem", "Database Anti-patterns", "Refactoring Databases", "Legacy System Migration", // 65
    "Real-time Analytics", "Stream Processing", "Event Sourcing", "CQRS Pattern", "Microservices Database Pattern", // 70
    "Saga Pattern", "Two-Phase Commit", "Vector Databases", "AI & SQL Integration", "RAG Pipeline w/ SQL", // 75
    "Geospatial Analytics (Adv)", "Financial Modeling in SQL", "Risk Analysis Queries", "Marketing Attribution Models", "Churn Prediction Query", // 80
    "Supply Chain Optimization", "Inventory Management Logic", "Dynamic Pricing Models", "Fraud Detection Rules", "Recommendation Engine SQL", // 85
    "Social Network Analysis", "Hierarchical Data (Trees)", "Gap Analysis", "Funnel Analysis", "Retention Analysis", // 90
    "User Segmentation (Adv)", "AB Testing Analysis", "Statistical Functions in SQL", "Linear Regression in SQL", "Forecasting Models", // 95
    "System Design Interview", "Architecting for Scale", "Chaos Engineering for DB", "Future of Databases", "Expert Final Project" // 100
];

const generatedCurricula: any = {};

topics.forEach((topic, index) => {
    const levelNum = index + 6;
    const levelKey = `level-${levelNum}`;

    generatedCurricula[levelKey] = {
        analyst: {
            title: `Level ${levelNum}: ${topic}`,
            sections: [
                {
                    heading: `Pengantar ${topic}`,
                    content: `Di Level ${levelNum} ini, kita akan mempelajari ${topic} secara mendalam. Topik ini sangat penting untuk menjadi seorang Expert Data Analyst.`,
                },
                {
                    heading: 'Konsep Utama',
                    content: `Pahami prinsip kerja ${topic} dan bagaimana mengaplikasikannya dalam kasus nyata.`,
                    code: `-- Contoh syntax untuk ${topic}\nSELECT 'Implementasi ${topic} di sini';`
                },
                {
                    heading: 'Best Practices',
                    content: `Selalu perhatikan performa dan keamanan saat menggunakan ${topic}.`
                }
            ]
        },
        scientist: {
            title: `Level ${levelNum}: ${topic} for Lab`,
            sections: [
                {
                    heading: `Teori ${topic}`,
                    content: `Untuk Data Scientist, ${topic} memberikan wawasan baru dalam pengolahan data.`
                },
                {
                    heading: 'Implementasi Logic',
                    content: `Gunakan logika ${topic} untuk optimasi pipeline data anda.`,
                    code: `-- Algoritma ${topic}\nSELECT * FROM experiments WHERE type = '${topic}';`
                }
            ]
        },
        challenge: {
            title: `Tantangan ${topic}`,
            description: `Implementasikan solusi menggunakan konsep ${topic} yang telah dipelajari.\n\n1. Analisis masalah\n2. Tulis query ${topic}\n3. Validasi hasil`,
            starterCode: `-- Tulis implementasi ${topic} anda\nSELECT 'Jawaban saya';`,
            expectedOutput: `Konsep ${topic} berhasil diimplementasikan!`
        }
    };
});

export const curricula = {
    ...baseCurricula,
    ...generatedCurricula
};
