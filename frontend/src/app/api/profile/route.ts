// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. GET: ดึงข้อมูล User มาแสดง
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true } // เลือกเฉพาะข้อมูลที่จะใช้
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// 2. PUT: บันทึกการแก้ไข
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email } = body;

    if (!id || !name || !email) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // อัปเดตข้อมูล
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}