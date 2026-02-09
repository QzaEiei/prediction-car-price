// src/app/login/page.tsx
'use client';

import { useState, Suspense } from 'react'; // ✅ เพิ่ม Suspense
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';

// ----------------------------------------------------------------------
// 1. สร้าง Component ย่อย: สำหรับจัดการ Logic ของฟอร์มทั้งหมด
// ----------------------------------------------------------------------
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ ใช้ได้แล้ว เพราะถูกห่อด้วย Suspense

  const [formData, setFormData] = useState({
    email: '',   
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/login', formData);

      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // ใช้ SweetAlert2 แทน alert ธรรมดาถ้าลงไว้ (ถ้าไม่มีใช้ alert เดิมก็ได้)
        // alert('เข้าสู่ระบบสำเร็จ! 🎉'); 

        const returnUrl = searchParams.get('returnUrl');
        if (returnUrl) {
          window.location.href = decodeURIComponent(returnUrl);
        } else {
          window.location.href = '/';
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  // Return JSX ของฟอร์ม
  return (
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
  );
}

// ----------------------------------------------------------------------
// 2. Main Page Component: เอา Suspense มาครอบ LoginForm ไว้
// ----------------------------------------------------------------------
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      {/* ✅ จุดสำคัญ: ต้องเอา Suspense มาครอบ Component ที่มีการใช้ useSearchParams 
          fallback คือสิ่งที่แสดงระหว่างรอโหลด params (ปกติจะเร็วมากจนมองไม่ทัน)
      */}
      <Suspense fallback={<div className="flex-grow flex items-center justify-center">Loading...</div>}>
        <LoginForm />
      </Suspense>

    </div>
  );
}