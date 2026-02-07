'use client';

import React, { useState, useEffect } from 'react';
import { Manrope, Noto_Sans_Thai } from 'next/font/google';
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า
import Navbar from "../components/Navbar";
import Link from "next/link";
// หมายเหตุ: อย่าลืมตรวจสอบว่าใน lay

// ตั้งค่า Font
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });
const notoSansThai = Noto_Sans_Thai({ subsets: ['thai'], display: 'swap', variable: '--font-noto-sans-thai' });

export default function ProcessingPage() {
  const [progress, setProgress] = useState(0);

  // จำลองการโหลดจาก 0 ถึง 100%
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        const increment = Math.random() * 2 + 1;
        return Math.min(prevProgress + increment, 100);
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`${manrope.variable} ${notoSansThai.variable} font-sans bg-white min-h-screen flex flex-col text-slate-900`}>
      {/* Import Icon */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

      {/* --- HEADER --- */}
      <Navbar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full flex flex-col items-center text-center">
          
          {/* 1. Circular Icon (ปรับสีเข้มขึ้นที่นี่) */}
          <div className="mb-10 relative">
            {/* - เปลี่ยน border-blue-100 เป็น border-[#137fec] (สีน้ำเงินเข้ม) 
                - เพิ่มความหนาเป็น border-[6px] 
            */}
            <div className="w-40 h-40 rounded-full border-[6px] border-[#137fec] flex items-center justify-center bg-white shadow-lg z-10 relative">
               <span className="material-symbols-outlined text-[#137fec] text-7xl">directions_car</span>
            </div>
            
            {/* Pulsing Ring Effect (ปรับให้ชัดขึ้นด้วย) */}
            <div className="absolute inset-0 rounded-full border-[6px] border-[#137fec]/30 animate-ping"></div>
          </div>

          {/* 2. Text Content */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#0d141b] mb-4">
            กำลังคำนวณราคาประเมินที่ดีที่สุดสำหรับคุณ...
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-10 max-w-lg">
            ระบบ AI กำลังวิเคราะห์ข้อมูลจากฐานข้อมูลราคารถยนต์มือสองเรียลไทม์ 
            กว่า 100,000 รายการ เพื่อความแม่นยำสูงสุด
          </p>

          {/* 3. Progress Card */}
          <div className="w-full bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 mb-12">
            <div className="flex justify-between items-end mb-3">
              <div className="text-left">
                <p className="font-bold text-gray-900 text-lg">กำลังประมวลผล</p>
                <p className="text-sm text-gray-400 mt-1">รวบรวมข้อมูลราคาตลาดปัจจุบัน</p>
              </div>
              <div className="text-3xl font-bold text-[#137fec]">
                {Math.round(progress)}%
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#137fec] rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#137fec] font-medium animate-pulse">
               <span className="material-symbols-outlined text-sm">sync</span>
               <span>กรุณารอสักครู่ ระบบกำลังทำงาน...</span>
            </div>
          </div>

          {/* 4. Steps Indicator */}
          <div className="flex items-center justify-center w-full max-w-md gap-2">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 w-20">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${progress > 10 ? 'bg-[#137fec]' : 'bg-gray-200'}`}>
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className={`text-xs ${progress > 10 ? 'text-[#137fec] font-bold' : 'text-gray-400'}`}>รับข้อมูล</span>
            </div>

            {/* Connector */}
            <div className={`flex-1 h-[2px] mb-6 transition-colors duration-500 ${progress > 50 ? 'bg-[#137fec]' : 'bg-gray-200'}`}></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 w-20">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${progress > 50 ? 'bg-[#137fec]' : 'bg-gray-200'}`}>
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className={`text-xs ${progress > 50 ? 'text-[#137fec] font-bold' : 'text-gray-400'}`}>วิเคราะห์</span>
            </div>

            {/* Connector */}
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