import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          
          {/* --- Brand Section (ส่วนที่แก้ไข) --- */}
          <div className="max-w-xs">
            {/* 1. ใช้ flex เพื่อจัดให้ โลโก้ และ ชื่อ อยู่บรรทัดเดียวกัน */}
            <div className="flex items-center gap-2 mb-4">
              {/* โลโก้ */}
              <div className="relative h-10 w-16 flex-shrink-0">
                <Image 
                    src="/logo_klang.png"
                    alt="Klang Checkpoint Logo"
                    fill
                    className="object-contain scale-200" 
                />
              </div>
              {/* ชื่อแบรนด์ */}
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900 uppercase">
                KLANG CHECKPOINT
              </h2>
            </div>
            
            <p className="text-slate-500 text-sm leading-relaxed">
              แพลตฟอร์มประเมินราคารถยนต์ที่ได้รับความไว้วางใจสูงสุด รวดเร็ว แม่นยำ และเป็นธรรม
            </p>
          </div>

          {/* --- Links Section (เหมือนเดิม) --- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-slate-900">บริการ</h4>
              <nav className="flex flex-col gap-2 text-sm text-slate-500">
                <Link className="hover:text-blue-600 transition-colors" href="/inspection">
                  เช็กราคารถ
                </Link>
                <Link className="hover:text-blue-600 transition-colors" href="/inspection">
                  นัดตรวจสภาพ
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-slate-900">ช่วยเหลือ</h4>
              <nav className="flex flex-col gap-2 text-sm text-slate-500">
                <Link className="hover:text-blue-600 transition-colors" href="/contact">
                  ติดต่อเรา
                </Link>
                <Link className="hover:text-blue-600 transition-colors" href="/contact#faq">
                  คำถามที่พบบ่อย
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* --- Copyright --- */}
        <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
            © {new Date().getFullYear()} KLANG CHECKPOINT. สงวนลิขสิทธิ์
        </div>
      </div>
    </footer>
  );
}