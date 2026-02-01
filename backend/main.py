# file: backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import xgboost as xgb

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

# รับค่า 5 ตัว ตามที่คุณระบุ
class CarItem(BaseModel):
    Present_Price: float  # ราคามือหนึ่ง (แสนบาท)
    Year: int             # ปีผลิต
    Kms_Driven: int       # เลขไมล์
    Fuel_Type: int        # 0=Petrol, 1=Diesel, 2=CNG
    Transmission: int     # 0=Manual, 1=Auto

@app.post("/predict")
def predict_price(item: CarItem):
    try:
        # 1. คำนวณอายุรถ (ตามสูตรของคุณ)
        current_year = 2026
        Car_Age = current_year - item.Year

        # 2. เรียงข้อมูลใส่ DataFrame
        # ⚠️ สำคัญมาก: ลำดับในวงเล็บนี้ ต้องเรียงเหมือนตอนที่คุณสั่ง X_train.columns เป๊ะๆ
        # ผมเรียงให้ตามความน่าจะเป็น แต่ถ้า Error ให้สลับตำแหน่งตรงนี้นะครับ
        data = pd.DataFrame([[
            item.Present_Price,
            item.Kms_Driven,
            item.Fuel_Type,
            item.Transmission,
            Car_Age
        ]], columns=['Present_Price', 'Kms_Driven', 'Fuel_Type', 'Transmission', 'Car_Age'])
        
        # 3. ให้โมเดลทำนาย
        prediction = model.predict(data)
        
        return {"predicted_price": float(prediction[0])}
        
    except Exception as e:
        return {"error": str(e)}
    
    #aaasdasdasd