// file: src/app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  // สร้างตัวแปรรับค่า 5 ตัว
  const [presentPrice, setPresentPrice] = useState('');
  const [year, setYear] = useState('');
  const [kms, setKms] = useState('');
  const [fuelType, setFuelType] = useState('0'); // เริ่มต้นเป็น Petrol (0)
  const [transmission, setTransmission] = useState('0'); // เริ่มต้นเป็น Manual (0)
  
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------
  // 👇 ส่วนที่แก้ไข: ฟังก์ชันนี้จะดัก Error ไม่ให้จอขาวครับ
  // ---------------------------------------------------------
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrice(null);

    // คำนวณปีปัจจุบัน เพื่อหาอายุรถ
    const currentYear = new Date().getFullYear(); 

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Present_Price: Number(presentPrice),
          Car_Age: currentYear - Number(year), // คำนวณอายุรถ
          Kms_Driven: Number(kms),
          Fuel_Type: Number(fuelType),
          Transmission: Number(transmission),
        }),
      });

      const data = await res.json();

      // เช็คว่า Server ตอบกลับมาว่า OK หรือไม่
      if (!res.ok) {
        console.error("Server Error Response:", data);
        // แสดงข้อความ Error ที่ Server ส่งมา
        const errorMsg = data.detail ? JSON.stringify(data.detail) : (data.error || "ข้อมูลไม่ถูกต้อง");
        alert(`❌ เกิดข้อผิดพลาด (${res.status}):\n${errorMsg}`);
        setLoading(false);
        return; 
      }

      // ถ้าผ่านฉลุย ค่อยเซ็ตราคา
      setPrice(data.predicted_price);

    } catch (error) {
      console.error("Error:", error);
      alert("เชื่อมต่อ Server ไม่ได้ (ตรวจสอบ Backend บน Render หรือลอง Redeploy Vercel)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">🔮 ทำนายราคารถมือสอง</h1>
        
        <form onSubmit={handlePredict} className="space-y-5">
          
          {/* 1. ราคามือหนึ่ง */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">💰 ราคามือหนึ่ง (หน่วย: แสนบาท)</label>
            <input type="number" step="0.01" placeholder="เช่น 6.5 (คือ 650,000)" 
              value={presentPrice} onChange={(e) => setPresentPrice(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 text-black" required />
            <p className="text-xs text-gray-500 mt-1">Vios ≈ 6.0 | Fortuner ≈ 15.0</p>
          </div>

          {/* 2. ปีผลิต */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">📅 ปีที่ผลิต (ค.ศ.)</label>
              <input type="number" placeholder="เช่น 2018" 
                value={year} onChange={(e) => setYear(e.target.value)}
                className="w-full border rounded-lg p-3 text-black" required />
            </div>
            
            {/* 3. เลขไมล์ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">🚗 เลขไมล์ (km)</label>
              <input type="number" placeholder="เช่น 50000" 
                value={kms} onChange={(e) => setKms(e.target.value)}
                className="w-full border rounded-lg p-3 text-black" required />
            </div>
          </div>

          {/* 4. เชื้อเพลิง */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">⛽ เชื้อเพลิง</label>
            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}
              className="w-full border rounded-lg p-3 bg-white text-black">
              <option value="0">Petrol (เบนซิน)</option>
              <option value="1">Diesel (ดีเซล)</option>
              <option value="2">CNG (ก๊าซ)</option>
            </select>
          </div>

          {/* 5. เกียร์ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">⚙️ ระบบเกียร์</label>
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)}
              className="w-full border rounded-lg p-3 bg-white text-black">
              <option value="0">Manual (ธรรมดา)</option>
              <option value="1">Automatic (ออโต้)</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-gray-400">
            {loading ? '⏳ กำลังคำนวณ...' : 'ทำนายราคาขาย'}
          </button>
        </form>

        {/* ผลลัพธ์ */}
        {price !== null && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center shadow-sm">
            <p className="text-gray-600 text-sm uppercase tracking-wide">ราคาขายที่เหมาะสม</p>
            <p className="text-4xl font-extrabold text-green-700 mt-2">
              {price.toLocaleString(undefined, {maximumFractionDigits: 2})} แสนบาท
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (≈ {(price * 100000).toLocaleString(undefined, {maximumFractionDigits: 0})} บาท)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}