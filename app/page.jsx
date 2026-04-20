"use client";
import { useState } from "react";

const cameras = [
  { name: "Ricoh GR IIIx", firstDay: 600, nextDay: 390, image: "/ricohgriiix.jpg", type: "special", deposit: 3000 },
  { name: "DJI Pocket 3", firstDay: 500, nextDay: 290, image: "/pocket3.jpg", type: "special", deposit: 3000 },
  { name: "FUJI X-A7", firstDay: 400, nextDay: 190, image: "/xa7.jpg", type: "fuji", deposit: 1000 },
  { name: "GoPro 13 Black", firstDay: 500, nextDay: 290, image: "/gopro13.jpg", type: "normal", deposit: 1000 },
  { name: "FUJI X-T200", firstDay: 450, nextDay: 190, image: "/xt200.jpg", type: "fuji", deposit: 1000 },
  { name: "FUJI X-T100", firstDay: 400, nextDay: 190, image: "/xt100.jpg", type: "fuji", deposit: 1000 },
  { name: "FUJI X-A5", firstDay: 350, nextDay: 190, image: "/xa5.jpg", type: "fuji", deposit: 1000 },
  { name: "FUJI X-A3", firstDay: 300, nextDay: 150, image: "/xa3.jpg", type: "fuji", deposit: 1000 },
  { name: "SONY A5100", firstDay: 350, nextDay: 190, image: "/a5100.jpg", type: "sony", deposit: 1000 },
  { name: "Canon M10", firstDay: 350, nextDay: 190, image: "/canonm10.jpg", type: "canon", deposit: 1000 },
];

const lensMap = {
  fuji: [
    "35mm f1.4 — ละลายหลัง",
    "18mm f2.0 — ถ่ายวิว",
    "50-230mm — ซูมไกล",
  ],
  sony: [
    "35mm f1.8 — ละลายหลังระยะใกล้",
    "50mm f1.8 — ละลายหลังระยะไกล",
  ],
  canon: [
    "22mm f2.0 — ละลายหลัง",
  ],
};

function calcDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff + 1 : 0;
}

export default function Page() {
  const [selected, setSelected] = useState(null);
  const [selectedLens, setSelectedLens] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [extraHours, setExtraHours] = useState(0);

  const rawDays = calcDays(startDate, endDate);
  const minDays = selected
    ? (selected.name === "Ricoh GR IIIx" || selected.name === "DJI Pocket 3" ? 3 : 2)
    : 0;
  const rentalDays = rawDays > 0 ? Math.max(rawDays, minDays) : 0;
  const cameraPrice = selected && rentalDays > 0
    ? selected.firstDay + Math.max(0, rentalDays - 1) * selected.nextDay
    : 0;
  const lensPrice = selectedLens && rentalDays > 0 ? rentalDays * 200 : 0;
  const extraPrice = Number(extraHours || 0) * 100;
  const insurance = selected ? (selectedLens ? Math.max(selected.deposit, 3000) : selected.deposit) : 0;
  const total = cameraPrice + lensPrice + extraPrice;

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f8", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: 28 }}>48RENT Camera Rental</h1>
        <p style={{ textAlign: "center", color: "#666" }}>ราคาเฉพาะสมาชิกเท่านั้น</p>

        <h2 style={{ marginTop: 30 }}>1. เลือกรุ่นกล้อง</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {cameras.map((cam) => (
            <div
              key={cam.name}
              onClick={() => { setSelected(cam); setSelectedLens(""); }}
              style={{ background: "#fff", padding: 16, borderRadius: 16, cursor: "pointer", border: selected?.name === cam.name ? "2px solid #111" : "1px solid #ddd" }}
            >
              <img src={cam.image} alt={cam.name} style={{ width: "100%", height: 160, objectFit: "contain" }} />
              <h3 style={{ fontSize: 15 }}>{cam.name}</h3>
              <p>วันแรก {cam.firstDay} | วันต่อไป {cam.nextDay}</p>
            </div>
          ))}
        </div>

        {selected && (
          <>
            <h2 style={{ marginTop: 40 }}>2. เลือกเลนส์เสริม</h2>
            {lensMap[selected.type] ? (
              <select
                value={selectedLens}
                onChange={(e) => setSelectedLens(e.target.value)}
                style={{ width: "100%", padding: 12, borderRadius: 10 }}
              >
                <option value="">ไม่เลือกเลนส์เสริม</option>
                {lensMap[selected.type].map((lens) => (
                  <option key={lens} value={lens}>{lens}</option>
                ))}
              </select>
            ) : (
              <p>รุ่นนี้ไม่มีเลนส์เสริม</p>
            )}

            <h2 style={{ marginTop: 40 }}>3. เลือกวันรับและคืน</h2>
            <p>เวลารับ-คืน 10:00 – 18:00 น. | นอกเวลา +100 บาท / ชั่วโมง</p>
            <p>ขั้นต่ำการเช่า: Ricoh GR IIIx / DJI Pocket 3 =
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 10 }} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 10 }} />
            <input type="number" min="0" placeholder="ชั่วโมงนอกเวลา" value={extraHours} onChange={(e) => setExtraHours(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 10 }} />

            <h2 style={{ marginTop: 40 }}>4. สรุปค่าเช่า</h2>
            <div style={{ background: "#fff", padding: 20, borderRadius: 16 }}>
              <p>รุ่นกล้อง: <b>{selected.name}</b></p>
              <p>เลนส์เสริม: <b>{selectedLens || "ไม่มี"}</b></p>
              <p>จำนวนวันเช่า: <b>{rentalDays}</b> วัน</p>
              <p>ค่ากล้อง: <b>{cameraPrice}</b> บาท</p>
              <p>ค่าเลนส์เสริม: <b>{lensPrice}</b> บาท</p>
              <p>ค่านอกเวลา: <b>{extraPrice}</b> บาท</p>
              <p>ค่าประกัน (สมาชิก): <b>{insurance}</b> บาท</p>
              <h2>ยอดรวมค่าเช่า: {total} บาท</h2>
              <p style={{ color: "#666" }}>* ค่าประกันแสดงแยก ไม่รวมในยอดค่าเช่า</p>

              <a href="https://line.me/R/ti/p/@48rent" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 20, background: "#111", color: "#fff", padding: "14px 24px", borderRadius: 12, textDecoration: "none" }}>
                ทัก LINE เพื่อจอง
              </a>
              <p style={{ marginTop: 10 }}>กรุณาแคปหน้าสรุปราคา แล้วส่งใน LINE เพื่อจอง</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
