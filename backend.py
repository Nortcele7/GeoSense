from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd  
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client()

app = FastAPI()

# Load your models
model = joblib.load("model1.pkl")
nlp_model = joblib.load("nlp_model.pkl")

# Allow CORS for React frontend
origins = [
    "http://localhost:5173",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # allows POST, GET, OPTIONS etc.
    allow_headers=["*"],   # allows all headers
)

# Helper functions
def get_safety_class(value: float) -> str:
    if value < 100:
        return "Unsafe"
    elif value < 200:
        return "Moderate"
    else:
        return "Safe"

# def get_message(safety: str) -> str:
#     if safety == "Safe":
#         return "✅ Structure condition is SAFE for design."
#     elif safety == "Moderate":
#         return "⚠ Moderate capacity – consider improvement."
#     else:
#         return "❌ Unsafe – redesign or ground improvement required."

def field_observation_score(text: str) -> float:
    score = nlp_model.predict([text])[0]
    return float(score)

# Pydantic models
class Soil(BaseModel):
    moisture_content: float
    bulk_density: float
    foundation_depth: float
    field_score: str
    soil_type: str
    grain_size_type: str

class GenerateRequest(BaseModel):
    prompt: str  # (You can keep this for flexibility but not used here)

class GenerateResponse(BaseModel):
    text: str

class SuggestionRequest(BaseModel):
    bearing_capacity: float
    safety_class: str

# Prediction endpoint
@app.post("/predict")
def predict(data: Soil):
    score = field_observation_score(data.field_score)

    df = pd.DataFrame({
        "soil_type": [data.soil_type],
        "grain_size": [data.grain_size_type],
        "moisture_content": [data.moisture_content],
        "bulk_density": [data.bulk_density],
        "foundation_depth": [data.foundation_depth],
        "field_observation_score": [score]
    })
    
    prediction = float(model.predict(df)[0])
    safety_class = get_safety_class(prediction)
    
    return JSONResponse({
        "Prediction": prediction,
        "SafetyClass": safety_class
    })

# AI suggestion endpoint - takes bearing capacity & safety class
@app.post("/aisuggest", response_model=GenerateResponse)
async def generate_content(req: SuggestionRequest):
    try:
        prompt = (
            f"Given the soil bearing capacity of {req.bearing_capacity:.2f} kPa "
            f"which is classified as '{req.safety_class}', "
            "provide a 4 point suggestion about what kind of construction can be made and what should not be done also give the bearing capacity value after considering factor of safety of 3."
        )

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        return GenerateResponse(text=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
