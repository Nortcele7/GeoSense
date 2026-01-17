import streamlit as st
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

# ---------------- LOAD DATA ----------------
df = pd.read_csv("synthetic_soil_bearing_capacity.csv")

# ---------------- MODEL TRAINING ----------------
X = df.drop(columns=['bearing_capacity', 'safety_class'])
y = df['bearing_capacity']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

transformer = ColumnTransformer(
    transformers=[
        ('tnf', OneHotEncoder(sparse_output=False, drop='first'),
         ['soil_type', 'grain_size'])
    ],
    remainder='passthrough'
)

X_train_new = transformer.fit_transform(X_train)

lr = LinearRegression()
lr.fit(X_train_new, y_train)

# ---------------- STREAMLIT UI ----------------

st.title("Soil Bearing Capacity Prediction")

soil_type = st.selectbox("Soil Type", df['soil_type'].unique())
grain_size = st.selectbox("Grain Size", df['grain_size'].unique())

moisture = st.number_input(
    "Moisture Content",
    float(df['moisture_content'].min()),
    float(df['moisture_content'].max())
)

depth = st.number_input(
    "Foundation Depth",
    float(df['foundation_depth'].min()),
    float(df['foundation_depth'].max())
)

bulk_density = st.number_input(
    "Bulk Density",
    float(df['bulk_density'].min()),
    float(df['bulk_density'].max())
)

field_score = st.number_input(
    "Field Observation Score",
    float(df['field_observation_score'].min()),
    float(df['field_observation_score'].max())
)

input_data = pd.DataFrame({
    'soil_type': [soil_type],
    'grain_size': [grain_size],
    'moisture_content': [moisture],
    'foundation_depth': [depth],
    'bulk_density': [bulk_density],
    'field_observation_score': [field_score]
})

input_transformed = transformer.transform(input_data)

if st.button("Predict Bearing Capacity"):
    result = lr.predict(input_transformed)
    st.success(f"Predicted Bearing Capacity: {result[0]:.2f}")
