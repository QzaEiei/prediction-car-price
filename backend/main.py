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

# รับค่า 5 ตัว (รับ Car_Age มาเลย ตามที่ตกลงกับหน้าเว็บ)
class CarItem(BaseModel):
    Present_Price: float  # ราคามือหนึ่ง (แสนบาท)
    Car_Age: int          # อายุรถ (หน้าเว็บคำนวณส่งมาให้แล้ว)
    Kms_Driven: int       # เลขไมล์
    Fuel_Type: int        # 0=Petrol, 1=Diesel, 2=CNG
    Transmission: int     # 0=Manual, 1=Auto

@app.post("/predict")
def predict_price(item: CarItem):
    try:
        # 1. ไม่ต้องคำนวณอายุรถใหม่แล้ว! 
        # เพราะ Frontend ส่ง item.Car_Age ที่ถูกต้องมาให้แล้ว ใช้ได้เลยครับ

        # 2. เรียงข้อมูลใส่ DataFrame
        # ⚠️ ลำดับคอลัมน์ต้องตรงกับตอนเทรนโมเดลเป๊ะๆ
        data = pd.DataFrame([[
            item.Present_Price,
            item.Kms_Driven,
            item.Fuel_Type,
            item.Transmission,
            item.Car_Age      # <--- ✅ ใช้ค่าจาก item.Car_Age ได้เลย
        ]], columns=['Present_Price', 'Kms_Driven', 'Fuel_Type', 'Transmission', 'Car_Age'])
        
        # 3. ให้โมเดลทำนาย
        prediction = model.predict(data)
        
        return {"predicted_price": float(prediction[0])}
        
    except Exception as e:
        # ส่ง error กลับไปดูว่าเกิดอะไรขึ้น
        return {"error": str(e)}