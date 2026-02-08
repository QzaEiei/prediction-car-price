"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Type ข้อมูล
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

interface PredictionResponse {
  price: number;
  currency: string;
}

// Type สำหรับรายการรถ { "TOYOTA": ["Prius", "Camry"], ... }
interface CarOptions {
  [key: string]: string[];
}

export default function Home() {
  // State เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState<CarFormData>({
    Levy: 0,
    Manufacturer: '',     // เริ่มต้นยังไม่เลือก
    Model: '',            // เริ่มต้นยังไม่เลือก
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

  // State เก็บตัวเลือกรถที่โหลดมาจาก API
  const [carOptions, setCarOptions] = useState<CarOptions>({});
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. โหลดรายชื่อรถตอนเข้าเว็บครั้งแรก
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get<CarOptions>('https://car-price-api-szgc.onrender.com/car_options');
        setCarOptions(res.data);
        setLoadingOptions(false);
      } catch (error) {
        console.error("Failed to load car options", error);
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  // 2. Handle Change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // ถ้ามีการเปลี่ยน "ยี่ห้อ" (Manufacturer)
    if (name === 'Manufacturer') {
      setFormData((prev) => ({
        ...prev,
        Manufacturer: value,
        Model: '' // **สำคัญ** รีเซ็ตรุ่นรถให้ว่างก่อน เพราะรุ่นเก่าอาจจะไม่มีในยี่ห้อใหม่
      }));
    } else {
      // กรณีอื่นๆ
      const newValue = type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value;
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPrice(null);

    try {
      const response = await axios.post<PredictionResponse>('https://car-price-api-szgc.onrender.com/predict', formData);
      setPrice(response.data.price);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่ออ");
    } finally {
      setLoading(false);
    }
  };

  // ดึงรายชื่อยี่ห้อทั้งหมดมาเรียง A-Z
  const manufacturerList = Object.keys(carOptions).sort();
  
  // ดึงรายชื่อรุ่น ตามยี่ห้อที่เลือกอยู่ปัจจุบัน
  const modelList = formData.Manufacturer ? carOptions[formData.Manufacturer] : [];

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>🚗 AI Car Price Predictor</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        
        {/* === ส่วนเลือกยี่ห้อ (Dropdown) === */}
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>ยี่ห้อ (Manufacturer)</label>
          <select 
            name="Manufacturer" 
            value={formData.Manufacturer} 
            onChange={handleChange} 
            required 
            style={inputStyle}
            disabled={loadingOptions}
          >
            <option value="">-- กรุณาเลือกยี่ห้อ --</option>
            {manufacturerList.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        
        {/* === ส่วนเลือกรุ่น (Dropdown แบบ Cascading) === */}
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>รุ่น (Model)</label>
          <select 
            name="Model" 
            value={formData.Model} 
            onChange={handleChange} 
            required 
            style={inputStyle}
            disabled={!formData.Manufacturer} // ล็อกไว้ถ้ายังไม่เลือกยี่ห้อ
          >
            <option value="">-- กรุณาเลือกรุ่น --</option>
            {modelList && modelList.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* === Input อื่นๆ (เหมือนเดิม) === */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>ปีผลิต</label>
            <input type="number" name="Prod_year" value={formData.Prod_year} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label>เครื่องยนต์ (ลิตร)</label>
            <input type="number" step="0.1" name="Engine_volume" value={formData.Engine_volume} onChange={handleChange} required style={inputStyle} />
          </div>
        </div>

        <div>
          <label>เลขไมล์ (กม.)</label>
          <input type="number" name="Mileage" value={formData.Mileage} onChange={handleChange} required style={inputStyle} />
        </div>

        <div>
          <label>ระบบเกียร์</label>
          <select name="Gear_box_type" value={formData.Gear_box_type} onChange={handleChange} style={inputStyle}>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Tiptronic">Tiptronic</option>
            <option value="Variator">Variator</option>
          </select>
        </div>

        <div>
          <label>เชื้อเพลิง</label>
          <select name="Fuel_type" value={formData.Fuel_type} onChange={handleChange} style={inputStyle}>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="LPG">LPG</option>
            <option value="CNG">CNG</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            marginTop: '1rem', padding: '12px', 
            backgroundColor: loading ? '#ccc' : '#2563eb', 
            color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' 
          }}
        >
          {loading ? '⏳ กำลังประมวลผล...' : '🔮 ทำนายราคา'}
        </button>
      </form>

      {price !== null && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px', textAlign: 'center' }}>
          <h3>💰 ราคาประเมินน: ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box'
};