# 🌿 MindEase — AI Stress Detector

An AI-powered stress detection web app built with **Next.js**, **Groq AI (Free)**, and **Supabase**.

> 🎓 Minor Project | AI-Based Stress Detector with Relief Suggestions

---

## ✨ Features

- 🤖 AI stress analysis using **Groq (Llama 3.3)** — Free!
- 📊 Animated stress scale (Low / Moderate / High)
- 💡 Personalized relief suggestions
- 🫁 Guided breathing exercises (Box 4-4-4 & 4-7-8)
- 📋 Full search history saved to Supabase
- 🌙 Dark modern UI
- 🚀 Deployed on Vercel

---

## 🛠️ Tech Stack

| Technology      | Purpose               |
| --------------- | --------------------- |
| Next.js 14      | Frontend + API Routes |
| Groq API (Free) | AI Stress Analysis    |
| Supabase        | Database (History)    |
| Vercel          | Deployment            |

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/mindease.git
cd mindease
npm install
```

---

### Step 2 — Get Groq API Key (Free — No Credit Card!)

1. Go to https://console.groq.com
2. Sign up with GitHub
3. Go to **API Keys** → click **"Create API Key"**
4. Copy the key (starts with `gsk_...`)

---

### Step 3 — Set up Supabase (for history)

1. Go to https://supabase.com → **New Project**
2. Give it a name (e.g. `mindease`) and set a password
3. Once created, go to **SQL Editor** and run this:

```sql
CREATE TABLE stress_history (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_text TEXT,
  score INT,
  level TEXT,
  level_label TEXT,
  insight TEXT,
  main_stressor TEXT
);
```

4. Go to **Settings → API**
5. Copy **Project URL** and **anon public** key

---

### Step 4 — Add Environment Variables

Create a `.env.local` file in the root folder:

```env
GROQ_API_KEY=gsk_your_groq_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJyour_anon_key_here
```

---

### Step 5 — Run Locally

```bash
npm run dev
```

Open http://localhost:3000

---

## 📦 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — MindEase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mindease.git
git push -u origin main
```

> .env.local is in .gitignore — your keys are NEVER pushed to GitHub!

---

## ☁️ Deploy on Vercel

1. Go to https://vercel.com → **New Project**
2. Import your GitHub repo `mindease`
3. Before clicking Deploy, go to **Environment Variables** and add:

| Name                            | Value                    |
| ------------------------------- | ------------------------ |
| `GROQ_API_KEY`                  | your Groq key (gsk\_...) |
| `NEXT_PUBLIC_SUPABASE_URL`      | your Supabase URL        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key   |

4. Click **Deploy**
5. Your app is live!

> After adding environment variables, always Redeploy for changes to take effect!

---

## 📁 Project Structure

```
mindease/
├── app/
│   ├── api/
│   │   ├── analyze/route.js     ← Calls Groq API (server-side, key is safe)
│   │   └── history/route.js     ← Saves/reads from Supabase
│   ├── globals.css
│   ├── layout.js
│   ├── page.js                  ← Main landing page
│   └── page.module.css
├── components/
│   ├── ResultScreen.js          ← Stress result + breathing animation
│   ├── ResultScreen.module.css
│   ├── HistoryPanel.js          ← Slide-in history drawer
│   └── HistoryPanel.module.css
├── lib/
│   └── supabase.js
├── .env.example                 ← Safe to commit (no real keys)
├── .env.local                   ← NEVER commit this
├── .gitignore
├── next.config.js
└── package.json
```

---

## 🔑 Environment Variables Summary

| Variable                        | Where to get              |
| ------------------------------- | ------------------------- |
| `GROQ_API_KEY`                  | console.groq.com          |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |

---

## 🛡️ Security Notes

- Groq API key is used **server-side only** — never exposed to the browser
- `.env.local` is git-ignored — keys never go to GitHub
- Supabase anon key is safe to use publicly

---

## 👨‍💻 Made with ❤️ for Minor Project
