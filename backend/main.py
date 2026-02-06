from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
import traceback # เพิ่มตัวนี้เพื่อช่วยดู Error
from fastapi.middleware.cors import CORSMiddleware
import os

# ==========================================
# 1. SETUP & LOAD RESOURCES
# ==========================================
print("Loading models and data...")

# โหลดโมเดล AI และตัวแปลง
# (ใช้ try-except กันไว้เผื่อหาไฟล์ไม่เจอ จะได้รู้เรื่อง)
try:
    model = joblib.load('car_price_xgb_tuned.pkl')
    encoders = joblib.load('car_price_encoders.pkl')
    print("-> Model loaded successfully.")
except Exception as e:
    print(f"🔴 Error loading model files: {e}")

# --- โหลดข้อมูลดิบเพื่อทำ Dropdown List ---
car_options = {}
try:
    # เช็กว่ามีไฟล์อยู่จริงไหม
    csv_path = 'car_price_data.csv'
    if not os.path.exists(csv_path):
        print(f"⚠️ Warning: {csv_path} not found in current directory.")
    else:
        raw_df = pd.read_csv(csv_path)
        
        # Clean ข้อมูลเบื้องต้น
        raw_df['Levy'] = raw_df['Levy'].replace('-', '0')
        raw_df['Price'] = pd.to_numeric(raw_df['Price'], errors='coerce')
        raw_df = raw_df[(raw_df['Price'] > 500) & (raw_df['Price'] < 150000)]

        # สร้าง Dictionary Dropdown
        car_options = (
            raw_df.groupby('Manufacturer')['Model']
            .unique()
            .apply(lambda x: sorted(list(x))) 
            .to_dict()
        )
        print("-> Car options loaded successfully.")

except Exception as e:
    print(f"Warning: Could not load car_price_data.csv for options. Error: {e}")

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
    Doors: int  # รับมาเป็นตัวเลข (2 หรือ 4)
    Wheel: str
    Color: str
    Airbags: int

# ==========================================
# 3. ENDPOINTS
# ==========================================

@app.get("/car_options")
def get_car_options():
    if not car_options:
        # ส่งค่าว่างไปก่อน ดีกว่า Error 500
        return {} 
    return car_options

@app.get("/")
def read_root():
    return {"status": "Server is running correctly!"}

@app.post("/predict")
def predict_price(item: CarItem):
    try:
        # ---------------------------------------------------------
        # 🛠️ ส่วนที่เพิ่มใหม่: แก้บั๊ก Doors (Excel Auto-format Bug)
        # ---------------------------------------------------------
        # แปลงตัวเลขที่รับมาจากหน้าเว็บ ให้เป็น String ประหลาดๆ ตามที่ Model เคยจำไว้
        doors_fixed = "04-May" # ค่า Default กันเหนียว
        
        if item.Doors == 4:
            doors_fixed = "04-May"
        elif item.Doors == 2:
            doors_fixed = "02-Mar"
        elif item.Doors > 5:
            doors_fixed = ">5"
        else:
            # กรณีอื่นๆ พยายามแปลงให้ใกล้เคียงที่สุด
            doors_fixed = "04-May"
        # ---------------------------------------------------------

        # 1. แปลงข้อมูลจาก JSON ให้เป็น DataFrame
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
            'Doors': [doors_fixed],  # ✅ ใช้ค่าที่แก้แล้วส่งให้ Model
            'Wheel': [item.Wheel],
            'Color': [item.Color],
            'Airbags': [item.Airbags]
        }
        df = pd.DataFrame(data)

        # 2. แปลงตัวหนังสือเป็นตัวเลข (Encoding)
        categorical_cols = ['Manufacturer', 'Model', 'Category', 'Leather interior', 
                            'Fuel type', 'Gear box type', 'Drive wheels', 
                            'Wheel', 'Color']
        
        # เพิ่ม Doors เข้าไปใน List การแปลงด้วย (ถ้า Encoder มีข้อมูลนี้อยู่)
        # แต่ถ้าใน categorical_cols เดิมไม่มี Doors ก็ไม่ต้องใส่เพิ่ม 
        # (XGBoost บางทีรับค่าแปลกๆ นี้ได้เลยถ้าเทรนมาแบบนั้น)

        for col in categorical_cols:
            if col in encoders: # เช็กก่อนว่ามีตัวแปลงไหม
                le = encoders.get(col)
                try:
                    df[col] = le.transform(df[col])
                except:
                    # ถ้าเจอค่าที่ไม่รู้จัก ให้ใช้ค่าแรกสุด (Mode)
                    df[col] = le.transform([le.classes_[0]])

        # 3. ทำนายราคา
        prediction = model.predict(df)
        predicted_price = float(prediction[0])

        return {"price": predicted_price, "currency": "USD"}

    except Exception as e:
        # ปริ้น Error ยาวๆ ลง Log ของ Render จะได้รู้ว่าพังตรงไหน
        print("🔴🔴 PREDICTION ERROR 🔴🔴")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))