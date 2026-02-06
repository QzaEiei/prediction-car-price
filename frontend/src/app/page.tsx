"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// 1. กำหนด Type ของข้อมูลให้ตรงกับที่ Python ต้องการ (Pydantic Model)
interface CarFormData {
  Levy: number;
  Manufacturer: string;
  Model: string;
  Prod_year: number;
  Category: string;
  Leather_interior: string;
  Fuel_type: string;
  Engine_volume: number;
  Mileage: number;
  Cylinders: number;
  Gear_box_type: string;
  Drive_wheels: string;
  Doors: number;
  Wheel: string;
  Color: string;
  Airbags: number;
}

// Type สำหรับ Response ที่ได้กลับมา
interface PredictionResponse {
  price: number;
  currency: string;
}

export default function Home() {
  // 2. กำหนด State พร้อม Type
  const [formData, setFormData] = useState<CarFormData>({
    Levy: 0,
    Manufacturer: 'TOYOTA',
    Model: 'Prius',
    Prod_year: 2015,
    Category: 'Sedan',
    Leather_interior: 'Yes',
    Fuel_type: 'Petrol',
    Engine_volume: 1.8,
    Mileage: 100000,
    Cylinders: 4,
    Gear_box_type: 'Automatic',
    Drive_wheels: 'Front',
    Doors: 4,
    Wheel: 'Left wheel',
    Color: 'Black',
    Airbags: 4
  });

  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 3. ฟังก์ชัน Handle Change แบบ Type-Safe
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // ตรวจสอบว่าเป็น input type="number" หรือไม่ เพื่อแปลงค่าให้ถูกต้อง
    // เพราะ HTML input จะส่งค่ามาเป็น string เสมอ
    const newValue = type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  // 4. ฟังก์ชัน Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPrice(null);

    try {
      // Axios จะรู้ Type ของ Response อัตโนมัติถ้าเราใส่ Generic <PredictionResponse>
      const response = await axios.post<PredictionResponse>('http://127.0.0.1:8000/predict', formData);
      setPrice(response.data.price);
    } catch (error) {
      console.error("Error connecting to API:", error);
      alert("เชื่อมต่อโมเดลไม่ได้ กรุณาเช็คว่ารัน Python Backend แล้วหรือยัง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        🚗 AI Car Price Predictor
      </h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        
        {/* กลุ่ม Text Input */}
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>ยี่ห้อ (Manufacturer)</label>
          <input 
            type="text" 
            name="Manufacturer" 
            value={formData.Manufacturer} 
            onChange={handleChange} 
            required 
            style={inputStyle}
          />
        </div>
        
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>รุ่น (Model)</label>
          <input 
            type="text" 
            name="Model" 
            value={formData.Model} 
            onChange={handleChange} 
            required 
            style={inputStyle}
          />
        </div>

        {/* กลุ่ม Number Input */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>ปีผลิต</label>
            <input 
              type="number" 
              name="Prod_year" 
              value={formData.Prod_year} 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>เครื่องยนต์ (ลิตร)</label>
            <input 
              type="number" 
              step="0.1" 
              name="Engine_volume" 
              value={formData.Engine_volume} 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>เลขไมล์ (กม.)</label>
          <input 
            type="number" 
            name="Mileage" 
            value={formData.Mileage} 
            onChange={handleChange} 
            required 
            style={inputStyle}
          />
        </div>

        {/* กลุ่ม Select Dropdown */}
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>ระบบเกียร์</label>
          <select 
            name="Gear_box_type" 
            value={formData.Gear_box_type} 
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Tiptronic">Tiptronic</option>
            <option value="Variator">Variator</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>เชื้อเพลิง</label>
          <select 
            name="Fuel_type" 
            value={formData.Fuel_type} 
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Petrol">Petrol (เบนซิน)</option>
            <option value="Diesel">Diesel (ดีเซล)</option>
            <option value="Hybrid">Hybrid</option>
            <option value="LPG">LPG</option>
            <option value="CNG">CNG</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            marginTop: '1rem',
            padding: '12px', 
            backgroundColor: loading ? '#ccc' : '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? '⏳ กำลังประมวลผล...' : '🔮 ทำนายราคา'}
        </button>
      </form>

      {/* ส่วนแสดงผลลัพธ์ */}
      {price !== null && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          backgroundColor: '#ecfdf5', 
          border: '1px solid #10b981', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#047857', margin: 0 }}>💰 ราคาประเมิน</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: '0.5rem 0' }}>
            ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            (ประมาณ {Math.round(price * 34).toLocaleString()} บาท)
          </span>
        </div>
      )}
    </div>
  );
}

// Style Object สำหรับ Input (เพื่อให้โค้ดสะอาดขึ้น)
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '1rem',
  boxSizing: 'border-box' // สำคัญสำหรับ layout
};