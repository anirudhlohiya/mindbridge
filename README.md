# 🌿 MindBridge
### AI Mental Health Companion for Students

> **Live Demo:** [mindbridge-psi-nine.vercel.app](https://mindbridge-psi-nine.vercel.app)  
> **Built for:** AI For Good Hackathon 2026 — Connecting Dreams Foundation  
> **Solo project by:** Anirudh Lohiya | Built in 48 hours

---

## 🧠 The Problem

Over **50 million students** in India suffer from anxiety, depression, and burnout — yet fewer than **1 in 10** seek help. Barriers include social stigma, cost of therapy, and complete lack of access to mental health resources in tier-2 and tier-3 cities.

Students need a safe, judgment-free, always-available space to express how they feel and receive immediate support.

---

## 💡 The Solution

MindBridge is an AI-powered mental wellness companion designed specifically for students.

- 🎯 **Mood check-ins** — 6 emotional states to help students articulate how they feel
- 🤗 **Empathetic AI conversations** — powered by LLaMA 3.1 using CBT-based techniques
- 🧘 **Coping strategies** — breathing exercises, journaling prompts, thought reframing
- 🆘 **Crisis detection** — auto-surfaces iCall & Vandrevala Foundation helplines on distress signals
- ⚡ **Zero friction** — no sign-up, no cost, works on any device

---

## 🤖 How AI is Used

MindBridge uses **Meta's LLaMA 3.1 8B Instant** model via the Groq API with a carefully engineered system prompt that:

- Applies **Cognitive Behavioural Therapy (CBT)** principles in every response
- Keeps responses warm, non-clinical, and student-appropriate
- Detects crisis signals and always escalates to professional resources
- Maintains full conversation context for coherent multi-turn dialogue
- Never attempts to diagnose — positions itself as a supportive peer

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| AI Model | LLaMA 3.1 8B Instant via Groq API |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Version Control | GitHub |

---

## 🚀 Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key_here" > .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
mindbridge/
├── backend/
│   ├── main.py              # FastAPI app + Groq integration
│   └── requirements.txt
└── frontend/
    └── src/
        └── App.jsx          # Full React app (landing, mood, chat)
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com (free) |

---

## 🎯 Features

### Mood Check-in
Select from 6 emotional states — the AI tailors its opening response to exactly how you're feeling.

### CBT-Based Chat
Every response applies proven Cognitive Behavioural Therapy techniques in a natural, conversational way.

### Crisis Detection
Keyword-based detection surfaces real helpline numbers automatically:
- **iCall:** 9152987821
- **Vandrevala Foundation:** 1860-2662-345

### Dark Theme UI
A calming, distraction-free interface designed to feel safe and welcoming — not clinical.

---

## 🏆 Hackathon

Built for the **AI For Good Hackathon 2026** organized by Connecting Dreams Foundation.  
Solo project — designed, built, and deployed in under 48 hours.

---