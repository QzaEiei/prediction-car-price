// src/app/login/page.tsx
'use client'; // 👈 1. ต้องมีบรรทัดนี้เสมอสำหรับหน้าที่มี Form/State

import { useState } from 'react';
import axios from 'axios';
// ✅ 1. เพิ่ม useSearchParams เข้ามาด้วย
import { useRouter, useSearchParams } from 'next/navigation'; 
import Link from 'next/link'; // 👈 2. ต้อง Import Link มาด้วย
import Navbar from '../components/Navbar';


export default function LoginPage() {
  
  const router = useRouter();
  // ✅ 2. ประกาศตัวแปรรับค่า params
  const searchParams = useSearchParams(); 

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ยิง API ไปตรวจสอบ
      const res = await axios.post('/api/login', formData);
      
      if (res.status === 200) {
        // บันทึกข้อมูล User ลงใน LocalStorage
        localStorage.setItem('user', JSON.stringify(res.data.user));

        alert('เข้าสู่ระบบสำเร็จ! 🎉');
        
        // ✅ 3. แก้ไข Logic การเปลี่ยนหน้า ตรงนี้ครับ
        const returnUrl = searchParams.get('returnUrl');

        if (returnUrl) {
            // ถ้ามี returnUrl ส่งมา (เช่นมาจากหน้าประเมินราคา) ให้เด้งกลับไปที่นั่น
            // ใช้ decodeURIComponent เพื่อแปลงรหัส %20 หรืออักขระพิเศษกลับมาเป็น URL ปกติ
            window.location.href = decodeURIComponent(returnUrl);
        } else {
            // ถ้าไม่มี (Login เข้ามาปกติ) ให้ไปหน้าแรก
            window.location.href = '/'; 
        }
      }
    } catch (err: any) {
      // จัดการ Error
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen flex flex-col bg-gray-100">
  
  {/* --- ส่วน Navbar เริ่มต้น --- */}
  <Navbar/>

  {/* --- ส่วน Navbar สิ้นสุด --- */}

  {/* --- ส่วนเนื้อหา (ฟอร์ม Login) --- */}
  <div className="flex-grow flex items-center justify-center p-4">
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900">เข้าสู่ระบบ</h2>
      
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-100 rounded border border-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">อีเมล</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none disabled:bg-gray-400"
        >
          {loading ? 'กำลังโหลด...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600">
        ยังไม่มีบัญชี?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  </div>
</div>
  );
}