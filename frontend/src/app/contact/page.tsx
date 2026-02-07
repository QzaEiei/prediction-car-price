'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sarabun, Manrope } from 'next/font/google';
import { useRouter } from "next/navigation"; // ใช้สำหรับเปลี่ยนหน้า
import Navbar from "../components/Navbar";

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

// --- 1. ข้อมูล FAQ (เพิ่มเข้ามา) ---
const faqs = [
  {
    question: "การประเมินราคาใช้เวลานานไหม?",
    answer: "ปกติการประเมินราคาเบื้องต้นผ่านระบบจะทราบผลทันที แต่หากต้องการใบรับรองฉบับสมบูรณ์ เจ้าหน้าที่จะใช้เวลาตรวจสอบประมาณ 30-60 นาทีครับ"
  },
  {
    question: "มีค่าใช้จ่ายในการประเมินหรือไม่?",
    answer: "บริการประเมินราคาเบื้องต้นผ่านหน้าเว็บไซต์ ฟรี! ไม่มีค่าใช้จ่ายครับ"
  },
  {
    question: "ต้องเตรียมเอกสารอะไรบ้าง หากจะนำรถเข้ามาตรวจ?",
    answer: "เตรียมเพียงเล่มทะเบียนรถตัวจริง (หรือสำเนา) และบัตรประชาชนเจ้าของรถครับ"
  },
  {
    question: "สามารถ Walk-in เข้ามาที่ศูนย์ได้เลยไหม?",
    answer: "สามารถเข้ามาได้ครับ แต่แนะนำให้นัดหมายล่วงหน้าผ่านเว็บไซต์เพื่อให้เจ้าหน้าที่เตรียมความพร้อม จะรวดเร็วกว่าครับ"
  }
];

export default function ContactPage() {
  // --- States ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  // State สำหรับ FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // จำลองการส่งข้อมูล 1.5 วินาที
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={`${sarabun.variable} ${manrope.variable} font-sans bg-[#f6f7f8] text-slate-900 min-h-screen flex flex-col`}>
      
      {/* Import Material Icons */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* --- HEADER --- */}
      <Navbar />

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="bg-[#137fec] py-16 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32 blur-3xl"></div>
          </div>
          <div className="mx-auto max-w-[1280px] px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-[family-name:var(--font-manrope)]">เราพร้อมให้คำปรึกษา</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light">
              ไม่ว่าคุณจะมีคำถามเกี่ยวกับการประเมินราคา หรือต้องการความช่วยเหลือด้านเทคนิค ทีมงานมืออาชีพของเราพร้อมดูแลคุณเสมอ
            </p>
          </div>
        </section>

        {/* --- CONTACT FORM & INFO --- */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Column: Form */}
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100">
                {!isSent ? (
                  <>
                    <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-manrope)]">ส่งข้อความถึงเรา</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="name">ชื่อ-นามสกุล</label>
                        <input required className="w-full rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] h-12 px-4 outline-none transition-all" id="name" placeholder="ระบุชื่อจริงและนามสกุลของคุณ" type="text"/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700" htmlFor="email">อีเมล</label>
                          <input required className="w-full rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] h-12 px-4 outline-none transition-all" id="email" placeholder="example@mail.com" type="email"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700" htmlFor="phone">เบอร์โทรศัพท์</label>
                          <input required className="w-full rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] h-12 px-4 outline-none transition-all" id="phone" placeholder="0xx-xxx-xxxx" type="tel"/>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="message">ข้อความ</label>
                        <textarea required className="w-full rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] min-h-[150px] p-4 outline-none transition-all resize-none" id="message" placeholder="ระบุรายละเอียดที่คุณต้องการสอบถาม..."></textarea>
                      </div>
                      <button 
                        disabled={isSubmitting}
                        className="w-full bg-[#137fec] text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:scale-[1.01] active:scale-[0.99] disabled:bg-blue-300 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                กำลังส่งข้อมูล...
                            </>
                        ) : (
                            <>
                                <span>ส่งข้อมูล</span>
                                <span className="material-symbols-outlined text-lg">send</span>
                            </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  // Success State
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                         <span className="material-symbols-outlined text-5xl">check_circle</span>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">ส่งข้อความสำเร็จ!</h2>
                      <p className="text-slate-500 max-w-xs mx-auto mb-8">
                         ขอบคุณที่ติดต่อเรา ทีมงานได้รับข้อความของคุณแล้วและจะติดต่อกลับโดยเร็วที่สุด
                      </p>
                      <button 
                        onClick={() => setIsSent(false)}
                        className="text-[#137fec] font-bold hover:underline"
                      >
                         ส่งข้อความใหม่
                      </button>
                  </div>
                )}
              </div>

              {/* Right Column: Info & Map */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#137fec]/10 rounded-lg flex items-center justify-center text-[#137fec] mb-4">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <h3 className="font-bold mb-1 font-[family-name:var(--font-manrope)]">เบอร์โทรศัพท์</h3>
                    <p className="text-slate-500 text-sm">02-555-2000</p>
                    <p className="text-slate-500 text-sm">จันทร์ - ศุกร์ (08:30 - 16:30)</p>
                  </div>
                  <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[#137fec]/10 rounded-lg flex items-center justify-center text-[#137fec] mb-4">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <h3 className="font-bold mb-1 font-[family-name:var(--font-manrope)]">อีเมลฝ่ายบริการ</h3>
                    <p className="text-slate-500 text-sm">support@valucar.co.th</p>
                    <p className="text-slate-500 text-sm">เราจะตอบกลับภายใน 24 ชม.</p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#137fec]/10 rounded-lg flex-shrink-0 flex items-center justify-center text-[#137fec]">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1 font-[family-name:var(--font-manrope)]">ที่ตั้งสำนักงานใหญ่</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        1381 ถนนประชาราษฎร์สาย 1<br/>
                        แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพมหานคร 10800
                      </p>
                      <p className="text-xs text-slate-400 mt-2 font-light">
                        (อาคารคณะวิศวกรรมศาสตร์ มทร.พระนคร ศูนย์พระนครเหนือ)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Google Map Embed - RMUTP North Bangkok */}
                <div className="rounded-xl overflow-hidden h-[300px] border border-slate-200 shadow-inner relative bg-slate-100">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.209675231718!2d100.51197937517926!3d13.826438895551908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29b9f9a0388b1%3A0x67399882208c903!2sRajamangala%20University%20of%20Technology%20Phra%20Nakhon%20(North%20Bangkok%20Campus)!5e0!3m2!1sen!2sth!4v1709390000000!5m2!1sen!2sth" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps RMUTP North Bangkok"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                </div>

                {/* Social Media Links */}
                <div className="flex items-center gap-6 pt-4">
                  <span className="text-sm font-bold text-slate-600">ติดตามเรา:</span>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[#00B900] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                    <span className="font-bold text-xs uppercase">Line</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- 3. ส่วน FAQ Section (เพิ่มเข้ามาใหม่) --- */}
        <section className="bg-white py-16 border-t border-slate-100">
            <div className="mx-auto max-w-[800px] px-6">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 font-[family-name:var(--font-manrope)]">คำถามที่พบบ่อย (FAQ)</h2>
                    <p className="text-slate-500">รวมคำถามยอดฮิตเกี่ยวกับการติดต่อและบริการของเรา</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                            <button 
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                            >
                                <span className="font-bold text-slate-800">{faq.question}</span>
                                <span className={`material-symbols-outlined transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-[200px]' : 'max-h-0'}`}>
                                <div className="p-5 text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
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
                แพลตฟอร์มประเมินราคารถยนต์ที่ได้รับความไว้วางใจสูงสุด เราช่วยให้เจ้าของรถเข้าใจมูลค่าที่แท้จริงของรถยนต์
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="font-bold">บริษัท</h4>
                <nav className="flex flex-col gap-2 text-sm text-slate-500">
                  <a className="hover:text-[#137fec]" href="#">เกี่ยวกับเรา</a>
                  <a className="hover:text-[#137fec]" href="#">ร่วมงานกับเรา</a>
                  <a className="hover:text-[#137fec]" href="#">ข่าวประชาสัมพันธ์</a>
                </nav>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold">กฎหมาย</h4>
                <nav className="flex flex-col gap-2 text-sm text-slate-500">
                  <a className="hover:text-[#137fec]" href="#">นโยบายความเป็นส่วนตัว</a>
                  <a className="hover:text-[#137fec]" href="#">เงื่อนไขการให้บริการ</a>
                  <a className="hover:text-[#137fec]" href="#">คุกกี้</a>
                </nav>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold">สนับสนุน</h4>
                <nav className="flex flex-col gap-2 text-sm text-slate-500">
                  <a className="hover:text-[#137fec]" href="#">ศูนย์ช่วยเหลือ</a>
                  <a className="hover:text-[#137fec]" href="#">ติดต่อฝ่ายบริการ</a>
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