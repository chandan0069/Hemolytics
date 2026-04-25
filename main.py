from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
import os

app = FastAPI()

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= LOAD MODEL FILES =================
model = pickle.load(open("model/disease_model.pkl", "rb"))
scaler = pickle.load(open("model/scaler.pkl", "rb"))
label_encoder = pickle.load(open("model/label_encoder.pkl", "rb"))

# ================= FEATURE LIST (STRICT ORDER) =================
FEATURES = [
    "Glucose", "Cholesterol", "Hemoglobin", "Platelets", "White Blood Cells",
    "Red Blood Cells", "Hematocrit", "Mean Corpuscular Volume", 
    "Mean Corpuscular Hemoglobin", "Mean Corpuscular Hemoglobin Concentration",
    "Insulin", "BMI", "Systolic Blood Pressure", "Diastolic Blood Pressure",
    "Triglycerides", "HbA1c", "LDL Cholesterol", "HDL Cholesterol", "ALT",
    "AST", "Heart Rate", "Creatinine", "Troponin", "C-reactive Protein"
]

@app.get("/")
def read_root():
    return {"message": "HemoLytics FastAPI Backend is running!"}

@app.post("/predict_api")
async def predict_api(request: Request):
    try:
        data = await request.json()
        
        values = []
        for feature in FEATURES:
            values.append(float(data.get(feature, 0.5)))
            
        df = pd.DataFrame([values], columns=FEATURES)
        scaled_data = scaler.transform(df)
        
        pred_encoded = model.predict(scaled_data)[0]
        disease = label_encoder.inverse_transform([pred_encoded])[0]
        
        return {
            "status": "success",
            "prediction": disease
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
