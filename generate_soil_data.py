import pandas as pd
import numpy as np

# Configuration
NUM_SAMPLES = 1800  # Target range 1500-2000
OUTPUT_FILE = "synthetic_soil_bearing_capacity.csv"
np.random.seed(42)  # For reproducibility

# 1. Generate Input Features
print("Generating synthetic soil data...")

# Distributions tailored slightly to real-world prevalence (e.g., more Clay/Sand than Gravel in typical broad datasets)
soil_types = ["Clay", "Sand", "Silt", "Gravel"]
soil_probs = [0.30, 0.35, 0.25, 0.10]

grain_sizes = ["Fine", "Medium", "Coarse"]

df = pd.DataFrame({
    'soil_type': np.random.choice(soil_types, NUM_SAMPLES, p=soil_probs),
    'moisture_content': np.random.uniform(5, 40, NUM_SAMPLES), # Percentage
    'bulk_density': np.random.uniform(14, 22, NUM_SAMPLES),     # kN/m^3
    'grain_size': np.random.choice(grain_sizes, NUM_SAMPLES),
    'foundation_depth': np.random.uniform(0.5, 3.0, NUM_SAMPLES), # Meters
    'field_observation_score': np.random.randint(1, 6, NUM_SAMPLES) # 1-5 scale
})

# 2. Define Data Generation Logic (Physics-inspired synthetic rules)
def calculate_bearing_capacity(row):
    # Base capacity ranges based on soil type
    # Clay: low, Silt: med-low, Sand: med, Gravel: high
    base_map = {
        "Clay": 70,
        "Silt": 100,
        "Sand": 150,
        "Gravel": 230
    }
    
    base_val = base_map[row['soil_type']]
    
    # Factor: Moisture Content (Negative correlation)
    # Clay is highly sensitive to moisture (swelling/softening)
    if row['soil_type'] == "Clay":
        moisture_impact = -1.5 * (row['moisture_content'] ** 1.2) # Non-linear penalty
    else:
        moisture_impact = -0.8 * row['moisture_content']
        
    # Factor: Bulk Density (Positive correlation)
    # Denser soil -> higher capacity
    density_impact = (row['bulk_density'] - 14) * 12
    
    # Factor: Foundation Depth (Positive correlation)
    # Deeper foundations reach more stable soil
    depth_impact = (row['foundation_depth'] ** 1.1) * 25 # Slightly non-linear
    
    # Factor: Field Observation Score (Positive correlation)
    # Represents visual firmness, consolidation, etc.
    score_impact = row['field_observation_score'] * 8
    
    # Factor: Grain Size (Multiplier)
    grain_map = {"Fine": 0.9, "Medium": 1.0, "Coarse": 1.15}
    grain_multiplier = grain_map[row['grain_size']]
    
    # Calculate raw capacity
    raw_capacity = (base_val + moisture_impact + density_impact + depth_impact + score_impact) * grain_multiplier
    
    # Add Random Noise (10-15%) to simulate real-world variability/measurement error
    noise_pct = np.random.uniform(-0.15, 0.15)
    final_capacity = raw_capacity * (1 + noise_pct)
    
    # Clean up bounds based on requirements
    return max(50, min(400, final_capacity))

# Apply the calculation logic
df['bearing_capacity'] = df.apply(calculate_bearing_capacity, axis=1)

# 3. Generate Target Class: Safety Class
def determine_safety(capacity):
    if capacity < 100:
        return "Unsafe"
    elif capacity < 200:
        return "Moderate"
    else:
        return "Safe"

df['safety_class'] = df['bearing_capacity'].apply(determine_safety)

# 4. Final Formatting
# Shuffle the dataset
df = df.sample(frac=1).reset_index(drop=True)

# Rounding for realism
df['moisture_content'] = df['moisture_content'].round(2)
df['bulk_density'] = df['bulk_density'].round(2)
df['foundation_depth'] = df['foundation_depth'].round(2)
df['bearing_capacity'] = df['bearing_capacity'].round(2)

# Save to CSV
df.to_csv(OUTPUT_FILE, index=False)

print(f"Successfully generated {len(df)} rows and saved to '{OUTPUT_FILE}'.")
print("-" * 30)
print("First 5 rows:")
print(df.head())
print("-" * 30)
print("Dataset Statistics:")
print(df.describe())
print("-" * 30)
print("Safety Class Distribution:")
print(df['safety_class'].value_counts())
