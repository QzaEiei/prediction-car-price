import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ⚠️ ตรวจสอบ path นี้ให้ตรงกับไฟล์ prisma ของคุณ

// ✅ ต้องใช้ชื่อ function ว่า POST เท่านั้น (ตัวใหญ่ทั้งหมด)
export async function POST(req: Request) {
  try {
    // 1. รับค่าจากหน้าบ้าน (Frontend)
    const body = await req.json();
    const { email, password } = body;

    // 2. เช็คว่ากรอกข้อมูลครบไหม
    if (!email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // 3. ค้นหา User ใน Database
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // 4. ถ้าหาไม่เจอ หรือ รหัสผ่านไม่ตรง
    // (หมายเหตุ: ระบบจริงควรใช้การ Hash รหัสผ่าน แต่ตอนนี้เอาแบบนี้ก่อนเพื่อให้เทสผ่านครับ)
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // 5. ลบ password ออกจากข้อมูลก่อนส่งกลับ (เพื่อความปลอดภัย)
    const { password: _, ...userWithoutPassword } = user;

    // 6. ส่งค่ากลับไปบอกหน้าบ้านว่า "ผ่าน"
    return NextResponse.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      user: userWithoutPassword,
    }, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}