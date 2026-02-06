import pandas as pd

# โหลดไฟล์ csv ของคุณ
df = pd.read_csv('backend/car_price_data.csv')

# สั่งปริ้นค่าที่ไม่ซ้ำกันในช่อง Doors ออกมาดู
print("--- ค่าที่ AI รู้จักในช่อง Doors ---")
print(df['Doors'].unique())
print("----------------------------------")