import type { Config } from "tailwindcss";

const config: Config = {
  content: [
"   ./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // เพิ่มสีพิเศษสำหรับเว็บคุณ
        "background-light": "#f8fafc", // สีพื้นหลังขาวอมฟ้าจางๆ
        "background-dark": "#0f172a",  // สีพื้นหลังมืด
        primary: "#2563eb",            // สีน้ำเงินหลัก
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;