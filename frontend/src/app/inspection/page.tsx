'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"; 
import Navbar from "../components/Navbar";
import Link from "next/link";

// --- Mock Data: Locations ---
const LOCATIONS = [
  {
    id: 1,
    name: 'ศูนย์ AutoValue - พระราม 9',
    address: 'ถนนพระราม 9 ห้วยขวาง กรุงเทพมหานคร 10310',
    distance: '15 นาที',
    rating: '4.9 (240 รีวิว)',
    status: 'open'
  },
  {
    id: 2,
    name: 'จุดตรวจสภาพรถ สาขาสุขุมวิท',
    address: 'ปากซอยสุขุมวิท 24 คลองเตย กรุงเทพมหานคร 10110',
    distance: '25 นาที',
    rating: '4.8 (185 รีวิว)',
    status: 'open'
  },
  {
    id: 3,
    name: 'ศูนย์บริการ รัชโยธิน',
    address: 'ถนนพหลโยธิน จตุจักร กรุงเทพมหานคร 10900',
    distance: '30 นาที',
    rating: '4.7 (120 รีวิว)',
    status: 'closed'
  },
  {
    id: 4,
    name: 'AutoValue สาขาบางนา',
    address: 'ถนนบางนา-ตราด กม.3 บางนา กรุงเทพมหานคร 10260',
    distance: '45 นาที',
    rating: '4.9 (310 รีวิว)',
    status: 'open'
  }
];

// --- Time Slots ---
const TIME_SLOTS = ['09:00', '10:30', '11:00', '12:30', '14:00', '15:30'];

export default function AppointmentPage() {
  const [selectedLocation, setSelectedLocation] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [dateList, setDateList] = useState<any[]>([]);
  
  // New States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Generate Dates on Client Side ---
  useEffect(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNum = date.getDate();
      const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      const dayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
      
      const monthShort = monthNames[date.getMonth()];
      const dayName = dayNames[date.getDay()];
      const fullDate = date.toISOString().split('T')[0];

      days.push({
        full: fullDate,
        d: dayNum,
        m: monthShort,
        day: i === 0 ? 'วันนี้' : dayName,
      });
    }

    setDateList(days);
    if (days.length > 0) setSelectedDate(days[0].full);
  }, []);

  // --- Handle Confirm ---
  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="font-sans bg-[#f8f9fa] text-[#0d141b] min-h-screen flex flex-col">
      
      {/* ✅ แก้ไขจุดที่ 1: อัปเดต Link Font ให้รองรับการเติมสี (FILL 0..1) 
        สังเกตตรง FILL@0..1
      */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0" />

      {/* --- HEADER --- */}
      <Navbar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8 pb-32 lg:pb-8"> 
        
        {/* Breadcrumbs */}
        <div className="flex gap-2 text-sm text-[#64748b] mb-4">
          <span>หน้าแรก</span>
          <span>/</span>
          <span>ประเมินราคา</span>
          <span>/</span>
          <span className="font-bold text-[#0d141b]">นัดหมายตรวจสภาพรถ</span>
        </div>

        {/* Title Section */}
        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0d141b] mb-2">นัดหมายตรวจสภาพรถ</h1>
            <p className="text-[#64748b] text-lg">เลือกศูนย์บริการที่ผ่านการรับรองและวันเวลาที่ท่านสะดวกเพื่อยืนยันการประเมินราคา</p>
          </div>
          
          {/* Selected Car Card */}
          <div className="flex items-center gap-4 bg-white border border-[#e2e8f0] p-4 rounded-xl shadow-sm min-w-[300px]">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#137fec]">
              <span className="material-symbols-outlined">directions_car</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#137fec]">รถที่เลือกปัจจุบัน</p>
              <h3 className="font-bold text-[#0d141b]">2021 BMW M3 Competition</h3>
              <p className="text-xs text-[#64748b]">ราคาประเมิน: ฿2,450,000 - ฿2,600,000</p>
            </div>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center gap-4 mb-10 border-b border-[#e2e8f0] overflow-x-auto">
          <div className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-[#64748b] whitespace-nowrap">
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <span className="font-medium">ข้อมูลรถยนต์</span>
          </div>
          <div className="flex items-center gap-2 pb-3 border-b-2 border-[#137fec] text-[#137fec] whitespace-nowrap">
            <span className="material-symbols-outlined text-xl">location_on</span>
            <span className="font-bold">เลือกศูนย์บริการและเวลา</span>
          </div>
          <div className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-[#64748b] whitespace-nowrap">
            <span className="material-symbols-outlined text-xl">schedule</span>
            <span className="font-medium">ยืนยันนัดหมาย</span>
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Location List */}
          <div className="lg:col-span-7">
            <h3 className="text-xl font-bold text-[#0d141b] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec]">map</span>
              เลือกศูนย์บริการ
            </h3>
            
            <div className="flex flex-col gap-4">
              {LOCATIONS.map((loc) => {
                const isSelected = selectedLocation === loc.id;
                const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.address)}`;

                return (
                  <div 
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc.id)}
                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 relative group
                      ${isSelected 
                        ? 'border-[#137fec] bg-white shadow-md' 
                        : 'border-white bg-white hover:border-blue-100 shadow-sm'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon Box */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0
                        ${isSelected ? 'bg-[#137fec]/10 text-[#137fec]' : 'bg-slate-100 text-slate-400'}`}>
                        <span className="material-symbols-outlined">
                          {isSelected ? 'verified' : 'location_on'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-lg font-bold ${isSelected ? 'text-[#137fec]' : 'text-[#0d141b]'}`}>
                            {loc.name}
                          </h4>
                          
                          {/* Map Link Button */}
                          <div className="flex items-center gap-2">
                            {loc.status === 'open' && (
                              <span className="hidden sm:inline-block text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                เปิดอยู่
                              </span>
                            )}
                            <a 
                              href={mapLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#94a3b8] hover:text-[#137fec] hover:bg-blue-50 p-1 rounded-md transition-all"
                              title="เปิดใน Google Maps"
                            >
                              <span className="material-symbols-outlined text-xl">map</span>
                            </a>
                          </div>
                        </div>
                        <p className="text-sm text-[#64748b] mb-3">{loc.address}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-[#64748b] font-medium">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            ห่างออกไป {loc.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            {/* ✅ แก้ไขจุดที่ 2: ใส่ style FILL 1 ให้ดาวเต็มดวง 
                            */}
                            <span 
                              className="material-symbols-outlined text-sm text-yellow-500" 
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            {loc.rating}
                          </span>
                        </div>
                      </div>

                      {/* Radio Circle */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1
                        ${isSelected ? 'border-[#137fec]' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#137fec]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Schedule */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-[#0d141b] mb-6">ตารางเวลานัดหมาย</h3>
              
              {/* Date Selector */}
              <div className="mb-6">
                <label className="text-sm font-bold text-[#64748b] mb-3 block">เลือกวันที่</label>
                <div className="grid grid-cols-4 gap-2">
                  {dateList.length > 0 ? dateList.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(item.full)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all
                        ${selectedDate === item.full 
                          ? 'border-[#137fec] bg-[#137fec]/5 text-[#137fec] ring-1 ring-[#137fec]' 
                          : 'border-[#e2e8f0] text-[#0d141b] hover:border-blue-200'}`}
                    >
                      <span className="text-[10px] font-bold uppercase text-[#64748b]">{item.m}</span>
                      <span className="text-xl font-bold leading-none my-1">{item.d}</span>
                      <span className="text-[10px] font-medium">{item.day}</span>
                    </button>
                  )) : (
                     [1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse"></div>)
                  )}
                </div>
              </div>

              {/* Time Selector */}
              <div className="mb-6">
                <label className="text-sm font-bold text-[#64748b] mb-3 block">เลือกเวลา</label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((time, index) => {
                     const isSelected = selectedTime === time;
                     const dayIndex = dateList.findIndex(d => d.full === selectedDate);
                     const isFull = (dayIndex === 0 && index < 1) || (dayIndex === 1 && index === 2) || (index === 3);

                     return (
                      <button
                        key={time}
                        disabled={isFull}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-1 text-xs font-bold rounded border transition-all relative
                          ${isFull ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : ''}
                          ${!isFull && isSelected ? 'bg-[#137fec] text-white border-[#137fec] shadow-md shadow-blue-200' : ''}
                          ${!isFull && !isSelected ? 'text-[#0d141b] border-[#e2e8f0] hover:border-[#137fec] hover:text-[#137fec]' : ''}
                        `}
                      >
                        {time} น.
                        {isFull && <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-red-400 rounded-full border border-white"></span>}
                      </button>
                     );
                  })}
                </div>
                <div className="flex gap-4 mt-2 justify-end">
                   <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <div className="w-2 h-2 bg-slate-100 border border-slate-200 rounded-full"></div> ไม่ว่าง
                   </div>
                   <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <div className="w-2 h-2 bg-white border border-[#e2e8f0] rounded-full"></div> ว่าง
                   </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6 flex gap-3 items-start">
                <span className="material-symbols-outlined text-[#137fec] text-lg mt-0.5">info</span>
                <div className="text-xs text-[#475569] leading-relaxed">
                  <strong className="text-[#137fec] block mb-1">ระยะเวลาประเมินโดยประมาณ: 45 นาที</strong>
                  ช่างเทคนิคจะตรวจสอบสภาพเครื่องยนต์ ความหนาของสี และส่วนประกอบหลัก 
                </div>
              </div>

              {/* Sticky Footer Button */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] p-4 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] 
                            lg:static lg:border-t lg:border-[#e2e8f0] lg:p-0 lg:pt-6 lg:shadow-none lg:bg-transparent">
                
                <div className="max-w-[1280px] mx-auto lg:max-w-none flex flex-row lg:flex-col justify-between items-center lg:items-stretch gap-4 lg:gap-0">
                    <div className="lg:block flex-1">
                        <div className="flex justify-between items-center lg:mb-4">
                           <span className="text-xs font-bold text-[#64748b]">ค่าบริการตรวจสภาพ</span>
                           <span className="text-lg font-black text-[#0d141b]">ฟรี</span>
                        </div>
                        <div className="hidden lg:flex justify-between items-center mb-6">
                           <span className="text-xs font-bold text-[#64748b]">หมายเลขการประเมิน</span>
                           <span className="text-sm font-bold text-[#0d141b]">#AV-89210-21</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="flex-1 lg:w-full bg-[#137fec] hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            กำลังยืนยัน...
                          </>
                      ) : (
                          <>
                            ยืนยัน<span className="hidden sm:inline">การนัดหมาย</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </>
                      )}
                    </button>
                </div>
                
                <p className="hidden lg:block text-center text-[10px] text-[#94a3b8] mt-3">
                  ไม่มีค่าใช้จ่ายในการจอง สามารถยกเลิกได้ฟรีก่อนเวลานัดหมาย 2 ชั่วโมง
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* --- SUCCESS MODAL --- */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d141b]/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-sm border border-green-100">
                <span className="material-symbols-outlined text-5xl">check</span>
            </div>
            <h3 className="text-2xl font-bold text-[#0d141b] mb-2">จองคิวสำเร็จ!</h3>
            <p className="text-[#64748b] mb-8 text-sm leading-relaxed">
                เราได้ส่งรายละเอียดการนัดหมายวันที่ <br/>
                <strong className="text-[#0d141b]">{selectedDate} เวลา {selectedTime} น.</strong> <br/>
                ไปที่อีเมลของคุณเรียบร้อยแล้ว
            </p>
            <button 
                onClick={() => setIsSuccess(false)}
                className="w-full bg-[#137fec] text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
                ตกลง, รับทราบ
            </button>
            </div>
        </div>
      )}
    </div>
  );
}