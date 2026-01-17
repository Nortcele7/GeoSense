import pandas as pd
import numpy as np
import random

# Configuration
NUM_SAMPLES = 1000
OUTPUT_FILE = "nlp_field_observation_augmented.csv"
EXISTING_FILE = "nlp_field_observation.csv"

# Word banks ensuring variety
# Score 1: Very Poor (Unsafe, Waterlogged, Very Weak)
score_1_terms = [
    "very soft", "waterlogged", "extremely muddy", "sinking", "collapsing", 
    "marshy", "swampy", "sludge", "quick-sand", "no bearing capacity", "fluid-like",
    "unstable", "hazardous", "liquefied", "zero resistance"
]

# Score 2: Poor (Soft, Loose, Needs Compaction)
score_2_terms = [
    "soft", "loose", "poorly compacted", "yielding", "spongy", 
    "unconsolidated", "weak", "shifts underfoot", "compressible", 
    "lightly consolidated", "needs deep reinforcement"
]

# Score 3: Moderate (Average, Medium Dense)
score_3_terms = [
    "medium dense", "moderately compacted", "average consistency", "stable enough", 
    "slightly moist", "acceptable firmness", "typical silt", "fair condition",
    "partially settled", "moderate stiffness"
]

# Score 4: Good (Firm, Dry, Stable)
score_4_terms = [
    "firm", "dense", "well compacted", "dry", "stable", 
    "high strength", "solid footing", "good bearing", "resistant to penetration",
    "hard clay", "compacted gravel"
]

# Score 5: Very Good (Hard, Rock-like, Excellent)
score_5_terms = [
    "very hard", "cemented", "rock-like", "extremely dense", "impenetrable", 
    "excellent stability", "bedrock exposed", "highly consolidated", 
    "undisturbed", "maximum compaction"
]

# Templates for sentence generation
templates = [
    "The soil is {adj}.",
    "{adj} soil conditions observed.",
    "Ground appears {adj} and {adj}.",
    "Excavation reveals {adj} layers.",
    "Site consists of {adj} material.",
    "{adj} ground.",
    "Foundations would sit on {adj} earth.",
    "Observation: {adj}.",
    "Testing indicates {adj} subsurface.",
    "{adj} terrain."
]

data = []

def generate_observation(score, terms):
    term1 = random.choice(terms)
    term2 = random.choice(terms)
    
    # Mix it up: sometimes 1 term, sometimes 2
    if random.random() > 0.7:
        text = f"{term1} and {term2}"
    else:
        text = term1
        
    template = random.choice(templates)
    sentence = template.format(adj=text)
    
    # cleanup "and and" or double spaces if any
    sentence = sentence.replace("  ", " ").capitalize()
    return sentence

# Generate data
print(f"Generating {NUM_SAMPLES} synthetic NLP observations...")

for _ in range(NUM_SAMPLES):
    # Weighted distribution (slightly more middle scores usually)
    score = np.random.choice([1, 2, 3, 4, 5], p=[0.15, 0.20, 0.30, 0.20, 0.15])
    
    if score == 1:
        obs = generate_observation(score, score_1_terms)
    elif score == 2:
        obs = generate_observation(score, score_2_terms)
    elif score == 3:
        obs = generate_observation(score, score_3_terms)
    elif score == 4:
        obs = generate_observation(score, score_4_terms)
    else: # 5
        obs = generate_observation(score, score_5_terms)
        
    data.append({"observation": obs, "score": score})

# Create DataFrame
new_df = pd.DataFrame(data)

# Try to load existing data to append
try:
    existing_df = pd.read_csv(EXISTING_FILE)
    print(f"Loaded {len(existing_df)} existing rows.")
    final_df = pd.concat([existing_df, new_df], ignore_index=True)
except FileNotFoundError:
    print("Existing file not found, creating new dataset.")
    final_df = new_df

# Shuffle
final_df = final_df.sample(frac=1).reset_index(drop=True)

# Save
final_df.to_csv(OUTPUT_FILE, index=False)
print(f"Saved {len(final_df)} rows to {OUTPUT_FILE}")

# Preview
print(final_df.head(10))
print(final_df['score'].value_counts().sort_index())
