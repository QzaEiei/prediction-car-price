"use client";

import { useState } from "react";
import Navbar from "../components/Navbar"; // ตรวจสอบ Path ให้ถูกต้อง
import Link from "next/link";

export default function ValuCarPage() {
  
  const scrollToForm = () => {
    const formElement = document.getElementById("car-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [carData, setCarData] = useState({
    year: "",
    prodYear: "",
    brand: "",
    model: ""
  });
  
  return (
    // 1. แก้ส่วนนี้: ลบ dark mode ออก และใช้สีพื้นหลังเป็น slate-50 (สีเทาจางๆ สบายตา)
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen flex flex-col">
    
      {/* --- Header --- */}
      <Navbar />

      <main className="flex-1">
        
        {/* --- Hero Section --- */}
        <section className="relative">
          <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-16">
            <div className="@container">
              {/* ตรงนี้พื้นหลังดำถูกต้องแล้วเพื่อให้ตัวหนังสือเด่น (เหมือนต้นฉบับ) */}
              <div className="relative overflow-hidden rounded-xl bg-slate-900 shadow-2xl">
                <div 
                  className="flex min-h-[520px] flex-col gap-8 bg-cover bg-center bg-no-repeat items-center justify-center p-8 text-center relative z-10"
                  style={{
                    // ใส่รูป Background สำรองไว้เผื่อ Link เสีย
                    backgroundImage: 'linear-gradient(rgba(16, 25, 34, 0.7) 0%, rgba(16, 25, 34, 0.4) 100%), url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop")'
                  }}
                >
                  <div className="max-w-3xl space-y-4">
                    <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                      ประเมินราคารถของคุณ
                    </h1>
                    <p className="text-slate-200 text-base md:text-xl font-medium max-w-xl mx-auto opacity-90">
                      รับราคาประเมินตลาดที่แม่นยำและรวดเร็วสำหรับรถของคุณภายในไม่กี่วินาที ได้รับความไว้วางใจจากเจ้าของรถนับพันราย
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    {/* 4. แก้ปุ่มเช็คราคาเป็นสีน้ำเงิน */}
                  <button 
                    onClick={scrollToForm}
                    className="flex items-center justify-center rounded-lg h-12 px-8 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all min-w-[160px]"
                  >
                    เช็กราคาเลย
                  </button>
                    <button className="flex items-center justify-center rounded-lg h-14 px-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-all">
                      เรียนรู้เพิ่มเติม
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Form Section --- */}
        <section id="car-form" className="bg-white py-16 scroll-mt-20">
          <div className="mx-auto max-w-[960px] px-6">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">ระบบคำนวณ</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">ระบุข้อมูลรถยนต์ของคุณ</h2>
              <p className="mt-2 text-slate-500">ระบุข้อมูลเบื้องต้นเพื่อรับราคาประเมินที่แม่นยำตามข้อมูลตลาดล่าสุด</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
              
              {/* 1. ปีที่จดทะเบียน (บนซ้าย) */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">calendar_today</span>
                    ปีที่จดทะเบียน
                  </p>
                  <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer">
                    <option value="">เลือกปี</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                  </select>
                </label>
              </div>

              {/* 2. ปีที่ผลิต (บนขวา) */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">event_available</span>
                    ปีที่ผลิต
                  </p>
                  <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer">
                    <option value="">เลือกปีที่ผลิต</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                  </select>
                </label>
              </div>

              {/* 3. ยี่ห้อ (ล่างซ้าย) */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">directions_car</span>
                    ยี่ห้อ
                  </p>
                  <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer">
                    <option value="">เลือกยี่ห้อ</option>
                    <option value="honda">Honda</option>
                    <option value="toyota">Toyota</option>
                  </select>
                </label>
              </div>

              {/* 4. รุ่น (ล่างขวา) */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">minor_crash</span>
                    รุ่น
                  </p>
                  <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer">
                    <option value="">เลือกรุ่น</option>
                    <option value="city">City</option>
                    <option value="civic">Civic</option>
                  </select>
                </label>
              </div>

              {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <Link href="/detail" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 rounded-lg h-14 bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all active:scale-[0.98]">
                  <span className="material-symbols-outlined">arrow_forward</span>
                  <span>เช็กราคาเลย</span>
                </button>
              </Link>
            </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-20 px-6 bg-white">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl shadow-sm border border-slate-100">
                <div className="size-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <span className="material-symbols-outlined text-3xl">bolt</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">รู้ผลทันที</h3>
                <p className="text-slate-500">รับราคาประเมินตลาดของรถคุณในเวลาไม่ถึง 30 วินาที</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl shadow-sm border border-slate-100">
                <div className="size-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">ข้อมูลแม่นยำ</h3>
                <p className="text-slate-500">อัลกอริทึมของเราวิเคราะห์ข้อมูลการขายจริงหลายหมื่นรายการ</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl shadow-sm border border-slate-100">
                <div className="size-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <span className="material-symbols-outlined text-3xl">shield</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">ปลอดภัยและเป็นส่วนตัว</h3>
                <p className="text-slate-500">ข้อมูลของคุณได้รับการปกป้อง เราไม่เคยขายข้อมูลของคุณให้กับบุคคลที่สาม</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-blue-600 text-3xl">auto_awesome</span>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">ValuCar</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                แพลตฟอร์มประเมินราคารถยนต์ที่ได้รับความไว้วางใจสูงสุด
              </p>
            </div>
            {/* ... (Footer Links ยังเหมือนเดิม) ... */}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
            © 2024 ValuCar App. สงวนลิขสิทธิ์
          </div>
        </div>
      </footer>
    </div>
  );
}