"use client";

import React from "react";

export default function ValuCarPage() {
  return (
    // 1. แก้ส่วนนี้: ลบ dark mode ออก และใช้สีพื้นหลังเป็น slate-50 (สีเทาจางๆ สบายตา)
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen flex flex-col overflow-x-hidden">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 md:px-10 py-4">
          <div className="flex items-center gap-3">
            {/* 2. แก้สีไอคอนเป็นสีน้ำเงิน (blue-600) */}
            <div className="text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">ValuCar</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-semibold hover:text-blue-600 transition-colors" href="#">วิธีการใช้งาน</a>
              <a className="text-sm font-semibold hover:text-blue-600 transition-colors" href="#">ราคา</a>
              <a className="text-sm font-semibold hover:text-blue-600 transition-colors" href="#">รีวิวจากลูกค้า</a>
              <a className="text-sm font-semibold hover:text-blue-600 transition-colors" href="#">ติดต่อเรา</a>
            </nav>
            {/* 3. แก้ปุ่ม Login เป็นสีน้ำเงินชัดๆ */}
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
                    <button className="flex items-center justify-center rounded-lg h-14 px-8 bg-blue-600 text-white text-lg font-bold shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all">
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
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">ระบบคำนวณ</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">ระบุข้อมูลรถยนต์ของคุณ</h2>
              <p className="mt-2 text-slate-500">ระบุข้อมูลเบื้องต้นเพื่อรับราคาประเมินที่แม่นยำตามข้อมูลตลาดล่าสุด</p>
            </div>
            
            {/* กล่อง Form เป็นสีขาว ตัดขอบสีเทา */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
              
              {/* Year Input */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">calendar_today</span>
                    ปีที่จดทะเบียน
                  </p>
                  <div className="relative">
                    <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer">
                      <option value="">เลือกปี</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </select>
                  </div>
                </label>
              </div>

              {/* Brand Input */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">branding_watermark</span>
                    ยี่ห้อ
                  </p>
                  <div className="relative">
                    <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer">
                      <option value="">เลือกยี่ห้อ</option>
                      <option value="honda">Honda</option>
                      <option value="toyota">Toyota</option>
                      <option value="mazda">Mazda</option>
                      <option value="mitsubishi">Mitsubishi</option>
                      <option value="isuzu">Isuzu</option>
                    </select>
                  </div>
                </label>
              </div>

              {/* Model Input */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">directions_car</span>
                    รุ่น
                  </p>
                  <div className="relative">
                    <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer">
                      <option value="">เลือกรุ่น</option>
                      <option value="city">City</option>
                      <option value="civic">Civic</option>
                      <option value="accord">Accord</option>
                      <option value="crv">CR-V</option>
                    </select>
                  </div>
                </label>
              </div>

              {/* Sub-Model Input */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col flex-1">
                  <p className="text-sm font-semibold pb-2 flex items-center gap-2 text-slate-700">
                    <span className="material-symbols-outlined text-blue-600 text-lg">settings_input_component</span>
                    รุ่นย่อย
                  </p>
                  <div className="relative">
                    <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-14 px-4 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer">
                      <option value="">เลือกรุ่นย่อย</option>
                      <option value="v">V</option>
                      <option value="sv">SV</option>
                      <option value="rs">RS</option>
                      <option value="hev-rs">e:HEV RS</option>
                    </select>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-4">
                <button className="w-full flex items-center justify-center gap-2 rounded-lg h-14 bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all">
                  <span>เช็กราคาเลย</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
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