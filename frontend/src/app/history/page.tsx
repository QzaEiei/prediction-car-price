"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

// ประกาศ Type ให้ตรงกับ Model Valuation ของคุณ
interface ValuationItem {
  id: string;
  brand: string;
  model: string;
  year: string;
  predictedPrice: number;
  minPrice: number;
  maxPrice: number;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<ValuationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 1. เช็ค User จาก LocalStorage
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          router.push("/login");
          return;
        }
        const userObj = JSON.parse(userStr);

        // 2. ดึงข้อมูลจาก API
        const res = await axios.get(`/api/history?userId=${userObj.id}`);
        
        if (res.data.success) {
          setHistoryItems(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  // ฟังก์ชันจัดรูปแบบวันที่ (เช่น 10 ต.ค. 66)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  };

  // ฟังก์ชันจัดรูปแบบราคา (ใส่ลูกน้ำ)
  const formatPrice = (price: number) => {
    return price.toLocaleString('th-TH');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Navbar />

      <main className="flex-1 py-12 px-4 flex justify-center">
        <div className="w-full max-w-4xl">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Link href="/profile" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    ประวัติการประเมินราคา
                </h1>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
                
                {loading ? (
                    <div className="p-12 text-center text-slate-400">กำลังโหลดข้อมูล...</div>
                ) : historyItems.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {historyItems.map((item) => (
                            <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                
                                {/* ส่วนข้อมูลรถ */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                                        {/* Icon รถ */}
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2v0a2 2 0 012 2m0 0a2 2 0 012 2v0a2 2 0 012-2" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">
                                            {item.brand} {item.model} ({item.year})
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1">
                                            ประเมินเมื่อ: {formatDate(item.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* ส่วนราคาที่ประเมินได้ */}
                                <div className="text-right flex flex-col sm:items-end gap-1">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full w-fit ml-auto sm:ml-0">
                                        ประเมินสำเร็จ
                                    </span>
                                    <p className="text-blue-600 font-bold text-xl mt-1">
                                        {formatPrice(item.predictedPrice)} บาท
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        ({formatPrice(item.minPrice)} - {formatPrice(item.maxPrice)})
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <p>ยังไม่มีประวัติการประเมินราคา</p>
                        <Link href="/#car-form" className="mt-4 text-blue-600 hover:underline text-sm font-semibold">
                            เริ่มประเมินราคาครั้งแรก
                        </Link>
                    </div>
                )}
            </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}