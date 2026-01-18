from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd  
from pydantic import BaseModel

app = FastAPI()

# Allow CORS for React frontend
origins = [
    "http://localhost:5173",  # React dev server
]

def get_safety_class(value):
    if value < 100:
        return "Unsafe"
    elif value < 200:
        return "Moderate"
    else:
        return "Safe"

def get_message(safety):
    if safety == "Safe":
        return "✅ Structure condition is SAFE for design."
    elif safety == "Moderate":
        return "⚠ Moderate capacity – consider improvement."
    else:
        return "❌ Unsafe – redesign or ground improvement required."

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # allows POST, GET, OPTIONS etc.
    allow_headers=["*"],   # allows all headers
)

# Load your model
model = joblib.load("model1.pkl")

# Pydantic model
class Soil(BaseModel):
    moisture_content: float
    bulk_density: float
    foundation_depth: float
    field_score: float
    soil_type: str
    grain_size_type: str

# POST endpoint
@app.post("/predict")
def predict(data: Soil):
    df = pd.DataFrame({
        "soil_type": [data.soil_type],
        "grain_size": [data.grain_size_type],
        "moisture_content": [data.moisture_content],
        "bulk_density": [data.bulk_density],
        "foundation_depth": [data.foundation_depth],
        "field_observation_score": [data.field_score]
    })
    prediction = model.predict(df)[0]

    safety_class = get_safety_class(prediction)
    return JSONResponse({"Prediction": float(prediction), 
                         "SafetyClass":safety_class})
