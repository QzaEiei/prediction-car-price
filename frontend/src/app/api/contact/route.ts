// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, userId } = body;

    // ตรวจสอบข้อมูลจำเป็น (Validation)
    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, message: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // บันทึกลงฐานข้อมูล
    const newContact = await prisma.contactMessage.create({
      data: {
        name,
        email: email || null, // ถ้าไม่ส่งมาให้เป็น null
        phone,
        message,
        userId: userId || null, // ถ้า Login มาก็ใส่ userId ถ้าไม่ก็ null
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: newContact });

  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการส่งข้อมูล" },
      { status: 500 }
    );
  }
}