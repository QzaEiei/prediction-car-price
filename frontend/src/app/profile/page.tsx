"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2"; 

export default function EditProfilePage() {
  const router = useRouter();
  
  // States
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false);  
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  // 1. ดึงข้อมูล User เมื่อเข้าหน้าเว็บ
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          router.push("/login"); 
          return;
        }

        const userObj = JSON.parse(userStr);
        setUserId(userObj.id);

        const res = await axios.get(`/api/profile?id=${userObj.id}`);
        if (res.data.success) {
          setFormData({
            name: res.data.data.name,
            email: res.data.data.email
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // 2. ฟังก์ชันเปลี่ยนค่าใน Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. ฟังก์ชันบันทึกข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    try {
      const res = await axios.put("/api/profile", {
        id: userId,
        name: formData.name,
        email: formData.email
      });

      if (res.data.success) {
        const updatedUserLocal = { ...JSON.parse(localStorage.getItem("user") || "{}"), name: formData.name, email: formData.email };
        localStorage.setItem("user", JSON.stringify(updatedUserLocal));

        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
          text: 'ข้อมูลส่วนตัวของคุณได้รับการแก้ไขแล้ว',
          confirmButtonColor: '#2563EB'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่',
      });
    } finally {
      setSaving(false);
    }
  };

  // ✅ 4. เพิ่มฟังก์ชันออกจากระบบ (Logout)
  const handleLogout = () => {
    Swal.fire({
      title: 'ยืนยันการออกจากระบบ?',
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // สีแดง
      cancelButtonColor: '#94a3b8', // สีเทา
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        // ลบข้อมูลใน LocalStorage
        localStorage.removeItem("user");
        // ดีดกลับไปหน้า Login
        router.push("/login");
      }
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8]">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      
      {/* 1. Navbar ด้านบน */}
      <Navbar />

      {/* 2. เนื้อหาหลัก */}
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-4">
        
        <div className="w-full max-w-2xl">
          
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Decorative Header */}
            <div className="h-24 bg-blue-600 relative">
              <div 
                className="absolute inset-0 opacity-20" 
                style={{ 
                    backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)", 
                    backgroundSize: "20px 20px" 
                }}
              ></div>
            </div>

            <div className="px-6 md:px-10 pb-10">
              
              {/* Header Text */}
              <div className="py-8 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-slate-900">{formData.name || "ผู้ใช้งาน"}</h2>
                <p className="text-slate-500 mt-1">จัดการข้อมูลส่วนตัวของคุณ</p>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. ชื่อ-นามสกุล */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide" htmlFor="fullname">
                    ชื่อ-นามสกุล
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input 
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-slate-900 font-medium outline-none placeholder:text-slate-400" 
                        id="fullname" 
                        name="name" 
                        placeholder="กรอกชื่อ-นามสกุล" 
                        type="text" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                  </div>
                </div>

                {/* 2. อีเมล */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide" htmlFor="email">
                    อีเมล
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <input 
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all text-slate-900 font-medium outline-none placeholder:text-slate-400" 
                        id="email" 
                        name="email" 
                        placeholder="กรอกอีเมลของคุณ" 
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                  </div>
                </div>

{/* Action Buttons Group */}
                <div className="pt-6 flex flex-col gap-3">
                  {/* 1. ปุ่มบันทึก (สีน้ำเงิน) */}
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:bg-blue-400 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {saving ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            กำลังบันทึก...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                            บันทึกการเปลี่ยนแปลง
                        </>
                    )}
                  </button>

                  {/* ✅ 2. ปุ่มดูประวัติการประเมิน (เพิ่มใหม่) */}
                  <button 
                    type="button"
                    onClick={() => router.push('/history')} // สั่งให้ไปหน้า history
                    className="w-full px-10 py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                     <span className="material-symbols-outlined">history</span> {/* หรือใช้ SVG ด้านล่างถ้าไม่ได้ลง Material Icon */}
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     ประวัติการประเมินราคา
                  </button>

                  {/* 3. ปุ่มออกจากระบบ (สีแดง) */}
                  <button 
                    type="button" 
                    onClick={handleLogout}
                    className="w-full px-10 py-4 bg-white border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                     ออกจากระบบ
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* 3. Footer */}
          <div className="mt-12">
             {/* Footer Content */}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}