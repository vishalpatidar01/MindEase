# 🌿 MindEase — AI Stress Detector

An AI-powered stress detection web app built with **Next.js**, **Anthropic Claude**, and **Supabase**.

---

## ✨ Features
- 🤖 AI stress analysis using Claude
- 📊 Animated stress scale (Low / Moderate / High)
- 💡 Personalized relief suggestions
- 🫁 Guided breathing exercises (Box 4-4-4 & 4-7-8)
- 📋 Full search history saved to Supabase
- 🌙 Dark modern UI

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/mindease.git
cd mindease
npm install
```

---

### Step 2 — Get Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to **API Keys** → click **Create Key**
4. Copy the key (starts with `sk-ant-...`)

---

### Step 3 — Set up Supabase (for history)

1. Go to [https://supabase.com](https://supabase.com) → **New Project**
2. Give it a name (e.g. `mindease`) and set a password
3. Once created, go to **SQL Editor** and run this:

```sql
create table stress_history (
  id           bigint generated always as identity primary key,
  created_at   timestamptz default now(),
  user_text    text not null,
  score        int,
  level        text,
  level_label  text,
  insight      text,
  main_stressor text
);
```

4. Go to **Settings → API**
5. Copy **Project URL** and **anon public** key

---

### Step 4 — Add Environment Variables

Create a `.env.local` file in the root:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
```

---

### Step 5 — Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

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

> ⚠️ `.env.local` is in `.gitignore` — your keys are never pushed!

---

## ☁️ Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo `mindease`
3. Before clicking Deploy, go to **Environment Variables** and add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | your Anthropic key |
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |

4. Click **Deploy** ✅
5. Your app is live at `https://mindease.vercel.app` (or similar)!

---

## 📁 Project Structure

```
mindease/
├── app/
│   ├── api/
│   │   ├── analyze/route.js     ← Calls Claude API (server-side)
│   │   └── history/route.js     ← Saves/reads from Supabase
│   ├── globals.css
│   ├── layout.js
│   ├── page.js                  ← Main landing page
│   └── page.module.css
├── components/
│   ├── ResultScreen.js          ← Stress result + breathing
│   ├── ResultScreen.module.css
│   ├── HistoryPanel.js          ← Slide-in history drawer
│   └── HistoryPanel.module.css
├── lib/
│   └── supabase.js
├── .env.example                 ← Safe to commit
├── .env.local                   ← NEVER commit this
├── .gitignore
├── next.config.js
└── package.json
```

---

## 🛡️ Security Notes

- Anthropic API key is used **server-side only** (in `/api/analyze/route.js`) — never exposed to the browser
- `.env.local` is git-ignored
- Supabase anon key is safe to expose publicly (it has row-level permissions)
