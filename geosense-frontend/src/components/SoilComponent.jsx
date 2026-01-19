import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SoilForm = () => {
  const [formData, setFormData] = useState({
    moisture_content: "",
    bulk_density: "",
    foundation_depth: "",
    field_score: "",
    soil_type: "Sand",
    grain_size_type: "Fine",
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.soil_type) {
      setFormData(prev => ({
        ...prev,
        soil_type: location.state.soil_type
      }));
    }
  }, [location]);

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);
    setIsLoading(true);

    const payload = {
      moisture_content: Number(formData.moisture_content),
      bulk_density: Number(formData.bulk_density),
      foundation_depth: Number(formData.foundation_depth),
      field_score: formData.field_score,
      soil_type: formData.soil_type,
      grain_size_type: formData.grain_size_type,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setPrediction({
        value: response.data.Prediction,
        safety: response.data.SafetyClass,
      });
    } catch (err) {
      const errorDetail =
        err.response?.data?.detail ||
        err.response?.data ||
        err.message ||
        "Something went wrong";
      setError(`Error: ${errorDetail}`);
    } finally {
      setIsLoading(false);
    }
  };

    const handleGetSuggestion = async () => {
    if (!prediction) return;
    setIsLoadingSuggestion(true);
    setAiSuggestion(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/aisuggest",
        {
          bearing_capacity: prediction.value,
          safety_class: prediction.safety
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setAiSuggestion(response.data.text);
    } catch (err) {
      console.error(err);
      setAiSuggestion("Error fetching AI suggestion. Please try again.");
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const safetyColors = {
    Safe: "#4CAF50", // Rich green
    Moderate: "#FF9800", // Warm orange
    Unsafe: "#F44336", // Alert red
  };

  const safetyIcons = {
    Safe: "✓",
    Moderate: "⚠",
    Unsafe: "✗"
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #8BC34A 0%, #CDDC39 50%, #FFEB3B 100%)",
      padding: "20px",
      fontFamily: "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        background: "#FFFFFF",
        padding: "40px",
        borderRadius: "24px",
        maxWidth: "720px",
        width: "100%",
        boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
        border: "1px solid rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "12px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "22px",
              fontWeight: "800",
              boxShadow: "0 6px 20px rgba(76, 175, 80, 0.3)"
            }}>
              GS
            </div>
            <div>
              <h1 style={{
                margin: "0",
                fontSize: "32px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
                lineHeight: "1.2"
              }}>
                GeoSense AI
              </h1>
              <p style={{
                margin: "4px 0 0 0",
                color: "#689F38",
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "1.5px",
                textTransform: "uppercase"
              }}>
                Advanced Soil Strength Prediction
              </p>
            </div>
          </div>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit}>
  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "32px"
  }}>
    {/* Column 1 */}
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Soil Type */}
      <div>
        <label style={{
          color: "#33691E",
          fontSize: "13px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "8px",
          display: "block",
          alignItems: "center",
          gap: "6px"
        }}>
          <span>🌱</span>
          SOIL TYPE
        </label>
        <select
          name="soil_type"
          value={formData.soil_type}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "15px 16px",
            borderRadius: "12px",
            border: "2px solid #DCEDC8",
            fontSize: "15px",
            color: "#33691E",
            background: "#F9FBE7",
            appearance: "none",
            backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%234CAF50\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"%3e%3cpolyline points=\"6 9 12 15 18 9\"%3e%3c/polyline%3e%3c/svg%3e')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 16px center",
            backgroundSize: "16px",
            fontWeight: "500",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4CAF50";
            e.target.style.boxShadow = "0 0 0 3px rgba(76, 175, 80, 0.1)";
            e.target.style.background = "#FFFFFF";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#DCEDC8";
            e.target.style.boxShadow = "none";
            e.target.style.background = "#F9FBE7";
          }}
        >
          <option style={{ background: "#FFFFFF", color: "#33691E", padding: "8px" }}>Sand</option>
          <option style={{ background: "#FFFFFF", color: "#33691E", padding: "8px" }}>Clay</option>
          <option style={{ background: "#FFFFFF", color: "#33691E", padding: "8px" }}>Silt</option>
          <option style={{ background: "#FFFFFF", color: "#33691E", padding: "8px" }}>Gravel</option>
        </select>
      </div>

      {/* Moisture Content */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label style={{
            color: "#33691E",
            fontSize: "13px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>💧</span>
            MOISTURE CONTENT
          </label>
          <span style={{ color: "#8BC34A", fontSize: "11px", fontWeight: "500" }}>(%)</span>
        </div>
        <input
          type="number"
          name="moisture_content"
          value={formData.moisture_content}
          onChange={handleChange}
          required
          step="any"
          placeholder="15.5"
          style={{
            width: "90%",
            padding: "15px 16px",
            borderRadius: "12px",
            border: "2px solid #DCEDC8",
            fontSize: "15px",
            color: "#33691E",
            background: "#F9FBE7",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            fontWeight: "500"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4CAF50";
            e.target.style.boxShadow = "0 0 0 3px rgba(76, 175, 80, 0.1)";
            e.target.style.background = "#FFFFFF";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#DCEDC8";
            e.target.style.boxShadow = "none";
            e.target.style.background = "#F9FBE7";
          }}
        />
      </div>
    </div>

    {/* Column 2 */}
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Grain Size */}
      <div>
        <label style={{
          color: "#33691E",
          fontSize: "13px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <span>🔬</span>
          GRAIN SIZE
        </label>
        <select
          name="grain_size_type"
          value={formData.grain_size_type}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "15px 16px",
            borderRadius: "12px",
            border: "2px solid #DCEDC8",
            fontSize: "15px",
            color: "#33691E",
            background: "#F9FBE7",
            appearance: "none",
            backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%234CAF50\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"%3e%3cpolyline points=\"6 9 12 15 18 9\"%3e%3c/polyline%3e%3c/svg%3e')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 16px center",
            backgroundSize: "16px",
            fontWeight: "500",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4CAF50";
            e.target.style.boxShadow = "0 0 0 3px rgba(76, 175, 80, 0.1)";
            e.target.style.background = "#FFFFFF";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#DCEDC8";
            e.target.style.boxShadow = "none";
            e.target.style.background = "#F9FBE7";
          }}
        >
          <option style={{ background: "#FFFFFF", color: "#33691E", padding: "8px" }}>Fine</option>
          <option style={{ background: "#FFFFFF", color: "#33691E", padding: "8px" }}>Medium</option>
          <option style={{ background: "#FFFFFF", color: "#33691E", padding: "8px" }}>Coarse</option>
        </select>
      </div>

      {/* Bulk Density */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label style={{
            color: "#33691E",
            fontSize: "13px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>⚖️</span>
            BULK DENSITY
          </label>
          <span style={{ color: "#8BC34A", fontSize: "11px", fontWeight: "500" }}>(g/cm³)</span>
        </div>
        <input
          type="number"
          name="bulk_density"
          value={formData.bulk_density}
          onChange={handleChange}
          required
          step="any"
          placeholder="1.65"
          style={{
            width: "90%",
            padding: "15px 16px",
            borderRadius: "12px",
            border: "2px solid #DCEDC8",
            fontSize: "15px",
            color: "#33691E",
            background: "#F9FBE7",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            fontWeight: "500"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4CAF50";
            e.target.style.boxShadow = "0 0 0 3px rgba(76, 175, 80, 0.1)";
            e.target.style.background = "#FFFFFF";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#DCEDC8";
            e.target.style.boxShadow = "none";
            e.target.style.background = "#F9FBE7";
          }}
        />
      </div>
    </div>

    {/* Full-width inputs */}
    <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Foundation Depth */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label style={{
            color: "#33691E",
            fontSize: "13px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span>⛏️</span>
            FOUNDATION DEPTH
          </label>
          <span style={{ color: "#8BC34A", fontSize: "11px", fontWeight: "500" }}>(m)</span>
        </div>
        <input
          type="number"
          name="foundation_depth"
          value={formData.foundation_depth}
          onChange={handleChange}
          required
          step="any"
          placeholder="2.5"
          style={{
            width: "100%",
            padding: "15px 16px",
            borderRadius: "12px",
            border: "2px solid #DCEDC8",
            fontSize: "15px",
            color: "#33691E",
            background: "#F9FBE7",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            fontWeight: "500"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4CAF50";
            e.target.style.boxShadow = "0 0 0 3px rgba(76, 175, 80, 0.1)";
            e.target.style.background = "#FFFFFF";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#DCEDC8";
            e.target.style.boxShadow = "none";
            e.target.style.background = "#F9FBE7";
          }}
        />
      </div>

      {/* Field Observation */}
      <div>
        <label style={{
          color: "#33691E",
          fontSize: "13px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "8px",
          display: "block",
          alignItems: "center",
          gap: "6px"
        }}>
          <span>📝</span>
          FIELD OBSERVATION
        </label>
        <textarea
          name="field_score"
          value={formData.field_score}
          onChange={handleChange}
          required
          rows="4"
          placeholder="Describe soil condition (color, texture, consistency, moisture appearance...)"
          style={{
            width: "100%",
            padding: "15px 16px",
            borderRadius: "12px",
            border: "2px solid #DCEDC8",
            fontSize: "15px",
            color: "#33691E",
            background: "#F9FBE7",
            resize: "vertical",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            minHeight: "120px",
            fontWeight: "500",
            fontFamily: "'Poppins', 'Segoe UI', sans-serif"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4CAF50";
            e.target.style.boxShadow = "0 0 0 3px rgba(76, 175, 80, 0.1)";
            e.target.style.background = "#FFFFFF";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#DCEDC8";
            e.target.style.boxShadow = "none";
            e.target.style.background = "#F9FBE7";
          }}
        />
      </div>
    </div>
  </div>

  {/* Submit button stays unchanged */}

  {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "18px",
              background: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: "0 8px 25px rgba(76, 175, 80, 0.25)"
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.transform = "translateY(-3px)", e.target.style.boxShadow = "0 12px 35px rgba(76, 175, 80, 0.35)")}
            onMouseOut={(e) => !isLoading && (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 8px 25px rgba(76, 175, 80, 0.25)")}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: "20px",
                  height: "20px",
                  border: "3px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                ANALYZING SOIL PROPERTIES...
              </>
            ) : (
              <>
                <span style={{ fontSize: "18px" }}>🔍</span>
                ANALYZE SOIL STRENGTH
              </>
            )}
          </button>

</form>

        

        {/* Prediction Result */}
        {prediction && (
          <div style={{
            marginTop: "32px",
            padding: "28px",
            background: "linear-gradient(135deg, #F1F8E9 0%, #F9FBE7 100%)",
            borderRadius: "18px",
            border: "2px solid #DCEDC8",
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            animation: "fadeIn 0.5s ease-out"
          }}>
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
              marginBottom: "20px"
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                background: safetyColors[prediction.safety],
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "26px",
                fontWeight: "bold",
                boxShadow: `0 6px 20px ${safetyColors[prediction.safety]}40`,
                flexShrink: "0"
              }}>
                {safetyIcons[prediction.safety]}
              </div>
              <div style={{ flex: "1" }}>
                <h3 style={{
                  margin: "0 0 6px 0",
                  color: "#33691E",
                  fontSize: "20px",
                  fontWeight: "700",
                  letterSpacing: "-0.3px"
                }}>
                  Analysis Complete
                </h3>
                <p style={{
                  margin: "0",
                  color: "#689F38",
                  fontSize: "13px",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px"
                }}>
                  GeoSense AI Prediction
                </p>
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
              marginBottom: "24px"
            }}>
              <span style={{
                fontSize: "48px",
                fontWeight: "800",
                color: "#33691E",
                lineHeight: "1",
                letterSpacing: "-1px"
              }}>
                {prediction.value.toFixed(2)}
              </span>
              <span style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#689F38",
                marginBottom: "4px"
              }}>
                kN/m²
              </span>
            </div>

    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 24px",
        background: safetyColors[prediction.safety],
        borderRadius: "12px",
        boxShadow: `0 6px 20px ${safetyColors[prediction.safety]}40`,
      }}
    >
      <span
        style={{
          fontSize: "18px",
          fontWeight: "800",
          color: "white",
          letterSpacing: "1px",
        }}
      >
        {prediction.safety} SOIL
      </span>
      <div
        style={{
          width: "1px",
          height: "24px",
          background: "rgba(255,255,255,0.3)",
        }}
      ></div>
      <span
        style={{
          fontSize: "14px",
          color: "white",
          fontWeight: "500",
          opacity: "0.9",
        }}
      >
        {prediction.safety === "Safe"
          ? "✓ Suitable for construction"
          : prediction.safety === "Moderate"
          ? "⚠ Requires reinforcement"
          : "✗ Requires soil treatment"}
      </span>
    </div>

    {/* AI Suggestion Button */}
    <button
      onClick={handleGetSuggestion}
      disabled={isLoadingSuggestion}
      style={{
        marginTop: "24px",
        width: "100%",
        padding: "16px",
        fontSize: "16px",
        fontWeight: "600",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        background: isLoadingSuggestion ? "#A5D6A7" : "#4CAF50",
        color: "white",
        boxShadow: "0 6px 20px rgba(76, 175, 80, 0.3)",
        transition: "background 0.3s ease",
      }}
    >
      {isLoadingSuggestion ? "Loading suggestion..." : "Get AI Construction Suggestion"}
    </button>

    {/* AI Suggestion Display */}
    {aiSuggestion && (
      <div
        style={{
          marginTop: "16px",
          padding: "20px",
          background: "#E8F5E9",
          borderRadius: "12px",
          color: "#2E7D32",
          fontWeight: "600",
          fontSize: "16px",
          boxShadow: "0 4px 15px rgba(46, 125, 50, 0.2)",
          whiteSpace: "pre-wrap",
        }}
      >
        {aiSuggestion}
      </div>
    )}
  </div>
)}


        {/* Error Display */}
        {error && (
          <div style={{
            marginTop: "24px",
            padding: "20px",
            background: "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)",
            borderRadius: "14px",
            borderLeft: "6px solid #F44336",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            animation: "shake 0.5s ease-in-out"
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              background: "#F44336",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              flexShrink: "0",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)"
            }}>
              !
            </div>
            <div>
              <h4 style={{
                margin: "0 0 6px 0",
                color: "#D32F2F",
                fontSize: "14px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.8px"
              }}>
                Analysis Error
              </h4>
              <p style={{
                margin: "0",
                color: "#B71C1C",
                fontSize: "14px",
                lineHeight: "1.5",
                fontWeight: "500"
              }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "1px solid #DCEDC8",
          textAlign: "center"
        }}>
          <p style={{
            margin: "0",
            color: "#689F38",
            fontSize: "12px",
            fontWeight: "500",
            letterSpacing: "0.8px",
            opacity: "0.8"
          }}>
            © 2024 GeoSense AI • Civil Engineering Intelligence System
          </p>
          <p style={{
            margin: "8px 0 0 0",
            color: "#8BC34A",
            fontSize: "11px",
            fontWeight: "400",
            letterSpacing: "0.5px",
            opacity: "0.6"
          }}>
            AI-Powered Soil Analysis for Safer Construction
          </p>
        </div>
      </div>

      {/* Inline CSS for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          div[style*="max-width: 720px"] {
            padding: 24px !important;
          }
          
          h1[style*="font-size: 32px"] {
            font-size: 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="padding: 40px"] {
            padding: 20px !important;
          }
          
          button[style*="padding: 18px"] {
            padding: 14px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SoilForm;  