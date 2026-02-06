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
        {/* ... (ส่วน Link Font/Icon ที่คุณใส่ไว้ ถูกแล้วครับ) ... */}
         <link 
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&family=Manrope:wght@400;500;700;800&display=swap" 
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}</style>
      </head>

      <body className="font-display antialiased">
        
        {/* --- ตัวอย่างการใช้ <Link> ที่คุณ import มา --- */}
        <nav className=" bg-white shadow-sm flex ">
            {/* <Link href="/" className="text-blue-600 font-bold">หน้าแรก</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-500">เกี่ยวกับเรา</Link> */}
        </nav>
        {/* ------------------------------------------- */}

        {children}
      </body>
    </html>
  );
}