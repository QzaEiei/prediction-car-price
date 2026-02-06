// frontend/prisma.config.ts
import 'dotenv/config'
import { defineConfig, env } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // ให้มันไปอ่านจาก .env เท่านั้น (ห้ามใส่ URL ตรงๆ ที่นี่)
    url: env('DIRECT_URL'),
  },
})