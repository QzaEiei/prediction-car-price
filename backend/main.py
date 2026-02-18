from fastapi import FastAPI, HTTPException # หน้าที่: คอยเปิด Server รอรับออเดอร์ (Request) จากหน้าเว็บ (Frontend) และส่งข้อมูลกลับไป (Response/ราคาที่ทำนาย) กลับไป
from fastapi.middleware.cors import CORSMiddleware #หน้าที่: ปกติ Backend จะหวงบ้าน ไม่ยอมให้เว็บอื่นเข้ามาคุยด้วย แต่ตัวนี้จะช่วย "อนุญาต" ให้ Frontend

from pydantic import BaseModel # กำหนดว่า Frontend "ต้อง" ส่งข้อมูลอะไรมาบ้าง และต้องเป็นประเภทไหน
from typing import Union # หน้าที่: บอก Python ว่าตัวแปรนี้เป็นได้หลายแบบนะ เช่น Union[str, None]

import pandas as pd # หน้าที่: โมเดล AI ส่วนใหญ่รับข้อมูลเป็นตาราง Pandas จะช่วยรับข้อมูลเดี่ยวๆ (ปี, เลขไมล์) แล้ว "จัดรูปขบวน" ให้เป็นตาราง 1 แถว เพื่อส่งเข้าโมเดล
import joblib #เอาไว้โหลด ไฟล์ pk
import numpy as np # หน้าที่: จัดการเรื่องตัวเลขและอาร์เรย์

import traceback # หน้าที่: เวลาระบบพัง (Crash) ตัวนี้จะปริ้นท์ออกมาบอกละเอียดยิบว่า "พังที่บรรทัดไหน ไฟล์อะไร เพราะอะไร"

import os # หน้าที่: ช่วยหาที่อยู่ไฟล์


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
        # 1. CLEANING DATA 
        # ====================================================
        clean_levy = 0
        try:
            val_levy = str(item.Levy).replace('-', '0')
            clean_levy = int(float(val_levy))
        except: pass

        clean_doors = 4
        try:
            val_doors = str(item.Doors)
            if 'May' in val_doors or '4' in val_doors: clean_doors = 4
            elif 'Mar' in val_doors or '2' in val_doors: clean_doors = 2
            elif '>' in val_doors or '5' in val_doors: clean_doors = 5
        except: pass

        clean_engine = 2.0
        try:
            val_eng = str(item.Engine_volume).lower().replace('turbo', '').strip()
            clean_engine = float(val_eng)
        except: pass

        clean_mileage = 0
        try:
            val_mile = str(item.Mileage).lower().replace('km', '').replace(' ', '')
            clean_mileage = int(float(val_mile))
        except: pass

        # ====================================================
        # 2. สร้าง DataFrame และ Force Types (เหมือนเดิม)
        # ====================================================
        data = {
            'Levy': [clean_levy],
            'Manufacturer': [item.Manufacturer],
            'Model': [item.Model],
            'Prod. year': [item.Prod_year], 
            'Category': [item.Category],
            'Leather interior': [item.Leather_interior],
            'Fuel type': [item.Fuel_type],
            'Engine volume': [clean_engine],
            'Mileage': [clean_mileage],
            'Cylinders': [item.Cylinders],
            'Gear box type': [item.Gear_box_type],
            'Drive wheels': [item.Drive_wheels],
            'Doors': [clean_doors],
            'Wheel': [item.Wheel],
            'Color': [item.Color],
            'Airbags': [item.Airbags]
        }
        df = pd.DataFrame(data)

        # Force Convert to Numeric
        df['Engine volume'] = pd.to_numeric(df['Engine volume'], errors='coerce').fillna(2.0)
        df['Mileage'] = pd.to_numeric(df['Mileage'], errors='coerce').fillna(0)
        df['Levy'] = pd.to_numeric(df['Levy'], errors='coerce').fillna(0)
        df['Prod. year'] = pd.to_numeric(df['Prod. year'], errors='coerce').fillna(2010)
        df['Cylinders'] = pd.to_numeric(df['Cylinders'], errors='coerce').fillna(4)
        df['Airbags'] = pd.to_numeric(df['Airbags'], errors='coerce').fillna(4)
        df['Doors'] = pd.to_numeric(df['Doors'], errors='coerce').fillna(4)

        # ====================================================
        # 3. แปลงหมวดหมู่ (Encoding)
        # ====================================================
        categorical_cols = [
            'Manufacturer', 'Model', 'Category', 'Leather interior', 
            'Fuel type', 'Gear box type', 'Drive wheels', 
            'Wheel', 'Color'
        ]
        for col in categorical_cols:
            df[col] = df[col].astype(str)
            if col in encoders:
                le = encoders[col]
                df[col] = df[col].map(lambda s: s if s in le.classes_ else le.classes_[0])
                df[col] = le.transform(df[col])
            else:
                df[col] = 0

        # ====================================================
        # 🚨 4. ท่าไม้ตาย: เรียงคอลัมน์ + แปลงเป็น Numpy Array
        # ====================================================
        
        # 4.1 เรียงลำดับคอลัมน์ให้เป๊ะ 100% (กันพลาด)
        required_order = [
            'Levy', 'Manufacturer', 'Model', 'Prod. year', 'Category', 
            'Leather interior', 'Fuel type', 'Engine volume', 'Mileage', 
            'Cylinders', 'Gear box type', 'Drive wheels', 'Doors', 
            'Wheel', 'Color', 'Airbags'
        ]
        df = df[required_order]

        # 4.2 แปลงเป็น Numpy Array (ตัดชื่อหัวตารางทิ้ง เพื่อแก้ปัญหา Version Mismatch)
        X_input = df.to_numpy()

        print(f"✅ Data prepared for prediction (Shape: {X_input.shape})")

        # 5. ทำนายผล
        if model:
            # ส่ง X_input (ที่เป็นตัวเลขล้วน) เข้าไปแทน df
            prediction = model.predict(X_input)
            result = float(prediction[0])
            print(f"✅ Prediction success: {result}")
            return {"price": result, "currency": "USD"}
        else:
            return {"price": 0, "error": "Model not loaded"}

    except Exception as e:
        print("🔴 PREDICTION ERROR FULL TRACEBACK:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")