'use client';

import React from 'react';
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า
import Navbar from "../components/Navbar";
import Link from "next/link";
// หมายเหตุ: อย่าลืมตรวจสอบว่าใน layout.tsx หรือ head ของคุณมีการ import Material Symbols แล้ว
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

export default function ValuationResultPage() {
  return (
    <div className="bg-[#f8f9fa] font-sans text-gray-900 min-h-screen flex flex-col">
      
      {/* --- HEADER --- */}
      <Navbar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6 text-gray-500">
          <a href="#" className="hover:text-blue-600">หน้าแรก</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <a href="#" className="hover:text-blue-600">ประเมินราคารถ</a>
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
                  {/* สมมติราคาประเมินสำหรับ Ferrari */}
                  <div className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
                    ฿8,500,000 - ฿8,900,000
                  </div>
                  <p className="text-gray-500 text-sm">
                    อ้างอิงจากข้อมูลตลาดปัจจุบันสำหรับ <span className="font-semibold text-gray-700">2023 FERRARI 456</span>
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-bold transition-colors">
                  <span className="material-symbols-outlined text-lg">refresh</span>
                  อัปเดตราคาใหม่
                </button>
              </div>
            </div>

            {/* 2. Vehicle Details (Replaces Graph - Updated Data from Image) */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">รายละเอียดรถยนต์</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">ผลิต 2023</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">จดทะเบียน 2022</span>
                  </div>
                </div>
                <a href="#" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">edit</span> แก้ไข
                </a>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {/* ข้อมูลตามภาพที่ส่งมา */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">เลขไมล์</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">speed</span>
                    <span className="text-gray-900 font-semibold">45,000 กม.</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">สีภายนอก</span>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gray-300 border border-gray-400 shadow-sm"></span>
                    <span className="text-gray-900 font-semibold">Silver (สีเงิน)</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">ระบบเกียร์</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">settings</span>
                    <span className="text-gray-900 font-semibold">Automatic</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">เชื้อเพลิง</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">local_gas_station</span>
                    <span className="text-gray-900 font-semibold">Petrol (เบนซิน)</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">ประวัติเข้าศูนย์</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">build_circle</span>
                    <span className="text-gray-900 font-semibold">เข้าศูนย์ตลอด</span>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-gray-100" />
              
              {/* Condition Section */}
              <div className="flex flex-col md:flex-row gap-4">
                 <div className="flex-1 flex gap-3 bg-blue-50 p-4 rounded-xl items-start">
                    <span className="material-symbols-outlined text-blue-600 mt-0.5">sentiment_satisfied</span>
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">สภาพรถ: ดี (Good)</p>
                      <p className="text-gray-600 mt-1">ใช้งานปกติ มีร่องรอยตามการใช้งานทั่วไป</p>
                    </div>
                  </div>
              </div>
            </div>

            {/* 3. Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">ขายเต็นท์รถ</p>
                <p className="text-xl font-bold text-gray-900">฿8,100,000</p>
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px]">trending_down</span>
                  -5% จากราคาตลาด
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">ขายเองโดยตรง</p>
                <p className="text-xl font-bold text-gray-900">฿9,200,000</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +3% จากราคาตลาด
                </p>
              </div>

              {/* Card 3 (AutoValue) */}
              <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-8 -mt-8"></div>
                <p className="text-sm text-gray-500 mb-1">AutoValue รับซื้อทันที</p>
                <p className="text-xl font-bold text-[#22c55e]">฿8,650,000</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  การันตีราคา
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar - Updated) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">ขั้นตอนถัดไป</h2>
                <p className="text-sm text-gray-500 mt-1">จัดการรถของคุณง่ายๆ ในไม่กี่ขั้นตอน</p>
              </div>

              <div className="space-y-3">
                {/* 1. ขายรถทันที */}
                <a href="#" className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100 group transition-all hover:bg-green-100">
                  <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-xl">payments</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">ขายรถทันที</p>
                    <p className="text-xs text-gray-500 truncate">รับข้อเสนอทันทีภายใน 24 ชม.</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </a>

                {/* 2. นัดตรวจสภาพรถ */}
                <a href="#" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 group transition-all">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">นัดตรวจสภาพรถ</p>
                    <p className="text-xs text-gray-500 truncate">บริการตรวจสภาพรถถึงบ้านฟรี</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </a>
              </div>

              {/* Info Box */}
              <div className="mt-6 mb-4 p-3 rounded-lg bg-green-50 border border-green-100 flex gap-3 items-start">
                <span className="material-symbols-outlined text-[#22c55e] text-lg mt-0.5">verified</span>
                <p className="text-xs text-green-800 leading-relaxed">
                  รถของคุณได้รับความสนใจสูงในตลาด <span className="font-bold">Supercar</span> ขณะนี้
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