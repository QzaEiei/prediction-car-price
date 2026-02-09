'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Manrope, Noto_Sans_Thai } from 'next/font/google';
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";

// ตั้งค่า Font
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope'
});
const notoSansThai = Noto_Sans_Thai({ subsets: ['thai'], display: 'swap', variable: '--font-noto-sans-thai' });

function ProcessingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null); // เก็บ URL ปลายทางเมื่อคำนวณเสร็จ


  const serviceHistory = searchParams.get('serviceHistory') || 'Full';
  // --- ส่วนที่ 1: ยิง API ---
  useEffect(() => {
    const fetchData = async () => {
      // 1. ดึงข้อมูล
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

      const payload = {
        Levy: parseInt(levy),
        Manufacturer: brand,
        Model: model,
        Prod_year: parseInt(year),
        Category: "Sedan",
        Leather_interior: leather,
        Fuel_type: fuelType,
        Engine_volume: 2.0,
        Mileage: mileage,
        Cylinders: 4,
        Gear_box_type: transmission,
        Drive_wheels: "Front",
        Doors: 4,
        Wheel: "Left wheel",
        Color: color,
        Airbags: 4
      };

      try {
        // แกล้งหน่วงเวลาขั้นต่ำ 1.5 วิ เพื่อให้กราฟิกได้วิ่งหน่อย ไม่ใช่มาถึงเสร็จเลย
        await new Promise(r => setTimeout(r, 1500));

        const res = await fetch('https://car-price-api-szgc.onrender.com/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.price) {
          // คำนวณราคา
          let multiplier = 1.0;
          switch (condition) {
            case 'Excellent': multiplier = 1.05; break;
            case 'Good': multiplier = 1.00; break;
            case 'Fair': multiplier = 0.90; break;
            case 'Poor': multiplier = 0.80; break;
          }
          const finalPrice = Math.round(data.price * multiplier);

          // สร้าง URL ปลายทาง แล้วเก็บใส่ State (ยังไม่ Push ทันที)
          const params = new URLSearchParams({
            price: finalPrice.toString(),
            brand, model, year, color, fuelType, transmission, serviceHistory,
            mileage: mileage.toString(),
            condition
          });
          setRedirectUrl(`/result?${params.toString()}`);

        } else {
          alert('API Error: ' + JSON.stringify(data));
          router.back();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
        router.back();
      }
    };

    fetchData();
  }, [searchParams, router]);


  // --- ส่วนที่ 2: ควบคุม Progress Bar ---
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        // ถ้าเต็ม 100 แล้ว ไม่ต้องทำอะไร รอ useEffect ตัวล่างทำงาน
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }

        // *** KEY LOGIC ***
        // ถ้า API ยังไม่เสร็จ (redirectUrl เป็น null) ให้วิ่งไปตันที่ 90% พอ
        if (!redirectUrl && prev >= 90) {
          return 90;
        }

        // ถ้า API เสร็จแล้ว (redirectUrl มีค่า) ให้วิ่งเร็วขึ้นจนถึง 100%
        const jump = redirectUrl ? 5 : 1;
        const increment = Math.random() * jump + 0.5;

        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(timer);
  }, [redirectUrl]); // Re-run เมื่อ redirectUrl เปลี่ยนค่า (API เสร็จ)


  // --- ส่วนที่ 3: สั่งย้ายหน้าเมื่อครบ 100% ---
  useEffect(() => {
    if (progress === 100 && redirectUrl) {
      // รออีกนิดนึง (0.5วิ) ให้ user เห็นเลข 100% เต็มๆตาก่อนเปลี่ยนหน้า
      const timeout = setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, redirectUrl, router]);


  // --- UI RENDER ---
  return (
    <div className={`${manrope.variable} ${notoSansThai.variable} font-sans bg-white min-h-screen flex flex-col text-slate-900`}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full flex flex-col items-center text-center">

          {/* Circular Icon */}
          <div className="mb-10 relative">
            <div className="w-40 h-40 rounded-full border-[6px] border-[#137fec] flex items-center justify-center bg-white shadow-lg z-10 relative">
              <span className="material-symbols-outlined text-[#137fec] text-7xl">directions_car</span>
            </div>
            <div className="absolute inset-0 rounded-full border-[6px] border-[#137fec]/30 animate-ping"></div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#0d141b] mb-4">
            กำลังคำนวณราคาประเมิน...
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-10 max-w-lg">
            ระบบ AI กำลังวิเคราะห์ข้อมูลตลาดรถยนต์มือสอง
          </p>

          {/* Progress Card */}
          <div className="w-full bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 mb-12">
            <div className="flex justify-between items-end mb-3">
              <div className="text-left">
                <p className="font-bold text-gray-900 text-lg">
                  {progress === 100 ? 'เสร็จสิ้น' : 'กำลังประมวลผล'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {progress === 100 ? 'เตรียมแสดงผลลัพธ์...' : 'ตรวจสอบสภาพและปีรถ'}
                </p>
              </div>
              <div className="text-3xl font-bold text-[#137fec]">
                {Math.round(progress)}%
              </div>
            </div>

            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#137fec] rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center w-full max-w-md gap-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 w-20">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${progress > 10 ? 'bg-[#137fec]' : 'bg-gray-200'}`}>
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className={`text-xs ${progress > 10 ? 'text-[#137fec] font-bold' : 'text-gray-400'}`}>รับข้อมูล</span>
            </div>
            <div className={`flex-1 h-[2px] mb-6 transition-colors duration-500 ${progress > 50 ? 'bg-[#137fec]' : 'bg-gray-200'}`}></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 w-20">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${progress > 50 ? 'bg-[#137fec]' : 'bg-gray-200'}`}>
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className={`text-xs ${progress > 50 ? 'text-[#137fec] font-bold' : 'text-gray-400'}`}>วิเคราะห์</span>
            </div>
            <div className={`flex-1 h-[2px] mb-6 transition-colors duration-500 ${progress >= 100 ? 'bg-[#137fec]' : 'bg-gray-200'}`}></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 w-20">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${progress >= 100 ? 'bg-[#137fec] border-[#137fec] text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                <span className="material-symbols-outlined text-sm">trending_up</span>
              </div>
              <span className={`text-xs ${progress >= 100 ? 'text-[#137fec] font-bold' : 'text-gray-400'}`}>สรุปราคา</span>
            </div>
          </div>

        </div>
      </main>

      <footer className="py-6 text-center text-gray-400 text-xs">
        Powered by AutoValue Intelligence AI Engine
      </footer>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProcessingPageContent />
    </Suspense>
  );
}