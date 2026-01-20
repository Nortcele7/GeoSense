# GeoSense

A comprehensive geotechnical analysis platform that combines machine learning, natural language processing, and soil classification to provide intelligent soil analysis and bearing capacity predictions.

## 🌟 Features

- **Soil Classification**: Image-based soil type identification (clay, sand, gravel, silt)
- **NLP Field Observations**: Process and analyze field observation notes using natural language processing
- **Bearing Capacity Analysis**: Calculate and predict soil bearing capacity using machine learning
- **Multi-Platform Support**: 
  - Web application (React/Vite frontend)
  - Mobile application (React Native)
  - Backend API services
- **Data Augmentation**: Enhanced field observation data processing
- **Interactive Notebooks**: Jupyter notebooks for data exploration and model development

## 📁 Project Structure

```
GeoSense/
├── app.py                                    # Main application entry point
├── app1.py                                   # Alternative application configuration
├── backend.py                                # Backend API server
├── soil_engine_core.py                       # Core soil analysis engine
├── dataset/                                  # Training dataset
│   ├── clay/                                 # Clay soil images
│   ├── gravel/                               # Gravel soil images
│   ├── sand/                                 # Sand soil images
│   └── slit/                                 # Silt soil images
├── nlp_field_observation.csv                 # Field observation data
├── nlp_field_observation_augmented.csv       # Augmented observation data
├── soil_geo_data.csv                         # Geotechnical data
├── synthetic_soil_bearing_capacity.csv       # Bearing capacity dataset
├── nlp_process.ipynb                         # NLP processing notebook
├── main.ipynb                                # Main analysis notebook
├── geosense-frontend/                        # Web frontend (Vite + React)
└── geosense-mobile/                          # Mobile app (React Native)
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the backend server:
```bash
python backend.py
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd geosense-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Mobile App Setup

1. Navigate to the mobile directory:
```bash
cd geosense-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the app:
```bash
npm start
```

## 🔬 Components

### Soil Engine Core
The `soil_engine_core.py` module provides:
- Soil property calculations
- Bearing capacity predictions
- Geotechnical parameter analysis

### NLP Processing
Natural language processing capabilities for:
- Field observation extraction
- Automated report generation
- Data augmentation from text descriptions

### Image Classification
Deep learning model for soil type identification:
- Clay
- Sand
- Gravel
- Silt

## 📊 Data Files

- **nlp_field_observation.csv**: Raw field observation data
- **nlp_field_observation_augmented.csv**: Enhanced observation data with NLP processing
- **soil_geo_data.csv**: Geotechnical soil properties and measurements
- **synthetic_soil_bearing_capacity.csv**: Training data for bearing capacity predictions

## 🛠️ Technologies

### Backend
- Python
- Machine Learning (TensorFlow/PyTorch/Scikit-learn)
- Natural Language Processing
- Flask/FastAPI (API framework)

### Frontend
- React
- Vite
- JavaScript/TypeScript

### Mobile
- React Native
- TypeScript

## 📱 Usage

1. **Image Analysis**: Upload soil images to classify soil type
2. **Field Observations**: Input text-based field notes for automated analysis
3. **Bearing Capacity**: Calculate soil bearing capacity based on parameters
4. **Report Generation**: Generate comprehensive geotechnical reports

## 🧪 Jupyter Notebooks

Explore the analysis notebooks:
- `main.ipynb`: Main analysis workflow
- `nlp_process.ipynb`: NLP processing pipeline
- `new.ipynb`: Experimental features

## 📈 Model Training

The dataset contains labeled images for soil classification:
- Clay: 29 samples
- Gravel: 70 samples
- Sand: 30+ samples
- Silt: Multiple samples

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

GeoSense Development Team

## 🔗 Links

- Documentation: [Coming Soon]
- API Reference: [Coming Soon]
- Support: [Coming Soon]

---

**Note**: This is a geotechnical analysis tool. Always verify results with professional engineers for critical applications.
