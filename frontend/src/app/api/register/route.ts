// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
// ❌ ลบ import bcrypt ออกแล้ว

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // 2. เช็คว่ามีอีเมลนี้ในระบบหรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }

    // ❌ ขั้นตอนการ Hash (เข้ารหัส) ถูกลบออกไปแล้ว

    // 3. สร้าง User ลง Database (บันทึกรหัสผ่านตรงๆ เลย)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: password, // 👉 ใส่รหัสผ่านดิบๆ ไปเลย ไม่ต้อง hash
        role: "USER",
      },
    });

    // ลบรหัสผ่านออกจากตัวแปรที่จะส่งกลับ (เพื่อความปลอดภัยในการแสดงผลหน้าบ้าน)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ", user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดที่ระบบเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}