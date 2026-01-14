# 🚀 Vercel Deployment Guide

## Setup di Vercel Dashboard

### 1. Import Project
- Buka https://vercel.com/new
- Pilih repository: `arra7trader/KURSUS-IT`
- Click "Import"

### 2. Configure Project
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
```

### 3. Environment Variables
Tambahkan environment variables berikut di Vercel dashboard:

```env
TURSO_DATABASE_URL=<your_turso_database_url>
TURSO_AUTH_TOKEN=<your_turso_auth_token>
GROQ_API_KEY=<your_groq_api_key>
```

### 4. Deploy!
Klik tombol **"Deploy"**

---

## ✅ Checklist

- [x] Database schema pushed ke Turso
- [x] GitHub repository ready
- [ ] Vercel project imported
- [ ] Environment variables set
- [ ] First deployment success
- [ ] Test API endpoints

---

## 📡 API Endpoints (setelah deploy)

```
https://kursusit.vercel.app/api/tutor/chat
https://kursusit.vercel.app/api/grade/submit
```

---

## 🔧 Troubleshooting

**Build fails?**
- Check environment variables sudah di-set
- Pastikan root directory = `frontend`

**API 500 error?**
- Verify GROQ_API_KEY valid
- Check Turso connection di dashboard

**Database kosong?**
- Schema sudah di-push (✅ done)
- Tinggal add seed data nanti
