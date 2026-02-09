// src/app/api/history/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ ต้องชื่อ GET ตัวใหญ่เป๊ะๆ
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
    }

    const history = await prisma.valuation.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}