from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import sklearn
from sklearn import set_config

# 1. ตั้งค่า Global ไว้ก่อน (กันเหนียว)
set_config(transform_output="pandas")

app = FastAPI()

# 2. โหลดโมเดล
try:
    model = joblib.load('My_Best_XGBoost_Tuned.pkl')
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# ======================================================
# 🔧 จุดแก้บั๊ก (ไม้ตาย): บังคับทุกชิ้นส่วนใน Pipeline ให้ส่งชื่อคอลัมน์
# ======================================================
if model is not None:
    try:
        # เช็คว่าเป็น Pipeline หรือไม่
        if hasattr(model, 'named_steps'):
            print("🔧 Pipeline detected! Patching steps...")
            # วนลูปเข้าไปสั่งทุกขั้นตอนย่อย
            for name, step in model.named_steps.items():
                if hasattr(step, 'set_output'):
                    step.set_output(transform="pandas")
                    print(f"   ✅ Fixed step: '{name}' -> output pandas")
        else:
            # ถ้าไม่ใช่ Pipeline (เป็น model เพียวๆ) สั่งตรงๆ
            if hasattr(model, 'set_output'):
                model.set_output(transform="pandas")
                print("   ✅ Fixed single model -> output pandas")
                
    except Exception as e:
        print(f"⚠️ Warning: Could not patch model steps: {e}")

# ======================================================

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
    if model is None:
        return {"error": "Model failed to load on server start."}

    try:
        # เตรียมข้อมูล (ชื่อคอลัมน์ต้องตรงเป๊ะ 100% กับตอน Train)
        data_input = {
            'Present_Price': [float(item.Present_Price)],
            'Kms_Driven': [int(item.Kms_Driven)],
            'Fuel_Type': [int(item.Fuel_Type)],
            'Transmission': [int(item.Transmission)],
            'Car_Age': [int(item.Car_Age)]
        }
        
        df = pd.DataFrame(data_input)
        
        # ปริ้นท์เช็คใน Logs ดูว่าข้อมูลเข้าเป็นยังไง
        print(f"Input Data:\n{df}")
        
        # ทำนายผล
        prediction = model.predict(df)
        return {"predicted_price": float(prediction[0])}
        
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(f"❌ Prediction Error: {error_msg}")
        # ส่ง error กลับไปแบบละเอียดขึ้น จะได้รู้ว่าพังตรงไหน
        return {"error": str(e), "detail": "Check server logs for traceback"}