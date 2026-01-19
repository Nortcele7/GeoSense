from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd  
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os
from PIL import Image
import io
import sys

sys.path.append(os.path.dirname(__file__))

import soil_engine_core  # now it will always find the module

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

def field_observation_score(text: str) -> float:
    score = nlp_model.predict([text])[0]
    return float(score)


# Pydantic model
class GeoRequest(BaseModel):
    latitude: float
    longitude: float

# Load Geo Data
# Ensure we reload if needed or handle path correctly
try:
    geo_df = pd.read_csv("soil_geo_data.csv")
except FileNotFoundError:
    # If not found, create an empty one or handle error
    geo_df = pd.DataFrame(columns=['latitude', 'longitude', 'soil_type'])

@app.post("/get_geo_data")
def get_geo_data(req: GeoRequest):
    if geo_df.empty:
        return {"error": "No geo data available"}
    
    # Simple nearest neighbor search using Euclidean distance
    # In a real app, use Scipy KDTree or a geospatial database (PostGIS)
    distances = ((geo_df['latitude'] - req.latitude)**2 + (geo_df['longitude'] - req.longitude)**2)**0.5
    nearest_idx = distances.argmin()
    
    match = geo_df.iloc[nearest_idx]
    
    return {
        "soil_type": match["soil_type"],
        "distance_deg": float(distances.iloc[nearest_idx]) # debug info
    }

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
    




@app.post("/image")
async def image(file: UploadFile = File(...)):
    try:
        img_bytes = await file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        result = soil_engine_core.classify_soil(img)

        # Standardize output for HTML JS
        if result.get("error"):
            return JSONResponse({
                "error": True,
                "message": result.get("message", "Unknown error")
            })
        else:
            return JSONResponse({
                "error": False,
                "soil": result.get("soil", "unknown"),
                "confidence": result.get("confidence", 0)
            })
    except Exception as e:
        return JSONResponse({
            "error": True,
            "message": f"Failed to process image: {str(e)}"
        })
