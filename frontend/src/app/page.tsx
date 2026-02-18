"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";
import Image from "next/image"



export default function ValuCarPage() {
  const router = useRouter();

  // --- State เก็บข้อมูล ---
  const [options, setOptions] = useState<Record<string, string[]>>({}); // เก็บข้อมูลจาก API
  const [loading, setLoading] = useState(true); // สถานะการโหลด API

  // State สำหรับฟอร์ม
  const [levy, setLevy] = useState("");
  const [prodYear, setProdYear] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  // สร้างลิสต์ปี (ปีปัจจุบัน ย้อนหลังไป 30 ปี)
  const currentYear = new Date().getFullYear();
  const yearList = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // --- 1. โหลดข้อมูลยี่ห้อ/รุ่น จาก API ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('https://car-price-api-szgc.onrender.com/car_options');
        const data = await res.json();
        setOptions(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load options", error);
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  // --- 2. ฟังก์ชันเลื่อนลงไปที่ฟอร์ม ---
  const scrollToForm = () => {
    const formElement = document.getElementById("car-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- 3. ฟังก์ชันกดปุ่มถัดไป ---
  const handleNext = () => {
    if (!levy || !prodYear || !brand || !model) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนทุกช่องครับ");
      return;
    }
    // ส่งค่าผ่าน URL Query Params ไปหน้า detail
    router.push(`/detail?levy=${levy}&year=${prodYear}&brand=${brand}&model=${model}`);
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen flex flex-col">
      
      {/* --- Header --- */}
      <Navbar />

      <main className="flex-1">
        
        {/* --- Hero Section --- */}
        <section className="relative">
          <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-16">
            <div className="@container">
              <div className="relative overflow-hidden rounded-xl bg-slate-900 shadow-2xl">
                <div className="relative flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
                  
                  {/* 1. รูปภาพพื้นหลัง (วางไว้ล่างสุดด้วย -z-20) */}
                  <Image
                    src="/Klang_car.png" // ✅ ใส่ path รูปของคุณตรงนี้
                    alt="Car Background"
                    fill
                    priority
                    className="object-cover -z-20"
                  />

                  {/* 2. เงาสีดำ (Gradient) เพื่อให้อ่านตัวหนังสือออก (วางทับรูปด้วย -z-10) */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900/40 -z-10" />

                  {/* 3. เนื้อหา (ต้องมี z-10 หรือวางไว้หลังสุด เพื่อให้ลอยเหนือรูป) */}
                  <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl">
                    <div className="space-y-4">
                      <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                        ประเมินราคารถของคุณ
                      </h1>
                      <p className="text-slate-200 text-base md:text-xl font-medium max-w-xl mx-auto opacity-90">
                        รับราคาประเมินตลาดที่แม่นยำและรวดเร็วสำหรับรถของคุณภายในไม่กี่วินาที
                        ด้วยระบบ AI อัจฉริยะ
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <button
                        onClick={scrollToForm}
                        className="flex items-center justify-center rounded-lg h-12 px-8 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all min-w-[160px]"
                      >
                        เช็กราคาเลย
                      </button>
                      <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-all min-w-[160px]">
                        เรียนรู้เพิ่มเติม
                      </button>
                    </div>
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
              
              {/* 1. ปีที่จดทะเบียน */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">calendar_today</span>
                    ปีที่จดทะเบียน (Levy Year)
                  </p>
                  <select 
                    value={levy}
                    onChange={(e) => setLevy(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer"
                  >
                    <option value="">เลือกปี</option>
                    {yearList.map((y) => (
                      <option key={`levy-${y}`} value={y}>{y}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* 2. ปีที่ผลิต */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">event_available</span>
                    ปีที่ผลิต (Production Year)
                  </p>
                  <select 
                    value={prodYear}
                    onChange={(e) => setProdYear(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer"
                  >
                    <option value="">เลือกปีที่ผลิต</option>
                    {yearList.map((y) => (
                      <option key={`prod-${y}`} value={y}>{y}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* 3. ยี่ห้อ (API) */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">directions_car</span>
                    ยี่ห้อ (Manufacturer)
                  </p>
                  <select 
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      setModel(""); // รีเซ็ตรุ่นเมื่อเปลี่ยนยี่ห้อ
                    }}
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer disabled:bg-gray-100"
                  >
                    <option value="">{loading ? "กำลังโหลด..." : "เลือกยี่ห้อ"}</option>
                    {Object.keys(options).map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* 4. รุ่น (API - Dynamic) */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">minor_crash</span>
                    รุ่น (Model)
                  </p>
                  <select 
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={!brand}
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{brand ? "เลือกรุ่น" : "กรุณาเลือกยี่ห้อก่อน"}</option>
                    {brand && options[brand]?.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-4">
                <button 
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 rounded-lg h-14 bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                  <span>ไปขั้นตอนถัดไป</span>
                </button>
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
      <Footer />
    </div>
  );
} 