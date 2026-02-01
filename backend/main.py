from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import sklearn
from sklearn import set_config

# ==========================================
# 🔧 จุดแก้บั๊กที่ 1: ตั้งค่า Global Config
# ==========================================
set_config(transform_output="pandas")

app = FastAPI()

# โหลดโมเดล
model = joblib.load('My_Best_XGBoost_Tuned.pkl')

# ==========================================
# 🔧 จุดแก้บั๊กที่ 2: บังคับตัวโมเดลที่โหลดมา (สำคัญมาก!)
# ==========================================
try:
    if hasattr(model, 'set_output'):
        model.set_output(transform="pandas")
        print("✅ Force model to output Pandas DataFrame success!")
except Exception as e:
    print(f"⚠️ Cannot set output to pandas: {e}")

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
    try:
        # เตรียมข้อมูล (ชื่อคอลัมน์ต้องเป๊ะ!)
        data_input = {
            'Present_Price': [item.Present_Price],
            'Kms_Driven': [item.Kms_Driven],
            'Fuel_Type': [item.Fuel_Type],
            'Transmission': [item.Transmission],
            'Car_Age': [item.Car_Age]
        }
        
        df = pd.DataFrame(data_input)
        
        # ทำนายผล
        prediction = model.predict(df)
        return {"predicted_price": float(prediction[0])}
        
    except Exception as e:
        # ส่ง Error กลับไปให้เห็นชัดๆ
        return {"error": str(e)}