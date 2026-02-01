from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import xgboost as xgb
import sklearn
from sklearn import set_config

# ✅ สั่งแก้บั๊กตรงนี้ (บรรทัดสำคัญที่สุด!)
# สั่งให้ Scikit-learn ส่งข้อมูลเป็น DataFrame เสมอ (รักษาชื่อคอลัมน์ไว้)
set_config(transform_output="pandas")

# โหลดโมเดล
model = joblib.load('My_Best_XGBoost_Tuned.pkl')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CarItem(BaseModel):
    Present_Price: float
    Car_Age: int
    Kms_Driven: int
    Fuel_Type: int
    Transmission: int

@app.post("/predict")
def predict_price(item: CarItem):
    try:
        # สร้าง DataFrame
        # ⚠️ ชื่อคอลัมน์ต้องตรงกับตอน Train เป๊ะๆ
        data = pd.DataFrame([[
            item.Present_Price,
            item.Kms_Driven,
            item.Fuel_Type,
            item.Transmission,
            item.Car_Age
        ]], columns=['Present_Price', 'Kms_Driven', 'Fuel_Type', 'Transmission', 'Car_Age'])
        
        # ทำนายผล
        prediction = model.predict(data)
        
        return {"predicted_price": float(prediction[0])}
        
    except Exception as e:
        return {"error": str(e)}