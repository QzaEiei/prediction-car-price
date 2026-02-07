'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";

// ฟังก์ชันจัดรูปแบบเงิน (เช่น 1000000 -> 1,000,000)
const formatMoney = (amount: number) => {
  return amount.toLocaleString('th-TH');
};

const ResultContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- 1. รับค่าข้อมูลจาก URL ---
      const brand = searchParams.get('brand') || 'Toyota';
      const model = searchParams.get('model') || 'Camry';
      const year = searchParams.get('year') || '2015';
      const levy = searchParams.get('levy') || '2015';
      const mileage = parseInt(searchParams.get('mileage') || '0');
      const color = searchParams.get('color') || 'Silver';
      const transmission = searchParams.get('transmission') || 'Automatic';
      const fuelType = searchParams.get('fuelType') || 'Petrol';
      const condition = searchParams.get('condition') || 'Good';
      const leather = searchParams.get('leather') || 'Yes';
  
  // ราคากลางที่ได้จาก AI (API)
  const rawprice = parseInt(searchParams.get('price') || '0');
  const basePrice = rawprice * 35

  // --- 2. คำนวณตัวเลขต่างๆ ---
  // ช่วงราคาประเมิน (บวกลบ 5%)
  const minPrice = Math.round(basePrice * 0.95);
  const maxPrice = Math.round(basePrice * 1.05);

  // ราคาเปรียบเทียบ
  const tentPrice = Math.round(basePrice * 0.90); // เต็นท์รับซื้อถูกกว่า (กดราคา)
  const directSalePrice = Math.round(basePrice * 1.03); // ขายเองได้แพงกว่า
  const autoValuePrice = Math.round(basePrice * 0.98); // AutoValue ให้ราคากลางๆ แต่รับซื้อเลย

  // Logic แสดงผลตามสภาพรถ
  let conditionText = '';
  let conditionDesc = '';
  let conditionIcon = '';
  let conditionColor = '';



  // สร้าง Map สำหรับแปลงข้อความให้สวยงาม
  const fuelDisplayMap: { [key: string]: string } = {
    'Petrol': 'Petrol (เบนซิน)',
    'Diesel': 'Diesel (ดีเซล)',
    'Hybrid': 'Hybrid (ไฮบริด)',
    'Electric': 'EV (ไฟฟ้า)',
    'LPG': 'LPG (ติดแก๊ส)',
    'CNG': 'CNG (ติดแก๊ส)',
  };

  // ถ้าค่าที่ได้มาไม่มีใน map ให้ใช้ค่าเดิมไปเลย
  const displayFuel = fuelDisplayMap[fuelType] || fuelType;
  
  // (แถม) เลือกไอคอนให้ตรงชนิดเชื้อเพลิง
  const fuelIcon = (fuelType === 'Electric' || fuelType === 'EV') ? 'ev_station' : 'local_gas_station';

  const serviceHistory = searchParams.get('serviceHistory') || 'Full';

  // เตรียมตัวแปรสำหรับแสดงผลประวัติศูนย์
  let serviceText = '';
  let serviceIcon = '';
  let serviceColor = '';

  switch (serviceHistory) {
    case 'Full':
      serviceText = 'เข้าศูนย์ตลอด';
      serviceIcon = 'history_edu'; // หรือ verified
      serviceColor = 'text-green-600'; // สีเขียว = ดี
      break;
    case 'Partial':
      serviceText = 'เข้าบ้าง / อู่นอก';
      serviceIcon = 'build_circle'; // หรือ pending_actions
      serviceColor = 'text-orange-500'; // สีส้ม = ปานกลาง
      break;
    case 'None':
      serviceText = 'ไม่มีประวัติ';
      serviceIcon = 'block'; // หรือ cancel
      serviceColor = 'text-red-500'; // สีแดง = ไม่ดี
      break;
    default:
      serviceText = 'ไม่ระบุ';
      serviceIcon = 'help';
      serviceColor = 'text-gray-400';
  }

  switch (condition) {
    case 'Excellent':
      conditionText = 'ดีเยี่ยม (Excellent)';
      conditionDesc = 'เหมือนรถใหม่ ไร้ริ้วรอย';
      conditionIcon = 'verified_user';
      conditionColor = 'text-green-600';
      break;
    case 'Good':
      conditionText = 'ดี (Good)';
      conditionDesc = 'ใช้งานปกติ มีร่องรอยเล็กน้อย';
      conditionIcon = 'sentiment_satisfied';
      conditionColor = 'text-blue-600';
      break;
    case 'Fair':
      conditionText = 'พอใช้ (Fair)';
      conditionDesc = 'มีรอยขีดข่วน หรือต้องเก็บงานบ้าง';
      conditionIcon = 'sentiment_neutral';
      conditionColor = 'text-orange-600';
      break;
    case 'Poor':
      conditionText = 'ต้องซ่อม (Poor)';
      conditionDesc = 'ขายตามสภาพ ต้องการการซ่อมแซม';
      conditionIcon = 'report_problem';
      conditionColor = 'text-red-600';
      break;
    default:
      conditionText = 'ดี (Good)';
      conditionDesc = 'ใช้งานปกติ';
      conditionIcon = 'sentiment_satisfied';
      conditionColor = 'text-blue-600';
  }

  return (
    <div className="bg-[#f8f9fa] font-sans text-gray-900 min-h-screen flex flex-col">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      
      {/* --- HEADER --- */}
      <Navbar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6 text-gray-500">
          <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-gray-900 font-medium">สรุปผลการประเมิน</span>
        </div>

        <div className="grid grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (Content) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            
            {/* 1. Price Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">ราคาประเมินของคุณ</h1>
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                  {/* แสดงช่วงราคา Min - Max */}
                  <div className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight mb-2">
                    ฿{formatMoney(minPrice)} - ฿{formatMoney(maxPrice)}
                  </div>
                  <p className="text-gray-500 text-sm">
                    อ้างอิงจากข้อมูลตลาดปัจจุบันสำหรับ <span className="font-semibold text-gray-700">{year} {brand} {model}</span>
                  </p>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">refresh</span>
                  ประเมินใหม่
                </button>
              </div>
            </div>

            {/* 2. Vehicle Details */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">รายละเอียดรถยนต์</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">ปีผลิต {year}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                
                {/* Mileage */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">เลขไมล์</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">speed</span>
                    <span className="text-gray-900 font-semibold">{formatMoney(mileage)} กม.</span>
                  </div>
                </div>

                {/* Color (Mockup logic for display) */}
{/* Exterior Color: ส่วนนี้อัปเดตใหม่แล้ว */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">สีภายนอก</span>
                  <div className="flex items-center gap-2">
                    {/* วงกลมแสดงสี */}
                    <span 
                      className="w-4 h-4 rounded-full border border-gray-400 shadow-sm"
                      style={{ 
                        backgroundColor: {
                          'Black': '#000000', // ดำ
                          'White': '#FFFFFF', // ขาว
                          'Silver': '#C0C0C0', // เงิน
                          'Grey': '#808080',  // เทา
                          'Blue': '#2563EB',  // น้ำเงิน
                          'Red': '#DC2626',   // แดง
                          'Green': '#16A34A', // เขียว
                          'Brown': '#8B4513', // น้ำตาล
                          'Gold': '#FFD700',  // ทอง
                          'Orange': '#EA580C', // ส้ม
                          'Yellow': '#FACC15', // เหลือง
                          'Purple': '#9333EA', // ม่วง
                          'Beige': '#F5F5DC',  // เบจ
                          'Sky blue': '#87CEEB', // ฟ้า
                          'Pink': '#EC4899'    // ชมพู
                        }[searchParams.get('color') || 'Silver'] || '#C0C0C0' // ค่า Default คือสีเงิน
                      }}
                    ></span>
                    
                    {/* ชื่อสี (เพิ่มแปลไทยให้ด้วย) */}
                    <span className="text-gray-900 font-semibold">
                      {{
                         'Black': 'Black (ดำ)',
                         'White': 'White (ขาว)',
                         'Silver': 'Silver (เงิน)',
                         'Grey': 'Grey (เทา)',
                         'Blue': 'Blue (น้ำเงิน)',
                         'Red': 'Red (แดง)',
                         'Green': 'Green (เขียว)',
                         'Brown': 'Brown (น้ำตาล)',
                         'Gold': 'Gold (ทอง)',
                         'Orange': 'Orange (ส้ม)',
                         'Yellow': 'Yellow (เหลือง)',
                         'Purple': 'Purple (ม่วง)',
                         'Beige': 'Beige (เบจ)',
                         'Sky blue': 'Sky blue (ฟ้า)'
                      }[searchParams.get('color') || 'Silver'] || (searchParams.get('color') || 'Silver')}
                    </span>
                  </div>
                </div>
                {/* Transmission */}
            {/* Transmission: ระบบเกียร์ */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">ระบบเกียร์</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">settings</span>
                    <span className="text-gray-900 font-semibold">
                      {/* แปลงค่าเป็นภาษาไทย ถ้าไม่มีในรายการให้แสดงค่าเดิม */}
                      {{
                        'Automatic': 'Automatic (อัตโนมัติ)',
                        'Manual': 'Manual (ธรรมดา)',
                        'Tiptronic': 'Tiptronic (กึ่งอัตโนมัติ)',
                        'Variator': 'CVT (แปรผัน)'
                      }[searchParams.get('transmission') || 'Automatic'] || (searchParams.get('transmission') || 'Automatic')}
                    </span>
                  </div>
                </div>

{/* Fuel: ส่วนนี้อัปเดตใหม่แล้ว */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">เชื้อเพลิง</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">
                      {/* ถ้าเป็นรถไฟฟ้าเปลี่ยนไอคอนเป็นที่ชาร์จ ถ้าไม่ใช่ให้เป็นปั๊มน้ำมัน */}
                      {(fuelType === 'Electric' || fuelType === 'EV') ? 'ev_station' : 'local_gas_station'}
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {/* แสดงผลแบบมีวงเล็บไทย ถ้าหาไม่เจอให้แสดงค่าเดิม */}
                      {{
                        'Petrol': 'Petrol (เบนซิน)',
                        'Diesel': 'Diesel (ดีเซล)',
                        'Hybrid': 'Hybrid (ไฮบริด)',
                        'Electric': 'EV (ไฟฟ้า)',
                        'LPG': 'LPG (ติดแก๊ส)',
                        'CNG': 'CNG (ติดแก๊ส)'
                      }[fuelType] || fuelType}
                    </span>
                  </div>
                </div>

                 {/* History */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">ประวัติเข้าศูนย์</span>
                  <div className="flex items-center gap-2">
                    {/* ส่วนไอคอน: เปลี่ยนสีและรูปไอคอนตามตัวแปร */}
                    <span className={`material-symbols-outlined ${serviceColor}`}>
                      {serviceIcon}
                    </span>
                    
                    {/* ส่วนข้อความ: แสดงข้อความภาษาไทย */}
                    <span className="text-gray-900 font-semibold">
                      {serviceText}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-gray-100" />
              
              {/* Condition Section */}
              <div className="flex flex-col md:flex-row gap-4">
                 <div className="flex-1 flex gap-3 bg-slate-50 p-4 rounded-xl items-start">
                    <span className={`material-symbols-outlined ${conditionColor} mt-0.5`}>{conditionIcon}</span>
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">สภาพรถ: {conditionText}</p>
                      <p className="text-gray-600 mt-1">{conditionDesc}</p>
                    </div>
                  </div>
              </div>
            </div>

            {/* 3. Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Tent */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <p className="text-sm text-gray-500 mb-1">ขายเต็นท์รถ</p>
                <p className="text-xl font-bold text-gray-900">฿{formatMoney(tentPrice)}</p>
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px]">trending_down</span>
                  -15% กดราคา
                </p>
              </div>

              {/* Card 2: Direct Sale */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">ขายเองโดยตรง</p>
                <p className="text-xl font-bold text-gray-900">฿{formatMoney(directSalePrice)}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +10% ราคาดีสุด
                </p>
                <p className="text-[10px] text-gray-400 mt-1">*แต่ใช้เวลาขาย 1-3 เดือน</p>
              </div>

              {/* Card 3: AutoValue */}
              <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden ring-2 ring-green-500/20">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-8 -mt-8"></div>
                <p className="text-sm text-gray-500 mb-1">AutoValue รับซื้อทันที</p>
                <p className="text-xl font-bold text-[#22c55e]">฿{formatMoney(autoValuePrice)}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
                   ได้เงินใน 24 ชม.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">ขั้นตอนถัดไป</h2>
                <p className="text-sm text-gray-500 mt-1">จัดการรถ {brand} ของคุณง่ายๆ</p>
              </div>

              <div className="space-y-3">
                {/* 1. ขายรถทันที */}
                <button className="w-full text-left flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100 group transition-all hover:bg-green-100">
                  <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-xl">payments</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">ขายรถทันที</p>
                    <p className="text-xs text-gray-500 truncate">รับเงิน ฿{formatMoney(autoValuePrice)} ภายในวันเดียว</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>

                {/* 2. นัดตรวจสภาพรถ */}
                <button className="w-full text-left flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 group transition-all">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">นัดตรวจสภาพรถ</p>
                    <p className="text-xs text-gray-500 truncate">เพื่อยืนยันราคาประเมิน</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100 flex gap-3 items-start">
                <span className="material-symbols-outlined text-blue-600 text-lg mt-0.5">verified</span>
                <p className="text-xs text-blue-800 leading-relaxed">
                  ราคาของ <span className="font-bold">{model}</span> มีแนวโน้ม<span className="text-green-600 font-bold">สูงขึ้น</span>เล็กน้อยในเดือนนี้ รีบตัดสินใจก่อนราคาเปลี่ยน
                </p>
              </div>

              {/* Blue CTA Button */}
              <button className="w-full bg-[#1a73e8] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all hover:shadow-md">
                ปรึกษาผู้เชี่ยวชาญ
              </button>
            </div>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center pb-8">
          <p className="text-xs text-gray-400">
            © 2024 AutoValue. ข้อมูลอัปเดตล่าสุดตามเวลาจริง <br className="md:hidden" /> 
            ราคาประเมินทั้งหมดเป็นการประมาณการเบื้องต้นและขึ้นอยู่กับการตรวจสภาพจริง
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function ValuationResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูลสรุป...</div>}>
      <ResultContent />
    </Suspense>
  );
}