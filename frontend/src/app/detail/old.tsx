'use client';

import React, { useState } from 'react';
import Navbar from "../components/Navbar"; // ตรวจสอบ Path ให้ถูกต้อง
import Link from "next/link";

const CarValuationForm: React.FC = () => {
  // --- STATE SETTINGS ---
  const [mileage, setMileage] = useState<number | ''>(45000); // อนุญาตให้เป็นว่างได้ตอนลบแก้เลข
  const [selectedColor, setSelectedColor] = useState('Silver');
  const [transmission, setTransmission] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Benzine');

  const maxMileage = 200000;
  // คำนวณ % สำหรับ Slider (ถ้า mileage เป็นว่าง ให้ถือเป็น 0)
  const currentMileage = mileage === '' ? 0 : mileage;
  const mileagePercent = Math.min((currentMileage / maxMileage) * 100, 100);

  // ฟังก์ชันจัดการเมื่อพิมพ์ตัวเลข
  const handleMileageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setMileage('');
    } else {
      // ลบเลข 0 นำหน้า และจำกัดไม่ให้เกิน max (ถ้าต้องการ)
      let numVal = parseInt(val, 10);
      if (isNaN(numVal)) numVal = 0;
      if (numVal > maxMileage) numVal = maxMileage; // ลบมรรทัดนี้ออกถ้าอยากให้กรอกเกินได้
      setMileage(numVal);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background-light text-slate-900 font-display">
      
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
          <div className="mb-12 border-b border-slate-100 pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">รุ่นที่เลือก: 2021 BMW 3 Series</h3>
                <p className="text-[#4c739a]">
                  ปรับแต่งรายละเอียดด้านล่างเพื่อให้ได้ราคาประเมินที่แม่นยำที่สุด
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* --- 1. เลขไมล์ (แก้ไข: มีช่องกรอกเลข + Slider เชื่อมกัน) --- */}
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <label className="text-base font-semibold mb-2">เลขไมล์ (กม.)</label>
                
                {/* ช่องกรอกตัวเลข */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={maxMileage}
                    value={mileage}
                    onChange={handleMileageInput}
                    className="w-32 text-right font-bold text-primary bg-blue-50 border border-blue-100 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="absolute right-[-25px] bottom-1.5 text-sm text-slate-500 font-medium">กม.</span>
                </div>
              </div>

              {/* Slider Bar */}
              <div className="relative w-full h-8 flex items-center mt-2">
                <div className="absolute w-full h-1.5 bg-slate-200 rounded-full"></div>
                <div 
                  className="absolute h-1.5 bg-primary rounded-full transition-all duration-75 ease-out" 
                  style={{ width: `${mileagePercent}%` }}
                ></div>
                <div 
                  className="absolute h-5 w-5 bg-primary border-4 border-white shadow-md rounded-full top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-all duration-75 ease-out"
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

            {/* --- 2. สีภายนอก (แบบปุ่มกด) --- */}
            <div className="flex flex-col gap-2">
              <p className="text-base font-semibold pb-1">สีภายนอก</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Silver', bg: 'bg-slate-500', border: 'border-slate-500' },
                  { name: 'White', bg: 'bg-white', border: 'border-slate-200' },
                  { name: 'Black', bg: 'bg-black', border: 'border-black' },
                  { name: 'Blue', bg: 'bg-blue-700', border: 'border-blue-700' },
                  { name: 'Red', bg: 'bg-red-600', border: 'border-red-600' },
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`size-8 rounded-full shadow-sm transition-all ${color.bg} ${color.border}
                      ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'border opacity-80 hover:opacity-100'}
                    `}
                    title={color.name}
                  ></button>
                ))}
                <button
                  onClick={() => setSelectedColor('Other')}
                  className={`size-8 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center transition-all
                    ${selectedColor === 'Other' ? 'ring-2 ring-offset-2 ring-primary' : ''}
                  `}
                >
                  <span className="material-symbols-outlined text-sm">palette</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* --- 3. ระบบเกียร์ (Dropdown) --- */}
            <div className="flex flex-col gap-3">
              <label className="text-base font-semibold">ระบบเกียร์</label>
              <select 
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="form-select w-full h-12 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary px-3 bg-white outline-none cursor-pointer"
              >
                <option value="Automatic">Automatic (เกียร์อัตโนมัติ)</option>
                <option value="Manual">Manual (เกียร์ธรรมดา)</option>
                <option value="Tiptronic">Tiptronic</option>
                <option value="Variator">Variator (CVT)</option>
              </select>
            </div>

            {/* --- 4. เชื้อเพลิง (Dropdown) --- */}
            <div className="flex flex-col gap-3">
              <label className="text-base font-semibold">ประเภทเชื้อเพลิง</label>
              <select 
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="form-select w-full h-12 rounded-lg border border-slate-200 focus:ring-primary focus:border-primary px-3 bg-white outline-none cursor-pointer"
              >
                <option value="Benzine">Petrol (เบนซิน)</option>
                <option value="Diesel">Diesel (ดีเซล)</option>
                <option value="Hybrid">Hybrid (ไฮบริด)</option>
                <option value="EV">Electric (ไฟฟ้า EV)</option>
                <option value="LPG">LPG</option>
                <option value="CNG">CNG (NGV)</option>
              </select>
            </div>
          </div>

          {/* --- ประวัติการเข้าศูนย์ --- */}
          <div className="mb-12">
            <p className="text-base font-semibold mb-4">ประวัติการเข้าศูนย์</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="cursor-pointer group">
                <input defaultChecked className="hidden peer" name="service_history" type="radio" />
                <div className="p-4 border rounded-xl flex items-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-primary">history_edu</span>
                  <span className="text-sm font-medium">เข้าศูนย์ตลอด</span>
                </div>
              </label>
              <label className="cursor-pointer group">
                <input className="hidden peer" name="service_history" type="radio" />
                <div className="p-4 border rounded-xl flex items-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-slate-400">pending_actions</span>
                  <span className="text-sm font-medium">เข้าศูนย์บ้าง</span>
                </div>
              </label>
              <label className="cursor-pointer group">
                <input className="hidden peer" name="service_history" type="radio" />
                <div className="p-4 border rounded-xl flex items-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-slate-400">block</span>
                  <span className="text-sm font-medium">ไม่มีประวัติศูนย์</span>
                </div>
              </label>
            </div>
          </div>

          {/* --- สภาพรถ --- */}
          <div className="mb-12">
            <p className="text-base font-semibold mb-4">สภาพรถ</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="cursor-pointer group">
                <input defaultChecked className="hidden peer" name="condition" type="radio" />
                <div className="h-full p-4 border rounded-xl flex flex-col items-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                  <div className="text-center">
                    <p className="font-bold text-sm">ดีเยี่ยม</p>
                    <p className="text-[10px] text-slate-500 mt-1">เหมือนรถใหม่</p>
                  </div>
                </div>
              </label>
              <label className="cursor-pointer group">
                <input className="hidden peer" name="condition" type="radio" />
                <div className="h-full p-4 border rounded-xl flex flex-col items-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-green-500 text-3xl">sentiment_satisfied</span>
                  <div className="text-center">
                    <p className="font-bold text-sm">ดี</p>
                    <p className="text-[10px] text-slate-500 mt-1">ดูแลดี</p>
                  </div>
                </div>
              </label>
              <label className="cursor-pointer group">
                <input className="hidden peer" name="condition" type="radio" />
                <div className="h-full p-4 border rounded-xl flex flex-col items-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-yellow-500 text-3xl">sentiment_neutral</span>
                  <div className="text-center">
                    <p className="font-bold text-sm">พอใช้</p>
                    <p className="text-[10px] text-slate-500 mt-1">มีร่องรอยตามอายุ</p>
                  </div>
                </div>
              </label>
              <label className="cursor-pointer group">
                <input className="hidden peer" name="condition" type="radio" />
                <div className="h-full p-4 border rounded-xl flex flex-col items-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-red-500 text-3xl">report_problem</span>
                  <div className="text-center">
                    <p className="font-bold text-sm">ต้องปรับปรุง</p>
                    <p className="text-[10px] text-slate-500 mt-1">มีตำหนิชัดเจน</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* --- ปุ่ม Submit --- */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <button className="text-slate-500 font-bold hover:text-slate-800 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">arrow_back</span>
              ย้อนกลับ
            </button>
            <button className="bg-primary text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center gap-2">
              คำนวณราคาประเมิน
              <span className="material-symbols-outlined">analytics</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarValuationForm;