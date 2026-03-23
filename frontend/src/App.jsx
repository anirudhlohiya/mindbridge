import { useState, useRef, useEffect } from "react";
import "./index.css";

// const BACKEND = "https://expert-telegram-p6g7w9jwjwrc6p99-8000.app.github.dev";
const BACKEND = "https://mindbridge-c1m6.onrender.com";

const MOODS = [
  { emoji: "😄", label: "Great",     color: "#7fd8be" },
  { emoji: "🙂", label: "Okay",      color: "#a89cef" },
  { emoji: "😐", label: "Meh",       color: "#f0c97a" },
  { emoji: "😔", label: "Low",       color: "#f0a7c0" },
  { emoji: "😰", label: "Anxious",   color: "#ff9f7f" },
  { emoji: "😭", label: "Terrible",  color: "#ff6b6b" },
];

const CRISIS_KEYWORDS = ["suicide", "kill myself", "end my life", "self harm", "self-harm", "hopeless", "don't want to live"];

function isCrisis(text) {
  return CRISIS_KEYWORDS.some(k => text.toLowerCase().includes(k));
}

function TypingDots() {
  return (
    <div style={styles.typingWrap}>
      {[0,1,2].map(i => (
        <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

function Bubble({ msg, showCrisis }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ ...styles.bubbleRow, justifyContent: isUser ? "flex-end" : "flex-start" }}>
      {!isUser && (
        <div style={styles.avatar}>🌿</div>
      )}
      <div style={{
        ...styles.bubble,
        background: isUser ? "var(--user-bubble)" : "var(--ai-bubble)",
        borderColor: isUser ? "rgba(127,216,190,0.15)" : "var(--border)",
        borderBottomRightRadius: isUser ? 4 : 18,
        borderBottomLeftRadius: isUser ? 18 : 4,
        maxWidth: isUser ? "68%" : "75%",
      }}>
        <p style={styles.bubbleText}>{msg.content}</p>
        {showCrisis && (
          <div style={styles.crisisBanner}>
            <span style={styles.crisisIcon}>🆘</span>
            <div>
              <p style={styles.crisisTitle}>You're not alone.</p>
              <p style={styles.crisisLine}>iCall: <strong>9152987821</strong></p>
              <p style={styles.crisisLine}>Vandrevala Foundation: <strong>1860-2662-345</strong></p>
            </div>
          </div>
        )}
      </div>
      {isUser && (
        <div style={{ ...styles.avatar, background: "rgba(127,216,190,0.1)", color: "var(--accent)" }}>you</div>
      )}
    </div>
  );
}

export default function App() {
  const [phase, setPhase]         = useState("landing");   // landing | mood | chat
  const [selectedMood, setMood]   = useState(null);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [crisisIdx, setCrisisIdx] = useState(new Set());
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function startChat(mood) {
    setMood(mood);
    setPhase("chat");
    setLoading(true);
    const firstMsg = { role: "user", content: `My mood today: ${mood.emoji} ${mood.label}` };
    setMessages([firstMsg]);
    const reply = await fetchReply([firstMsg]);
    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function fetchReply(msgs) {
    try {
      const res = await fetch(`${BACKEND}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-github-token": "bypass",
        },
        body: JSON.stringify({ messages: msgs }),
      });
      const data = await res.json();
      return data.reply;
    } catch {
      return "I'm having trouble connecting right now. Please try again in a moment. 💙";
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    if (isCrisis(text)) {
      setCrisisIdx(prev => new Set(prev).add(newMessages.length));
    }

    const reply = await fetchReply(newMessages);
    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  // ─── LANDING ────────────────────────────────────────────────
  if (phase === "landing") return (
    <div style={styles.page}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.landingWrap}>
        <div style={styles.logoRow}>
          <span style={styles.logoLeaf}>🌿</span>
          <span style={styles.logoText}>MindBridge</span>
        </div>
        <h1 style={styles.headline}>
          A safe space<br/>
          <em style={styles.headlineItalic}>to just breathe.</em>
        </h1>
        <p style={styles.sub}>
          AI-powered mental wellness companion for students.<br/>
          No judgment. No pressure. Just conversation.
        </p>
        <button style={styles.ctaBtn} onClick={() => setPhase("mood")}
          onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.target.style.transform = "translateY(0)"}
        >
          Start Check-in →
        </button>
        <p style={styles.disclaimer}>
          Not a substitute for professional help. If you're in crisis, call <strong>iCall: 9152987821</strong>
        </p>
      </div>
    </div>
  );

  // ─── MOOD PICKER ────────────────────────────────────────────
  if (phase === "mood") return (
    <div style={styles.page}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.moodWrap}>
        <button style={styles.backBtn} onClick={() => setPhase("landing")}>← Back</button>
        <h2 style={styles.moodTitle}>How are you feeling<br/><em>right now?</em></h2>
        <p style={styles.moodSub}>Be honest — this is just for you.</p>
        <div style={styles.moodGrid}>
          {MOODS.map(m => (
            <button key={m.label} style={styles.moodCard}
              onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = "translateY(-4px) scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
              onClick={() => startChat(m)}
            >
              <span style={styles.moodEmoji}>{m.emoji}</span>
              <span style={{ ...styles.moodLabel, color: m.color }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── CHAT ────────────────────────────────────────────────────
  return (
    <div style={styles.chatPage}>
      <div style={styles.chatHeader}>
        <div style={styles.logoRow}>
          <span style={styles.logoLeaf}>🌿</span>
          <span style={{ ...styles.logoText, fontSize: 18 }}>MindBridge</span>
        </div>
        {selectedMood && (
          <div style={styles.moodPill}>
            {selectedMood.emoji} <span style={{ color: selectedMood.color, marginLeft: 4 }}>{selectedMood.label}</span>
          </div>
        )}
        <button style={styles.newBtn} onClick={() => { setPhase("mood"); setMessages([]); setCrisisIdx(new Set()); }}>
          New Check-in
        </button>
      </div>

      <div style={styles.chatBody}>
        {messages.map((msg, i) => (
          <Bubble key={i} msg={msg} showCrisis={crisisIdx.has(i + 1)} />
        ))}
        {loading && (
          <div style={{ ...styles.bubbleRow, justifyContent: "flex-start" }}>
            <div style={styles.avatar}>🌿</div>
            <div style={{ ...styles.bubble, background: "var(--ai-bubble)", borderColor: "var(--border)" }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputBar}>
        <textarea
          ref={inputRef}
          style={styles.textarea}
          placeholder="Share what's on your mind…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button style={{
          ...styles.sendBtn,
          opacity: input.trim() && !loading ? 1 : 0.4,
          cursor: input.trim() && !loading ? "pointer" : "default",
        }} onClick={send}>
          ↑
        </button>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden", background: "var(--bg)",
  },
  orb1: {
    position: "absolute", width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(127,216,190,0.07) 0%, transparent 70%)",
    top: -100, left: -100, pointerEvents: "none",
  },
  orb2: {
    position: "absolute", width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,156,239,0.07) 0%, transparent 70%)",
    bottom: -80, right: -80, pointerEvents: "none",
  },
  landingWrap: {
    position: "relative", zIndex: 1, textAlign: "center",
    maxWidth: 520, padding: "0 24px",
  },
  logoRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 40 },
  logoLeaf: { fontSize: 28 },
  logoText: { fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, color: "var(--accent)", letterSpacing: "-0.5px" },
  headline: {
    fontFamily: "'Fraunces', serif", fontSize: "clamp(42px, 7vw, 64px)",
    fontWeight: 300, lineHeight: 1.1, color: "var(--text)", marginBottom: 20,
  },
  headlineItalic: { fontStyle: "italic", color: "var(--accent)", fontWeight: 300 },
  sub: { color: "var(--muted)", lineHeight: 1.7, marginBottom: 36, fontSize: 16 },
  ctaBtn: {
    background: "var(--accent)", color: "#0d1a16", border: "none",
    padding: "14px 36px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500, fontSize: 16, cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 0 30px rgba(127,216,190,0.25)", marginBottom: 28,
  },
  disclaimer: { color: "var(--muted)", fontSize: 12, lineHeight: 1.6 },

  // Mood
  moodWrap: {
    position: "relative", zIndex: 1, textAlign: "center",
    maxWidth: 560, padding: "0 24px", width: "100%",
  },
  backBtn: {
    background: "none", border: "none", color: "var(--muted)", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 32, display: "block",
  },
  moodTitle: {
    fontFamily: "'Fraunces', serif", fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: 300, marginBottom: 10, lineHeight: 1.2,
  },
  moodSub: { color: "var(--muted)", marginBottom: 40, fontSize: 15 },
  moodGrid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: 14, maxWidth: 480, margin: "0 auto",
  },
  moodCard: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: "22px 12px", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    transition: "border-color 0.2s, transform 0.2s",
  },
  moodEmoji: { fontSize: 32 },
  moodLabel: { fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13 },

  // Chat
  chatPage: {
    height: "100vh", display: "flex", flexDirection: "column",
    background: "var(--bg)", overflow: "hidden",
  },
  chatHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 24px", borderBottom: "1px solid var(--border)",
    background: "rgba(13,15,20,0.8)", backdropFilter: "blur(12px)",
    flexShrink: 0,
  },
  moodPill: {
    background: "var(--surface2)", borderRadius: 50, padding: "5px 14px",
    fontSize: 13, display: "flex", alignItems: "center", border: "1px solid var(--border)",
  },
  newBtn: {
    background: "none", border: "1px solid var(--border)", color: "var(--muted)",
    padding: "6px 16px", borderRadius: 50, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    transition: "border-color 0.2s, color 0.2s",
  },
  chatBody: {
    flex: 1, overflowY: "auto", padding: "28px 20px",
    display: "flex", flexDirection: "column", gap: 16,
    maxWidth: 760, width: "100%", margin: "0 auto", alignSelf: "stretch",
    boxSizing: "border-box",
  },
  bubbleRow: { display: "flex", alignItems: "flex-end", gap: 10 },
  avatar: {
    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
    background: "rgba(127,216,190,0.08)", border: "1px solid rgba(127,216,190,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, color: "var(--accent)", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500, letterSpacing: "-0.5px",
  },
  bubble: {
    padding: "13px 17px", borderRadius: 18, border: "1px solid",
    lineHeight: 1.65, fontSize: 14.5,
  },
  bubbleText: { color: "var(--text)", fontFamily: "'DM Sans', sans-serif" },
  crisisBanner: {
    marginTop: 12, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)",
    borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start",
  },
  crisisIcon: { fontSize: 18, flexShrink: 0 },
  crisisTitle: { color: "var(--crisis)", fontWeight: 500, fontSize: 13, marginBottom: 4 },
  crisisLine: { color: "var(--muted)", fontSize: 12, marginBottom: 2 },

  // Input
  inputBar: {
    padding: "14px 20px", borderTop: "1px solid var(--border)",
    background: "rgba(13,15,20,0.9)", backdropFilter: "blur(12px)",
    display: "flex", gap: 10, alignItems: "flex-end",
    maxWidth: 760, width: "100%", margin: "0 auto", alignSelf: "stretch",
    boxSizing: "border-box",
  },
  textarea: {
    flex: 1, background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 14, padding: "12px 16px", color: "var(--text)",
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, resize: "none",
    outline: "none", lineHeight: 1.6,
    transition: "border-color 0.2s",
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: "50%", background: "var(--accent)",
    border: "none", color: "#0d1a16", fontSize: 18, fontWeight: 700,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    transition: "opacity 0.2s", flexShrink: 0,
  },
  typingWrap: { display: "flex", gap: 5, padding: "4px 2px", alignItems: "center" },
  dot: {
    width: 7, height: 7, borderRadius: "50%", background: "var(--muted)",
    display: "inline-block",
    animation: "bounce 0.9s infinite ease-in-out",
  },
};

// Inject keyframe for typing dots
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%            { transform: translateY(-6px); opacity: 1; }
  }
  textarea:focus { border-color: rgba(127,216,190,0.35) !important; }
  textarea::placeholder { color: #4a5060; }
`;
document.head.appendChild(styleTag);