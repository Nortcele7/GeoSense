from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

# Load .env file variables into environment
load_dotenv()

# Now GEMINI_API_KEY is available in os.environ
client = genai.Client()

app = FastAPI()

class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    text: str

@app.post("/generate", response_model=GenerateResponse)
async def generate_content(req: GenerateRequest):
    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=req.prompt
        )
        return GenerateResponse(text=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
