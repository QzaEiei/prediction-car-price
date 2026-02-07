'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from "../components/Navbar";
import Link from "next/link";

// แยก Content ออกมาเพื่อรองรับ Suspense
const CarValuationFormContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- 1. รับค่าจากหน้าแรก ---
  const step1Data = {
    levy: searchParams.get('levy') || '2015',
    brand: searchParams.get('brand') || 'Toyota',
    model: searchParams.get('model') || 'Camry',
    prodYear: searchParams.get('year') || '2015',
  };

  // --- 2. STATE SETTINGS ---
  const [mileage, setMileage] = useState<number | ''>(45000);
  const [selectedColor, setSelectedColor] = useState('Silver');
  const [transmission, setTransmission] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Petrol');
  const [leather, setLeather] = useState('Yes'); // เพิ่มเรื่องเบาะหนังเพราะ API ต้องการ

  // State สำหรับผลลัพธ์
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Logic Slider
  const maxMileage = 300000;
  const currentMileage = mileage === '' ? 0 : mileage;
  const mileagePercent = Math.min((currentMileage / maxMileage) * 100, 100);

  const handleMileageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setMileage('');
    } else {
      let numVal = parseInt(val, 10);
      if (isNaN(numVal)) numVal = 0;
      if (numVal > maxMileage) numVal = maxMileage;
      setMileage(numVal);
    }
  };

  // --- 3. ฟังก์ชันคำนวณราคา (API) ---
  const handlePredict = async () => {
    setLoading(true);
    setPrice(null);

    // เตรียม Data ให้ตรงกับที่ API ต้องการ
    const payload = {
      Levy: parseInt(step1Data.levy),
      Manufacturer: step1Data.brand,
      Model: step1Data.model,
      Prod_year: parseInt(step1Data.prodYear),
      Category: "Sedan",       // Default Value
      Leather_interior: leather,
      Fuel_type: fuelType,
      Engine_volume: 2.0,      // Default Value
      Mileage: typeof mileage === 'number' ? mileage : 0,
      Cylinders: 4,            // Default Value
      Gear_box_type: transmission,
      Drive_wheels: "Front",   // Default Value
      Doors: 4,                // Default Value
      Wheel: "Left wheel",     // Default Value
      Color: selectedColor,
      Airbags: 4               // Default Value
    };

    try {
      const res = await fetch('https://car-price-api-szgc.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.price) {
        setPrice(data.price);
        setShowModal(true);
      } else {
        alert("เกิดข้อผิดพลาด: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* --- HEADER --- */}
      <Navbar />

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[960px] mx-auto w-full px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight text-[#0d141b]">
            แบบฟอร์มข้อมูลรถยนต์
          </h1>
          <p className="text-[#4c739a] mt-2 text-lg">
            ระบุรายละเอียดเพื่อประเมินราคารถของคุณตามราคาตลาดปัจจุบัน
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          
          {/* Header Card: แสดงรุ่นที่เลือกจากหน้าแรก */}
          <div className="mb-12 border-b border-slate-100 pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-blue-800">
                  {step1Data.brand} {step1Data.model}
                </h3>
                <div className="flex gap-4 text-sm text-slate-500">
                  <span className="bg-slate-100 px-3 py-1 rounded-full">ปีผลิต: {step1Data.prodYear}</span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full">จดทะเบียน: {step1Data.levy}</span>
                </div>
              </div>
              <Link href="/" className="text-blue-600 text-sm font-bold underline hover:text-blue-800">
                แก้ไขรุ่นรถ
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* --- 1. เลขไมล์ --- */}
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <label className="text-base font-semibold mb-2">เลขไมล์ (กม.)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={maxMileage}
                    value={mileage}
                    onChange={handleMileageInput}
                    className="w-32 text-right font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-[-25px] bottom-1.5 text-sm text-slate-500 font-medium">กม.</span>
                </div>
              </div>

              {/* Slider */}
              <div className="relative w-full h-8 flex items-center mt-2">
                <div className="absolute w-full h-1.5 bg-slate-200 rounded-full"></div>
                <div 
                  className="absolute h-1.5 bg-blue-600 rounded-full transition-all duration-75 ease-out" 
                  style={{ width: `${mileagePercent}%` }}
                ></div>
                <div 
                  className="absolute h-5 w-5 bg-blue-600 border-4 border-white shadow-md rounded-full top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-all duration-75 ease-out"
                  style={{ left: `calc(${mileagePercent}% - 10px)` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max={maxMileage}
                  step="1000"
                  value={currentMileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-30"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-[-10px]">
                <span>0</span>
                <span>{maxMileage.toLocaleString()}+</span>
              </div>
            </div>

            {/* --- 2. สีภายนอก --- */}
            <div className="flex flex-col gap-2">
              <p className="text-base font-semibold pb-1">สีภายนอก</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Silver', label: 'สีเงิน', bg: 'bg-gray-400', border: 'border-gray-400' },
                  { name: 'White', label: 'สีขาว', bg: 'bg-white', border: 'border-slate-200' },
                  { name: 'Black', label: 'สีดำ', bg: 'bg-black', border: 'border-black' },
                  { name: 'Blue', label: 'สีน้ำเงิน', bg: 'bg-blue-700', border: 'border-blue-700' },
                  { name: 'Red', label: 'สีแดง', bg: 'bg-red-600', border: 'border-red-600' },
                  { name: 'Grey', label: 'สีเทา', bg: 'bg-slate-600', border: 'border-slate-600' },
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`size-10 rounded-full shadow-sm transition-all ${color.bg} ${color.border} relative
                      ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : 'border opacity-80 hover:opacity-100'}
                    `}
                    title={color.label}
                  >
                     {/* Checkmark ถ้าเลือกสีขาว เพื่อให้มองเห็น */}
                     {selectedColor === color.name && color.name === 'White' && (
                        <span className="absolute inset-0 flex items-center justify-center text-black font-bold">✓</span>
                     )}
                     {selectedColor === color.name && color.name !== 'White' && (
                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold">✓</span>
                     )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-2">สีที่เลือก: <span className="font-bold text-slate-800">{selectedColor}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* --- 3. ระบบเกียร์ --- */}
            <div className="flex flex-col gap-3">
              <label className="text-base font-semibold">ระบบเกียร์</label>
              <select 
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="form-select w-full h-12 rounded-lg border border-slate-200 focus:ring-blue-600 focus:border-blue-600 px-3 bg-white outline-none cursor-pointer"
              >
                <option value="Automatic">Automatic (เกียร์อัตโนมัติ)</option>
                <option value="Manual">Manual (เกียร์ธรรมดา)</option>
                <option value="Tiptronic">Tiptronic</option>
                <option value="Variator">Variator (CVT)</option>
              </select>
            </div>

            {/* --- 4. เชื้อเพลิง --- */}
            <div className="flex flex-col gap-3">
              <label className="text-base font-semibold">ประเภทเชื้อเพลิง</label>
              <select 
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="form-select w-full h-12 rounded-lg border border-slate-200 focus:ring-blue-600 focus:border-blue-600 px-3 bg-white outline-none cursor-pointer"
              >
                <option value="Petrol">Petrol (เบนซิน)</option>
                <option value="Diesel">Diesel (ดีเซล)</option>
                <option value="Hybrid">Hybrid (ไฮบริด)</option>
                <option value="LPG">LPG</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

             {/* --- 5. เบาะหนัง (API ต้องการ) --- */}
             <div className="flex flex-col gap-3">
              <label className="text-base font-semibold">เบาะหนัง</label>
              <select 
                value={leather}
                onChange={(e) => setLeather(e.target.value)}
                className="form-select w-full h-12 rounded-lg border border-slate-200 focus:ring-blue-600 focus:border-blue-600 px-3 bg-white outline-none cursor-pointer"
              >
                <option value="Yes">มีเบาะหนัง (Yes)</option>
                <option value="No">ไม่มี (No)</option>
              </select>
            </div>
          </div>


          {/* --- เพิ่มเติม: ส่วนที่ไม่ได้ใช้คำนวณแต่มีไว้ให้ UI ครบ --- */}
          <div className="mb-12 opacity-50 pointer-events-none grayscale">
             {/* หมายเหตุ: ส่วนนี้ทำให้จางลงเพื่อให้ User โฟกัสส่วนสำคัญ แต่ยังคง Layout เดิมไว้ */}
            <p className="text-base font-semibold mb-4">สภาพรถ (Optional - ไม่นำมาคำนวณ)</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="p-3 border rounded-lg text-center bg-slate-50">ดีเยี่ยม</div>
               <div className="p-3 border rounded-lg text-center bg-slate-50">ดี</div>
               <div className="p-3 border rounded-lg text-center bg-slate-50">พอใช้</div>
               <div className="p-3 border rounded-lg text-center bg-slate-50">ซ่อมแซม</div>
            </div>
          </div>

          {/* --- ปุ่ม Submit --- */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <button 
              onClick={() => router.back()}
              className="text-slate-500 font-bold hover:text-slate-800 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              ย้อนกลับ
            </button>
            <button 
              onClick={handlePredict}
              disabled={loading || mileage === ''}
              className="bg-blue-600 text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all flex items-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
            >
              {loading ? 'กำลังประมวลผล...' : 'คำนวณราคาประเมิน'}
              {!loading && <span className="material-symbols-outlined">analytics</span>}
            </button>
          </div>
        </div>
      </main>

      {/* --- RESULT MODAL --- */}
      {showModal && price !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-600 text-3xl">payments</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">ราคาประเมินของคุณ</h2>
              <p className="text-slate-500 mb-6">
                ราคาตลาดสำหรับ {step1Data.brand} {step1Data.model} ({step1Data.prodYear})
              </p>
              
              <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-6">
                <span className="block text-sm text-green-600 font-semibold mb-1">ราคาโดยประมาณ</span>
                <span className="text-4xl font-black text-green-700">
                  ฿{(price * 35).toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-lg border border-slate-200 font-bold hover:bg-slate-50"
                >
                  ปิด
                </button>
                <button className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">
                  สนใจขายรถ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Main Export Component Wrapper with Suspense
export default function CarValuationForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>}>
      <CarValuationFormContent />
    </Suspense>
  );
}