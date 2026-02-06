from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# 1. โหลดโมเดลและตัวแปลงภาษา
print("Loading models...")
model = joblib.load('car_price_xgb_tuned.pkl')
encoders = joblib.load('car_price_encoders.pkl')

app = FastAPI()

# เปิด CORS ให้ Next.js (port 3000) ยิงเข้ามาได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # หรือระบุ ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. กำหนดหน้าตาข้อมูลที่จะรับ (ต้องตรงกับตอนเทรน)
class CarItem(BaseModel):
    Levy: int
    Manufacturer: str
    Model: str
    Prod_year: int  # ใน pandas ชื่อ 'Prod. year' แต่ใน code ใช้ _ แทนเดี๋ยวไปแก้
    Category: str
    Leather_interior: str
    Fuel_type: str
    Engine_volume: float
    Mileage: int
    Cylinders: int
    Gear_box_type: str
    Drive_wheels: str
    Doors: int
    Wheel: str
    Color: str
    Airbags: int

@app.post("/predict")
def predict_price(item: CarItem):
    try:
        # 3. แปลงข้อมูลจาก JSON ให้เป็น DataFrame
        data = {
            'Levy': [item.Levy],
            'Manufacturer': [item.Manufacturer],
            'Model': [item.Model],
            'Prod. year': [item.Prod_year], # แก้ชื่อให้ตรงกับตอนเทรน
            'Category': [item.Category],
            'Leather interior': [item.Leather_interior],
            'Fuel type': [item.Fuel_type],
            'Engine volume': [item.Engine_volume],
            'Mileage': [item.Mileage],
            'Cylinders': [item.Cylinders],
            'Gear box type': [item.Gear_box_type],
            'Drive wheels': [item.Drive_wheels],
            'Doors': [item.Doors],
            'Wheel': [item.Wheel],
            'Color': [item.Color],
            'Airbags': [item.Airbags]
        }
        df = pd.DataFrame(data)

        # 4. แปลงตัวหนังสือเป็นตัวเลข (Encoding)
        categorical_cols = ['Manufacturer', 'Model', 'Category', 'Leather interior', 
                            'Fuel type', 'Gear box type', 'Drive wheels', 
                            'Wheel', 'Color']

        for col in categorical_cols:
            le = encoders.get(col)
            # กรณีเจอรุ่นรถแปลกๆ ที่ไม่เคยเทรน (Handle Unseen Labels)
            # เราจะพยายามแปลง ถ้าไม่ได้จะใส่ค่า -1 หรือค่าที่เจอบ่อยสุดแทน
            try:
                df[col] = le.transform(df[col])
            except:
                # ถ้าไม่เจอค่านี้ในตอนเทรน ให้ใช้ค่าแรกสุดในตัวแปลง (กัน Error)
                df[col] = le.transform([le.classes_[0]])

        # 5. ทำนายราคา
        prediction = model.predict(df)
        predicted_price = float(prediction[0])

        return {"price": predicted_price, "currency": "USD"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# วิธีรัน: uvicorn main:app --reload