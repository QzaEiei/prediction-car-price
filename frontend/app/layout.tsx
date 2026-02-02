// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link"; // เพิ่ม Link เผื่อใช้ในอนาคต

export const metadata: Metadata = {
  title: "ประเมินราคารถยนต์ - ValuCar",
  description: "รับราคาประเมินตลาดที่แม่นยำและรวดเร็วสำหรับรถของคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        {/* --- ส่วนที่เพิ่มมา: โหลด Font และ Icon --- */}
        
        {/* Google Fonts: Sarabun & Manrope */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&family=Manrope:wght@400;500;700;800&display=swap" 
          rel="stylesheet"
        />
        
        {/* Material Symbols Icons */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet"
        />

        {/* CSS สำหรับตั้งค่า Icon ให้แสดงผลถูกต้อง */}
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}</style>
      </head>

      {/* เรียกใช้ font-display ที่ตั้งค่าไว้ใน tailwind.config.ts */}
      <body className="font-display antialiased">
        {children}
      </body>
    </html>
  );
}