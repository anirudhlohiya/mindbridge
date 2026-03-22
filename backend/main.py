from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

ALLOWED_ORIGIN = "*"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Explicit OPTIONS preflight handler (fixes Codespaces CORS — same as EduAgent)
@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str, request: Request):
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    )

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are MindBridge, a compassionate AI mental health companion for students in India.
Your role is to:
1. Start by warmly asking how the user is feeling today (mood check-in)
2. Listen carefully and identify stress triggers from what they share
3. Offer simple CBT-based coping techniques: breathing exercises, journaling prompts, or thought reframing
4. If the user seems to be in crisis (mentions self-harm, hopelessness, or suicide), ALWAYS respond with:
   - Empathy first
   - Then say: "Please reach out to iCall at 9152987821 or Vandrevala Foundation at 1860-2662-345. You are not alone."
5. Keep responses short, warm, and non-clinical. Never diagnose.
6. Always end your response with one gentle follow-up question to keep the conversation going.

Remember: You are a supportive friend, not a therapist.
"""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

@app.get("/")
def root():
    return {"status": "MindBridge backend is running"}

@app.post("/chat")
async def chat(request: ChatRequest):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return JSONResponse(
            status_code=500,
            content={"error": "GROQ_API_KEY not found"},
            headers={"Access-Control-Allow-Origin": "*"},
        )

    client = Groq(api_key=api_key)
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            *[{"role": m.role, "content": m.content} for m in request.messages]
        ],
        max_tokens=500,
        temperature=0.7
    )
    reply = response.choices[0].message.content
    return JSONResponse(
        content={"reply": reply},
        headers={"Access-Control-Allow-Origin": "*"},
    )