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
  const [leather, setLeather] = useState('Yes'); // Default Yes (ไม่ได้โชว์ใน UI แต่ส่งไปคำนวณ)
  const [condition, setCondition] = useState('Good'); 

  // Logic Slider
  const maxMileage = 300000;
  const currentMileage = mileage === '' ? 0 : mileage;
  const mileagePercent = Math.min((currentMileage / maxMileage) * 100, 100);

  const [serviceHistory, setServiceHistory] = useState('Full'); // ค่าเริ่มต้น: เข้าศูนย์ตลอด

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

  // --- 3. ฟังก์ชันส่งข้อมูลไปหน้า Loading ---
  const handlePredict = () => {
    // รวมข้อมูลทั้งหมดเป็น Query Params
    const queryParams = new URLSearchParams({
      // ข้อมูลจาก Step 1
      levy: step1Data.levy,
      brand: step1Data.brand,
      model: step1Data.model,
      year: step1Data.prodYear,

      // ข้อมูลจาก Step 2 (หน้านี้)
      mileage: mileage === '' ? '0' : mileage.toString(),
      color: selectedColor,
      transmission: transmission,
      fuelType: fuelType,
      condition: condition,
      leather: leather,
      serviceHistory: serviceHistory,
    });
    
    // ย้ายไปหน้า Loading (ส่งข้อมูลไปทาง URL)
    router.push(`/load?${queryParams.toString()}`);
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
            </div>
             {/* --- ประวัติ --- */}
{/* --- ประวัติการเข้าศูนย์ (แก้ไขแล้ว) --- */}
          <div className="mb-12">
            <p className="text-base font-semibold mb-4">ประวัติการเข้าศูนย์</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* ตัวเลือก 1: เข้าตลอด */}
              <label className="cursor-pointer group">
                <input 
                  type="radio" 
                  name="service_history" 
                  value="Full"
                  checked={serviceHistory === 'Full'}
                  onChange={(e) => setServiceHistory(e.target.value)}
                  className="hidden peer" 
                />
                <div className="p-4 border rounded-xl flex items-center gap-3 transition-all peer-checked:border-[#137fec] peer-checked:bg-[#137fec]/5 peer-checked:text-[#137fec] hover:bg-slate-50">
                  <span className="material-symbols-outlined">history_edu</span>
                  <span className="text-sm font-medium">เข้าศูนย์ตลอด</span>
                </div>
              </label>

              {/* ตัวเลือก 2: เข้าบ้าง */}
              <label className="cursor-pointer group">
                <input 
                  type="radio" 
                  name="service_history" 
                  value="Partial"
                  checked={serviceHistory === 'Partial'}
                  onChange={(e) => setServiceHistory(e.target.value)}
                  className="hidden peer" 
                />
                <div className="p-4 border rounded-xl flex items-center gap-3 transition-all peer-checked:border-[#137fec] peer-checked:bg-[#137fec]/5 peer-checked:text-[#137fec] hover:bg-slate-50">
                  <span className="material-symbols-outlined">pending_actions</span>
                  <span className="text-sm font-medium">เข้าศูนย์บ้าง</span>
                </div>
              </label>

              {/* ตัวเลือก 3: ไม่มีประวัติ */}
              <label className="cursor-pointer group">
                <input 
                  type="radio" 
                  name="service_history" 
                  value="None"
                  checked={serviceHistory === 'None'}
                  onChange={(e) => setServiceHistory(e.target.value)}
                  className="hidden peer" 
                />
                <div className="p-4 border rounded-xl flex items-center gap-3 transition-all peer-checked:border-[#137fec] peer-checked:bg-[#137fec]/5 peer-checked:text-[#137fec] hover:bg-slate-50">
                  <span className="material-symbols-outlined">block</span>
                  <span className="text-sm font-medium">ไม่มีประวัติศูนย์</span>
                </div>
              </label>
            </div>
          </div>

          {/* --- เพิ่มเติม: ส่วนที่ไม่ได้ใช้คำนวณแต่มีไว้ให้ UI ครบ --- */}
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
                   <p className="font-bold text-sm">ดีเยี่ยม</p>
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
                   <p className="font-bold text-sm">ดี</p>
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
                   <p className="font-bold text-sm">พอใช้</p>
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
                   <p className="font-bold text-sm">ต้องซ่อม</p>
                   <p className="text-[10px] text-slate-500 mt-1">ขายตามสภาพ</p>
                 </div>
               </div>
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
              disabled={mileage === ''}
              className="bg-blue-600 text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all flex items-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
            >
              คำนวณราคาประเมิน
              <span className="material-symbols-outlined">analytics</span>
            </button>
          </div>
        </div>
      </main>

      {/* --- RESULT MODAL --- */}
      

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