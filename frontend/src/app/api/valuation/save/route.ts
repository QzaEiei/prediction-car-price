// src/app/api/valuation/save/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ตรวจสอบ path ของ prisma ให้ถูก

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // สร้างข้อมูลใหม่ลงตาราง Valuation
    const newValuation = await prisma.valuation.create({
      data: {
        brand: body.brand,
        model: body.model,
        year: String(body.year),
        mileage: Number(body.mileage),
        color: body.color,
        condition: body.condition,
        serviceHistory: body.serviceHistory,
        fuelType: body.fuelType,
        transmission: body.transmission,
        
        // ข้อมูลราคาที่คำนวณมาแล้ว
        predictedPrice: parseFloat(body.predictedPrice),
        minPrice: parseFloat(body.minPrice),
        maxPrice: parseFloat(body.maxPrice),

        // เชื่อมกับ User (ถ้ามี)
        userId: body.userId || null, 
      },
    });

    return NextResponse.json({ success: true, data: newValuation });
  } catch (error) {
    console.error("Save Valuation Error:", error);
    return NextResponse.json({ success: false, message: "Failed to save" }, { status: 500 });
  }
}