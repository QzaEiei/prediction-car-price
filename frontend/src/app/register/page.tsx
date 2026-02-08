'use client';

import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันจัดการการพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันกดปุ่มสมัคร
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // เช็คว่ารหัสผ่านตรงกันไหม
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านยืนยันไม่ตรงกัน');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // สมัครสำเร็จ -> ไปหน้า Login (เดี๋ยวเราค่อยสร้าง)
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        router.push('/login'); 
      } else {
        // สมัครไม่สำเร็จ -> แสดง Error
        setError(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />
      
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">สร้างบัญชีผู้ใช้</h1>
            <p className="text-gray-500 text-sm mt-2">
              สมัครสมาชิกเพื่อดูประวัติการประเมินราคาและนัดหมาย
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <input 
                type="text" 
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="สมชาย ใจดี"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="somchai@example.com"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <input 
                type="password" 
                name="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="******"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
              <input 
                type="password" 
                name="confirmPassword"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="******"
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:bg-blue-300"
            >
              {loading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
              เข้าสู่ระบบ
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}