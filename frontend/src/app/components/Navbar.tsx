"use client";

import React, { useState, useEffect } from "react"; // ✅ เพิ่ม useEffect
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // ✅ 1. สร้างตัวแปรเก็บข้อมูล User
  const [user, setUser] = useState<any>(null);

  // ✅ 2. เมื่อเปิดหน้าเว็บ ให้เช็คว่า Login อยู่ไหม (ดึงจาก LocalStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ 3. ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // ลบข้อมูล
    setUser(null); // เคลียร์หน้าจอ
    window.location.href = '/login'; // เด้งไปหน้า Login หรือหน้าแรก
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 md:px-10 py-3 md:py-4">
        
        {/* --- 1. LOGO SECTION --- */}
        <Link 
          href="/" 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
            <div className="relative h-10 w-28 md:h-12 md:w-36 flex-shrink-0">
                <Image 
                    src="/klang_2.jpg"
                    alt="Klang Checkpoint Logo"
                    fill
                    className="object-contain object-left" 
                    priority
                />
            </div>
            
            <div className="hidden md:flex flex-col">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none uppercase">
                    KLANG CHECKPOINT
                </h2>
                <span className="text-[12px] font-semibold text-slate-600 tracking-wide mt-[2px]">
                    กลางตรวจเช็ค
                </span>
            </div>
        </Link>

        {/* --- 2. DESKTOP MENU (โชว์เฉพาะ PC) --- */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-8">
          <nav className="flex items-center gap-8 text-slate-600">
            <Link className="text-sm font-semibold hover:text-blue-600 transition-colors" href="/landing-page#how-it-works">
              วิธีการใช้งาน
            </Link>
            <Link className="text-sm font-semibold hover:text-blue-600 transition-colors" href="/landing-page#reviews">
              รีวิวจากลูกค้า
            </Link>
            <Link className="text-sm font-semibold hover:text-blue-600 transition-colors" href="/contact">
              ติดต่อเรา
            </Link>
          </nav>
          
          {/* ✅ จุดเปลี่ยน: ถ้ามี User โชว์ชื่อ / ถ้าไม่มี โชว์ปุ่ม Login */}
          {user ? (
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
              <span className="text-sm font-bold text-slate-700">
                สวัสดี, <span className="text-blue-600">{user.name}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-all"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="flex items-center justify-center rounded-lg h-10 px-5 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                <span>เข้าสู่ระบบ</span>
              </button>
            </Link>
          )}

        </div>

        {/* --- 3. MOBILE HAMBURGER BUTTON (โชว์เฉพาะมือถือ) --- */}
        <div className="md:hidden flex items-center gap-4">
            {/* ✅ มือถือ: ถ้า Login แล้วโชว์ชื่อย่อ หรือซ่อนปุ่ม Login ไปเลย */}
            {user ? (
                 <span className="text-sm font-bold text-blue-600 truncate max-w-[100px]">
                    {user.name}
                 </span>
            ) : (
                <Link href="/login" className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-md">
                    เข้าสู่ระบบ
                </Link>
            )}

            {/* ปุ่ม 3 ขีด */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-slate-600 focus:outline-none p-2"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
            </button>
        </div>

      </div>

      {/* --- 4. MOBILE MENU DROPDOWN (ส่วนที่เลื่อนลงมา) --- */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200">
            {/* ✅ มือถือ: เพิ่มเมนู Logout ใน Dropdown ถ้า Login แล้ว */}
            {user && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-semibold">บัญชีผู้ใช้: {user.name}</span>
                    <button onClick={handleLogout} className="text-red-500 text-sm font-bold">ออกจากระบบ</button>
                </div>
            )}

            <Link 
                className="text-slate-600 font-semibold py-2 border-b border-slate-100" 
                href="/landing-page#how-it-works"
                onClick={() => setIsOpen(false)}
            >
              วิธีการใช้งาน
            </Link>
            <Link 
                className="text-slate-600 font-semibold py-2 border-b border-slate-100" 
                href="/landing-page#reviews"
                onClick={() => setIsOpen(false)}
            >
              รีวิวจากลูกค้า
            </Link>
            <Link 
                className="text-slate-600 font-semibold py-2 border-b border-slate-100" 
                href="/contact"
                onClick={() => setIsOpen(false)}
            >
              ติดต่อเรา
            </Link>
        </div>
      )}

    </header>
  );
}