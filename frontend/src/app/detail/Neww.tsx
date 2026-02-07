'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from "../components/Navbar";
import Link from "next/link";

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
  
  // เพิ่ม State สภาพรถ (Condition)
  const [condition, setCondition] = useState('Good'); 

  // State สำหรับผลลัพธ์
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Logic Slider
  const maxMileage = 300000;
  const currentMileage = mileage === '' ? 0 : mileage;
  const mileagePercent = Math.min((currentMileage / maxMileage) * 100, 100);

  // --- 3. ตั้งค่า % ตามสภาพรถ ---
  const conditionMultipliers: Record<string, number> = {
    'Excellent': 1.05, // +5%
    'Good': 1.00,      // ราคาปกติ
    'Fair': 0.90,      // -10%
    'Poor': 0.80       // -20%
  };

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

  // --- 4. ฟังก์ชันคำนวณราคา (API + Condition Logic) ---
  const handlePredict = async () => {
    setLoading(true);
    setPrice(null);

    const payload = {
      Levy: parseInt(step1Data.levy),
      Manufacturer: step1Data.brand,
      Model: step1Data.model,
      Prod_year: parseInt(step1Data.prodYear),
      Category: "Sedan",
      Leather_interior: "Yes", // Hardcode ไว้ตามที่ตกลง (ซ่อนจาก UI)
      Fuel_type: fuelType,
      Engine_volume: 2.0,
      Mileage: typeof mileage === 'number' ? mileage : 0,
      Cylinders: 4,
      Gear_box_type: transmission,
      Drive_wheels: "Front",
      Doors: 4,
      Wheel: "Left wheel",
      Color: selectedColor,
      Airbags: 4
    };

    try {
      const res = await fetch('https://car-price-api-szgc.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (data.price) {
        // --- คำนวณลดทอนราคาตามสภาพรถตรงนี้ ---
        const basePrice = data.price;
        const multiplier = conditionMultipliers[condition] || 1.0;
        const finalPrice = basePrice * multiplier;

        setPrice(finalPrice);
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
      <Navbar />

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
            
            {/* เลขไมล์ */}
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
            </div>

            {/* สีภายนอก */}
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
            
            {/* ระบบเกียร์ */}
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

            {/* เชื้อเพลิง */}
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
          </div>

          {/* --- 5. ส่วนสภาพรถ (เปิดใช้งานแล้ว!) --- */}
          <div className="mb-12">
            <p className="text-base font-semibold mb-4">สภาพรถ (มีผลต่อราคาประเมิน)</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Excellent */}
               <div 
                 onClick={() => setCondition('Excellent')}
                 className={`cursor-pointer p-4 border rounded-xl flex flex-col items-center gap-3 transition-all hover:bg-slate-50
                   ${condition === 'Excellent' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-slate-200'}
                 `}
               >
                 <span className={`material-symbols-outlined text-3xl ${condition === 'Excellent' ? 'text-green-600' : 'text-slate-400'}`}>verified_user</span>
                 <div className="text-center">
                   <p className="font-bold text-sm">ดีเยี่ยม (+5%)</p>
                   <p className="text-[10px] text-slate-500 mt-1">เหมือนรถใหม่</p>
                 </div>
               </div>

               {/* Good */}
               <div 
                 onClick={() => setCondition('Good')}
                 className={`cursor-pointer p-4 border rounded-xl flex flex-col items-center gap-3 transition-all hover:bg-slate-50
                   ${condition === 'Good' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200'}
                 `}
               >
                 <span className={`material-symbols-outlined text-3xl ${condition === 'Good' ? 'text-blue-600' : 'text-slate-400'}`}>sentiment_satisfied</span>
                 <div className="text-center">
                   <p className="font-bold text-sm">ดี (ราคาตลาด)</p>
                   <p className="text-[10px] text-slate-500 mt-1">ใช้งานปกติ</p>
                 </div>
               </div>

               {/* Fair */}
               <div 
                 onClick={() => setCondition('Fair')}
                 className={`cursor-pointer p-4 border rounded-xl flex flex-col items-center gap-3 transition-all hover:bg-slate-50
                   ${condition === 'Fair' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-slate-200'}
                 `}
               >
                 <span className={`material-symbols-outlined text-3xl ${condition === 'Fair' ? 'text-orange-600' : 'text-slate-400'}`}>sentiment_neutral</span>
                 <div className="text-center">
                   <p className="font-bold text-sm">พอใช้ (-10%)</p>
                   <p className="text-[10px] text-slate-500 mt-1">มีรอย/เก็บงาน</p>
                 </div>
               </div>

               {/* Poor */}
               <div 
                 onClick={() => setCondition('Poor')}
                 className={`cursor-pointer p-4 border rounded-xl flex flex-col items-center gap-3 transition-all hover:bg-slate-50
                   ${condition === 'Poor' ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-slate-200'}
                 `}
               >
                 <span className={`material-symbols-outlined text-3xl ${condition === 'Poor' ? 'text-red-600' : 'text-slate-400'}`}>report_problem</span>
                 <div className="text-center">
                   <p className="font-bold text-sm">ต้องซ่อม (-20%)</p>
                   <p className="text-[10px] text-slate-500 mt-1">ขายตามสภาพ</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Submit */}
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

      {/* RESULT MODAL */}
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
                ราคาตลาดสำหรับ {step1Data.brand} {step1Data.model} <br/>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">สภาพ: {condition === 'Excellent' ? 'ดีเยี่ยม (+5%)' : condition === 'Good' ? 'ดี (ปกติ)' : condition === 'Fair' ? 'พอใช้ (-10%)' : 'ต้องซ่อม (-20%)'}</span>
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

export default function CarValuationForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>}>
      <CarValuationFormContent />
    </Suspense>
  );
}