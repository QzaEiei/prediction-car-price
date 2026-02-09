'use client';

import React, { Suspense, useState } from 'react'; // ✅ เพิ่ม useState
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Link from "next/link";
import axios from 'axios'; // ✅ เพิ่ม axios

// ฟังก์ชันจัดรูปแบบเงิน
const formatMoney = (amount: number) => {
  return amount.toLocaleString('th-TH');
};

const ResultContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ เพิ่ม State สำหรับสถานะการบันทึก
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // --- 1. รับค่าข้อมูลจาก URL ---
  const brand = searchParams.get('brand') || 'Toyota';
  const model = searchParams.get('model') || 'Camry';
  const year = searchParams.get('year') || '2015';
  const mileage = parseInt(searchParams.get('mileage') || '0');
  const color = searchParams.get('color') || 'Silver';
  const transmission = searchParams.get('transmission') || 'Automatic';
  const fuelType = searchParams.get('fuelType') || 'Petrol';
  const condition = searchParams.get('condition') || 'Good';
  const serviceHistory = searchParams.get('serviceHistory') || 'Full'; // รับค่า serviceHistory

  // ราคากลางที่ได้จาก AI (API)
  const rawprice = parseInt(searchParams.get('price') || '0');
  const basePrice = rawprice * 35;

  // --- 2. คำนวณตัวเลขต่างๆ ---
  const minPrice = Math.round(basePrice * 0.95);
  const maxPrice = Math.round(basePrice * 1.05);

  const tentPrice = Math.round(basePrice * 0.90);
  const directSalePrice = Math.round(basePrice * 1.03);
  const autoValuePrice = Math.round(basePrice * 0.98);

  // ✅ ฟังก์ชันบันทึกข้อมูลลง Database
// ✅✅✅ เริ่มส่วนที่แก้ไข: ฟังก์ชันบันทึกข้อมูลแบบมีระบบล็อกอิน ✅✅✅
  const handleSaveValuation = async () => {
    if (isSaved) return; // ถ้าบันทึกไปแล้ว ไม่ให้กดซ้ำ

    // --- 1. เช็คก่อนว่า Login หรือยัง ---
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      // ถ้ายังไม่ล็อกอิน ให้แจ้งเตือน
      const confirmLogin = window.confirm("คุณต้องเข้าสู่ระบบก่อนบันทึกข้อมูล\nกด 'ตกลง' เพื่อไปหน้าเข้าสู่ระบบ");
      
      if (confirmLogin) {
        // สร้าง URL ปัจจุบัน (รวมค่า params รถยนต์) เพื่อให้พอล็อกอินเสร็จเด้งกลับมาหน้านี้ได้
        // ใช้ currentPath + search เพื่อเก็บทั้ง path และ query string (?brand=...)
        const currentPath = window.location.pathname + window.location.search;
        const returnUrl = encodeURIComponent(currentPath);
        
        // ส่งไปหน้า Login
        router.push(`/login?returnUrl=${returnUrl}`);
      }
      return; // จบการทำงาน ไม่บันทึกต่อ
    }

    // --- 2. ถ้าล็อกอินแล้ว ให้ทำกระบวนการบันทึกเดิม ---
    setIsSaving(true);

    try {
        const userObj = JSON.parse(userStr);
        const userId = userObj.id; // ดึง ID จาก User ที่ล็อกอินอยู่

        // เช็คความชัวร์ว่ามี ID ไหม
        if (!userId) {
             alert('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
             localStorage.removeItem('user'); // ลบข้อมูลที่ผิดพลาดออก
             router.push('/login');
             return;
        }

        // เตรียมข้อมูลส่ง API
        const payload = {
            brand,
            model,
            year,
            mileage,
            color,
            transmission,
            fuelType,
            condition,
            serviceHistory,
            predictedPrice: basePrice,
            minPrice,
            maxPrice,
            userId: userId 
        };

        // ยิง API Save
        const res = await axios.post('/api/valuation/save', payload);

        if (res.data.success) {
            alert('บันทึกข้อมูลสำเร็จ! 🎉');
            setIsSaved(true);
        }

    } catch (error) {
        console.error("Save Error:", error);
        alert('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่');
    } finally {
        setIsSaving(false);
    }
  };


  // Logic แสดงผลตามสภาพรถ (คงเดิม)
  let conditionText = '';
  let conditionDesc = '';
  let conditionIcon = '';
  let conditionColor = '';

  const fuelDisplayMap: { [key: string]: string } = {
    'Petrol': 'Petrol (เบนซิน)',
    'Diesel': 'Diesel (ดีเซล)',
    'Hybrid': 'Hybrid (ไฮบริด)',
    'Electric': 'EV (ไฟฟ้า)',
    'LPG': 'LPG (ติดแก๊ส)',
    'CNG': 'CNG (ติดแก๊ส)',
  };
  const displayFuel = fuelDisplayMap[fuelType] || fuelType;

  // Logic Service History (คงเดิม)
  let serviceText = '';
  let serviceIcon = '';
  let serviceColor = '';

  switch (serviceHistory) {
    case 'Full':
      serviceText = 'เข้าศูนย์ตลอด';
      serviceIcon = 'history_edu';
      serviceColor = 'text-green-600';
      break;
    case 'Partial':
      serviceText = 'เข้าบ้าง / อู่นอก';
      serviceIcon = 'build_circle';
      serviceColor = 'text-orange-500';
      break;
    case 'None':
      serviceText = 'ไม่มีประวัติ';
      serviceIcon = 'block';
      serviceColor = 'text-red-500';
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
      
      <Navbar />

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
                  <div className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight mb-2">
                    ฿{formatMoney(minPrice)} - ฿{formatMoney(maxPrice)}
                  </div>
                  <p className="text-gray-500 text-sm">
                    อ้างอิงจากข้อมูลตลาดปัจจุบันสำหรับ <span className="font-semibold text-gray-700">{year} {brand} {model}</span>
                  </p>
                </div>
                <Link 
                  href='/home#car-form'
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">refresh</span>
                  ประเมินใหม่
                </Link>
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

                {/* Color */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">สีภายนอก</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-gray-400 shadow-sm"
                      style={{ 
                        backgroundColor: {
                          'Black': '#000000', 'White': '#FFFFFF', 'Silver': '#C0C0C0',
                          'Grey': '#808080', 'Blue': '#2563EB', 'Red': '#DC2626',
                          'Green': '#16A34A', 'Brown': '#8B4513', 'Gold': '#FFD700',
                          'Orange': '#EA580C', 'Yellow': '#FACC15', 'Purple': '#9333EA',
                          'Beige': '#F5F5DC', 'Sky blue': '#87CEEB', 'Pink': '#EC4899'
                        }[color] || '#C0C0C0'
                      }}
                    ></span>
                    <span className="text-gray-900 font-semibold">{color}</span>
                  </div>
                </div>

                {/* Transmission */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">ระบบเกียร์</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">settings</span>
                    <span className="text-gray-900 font-semibold">{transmission}</span>
                  </div>
                </div>

                {/* Fuel */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">เชื้อเพลิง</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">
                      {(fuelType === 'Electric' || fuelType === 'EV') ? 'ev_station' : 'local_gas_station'}
                    </span>
                    <span className="text-gray-900 font-semibold">{displayFuel}</span>
                  </div>
                </div>

                 {/* History */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">ประวัติเข้าศูนย์</span>
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined ${serviceColor}`}>
                      {serviceIcon}
                    </span>
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
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <p className="text-sm text-gray-500 mb-1">ขายเต็นท์รถ</p>
                <p className="text-xl font-bold text-gray-900">฿{formatMoney(tentPrice)}</p>
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px]">trending_down</span> -15% กดราคา
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">ขายเองโดยตรง</p>
                <p className="text-xl font-bold text-gray-900">฿{formatMoney(directSalePrice)}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> +10% ราคาดีสุด
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden ring-2 ring-green-500/20">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-8 -mt-8"></div>
                <p className="text-sm text-gray-500 mb-1">AutoValue รับซื้อทันที</p>
                <p className="text-xl font-bold text-[#22c55e]">฿{formatMoney(autoValuePrice)}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span> ได้เงินใน 24 ชม.
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
                <Link href="/contact"
                 className="w-full text-left flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100 group transition-all hover:bg-green-100">
                  <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-xl">payments</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">ขายรถทันที</p>
                    <p className="text-xs text-gray-500 truncate">รับเงิน ฿{formatMoney(autoValuePrice)} ภายในวันเดียว</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>

                <Link 
                  href="/inspection" 
                  className="w-full text-left flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 group transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">นัดตรวจสภาพรถ</p>
                    <p className="text-xs text-gray-500 truncate">เพื่อยืนยันราคาประเมิน</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>
              </div>

              <div className="mt-6 mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100 flex gap-3 items-start">
                <span className="material-symbols-outlined text-blue-600 text-lg mt-0.5">verified</span>
                <p className="text-xs text-blue-800 leading-relaxed">
                  ราคาของ <span className="font-bold">{model}</span> มีแนวโน้ม<span className="text-green-600 font-bold">สูงขึ้น</span>เล็กน้อยในเดือนนี้ รีบตัดสินใจก่อนราคาเปลี่ยน
                </p>
              </div>

              {/* ✅ Blue CTA Button (Updated) */}
              <button 
                onClick={handleSaveValuation}
                disabled={isSaving || isSaved}
                className={`w-full font-bold py-3 px-4 rounded-lg shadow-sm transition-all hover:shadow-md flex justify-center items-center gap-2
                  ${isSaved 
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-default' 
                    : 'bg-[#1a73e8] hover:bg-blue-700 text-white'
                  }
                  ${isSaving ? 'opacity-70 cursor-wait' : ''}
                `}
              >
                {isSaving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                {isSaved ? '[ บันทึกเรียบร้อยแล้ว ]' : isSaving ? 'กำลังบันทึก...' : '[ บันทึกราคาประเมิน ]'}
              </button>

            </div>
          </div>

        </div>

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