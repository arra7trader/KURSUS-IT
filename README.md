# Data Academy 🎓

Platform AI-driven LMS untuk Data Analysts dan Data Scientists dengan standar internasional.

## 🚀 Fitur Utama

- **Dual Learning Path**: Data Analyst (Mentor: Rendy) & Data Scientist (Mentor: Abdul)
- **AI Tutor**: Pakai Groq API dengan bahasa Indonesia yang santai
- **Interactive Coding**: Browser-based IDE dengan Monaco Editor
- **AI Grading**: Penilaian otomatis berdasarkan 4 kriteria
- **Gated Progression**: Sistem level yang harus di-unlock

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python) |
| AI | Groq API (Llama 3.1 70B) + LangChain |
| Database | PostgreSQL / Turso (planned) |

## 📁 Struktur Project

```
KURSUS-IT/
├── frontend/           # Next.js 14 App
│   └── src/app/
│       ├── page.tsx    # Landing page
│       └── learn/      # Learning interface
├── backend/            # FastAPI Backend
│   └── app/
│       ├── services/   # AI Tutor & Grading
│       └── routers/    # API endpoints
├── prisma/             # Database schema
└── content/            # Curriculum JSON
```

## 🏃 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🔑 Environment Variables

```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_database_url
```

## 👥 AI Mentors

### Rendy (Data Analyst)
> "Data cuma berguna kalau bisa bikin duit atau hemat waktu."

### Abdul (Data Scientist)  
> "Pahami matematika di balik algoritmanya."

---

Made with ❤️ for aspiring data professionals
