"use client";

import React, { useState } from "react";

export default function ValuCarPage() {
  // เพิ่ม State สำหรับเก็บค่าจากฟอร์ม เพื่อให้ Dropdown ทำงานได้จริง
  const [formData, setFormData] = useState({
    year: "",
    brand: "",
    model: "",
    subModel: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    // 1. ปรับพื้นหลังเป็น slate-50 และลบ Dark mode ออกตามที่ขอ
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen flex flex-col overflow-x-hidden">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 md:px-10 py-4">
          <div className="flex items-center gap-3">
            {/* 2. ไอคอนสีน้ำเงิน blue-600 */}
            <div className="text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">ValuCar</h2>
          </div>
          
          <div className="flex flex-1 justify-end gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors" href="#">วิธีการใช้งาน</a>
              <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors" href="#">ราคา</a>
              <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors" href="#">รีวิวจากลูกค้า</a>
              <a className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors" href="#">ติดต่อเรา</a>
            </nav>
            {/* 3. ปุ่ม Login สีน้ำเงิน */}
            <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
              <span>เข้าสู่ระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        
        {/* --- Hero Section --- */}
        <section className="relative">
          <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-16">
            <div className="@container">
              <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
                <div 
                  className="flex min-h-[520px] flex-col gap-8 bg-cover bg-center bg-no-repeat items-center justify-center p-8 text-center relative z-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%), url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop")'
                  }}
                >
                  <div className="max-w-3xl space-y-4">
                    <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
                      ประเมินราคารถของคุณ
                    </h1>
                    <p className="text-slate-200 text-base md:text-xl font-medium max-w-xl mx-auto opacity-90 leading-relaxed">
                      รับราคาประเมินตลาดที่แม่นยำและรวดเร็วสำหรับรถของคุณภายในไม่กี่วินาที ได้รับความไว้วางใจจากเจ้าของรถนับพันราย
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    {/* 4. ปุ่มเช็คราคาสีน้ำเงิน */}
                    <button className="flex items-center justify-center rounded-lg h-14 px-8 bg-blue-600 text-white text-lg font-bold shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all">
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
        <section className="bg-white py-16">
          <div className="mx-auto max-w-[960px] px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                ระบบคำนวณ AI
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">ระบุข้อมูลรถยนต์ของคุณ</h2>
              <p className="mt-3 text-slate-500 text-lg">ระบุข้อมูลเบื้องต้นเพื่อรับราคาประเมินที่แม่นยำตามข้อมูลตลาดล่าสุด</p>
            </div>
            
            {/* กล่อง Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm">
              
              {/* Year Input */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-xl">calendar_today</span>
                    ปีที่จดทะเบียน
                  </p>
                  <div className="relative">
                    <select 
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="">เลือกปี</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </select>
                    {/* Custom Arrow Icon for Select */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Brand Input */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-xl">branding_watermark</span>
                    ยี่ห้อ
                  </p>
                  <div className="relative">
                    <select 
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="">เลือกยี่ห้อ</option>
                      <option value="honda">Honda</option>
                      <option value="toyota">Toyota</option>
                      <option value="mazda">Mazda</option>
                      <option value="mitsubishi">Mitsubishi</option>
                      <option value="isuzu">Isuzu</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Model Input */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-xl">directions_car</span>
                    รุ่น
                  </p>
                  <div className="relative">
                    <select 
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="">เลือกรุ่น</option>
                      <option value="city">City</option>
                      <option value="civic">Civic</option>
                      <option value="accord">Accord</option>
                      <option value="crv">CR-V</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Sub-Model Input */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-xl">settings_input_component</span>
                    รุ่นย่อย
                  </p>
                  <div className="relative">
                    <select 
                      name="subModel"
                      value={formData.subModel}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="">เลือกรุ่นย่อย</option>
                      <option value="v">V</option>
                      <option value="sv">SV</option>
                      <option value="rs">RS</option>
                      <option value="hev-rs">e:HEV RS</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-6">
                <button className="w-full flex items-center justify-center gap-2 rounded-lg h-14 bg-blue-600 text-white text-lg font-bold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-[0.98]">
                  <span>เช็กราคาเลย</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-20 px-6 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                  <span className="material-symbols-outlined text-3xl">bolt</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">รู้ผลทันที</h3>
                <p className="text-slate-500 leading-relaxed">รับราคาประเมินตลาดของรถคุณในเวลาไม่ถึง 30 วินาที ด้วยระบบประมวลผลความเร็วสูง</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">ข้อมูลแม่นยำ</h3>
                <p className="text-slate-500 leading-relaxed">อัลกอริทึมของเราวิเคราะห์ข้อมูลการขายจริงจากตลาดมือสองมากกว่า 100,000 รายการ</p>
              </div>
              <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                  <span className="material-symbols-outlined text-3xl">shield</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">ปลอดภัยและเป็นส่วนตัว</h3>
                <p className="text-slate-500 leading-relaxed">ข้อมูลของคุณได้รับการปกป้องสูงสุด เราไม่เคยเปิดเผยหรือขายข้อมูลของคุณให้กับบุคคลที่สาม</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col md:flex-row justify-between gap-10 items-center md:items-start">
            <div className="max-w-xs text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <span className="material-symbols-outlined text-blue-600 text-3xl">auto_awesome</span>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">ValuCar</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                แพลตฟอร์มประเมินราคารถยนต์ AII ที่ได้รับความไว้วางใจสูงสุด ช่วยให้คุณตัดสินใจซื้อขายได้อย่างมั่นใจ
              </p>
            </div>
            
            <div className="flex gap-8">
               <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">เกี่ยวกับเรา</a>
               <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">นโยบายความเป็นส่วนตัว</a>
               <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">ช่วยเหลือ</a>
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