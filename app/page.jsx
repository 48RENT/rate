"use client";
import { useState } from "react";

const cameras = [
  { name: "Ricoh GR IIIx", firstDay: 600, nextDay: 390, image: "/ricohgriiix.jpg" },
  { name: "DJI Pocket 3", firstDay: 500, nextDay: 290, image: "/pocket3.jpg" },
  { name: "FUJI X-A7", firstDay: 400, nextDay: 190, image: "/xa7.jpg" },
  { name: "GoPro 13 Black", firstDay: 500, nextDay: 290, image: "/gopro13.jpg" },
  { name: "FUJI X-T200", firstDay: 450, nextDay: 190, image: "/xt200.jpg" },
  { name: "FUJI X-T100", firstDay: 400, nextDay: 190, image: "/xt100.jpg" },
  { name: "FUJI X-A5", firstDay: 350, nextDay: 190, image: "/xa5.jpg" },
  { name: "FUJI X-A3", firstDay: 300, nextDay: 150, image: "/xa3.jpg" },
  { name: "SONY A5100", firstDay: 350, nextDay: 190, image: "/a5100.jpg" },
  { name: "Canon M10", firstDay: 350, nextDay: 190, image: "/canonm10.jpg" },
];

function calcDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff + 1 : 0;
}

export default function Page() {
  const [selected, setSelected] = useState(cameras[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lensDays, setLensDays] = useState(0);
  const [extraHours, setExtraHours] = useState(0);

  const rentalDays = calcDays(startDate, endDate);
  const cameraPrice = rentalDays > 0
    ? selected.firstDay + Math.max(0, rentalDays - 1) * selected.nextDay
    : 0;
  const lensPrice = Number(lensDays || 0) * 200;
  const extraPrice = Number(extraHours || 0) * 100;
  const total = cameraPrice + lensPrice + extraPrice;

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f8", padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: 30 }}>48RENT Camera Rental Calculator</h1>
        <p style={{ textAlign: "center", color: "#666" }}>
          เลือกกล้อง • เลือกวันรับคืน • สรุปค่าเช่าอัตโนมัติ
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 30 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 18 }}>
            <h2>เลือกกล้อง</h2>
            <select
              value={selected.name}
              onChange={(e) => setSelected(cameras.find(c => c.name === e.target.value))}
              style={{ width: "100%", padding: 12, marginTop: 10, borderRadius: 10 }}
            >
              {cameras.map((cam) => (
                <option key={cam.name} value={cam.name}>{cam.name}</option>
              ))}
            </select>

            <img
              src={selected.image}
              alt={selected.name}
              style={{ width: "100%", height: 280, objectFit: "contain", marginTop: 20 }}
            />

            <p>วันแรก: {selected.firstDay} บาท</p>
            <p>วันต่อไป: {selected.nextDay} บาท</p>
          </div>

          <div style={{ background: "#fff", padding: 24, borderRadius: 18 }}>
            <h2>คำนวณค่าเช่า</h2>

            <label>วันรับ</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 12 }} />

            <label>วันคืน</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 12 }} />

            <label>จำนวนวันเลนส์เสริม (วันละ 200)</label>
            <input type="number" min="0" value={lensDays} onChange={(e) => setLensDays(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 12 }} />

            <label>ชั่วโมงนอกเวลา (+100/ชม.)</label>
            <input type="number" min="0" value={extraHours} onChange={(e) => setExtraHours(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 12 }} />

            <hr style={{ margin: "20px 0" }} />
            <p>จำนวนวันเช่า: <b>{rentalDays}</b> วัน</p>
            <p>ค่ากล้อง: <b>{cameraPrice}</b> บาท</p>
            <p>ค่าเลนส์: <b>{lensPrice}</b> บาท</p>
            <p>ค่านอกเวลา: <b>{extraPrice}</b> บาท</p>
            <h2>รวมทั้งหมด: {total} บาท</h2>

            <a
              href="https://line.me/R/ti/p/@48rent"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 20,
                background: "#111",
                color: "#fff",
                padding: "14px 24px",
                borderRadius: 12,
                textDecoration: "none"
              }}
            >
              ทัก LINE เพื่อจอง
            </a>

            <p style={{ marginTop: 12, fontSize: 14, color: "#666" }}>
              กรุณาแคปหน้าสรุปราคา แล้วส่งใน LINE เพื่อจอง
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
