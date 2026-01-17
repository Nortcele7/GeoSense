import streamlit as st
import numpy as np
import pandas as pd
import joblib

# Load dataset for dynamic dropdowns and input ranges
@st.cache_data
def load_data():
    return pd.read_csv("synthetic_soil_bearing_capacity.csv")

df = load_data()

# Load pipeline model (transformer + regressor)
@st.cache_resource
def load_model():
    return joblib.load("model1.pkl")

model = load_model()

# Safety classification logic
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

# Streamlit UI
st.set_page_config(page_title="Soil Bearing Capacity Predictor")
st.title("Soil Bearing Capacity Prediction")

st.write("""
Enter soil parameters below to estimate **bearing capacity**  
and automatically obtain the **safety class**.
""")

# Dynamic dropdown options from dataset
soil_type_options = list(df['soil_type'].unique())
grain_size_options = list(df['grain_size'].unique())

soil_type = st.selectbox("Soil Type", soil_type_options)
grain_size = st.selectbox("Grain Size", grain_size_options)

moisture_content = st.slider(
    "Moisture Content (%)",
    float(df['moisture_content'].min()),
    float(df['moisture_content'].max()),
    float(df['moisture_content'].median()),
    step=0.1
)

foundation_depth = st.number_input(
    "Foundation Depth (m)",
    float(df['foundation_depth'].min()),
    float(df['foundation_depth'].max()),
    float(df['foundation_depth'].median()),
    step=0.1
)

bulk_density = st.number_input(
    "Bulk Density (g/cm³)",
    float(df['bulk_density'].min()),
    float(df['bulk_density'].max()),
    float(df['bulk_density'].median()),
    step=0.01
)

field_observation_score = st.number_input(
    "Field Observation Score",
    float(df['field_observation_score'].min()),
    float(df['field_observation_score'].max()),
    float(df['field_observation_score'].median()),
    step=0.1
)

# Prepare input in the exact order your pipeline expects
input_data = pd.DataFrame({
    'soil_type': [soil_type],
    'grain_size': [grain_size],
    'moisture_content': [moisture_content],
    'foundation_depth': [foundation_depth],
    'bulk_density': [bulk_density],
    'field_observation_score': [field_observation_score]
})


if st.button("Predict Bearing Capacity"):
    prediction = model.predict(input_data)[0]
    safety = get_safety_class(prediction)

    st.subheader("Results")
    st.metric(label="Predicted Bearing Capacity (kPa)", value=f"{prediction:.2f}")

    if safety == "Safe":
        st.success(f"Safety Class: {safety}")
    elif safety == "Moderate":
        st.warning(f"Safety Class: {safety}")
    else:
        st.error(f"Safety Class: {safety}")

    st.write(get_message(safety))

    result_text = f"""\
Bearing Capacity: {prediction:.2f} kPa
Safety Class: {safety}
"""

    st.download_button(
        "Download Result",
        result_text,
        file_name="bearing_capacity_result.txt"
    )

st.markdown("---")
st.caption("ML-Based Bearing Capacity & Safety Classification System")
