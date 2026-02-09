"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../components/Navbar"; // ✅ ดึง Navbar ของคุณมาใช้
import Footer from "../components/Footer";

export default function EditProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      
      {/* 1. Navbar ด้านบน */}
      <Navbar />

      {/* 2. เนื้อหาหลัก */}
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-4">
        
        <div className="w-full max-w-2xl">
          
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Decorative Header (แถบสีฟ้าด้านบน) */}
            <div className="h-24 bg-blue-600 relative">
              <div 
                className="absolute inset-0 opacity-20" 
                style={{ 
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)", 
                    backgroundSize: "20px 20px" 
                }}
              ></div>
            </div>

            <div className="px-6 md:px-10 pb-10">
              
              {/* Header Text (ไม่มีรูปคนแล้ว) */}
              <div className="py-8 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-slate-900">สมชาย ใจดี</h2>
                <p className="text-slate-500 mt-1">จัดการข้อมูลส่วนตัวของคุณ</p>
              </div>

              {/* Form Input */}
              <form className="space-y-6">
                
                {/* 1. ชื่อ-นามสกุล */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide" htmlFor="fullname">
                    ชื่อ-นามสกุล
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      {/* Icon: Person */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input 
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-slate-900 font-medium outline-none placeholder:text-slate-400" 
                        id="fullname" 
                        name="fullname" 
                        placeholder="กรอกชื่อ-นามสกุล" 
                        type="text" 
                        defaultValue="นายสมชาย ใจดี" // ตัวอย่างข้อมูลเดิม
                    />
                  </div>
                </div>

                {/* 2. อีเมล */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide" htmlFor="email">
                    อีเมล
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      {/* Icon: Mail */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <input 
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-slate-900 font-medium outline-none placeholder:text-slate-400" 
                        id="email" 
                        name="email" 
                        placeholder="กรอกอีเมลของคุณ" 
                        type="email" 
                        defaultValue="somchai.j@email.com" 
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button 
                    type="submit" 
                    className="w-full px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {/* Icon: Save */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    บันทึกการเปลี่ยนแปลง
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* 3. Footer (ตามดีไซน์ที่ให้มา) */}
        <footer />

        </div>
      </main>
    </div>
  );
}