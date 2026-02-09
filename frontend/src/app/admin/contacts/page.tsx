'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sarabun, Manrope } from 'next/font/google';
import Navbar from "../../components/Navbar"; // สมมติว่าใช้ Navbar เดิม หรือจะทำ Sidebar แยกก็ได้

// Fonts
const sarabun = Sarabun({ subsets: ['thai', 'latin'], weight: ['400', '600', '700'], variable: '--font-sarabun' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-manrope' });

// Interface ให้ตรงกับ Prisma Model
interface ContactMsg {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string;
  status: 'PENDING' | 'READ' | 'REPLIED';
  createdAt: string;
  user?: { email: string };
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, REPLIED

  // ดึงข้อมูลเมื่อเข้าหน้าเว็บ
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/contacts');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load contacts", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันอัปเดตสถานะ
  const updateStatus = async (id: string, newStatus: string) => {
    try {
        // อัปเดตใน Frontend ก่อนเพื่อให้ดูเร็ว (Optimistic UI)
        setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, status: newStatus as any } : msg));
        
        // ยิง API ไปหลังบ้าน
        await axios.patch('/api/admin/contacts', { id, status: newStatus });
    } catch (error) {
        alert('อัปเดตสถานะไม่สำเร็จ');
        fetchMessages(); // โหลดข้อมูลจริงกลับมาถ้าพลาด
    }
  };

  // ฟังก์ชันลบ
  const handleDelete = async (id: string) => {
      if (!confirm("คุณแน่ใจหรือไม่ว่าจะลบข้อความนี้?")) return;

      try {
          await axios.delete(`/api/admin/contacts?id=${id}`);
          setMessages(prev => prev.filter(msg => msg.id !== id));
      } catch (error) {
          alert('ลบข้อมูลไม่สำเร็จ');
      }
  };

  // กรองข้อมูลตาม Filter
  const filteredMessages = messages.filter(msg => {
      if (filter === 'ALL') return true;
      return msg.status === filter;
  });

  // Helper: แปลงสีสถานะ
const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'READ': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'REPLIED': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

  return (
    <div className={`${sarabun.variable} ${manrope.variable} font-sans bg-slate-50 min-h-screen`}>
       {/* Import Icons */}
       <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
      <Navbar /> 

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">จัดการข้อความติดต่อ</h1>
                <p className="text-slate-500">รายการข้อความจากหน้า Contact Us ทั้งหมด</p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-4">
                 <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase">ทั้งหมด</span>
                    <span className="text-2xl font-bold text-[#137fec]">{messages.length}</span>
                 </div>
                 <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase">รออ่าน</span>
                    <span className="text-2xl font-bold text-yellow-600">
                        {messages.filter(m => m.status === 'PENDING').length}
                    </span>
                 </div>
            </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-t-xl border-b border-slate-200 flex gap-2">
            {['ALL', 'PENDING', 'READ', 'REPLIED'].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        filter === f 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    {f === 'ALL' ? 'ทั้งหมด' : f}
                </button>
            ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
                <div className="p-10 text-center text-slate-500">กำลังโหลดข้อมูล...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-bold">วันที่</th>
                                <th className="p-4 font-bold">ผู้ส่ง / เบอร์โทร</th>
                                <th className="p-4 font-bold">ข้อความ</th>
                                <th className="p-4 font-bold text-center">สถานะ</th>
                                <th className="p-4 font-bold text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        ไม่พบข้อมูล
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                                        
                                        {/* ... (Code ส่วนวันที่ และ ผู้ส่ง เหมือนเดิม) ... */}
                                        <td className="p-4 text-sm text-slate-500 whitespace-nowrap align-top">
                                            {new Date(msg.createdAt).toLocaleDateString('th-TH', {
                                                day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute:'2-digit'
                                            })}
                                        </td>
                                        <td className="p-4 align-top w-[250px]">
                                            <p className="font-bold text-slate-800">{msg.name}</p>
                                            <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-[16px]">call</span>
                                                {msg.phone}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top max-w-[400px]">
                                            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm leading-relaxed">
                                                {msg.message}
                                            </p>
                                        </td>

                                        {/* ✅✅✅ ส่วนที่แก้: เปลี่ยนเป็น Dropdown เปลี่ยนสถานะได้ทันที ✅✅✅ */}
                                        <td className="p-4 align-top text-center">
                                            <div className="relative inline-block w-full max-w-[140px]">
                                                <select
                                                    value={msg.status}
                                                    onChange={(e) => updateStatus(msg.id, e.target.value)}
                                                    className={`
                                                        w-full appearance-none cursor-pointer font-bold text-xs py-2 pl-3 pr-8 rounded-full border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
                                                        ${getStatusColor(msg.status)}
                                                    `}
                                                >
                                                    <option value="PENDING">🟡 รอตรวจสอบ</option>
                                                    <option value="READ">🔵 อ่านแล้ว</option>
                                                    <option value="REPLIED">🟢 ตอบแล้ว</option>
                                                </select>
                                                {/* ลูกศร Dropdown (ตกแต่ง) */}
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-60">
                                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ปุ่มลบแยกออกมา */}
                                        <td className="p-4 align-top text-center">
                                            <button 
                                                onClick={() => handleDelete(msg.id)}
                                                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                                                title="ลบข้อมูล"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}