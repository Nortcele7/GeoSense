import React, { useState } from "react";
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

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      field_score: Number(formData.field_score),
      soil_type: formData.soil_type,
      grain_size_type: formData.grain_size_type,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // Only take prediction value and safety class
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

  return (
    <div className="soil-form-container">
      <div className="soil-form-card">
        <div className="soil-form-header">
          <div className="soil-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <h2 className="soil-form-title">Soil Strength Predictor</h2>
          <p className="soil-form-subtitle">
            Enter soil properties to predict strength
          </p>
        </div>

        <form onSubmit={handleSubmit} className="soil-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Moisture Content</span>
                <span className="label-unit">(%)</span>
              </label>
              <input
                type="number"
                name="moisture_content"
                value={formData.moisture_content}
                onChange={handleChange}
                required
                step="any"
                className="form-input"
                placeholder="e.g., 15.5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Bulk Density</span>
                <span className="label-unit">(g/cm³)</span>
              </label>
              <input
                type="number"
                name="bulk_density"
                value={formData.bulk_density}
                onChange={handleChange}
                required
                step="any"
                className="form-input"
                placeholder="e.g., 1.65"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Foundation Depth</span>
                <span className="label-unit">(m)</span>
              </label>
              <input
                type="number"
                name="foundation_depth"
                value={formData.foundation_depth}
                onChange={handleChange}
                required
                step="any"
                className="form-input"
                placeholder="e.g., 2.5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Field Score</span>
                <span className="label-unit">(1-5)</span>
              </label>
              <input
                type="number"
                name="field_score"
                value={formData.field_score}
                onChange={handleChange}
                required
                min="1"
                max="5"
                step="any"
                className="form-input"
                placeholder="e.g., 5"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Soil Type</label>
              <select
                name="soil_type"
                value={formData.soil_type}
                onChange={handleChange}
                className="form-input"
              >
                <option>Sand</option>
                <option>Clay</option>
                <option>Silt</option>
                <option>Gravel</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Grain Size Type</label>
              <select
                name="grain_size_type"
                value={formData.grain_size_type}
                onChange={handleChange}
                className="form-input"
              >
                <option>Fine</option>
                <option>Medium</option>
                <option>Coarse</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span> Predicting...
              </>
            ) : (
              "Get Prediction"
            )}
          </button>
        </form>

        {/* Prediction display */}
        {prediction && (
          <div className="prediction-card">
            <div className="prediction-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div className="prediction-content">
              <h3 className="prediction-title">Predicted Strength</h3>
              <div className="prediction-value">
                {prediction.value.toFixed(2)}
                <span className="prediction-unit"> kN/m²</span>
              </div>
              <div
                className={`safety-class ${
                  prediction.safety === "Safe"
                    ? "safe"
                    : prediction.safety === "Moderate"
                    ? "moderate"
                    : "unsafe"
                }`}
              >
                Safety Class: {prediction.safety}
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="error-card">
            <div className="error-icon">!</div>
            <div className="error-content">
              <h4 className="error-title">Prediction Error</h4>
              <p className="error-message">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* CSS */}
      <style>{`
        .soil-form-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .soil-form-card {
          width: 100%;
          max-width: 540px;
          background: #ffffff;
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }
        .soil-form-card:hover { transform: translateY(-3px); box-shadow: 0 25px 70px rgba(0,0,0,0.2); }
        .soil-form-header { text-align: center; margin-bottom: 32px; }
        .soil-icon { width: 64px; height: 64px; margin: 0 auto 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; }
        .soil-icon svg { width: 32px; height: 32px; }
        .soil-form-title { margin: 0 0 8px 0; color: #2d3748; font-size: 28px; font-weight: 700; }
        .soil-form-subtitle { margin: 0; color: #718096; font-size: 14px; font-weight: 500; letter-spacing: 0.5px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
        .form-group { display: flex; flex-direction: column; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .label-text { color: #4a5568; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .label-unit { color: #a0aec0; font-size: 12px; font-weight: 500; }
        .form-input { padding: 14px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px; color: #2d3748; transition: all 0.3s ease; background: #f8fafc; }
        .form-input:focus { outline: none; border-color: #667eea; background: #ffffff; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15); }
        select.form-input { appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='14' height='8' viewBox='0 0 14 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23718796' d='M7 8l7-8H0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; background-size: 12px 12px; }
        .submit-button { width: 100%; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s ease; }
        .submit-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(102,126,234,0.3); }
        .submit-button:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .prediction-card { margin-top: 32px; padding: 24px; background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%); border-radius: 16px; display: flex; align-items: center; gap: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .prediction-icon { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #2d3748; }
        .prediction-content { flex: 1; }
        .prediction-title { margin: 0 0 4px 0; color: #2d3748; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .prediction-value { font-size: 36px; font-weight: 800; color: #2d3748; line-height: 1; margin-bottom: 4px; }
        .prediction-unit { font-size: 16px; font-weight: 600; color: #4a5568; }
        .safety-class { margin-top: 10px; font-weight: 700; font-size: 16px; }
        .safety-class.safe { color: #2f855a; }
        .safety-class.moderate { color: #d69e2e; }
        .safety-class.unsafe { color: #c53030; }
        .error-card { margin-top: 24px; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 16px; display: flex; align-items: flex-start; gap: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .error-icon { width: 24px; height: 24px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #f5576c; font-weight: 800; flex-shrink: 0; }
        .error-content { flex: 1; }
        .error-title { margin: 0 0 4px 0; color: white; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .error-message { margin: 0; color: white; font-size: 14px; line-height: 1.5; opacity: 0.9; }
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
          .soil-form-card { padding: 30px 20px; }
          .prediction-value { font-size: 28px; }
          .soil-form-title { font-size: 24px; }
        }
      `}</style>
    </div>
  );
};

export default SoilForm;
