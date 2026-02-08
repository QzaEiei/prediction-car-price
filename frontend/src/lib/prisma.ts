import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// บรรทัดนี้ต้องมีครับ แต่ต้องเขียนแบบนี้เพื่อเช็คว่ามีของเก่าไหม
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma