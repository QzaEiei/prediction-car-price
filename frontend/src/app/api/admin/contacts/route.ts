// src/app/api/admin/contacts/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. GET: ดึงข้อมูลทั้งหมด
export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc', // เรียงจากใหม่ไปเก่า
      },
      include: {
        user: { // ดึงข้อมูล User (ถ้ามี) มาดูด้วยว่าใครส่ง
           select: { email: true, id: true } 
        }
      }
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// 2. PATCH: อัปเดตสถานะ (เช่น กดว่าอ่านแล้ว)
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body; // รับ id และ status ใหม่ (PENDING, READ, REPLIED)

        const updated = await prisma.contactMessage.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Update Error" }, { status: 500 });
    }
}

// 3. DELETE: ลบข้อความ
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false }, { status: 400 });

        await prisma.contactMessage.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Delete Error" }, { status: 500 });
    }
}