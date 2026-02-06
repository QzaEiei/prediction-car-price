import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor
from sklearn.metrics import r2_score

print("🚀 Starting Model Retraining...")

# 1. โหลดข้อมูล
df = pd.read_csv('backend/car_price_data.csv')

# 2. Clean ข้อมูล (ให้เหมือน main.py)
df['Levy'] = df['Levy'].replace('-', '0')
df['Levy'] = pd.to_numeric(df['Levy'])
df['Price'] = pd.to_numeric(df['Price'], errors='coerce')

# กรองข้อมูลขยะ
df = df.dropna(subset=['Price'])
df = df[(df['Price'] > 500) & (df['Price'] < 150000)]

# *** 3. จัดการ Doors (ตัวปัญหา) ***
# แปลงให้เป็น String ทั้งหมดก่อน เพื่อให้ "04-May" หรือ "4-5" เป็นพวกเดียวกัน
df['Doors'] = df['Doors'].astype(str)

# 4. แปลงข้อมูลเป็นตัวเลข (Label Encoding)
encoders = {}
categorical_cols = ['Manufacturer', 'Model', 'Category', 'Leather interior', 
                    'Fuel type', 'Gear box type', 'Drive wheels', 
                    'Doors',  # <--- ใส่ Doors เข้าไปแล้ว!
                    'Wheel', 'Color']

for col in categorical_cols:
    le = LabelEncoder()
    # แปลงข้อมูลในคอลัมน์นั้นเป็นตัวเลข
    df[col] = le.fit_transform(df[col])
    # บันทึกตัวแปลงเก็บไว้
    encoders[col] = le

# 5. เตรียมข้อมูล Train
X = df.drop(['ID', 'Price'], axis=1) # ลบ ID กับ Price ออก
y = df['Price']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. สร้างและเทรนโมเดล XGBoost
model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
model.fit(X_train, y_train)

# เช็กผลลัพธ์นิดหน่อย
score = model.score(X_test, y_test)
print(f"✅ Training Complete! Accuracy (R2): {score:.4f}")

# 7. บันทึกไฟล์ทับของเดิม (Save Overwrite)
joblib.dump(model, 'car_price_xgb_tuned.pkl')
joblib.dump(encoders, 'car_price_encoders.pkl')

print("💾 Saved 'car_price_xgb_tuned.pkl' and 'car_price_encoders.pkl' successfully.")