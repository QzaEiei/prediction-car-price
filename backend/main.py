from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import xgboost as xgb
import sklearn  # <--- 1. ต้อง import อันนี้เพิ่ม
from sklearn import set_config
# 2. บังคับให้ Pipeline ส่งต่อข้อมูลเป็น DataFrame (รักษาชื่อคอลัมน์ไว้)
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
    Car_Age: int        # รับค่าอายุรถโดยตรง (Frontend คำนวณมาให้แล้ว)
    Kms_Driven: int
    Fuel_Type: int
    Transmission: int

@app.post("/predict")
def predict_price(item: CarItem):
    try:
        # 3. สร้าง DataFrame (คอลัมน์ต้องเรียงเป๊ะๆ ตามตอน Train)
        data = pd.DataFrame([[
            item.Present_Price,
            item.Kms_Driven,
            item.Fuel_Type,
            item.Transmission,
            item.Car_Age  # <--- ใช้ item.Car_Age ได้เลย (ไม่ต้องลบปีแล้ว)
        ]], columns=['Present_Price', 'Kms_Driven', 'Fuel_Type', 'Transmission', 'Car_Age'])
        
        # 4. ทำนายผล
        prediction = model.predict(data)
        
        return {"predicted_price": float(prediction[0])}
        
    except Exception as e:
        return {"error": str(e)}