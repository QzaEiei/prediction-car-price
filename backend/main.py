from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
import traceback 
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Union  # สำคัญมาก! ต้อง import ตัวนี้

# ==========================================
# 1. SETUP & LOAD RESOURCES
# ==========================================
print("Loading models and data...")

try:
    model = joblib.load('car_price_xgb_tuned.pkl')
    encoders = joblib.load('car_price_encoders.pkl')
    print("-> Model & Encoders loaded successfully.")
except Exception as e:
    print(f"🔴 Error loading model files: {e}")
    model = None
    encoders = {}

car_options = {}
try:
    csv_path = 'car_price_data.csv'
    if os.path.exists(csv_path):
        raw_df = pd.read_csv(csv_path)
        raw_df['Levy'] = raw_df['Levy'].replace('-', '0')
        raw_df['Price'] = pd.to_numeric(raw_df['Price'], errors='coerce')
        raw_df = raw_df[(raw_df['Price'] > 500) & (raw_df['Price'] < 150000)]
        car_options = (
            raw_df.groupby('Manufacturer')['Model']
            .unique()
            .apply(lambda x: sorted(list(x))) 
            .to_dict()
        )
except Exception as e:
    pass

# ==========================================
# 2. API CONFIGURATION
# ==========================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ส่วนที่ 1: รับค่าได้ทั้งตัวเลขและข้อความ (กัน Error 422)
class CarItem(BaseModel):
    Levy: Union[int, str]
    Manufacturer: str
    Model: str
    Prod_year: int
    Category: str
    Leather_interior: str
    Fuel_type: str
    Engine_volume: Union[float, str]
    Mileage: Union[int, str]
    Cylinders: int
    Gear_box_type: str
    Drive_wheels: str
    Doors: Union[int, str]
    Wheel: str
    Color: str
    Airbags: int

@app.get("/car_options")
def get_car_options():
    return car_options or {}

@app.get("/")
def read_root():
    return {"status": "Server is running correctly!"}

@app.post("/predict")
def predict_price(item: CarItem):
    try:
        # ====================================================
        # 🧹 CLEANING DATA: แปลงข้อความให้เป็นตัวเลขที่สะอาด (แก้ Error 500)
        # ====================================================
        
        # 1. จัดการ Levy (ถ้ามาเป็น "-" ให้เป็น 0)
        try:
            val_levy = str(item.Levy).replace('-', '0')
            clean_levy = int(float(val_levy))
        except:
            clean_levy = 0

        # 2. จัดการ Doors (แปลง 04-May เป็นเลข)
        def fix_doors(val):
            val = str(val)
            if 'May' in val or '4' in val: return 4
            if 'Mar' in val or '2' in val: return 2
            if '>' in val or '5' in val: return 5
            return 4 
        clean_doors = fix_doors(item.Doors)

        # 3. จัดการ Engine Volume (ลบคำว่า Turbo ออก)
        try:
            val_eng = str(item.Engine_volume).lower().replace('turbo', '').strip()
            clean_engine = float(val_eng)
        except:
            clean_engine = 2.0 # ค่า Default ถ้าแปลงไม่ได้

        # 4. จัดการ Mileage (ลบคำว่า km ออก)
        try:
            val_mile = str(item.Mileage).lower().replace('km', '').replace(' ', '')
            clean_mileage = int(float(val_mile))
        except:
            clean_mileage = 0

        # ====================================================

        # ✅ สร้าง DataFrame โดยใช้ค่าที่ Clean แล้ว (clean_xxx)
        data = {
            'Levy': [clean_levy],
            'Manufacturer': [item.Manufacturer],
            'Model': [item.Model],
            'Prod. year': [item.Prod_year], 
            'Category': [item.Category],
            'Leather interior': [item.Leather_interior],
            'Fuel type': [item.Fuel_type],
            'Engine volume': [clean_engine], # ใช้ค่าที่สะอาดแล้ว
            'Mileage': [clean_mileage],      # ใช้ค่าที่สะอาดแล้ว
            'Cylinders': [item.Cylinders],
            'Gear box type': [item.Gear_box_type],
            'Drive wheels': [item.Drive_wheels],
            'Doors': [clean_doors],          # ใช้ค่าที่สะอาดแล้ว
            'Wheel': [item.Wheel],
            'Color': [item.Color],
            'Airbags': [item.Airbags]
        }
        df = pd.DataFrame(data)

        # 🛠️ แปลงหมวดหมู่ (Categorical)
        categorical_cols = [
            'Manufacturer', 'Model', 'Category', 'Leather interior', 
            'Fuel type', 'Gear box type', 'Drive wheels', 
            'Wheel', 'Color'
        ]

        for col in categorical_cols:
            df[col] = df[col].astype(str)
            if col in encoders:
                le = encoders[col]
                # ใช้เทคนิค map เพื่อป้องกัน Error เวลามีค่าใหม่ๆ ที่ไม่เคยเจอ
                df[col] = df[col].map(lambda s: s if s in le.classes_ else le.classes_[0])
                df[col] = le.transform(df[col])
            else:
                df[col] = 0

        # 🚀 ทำนายผล
        if model:
            prediction = model.predict(df)
            return {"price": float(prediction[0]), "currency": "USD"}
        else:
            return {"price": 0, "error": "Model not loaded properly"}

    except Exception as e:
        print("🔴 PREDICTION ERROR:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")