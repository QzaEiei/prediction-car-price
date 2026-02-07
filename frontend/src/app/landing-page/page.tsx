'use client';

import React from 'react';
import { Sarabun, Manrope } from 'next/font/google';
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า
import Navbar from "../components/Navbar";
import Link from "next/link";

// --- Font Configuration ---
const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sarabun',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export default function LandingPage() {
  return (
    <div className={`${sarabun.variable} ${manrope.variable} font-sans bg-white text-slate-900 min-h-screen flex flex-col`}>
      
      {/* Import Material Icons (แก้เรื่องดาวแดง โดยใช้ฟอนต์ไอคอนแทน) */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* --- HEADER --- */}
      <Navbar />

      <main className="flex-1">
        {/* --- HERO / HOW IT WORKS --- */}
        <section  className="py-20 px-6 bg-white" id="how-it-works">
          <div className="mx-auto max-w-[1280px]">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-[#137fec]/10 text-[#137fec] text-xs font-bold uppercase tracking-wider mb-4">ขั้นตอนง่ายๆ</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">วิธีการใช้งาน</h2>
              <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">ประเมินราคารถและรับเงินสดได้รวดเร็วใน 4 ขั้นตอน</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#137fec] shadow-xl border border-slate-100 mb-6 group-hover:scale-110 transition-transform relative">
                  <span className="material-symbols-outlined text-4xl">edit_note</span>
                </div>
                <h3 className="text-xl font-bold mb-2">กรอกข้อมูลรถ</h3>
                <p className="text-slate-500 text-sm">ระบุยี่ห้อ รุ่น และปีรถของคุณผ่านระบบออนไลน์</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#137fec] shadow-xl border border-slate-100 mb-6 group-hover:scale-110 transition-transform relative">
                  <span className="material-symbols-outlined text-4xl">calculate</span>
                </div>
                <h3 className="text-xl font-bold mb-2">รับราคาประเมิน</h3>
                <p className="text-slate-500 text-sm">ระบบจะคำนวณราคาตลาดปัจจุบันให้ทันที</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#137fec] shadow-xl border border-slate-100 mb-6 group-hover:scale-110 transition-transform relative">
                  <span className="material-symbols-outlined text-4xl">calendar_month</span>
                </div>
                <h3 className="text-xl font-bold mb-2">นัดตรวจสภาพ</h3>
                <p className="text-slate-500 text-sm">เลือกวันและเวลาที่สะดวกเพื่อให้ผู้เชี่ยวชาญเข้าตรวจ</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#137fec] shadow-xl border border-slate-100 mb-6 group-hover:scale-110 transition-transform relative">
                  <span className="material-symbols-outlined text-4xl">payments</span>
                </div>
                <h3 className="text-xl font-bold mb-2">รับเงินสด</h3>
                <p className="text-slate-500 text-sm">ตกลงราคาและรับเงินโอนเข้าบัญชีทันที</p>
              </div>
            </div>

            {/* ปุ่ม CTA เพิ่มเติมใต้ขั้นตอน */}
            <div className="mt-12 text-center">
              <Link href="/inspection" className="inline-flex items-center gap-2 px-8 py-3 bg-[#137fec] text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-all">
                เริ่มประเมินราคารถ
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* --- PRICING --- */}
        <section className="py-20 bg-white border-y border-slate-100" id="pricing">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-[#137fec]/10 text-[#137fec] text-xs font-bold uppercase tracking-wider mb-4">แผนบริการ</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">ราคาแพ็กเกจ</h2>
              <p className="mt-4 text-slate-500 text-lg">เลือกแพ็กเกจที่เหมาะกับความต้องการของคุณ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              {/* Basic Plan */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                <h3 className="text-lg font-bold mb-2">ประเมินเบื้องต้น</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">ฟรี</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    เช็กราคาตลาดผ่านระบบ
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    รายงานราคาย้อนหลัง 6 เดือน
                  </li>
                </ul>
                <Link href="/inspection" className="w-full py-3 rounded-lg border-2 border-[#137fec] text-[#137fec] font-bold hover:bg-[#137fec] hover:text-white transition-all text-center block">เริ่มใช้งานฟรี</Link>
              </div>

              {/* Popular Plan */}
              <div className="bg-white p-8 rounded-2xl border-2 border-[#137fec] shadow-xl flex flex-col relative md:scale-105 z-10 h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#137fec] text-white px-4 py-1 rounded-full text-xs font-bold">ยอดนิยม</div>
                <h3 className="text-lg font-bold mb-2">ตรวจสภาพเชิงลึก</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">฿</span>
                  <span className="text-4xl font-extrabold">990</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    ตรวจสภาพรถ 200+ รายการ
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    ช่างผู้เชี่ยวชาญไปหาถึงที่
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    การันตีราคาขายที่ดีที่สุด
                  </li>
                </ul>
                <Link href="/inspection?plan=popular" className="w-full py-3 rounded-lg bg-[#137fec] text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all text-center block">เลือกแพ็กเกจนี้</Link>
              </div>

              {/* Premium Plan */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                <h3 className="text-lg font-bold mb-2">บริการระดับพรีเมียม</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">฿</span>
                  <span className="text-4xl font-extrabold">2,500</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    ทุกอย่างในแพ็กเกจตรวจลึก
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    บริการดูแลเรื่องเอกสารการโอน
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    ช่องทางขายด่วน VIP
                  </li>
                </ul>
                <Link href="/contact" className="w-full py-3 rounded-lg border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all text-center block">ติดต่อเจ้าหน้าที่</Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- REVIEWS (ใช้ Material Symbols แทน React Icons เพื่อแก้ Error สีแดง) --- */}
        <section className="py-20 px-6 bg-white" id="reviews">
          <div className="mx-auto max-w-[1280px]">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-[#137fec]/10 text-[#137fec] text-xs font-bold uppercase tracking-wider mb-4">เสียงจากผู้ใช้จริง</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">รีวิวจากลูกค้า</h2>
              <p className="mt-4 text-slate-500 text-lg">ความพึงพอใจจากเจ้าของรถที่ใช้บริการประเมินราคากับเรา</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Review 1 - 5 Stars */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    // ใช้ style fontVariationSettings 'FILL' 1 เพื่อให้ดาวเต็มดวง
                    <span key={i} className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">"ใช้งานง่ายมากครับ แค่กรอกรุ่นรถก็ได้ราคาประเมินเบื้องต้นทันที ช่วยให้ผมตัดสินใจขายรถได้ง่ายขึ้นเยอะ"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <img alt="User 1" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Somchai&background=EBF4FF&color=137fec" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">คุณสมชาย ใจดี</h4>
                    <p className="text-xs text-slate-400">เจ้าของรถ Honda Civic</p>
                  </div>
                </div>
              </div>

              {/* Review 2 - 4 Stars */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                  <span className="material-symbols-outlined text-slate-200 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="text-slate-600 mb-6 italic">"ประทับใจบริการนัดตรวจสภาพมาก ช่างมาตรงเวลาและสุภาพมาก ราคาที่ได้ก็ยุติธรรมดีค่ะ"</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <img alt="User 2" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Wipawan&background=EBF4FF&color=137fec" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">คุณวิภาวรรณ</h4>
                    <p className="text-xs text-slate-400">เจ้าของรถ Toyota Yaris</p>
                  </div>
                </div>
              </div>

              {/* Review 3 - 3 Stars */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                   {[...Array(2)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-slate-200 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">"ได้รับเงินสดรวดเร็วทันใจจริงๆ ครับ ไม่ต้องรอนานเหมือนเต็นท์รถทั่วไป แนะนำเลยสำหรับคนอยากขายรถเร็ว"</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <img alt="User 3" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Kittisak&background=EBF4FF&color=137fec" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">คุณเกียรติศักดิ์</h4>
                    <p className="text-xs text-slate-400">เจ้าของรถ Isuzu D-Max</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-[#137fec] text-3xl">auto_awesome</span>
                <h2 className="text-xl font-extrabold tracking-tight font-[family-name:var(--font-manrope)]">ValuCar</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                แพลตฟอร์มประเมินราคารถยนต์ที่ได้รับความไว้วางใจสูงสุด
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="font-bold">บริการ</h4>
                <nav className="flex flex-col gap-2 text-sm text-slate-500">
                   {/* แก้ลิ้งค์ Footer ด้วย */}
                  <Link className="hover:text-[#137fec]" href="/inspection">เช็กราคารถ</Link>
                  <Link className="hover:text-[#137fec]" href="/inspection">นัดตรวจสภาพ</Link>
                </nav>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold">ช่วยเหลือ</h4>
                <nav className="flex flex-col gap-2 text-sm text-slate-500">
                  <Link className="hover:text-[#137fec]" href="/contact">ติดต่อเรา</Link>
                  <a className="hover:text-[#137fec]" href="#">คำถามที่พบบ่อย</a>
                </nav>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
             © 2024 ValuCar App. สงวนลิขสิทธิ์
          </div>
        </div>
      </footer>
    </div>
  );
}