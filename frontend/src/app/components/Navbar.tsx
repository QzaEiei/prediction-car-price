"use client";

import React from "react";
import Link from "next/link";
// import { usePathname } from "next/navigation"; // เผื่อใช้เช็ค Active link ในอนาคต

export default function Navbar() {
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 md:px-10 py-4">
        
        {/* --- Logo Section --- */}
        {/* Link ไปที่หน้าแรก (Root) */}
<Link 
          href="/home" 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
            {/* Icon: เปลี่ยนเป็นรูปรถเครื่องมือช่าง สื่อถึงการตรวจเช็ค */}
            <div className="text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl">car_repair</span>
            </div>
            
            {/* Text: ชื่อแบรนด์ */}
        {/* Text: ชื่อแบรนด์ */}
          <div className="flex flex-col">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none uppercase">
                  KLANG CHECKPOINT
              </h2>
              {/* แก้ตรงนี้: เปลี่ยน text-slate-500 เป็น text-slate-600 และเพิ่ม font-semibold */}
              <span className="text-[12px] font-semibold text-slate-600 tracking-wide mt-[2px]">
                  กลางตรวจเช็ค
              </span>
          </div>
        </Link>

        {/* --- Navigation Links --- */}
        <div className="flex flex-1 justify-end gap-8">
          <nav className="hidden md:flex items-center gap-8 text-slate-600">
            
            {/* Anchor Links: ลิงก์ไปยังส่วนต่างๆ ภายในหน้า Landing Page */}
            {/* อย่าลืมไปใส่ id="how-it-works" ที่ section วิธีการใช้งาน ในหน้า page.tsx หลัก */}
            <Link className="text-sm font-semibold hover:text-blue-600 transition-colors" href="/landing-page#how-it-works">
              วิธีการใช้งาน
            </Link>
            
            {/* อย่าลืมไปใส่ id="pricing" ที่ section ราคา */}
            <Link className="text-sm font-semibold hover:text-blue-600 transition-colors" href="/landing-page#pricing">
              ราคา
            </Link>
            
            {/* อย่าลืมไปใส่ id="reviews" ที่ section รีวิว */}
            <Link className="text-sm font-semibold hover:text-blue-600 transition-colors" href="/landing-page#reviews">
              รีวิวจากลูกค้า
            </Link>

            {/* Page Link: ลิงก์ไปยังหน้า Contact (src/app/contact/page.tsx) */}
            <Link className="text-sm font-semibold hover:text-blue-600 transition-colors" href="/contact">
              ติดต่อเรา
            </Link>
          </nav>

          {/* --- Login Button --- */}
          {/* ลิงก์ไปยังหน้า Login (src/app/login/page.tsx) */}
          <Link href="/login">
            <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
              <span>เข้าสู่ระบบ</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}