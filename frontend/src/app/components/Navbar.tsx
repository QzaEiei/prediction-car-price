"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    // เปลี่ยนจาก bg-white/80 backdrop-blur-md เป็น bg-white ทึบๆ ไปเลยครับ
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 md:px-10 py-4">
        
        {/* Logo Section */}
        <Link href="/home" className="">
            <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            >
            <div className="text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">ValuCar</h2>
            </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-1 justify-end gap-8">
          <nav className="hidden md:flex items-center gap-8 text-slate-600">
            <a className="text-sm font-semibold hover:text-blue-600 transition-colors" href="#">วิธีการใช้งาน</a>
            <a className="text-sm font-semibold hover:text-blue-600 transition-colors" href="#">ราคา</a>
            <a className="text-sm font-semibold hover:text-blue-600 transition-colors" href="#">รีวิวจากลูกค้า</a>
            <a className="text-sm font-semibold hover:text-blue-600 transition-colors" href="#">ติดต่อเรา</a>
          </nav>

          {/* Login Button */}
          <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
            <span>เข้าสู่ระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
}       