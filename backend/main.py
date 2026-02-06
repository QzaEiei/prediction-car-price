from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
import traceback 
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Union

# ==========================================
# 1. SETUP & LOAD RESOURCES
# ==========================================
print("Loading models and data...")

try:
    # โหลดโมเดลใหม่และตัวแปลง
    model = joblib.load('car_price_xgb_tuned.pkl')
    encoders = joblib.load('car_price_encoders.pkl')
    print("-> Model & Encoders loaded successfully.")
except Exception as e:
    print(f"🔴 Error loading model files: {e}")
    model = None
    encoders = {}

# โหลดข้อมูล Dropdown
car_options = {}
try:
    csv_path = 'car_price_data.csv'
    if os.path.exists(csv_path):
        raw_df = pd.read_csv(csv_path)
        # Clean ข้อมูลเบื้องต้น
        raw_df['Levy'] = raw_df['Levy'].replace('-', '0')
        raw_df['Price'] = pd.to_numeric(raw_df['Price'], errors='coerce')
        raw_df = raw_df[(raw_df['Price'] > 500) & (raw_df['Price'] < 150000)]

        car_options = (
            raw_df.groupby('Manufacturer')['Model']
            .unique()
            .apply(lambda x: sorted(list(x))) 
            .to_dict()
        )
        print("-> Car options loaded successfully.")
except Exception as e:
    print(f"Warning options: {e}")

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

class CarItem(BaseModel):
    Levy: Union[int, str]         # กันเหนียวเผื่อส่ง "-" มา
    Manufacturer: str
    Model: str
    Prod_year: int
    Category: str
    Leather_interior: str
    Fuel_type: str
    Engine_volume: Union[float, str] # กันเหนียวเผื่อส่ง "1.8 Turbo" มา
    Mileage: Union[int, str]         # กันเหนียวเผื่อส่ง "20000 km" มา
    Cylinders: int
    Gear_box_type: str
    Drive_wheels: str
    Doors: Union[int, str]           # ✅ รับได้หมดทั้ง 4, "4", "04-May"
    Wheel: str
    Color: str
    Airbags: int

# ==========================================
# 3. ENDPOINTS
# ==========================================

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
        # 🧹 CLEANING DATA รอบสุดท้ายก่อนเข้า DataFrame
        # ====================================================
        
        # 1. จัดการ Levy (ถ้ามาเป็น "-" ให้เป็น 0)
        try:
            val_levy = str(item.Levy).replace('-', '0')
            clean_levy = int(float(val_levy))
        except:
            clean_levy = 0

        # 2. จัดการ Doors (พระเอกของเรา)
        def fix_doors(val):
            val = str(val)
            if 'May' in val or '4' in val: return 4
            if 'Mar' in val or '2' in val: return 2
            if '>' in val or '5' in val: return 5
            return 4 
        clean_doors = fix_doors(item.Doors)

        # 3. จัดการ Engine Volume (เผื่อมี Turbo)
        try:
            val_eng = str(item.Engine_volume).replace('Turbo', '').strip()
            clean_engine = float(val_eng)
        except:
            clean_engine = 2.0 # Default

        # 4. จัดการ Mileage (เผื่อมี km)
        try:
            val_mile = str(item.Mileage).replace('km', '').replace(' ', '')
            clean_mileage = int(float(val_mile))
        except:
            clean_mileage = 0
        # 1. สร้าง DataFrame
        data = {
            'Levy': [item.Levy],
            'Manufacturer': [item.Manufacturer],
            'Model': [item.Model],
            'Prod. year': [item.Prod_year], 
            'Category': [item.Category],
            'Leather interior': [item.Leather_interior],
            'Fuel type': [item.Fuel_type],
            'Engine volume': [item.Engine_volume],
            'Mileage': [item.Mileage],
            'Cylinders': [item.Cylinders],
            'Gear box type': [item.Gear_box_type],
            'Drive wheels': [item.Drive_wheels],
            'Doors': [cleaned_doors],  # ✅ ส่งเลข 4, 2, 5 ไปเลย
            'Wheel': [item.Wheel],
            'Color': [item.Color],
            'Airbags': [item.Airbags]
        }
        df = pd.DataFrame(data)

        # 2. แปลงหมวดหมู่ (Categorical)
        # ⚠️ สังเกตว่า: ไม่มี 'Doors' ในลิสต์นี้แล้ว! (เพราะมันเป็นตัวเลขแล้ว)
        categorical_cols = ['Manufacturer', 'Model', 'Category', 'Leather interior', 
                            'Fuel type', 'Gear box type', 'Drive wheels', 
                            'Wheel', 'Color']
        for col in categorical_cols:
            df[col] = df[col].astype(str)
            if col in encoders:
                le = encoders[col]
                df[col] = df[col].map(lambda s: s if s in le.classes_ else le.classes_[0])
                df[col] = le.transform(df[col])
            else:
                df[col] = 0

        if model:
            prediction = model.predict(df)
            return {"price": float(prediction[0]), "currency": "USD"}
        else:
            return {"price": 0, "error": "Model not loaded"}

    except Exception as e:
        print("🔴 ERROR:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))