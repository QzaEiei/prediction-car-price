from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# ==========================================
# 1. SETUP & LOAD RESOURCES
# ==========================================
print("Loading models and data...")

# โหลดโมเดล AI และตัวแปลง
model = joblib.load('car_price_xgb_tuned.pkl')
encoders = joblib.load('car_price_encoders.pkl')

# --- [ส่วนที่เพิ่มมา] โหลดข้อมูลดิบเพื่อทำ Dropdown List ---
# เราต้องอ่าน CSV เพื่อดูว่า ยี่ห้อไหน (Key) มีรุ่นอะไรบ้าง (Value)
try:
    raw_df = pd.read_csv('car_price_data.csv')
    
    # Clean ข้อมูลเบื้องต้นเพื่อให้ได้รายชื่อรุ่นที่ถูกต้อง (เหมือนตอนเทรน)
    raw_df['Levy'] = raw_df['Levy'].replace('-', '0')
    # กรองราคาที่ผิดปกติออก เพื่อไม่ให้มีรุ่นรถแปลกๆ หลุดมา
    raw_df['Price'] = pd.to_numeric(raw_df['Price'], errors='coerce')
    raw_df = raw_df[(raw_df['Price'] > 500) & (raw_df['Price'] < 150000)]

    # สร้าง Dictionary: { "TOYOTA": ["Prius", "Camry"], "HONDA": ["Civic", ...] }
    # 1. Group ตามยี่ห้อ
    # 2. หาชื่อรุ่นที่ไม่ซ้ำ (unique)
    # 3. เรียงลำดับชื่อรุ่น (sorted)
    car_options = (
        raw_df.groupby('Manufacturer')['Model']
        .unique()
        .apply(lambda x: sorted(list(x))) 
        .to_dict()
    )
    print("-> Car options loaded successfully.")

except Exception as e:
    print(f"Warning: Could not load car_price_data.csv for options. Error: {e}")
    car_options = {}

# ==========================================
# 2. API CONFIGURATION
# ==========================================
app = FastAPI()

# เปิด CORS ให้ Next.js (port 3000) ยิงเข้ามาได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# กำหนดหน้าตาข้อมูลที่จะรับ (Pydantic Model)
class CarItem(BaseModel):
    Levy: int
    Manufacturer: str
    Model: str
    Prod_year: int
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

# ==========================================
# 3. ENDPOINTS
# ==========================================

# --- API ใหม่: ส่งรายชื่อ ยี่ห้อ และ รุ่นรถ ไปให้ Frontend ---
@app.get("/car_options")
def get_car_options():
    if not car_options:
        raise HTTPException(status_code=500, detail="Car options data not loaded.")
    return car_options

# --- API เดิม: รับค่ามาทำนายราคา ---
@app.post("/predict")
def predict_price(item: CarItem):
    try:
        # 1. แปลงข้อมูลจาก JSON ให้เป็น DataFrame
        data = {
            'Levy': [item.Levy],
            'Manufacturer': [item.Manufacturer],
            'Model': [item.Model],
            'Prod. year': [item.Prod_year], # Map ชื่อให้ตรงกับโมเดล
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

        # 2. แปลงตัวหนังสือเป็นตัวเลข (Encoding) ด้วย encoders ที่โหลดมา
        categorical_cols = ['Manufacturer', 'Model', 'Category', 'Leather interior', 
                            'Fuel type', 'Gear box type', 'Drive wheels', 
                            'Wheel', 'Color']

        for col in categorical_cols:
            le = encoders.get(col)
            try:
                # แปลงค่าปกติ
                df[col] = le.transform(df[col])
            except:
                # กรณีเจอค่าแปลกๆ (Unseen Label) ให้ใช้ค่าแรกสุดในลิสต์แทน เพื่อกัน Error
                # (หรือคุณจะเลือกใส่ค่า -1 ก็ได้ ถ้าโมเดลรองรับ)
                df[col] = le.transform([le.classes_[0]])

        # 3. ทำนายราคา
        prediction = model.predict(df)
        predicted_price = float(prediction[0])

        return {"price": predicted_price, "currency": "USD"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# วิธีรัน (ใน Terminal): uvicorn main:app --reload