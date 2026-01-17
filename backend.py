from fastapi import FastAPI
import joblib
import pandas as pd
from pydantic import BaseModel

model = joblib.load("model1.pkl")

app = FastAPI()

class Soil(BaseModel):
    moisture_content: float
    bulk_density: float
    foundation_depth: float
    field_score: float
    soil_type: str
    grain_size_type: str

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

    return {"Prediction": float(prediction)}
