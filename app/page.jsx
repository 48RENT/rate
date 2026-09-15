"use client";
import { useState, useRef } from "react";

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

function formatThaiDate(dateString) {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${Number(year) + 543}`;
}

function getExtraHours(time, type) {
  if (!time || type === "normal") return 0;

  const [hour, minute] = time.split(":").map(Number);
  const minutes = hour * 60 + minute;

  if (type === "before") {
    return Math.ceil((10 * 60 - minutes) / 60);
  }

  if (type === "after") {
    return Math.ceil((minutes - 18 * 60) / 60);
  }

  return 0;
}

export default function Page() {
  const nextSectionRef = useRef(null);

  const [selected, setSelected] = useState(null);
  const [selectedLens, setSelectedLens] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [pickupType, setPickupType] = useState("normal");
  const [pickupTime, setPickupTime] = useState("10:00");

  const [returnType, setReturnType] = useState("normal");
  const [returnTime, setReturnTime] = useState("18:00");

  const rawDays = calcDays(startDate, endDate);

  const minDays = selected
    ? (
        selected.name === "Ricoh GR IIIx" ||
        selected.name === "DJI Pocket 3"
          ? 3
          : 2
      )
    : 0;

  const rentalDays = rawDays > 0 ? Math.max(rawDays, minDays) : 0;

  const cameraPrice = selected && rentalDays > 0
    ? selected.firstDay + Math.max(0, rentalDays - 1) * selected.nextDay
    : 0;

  const lensPrice = selectedLens && rentalDays > 0
    ? rentalDays * 200
    : 0;

  const pickupExtraHours = getExtraHours(pickupTime, pickupType);
  const returnExtraHours = getExtraHours(returnTime, returnType);

  const pickupExtraPrice = pickupExtraHours * 100;
  const returnExtraPrice = returnExtraHours * 100;
  const extraPrice = pickupExtraPrice + returnExtraPrice;

  const insurance = selected
    ? (selectedLens ? Math.max(selected.deposit, 3000) : selected.deposit)
    : 0;

  const displayPickupTime = pickupType === "normal" ? "10:00 น." : `${pickupTime} น.`;
  const displayReturnTime = returnType === "normal" ? "18:00 น." : `${returnTime} น.`;

  const total = cameraPrice + lensPrice + extraPrice;

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f8", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: 28 }}>48RENT Camera Rental</h1>
        <p style={{ textAlign: "center", color: "#666" }}>
          ราคาเฉพาะสมาชิกเท่านั้น
        </p>

        <h2 style={{ marginTop: 30 }}>1. เลือกรุ่นกล้อง</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
          {cameras.map((cam) => (
            <div
              key={cam.name}
              onClick={() => {
                setSelected(cam);
                setSelectedLens("");
                setTimeout(() => {
                  nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 150);
              }}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 16,
                cursor: "pointer",
                border: selected?.name === cam.name ? "2px solid #111" : "1px solid #ddd"
              }}
            >
              <img
                src={cam.image}
                alt={cam.name}
                style={{ width: "100%", height: 160, objectFit: "contain" }}
              />
              <h3 style={{ fontSize: 15 }}>{cam.name}</h3>
              <p>วันแรก {cam.firstDay} | วันต่อไป {cam.nextDay}</p>
            </div>
          ))}
        </div>

        {selected && (
          <>
            <div ref={nextSectionRef}>
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
            </div>

            <h2 style={{ marginTop: 40 }}>3. เลือกวันและเวลารับ-คืน</h2>
            <p>เวลาปกติ 10:00 – 18:00 น. | นอกเวลา 100 บาท / ชั่วโมง</p>
            <p>ขั้นต่ำการเช่า: Ricoh GR IIIx / DJI Pocket 3 = 3 วัน, รุ่นอื่นทั้งหมด = 2 วัน</p>

            <label style={{ marginTop: 12, display: "block" }}>วันที่รับกล้อง</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 10 }}
            />

            <label style={{ marginTop: 18, display: "block" }}>วันที่คืนกล้อง</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 10 }}
            />

            <div style={{ background: "#fff", padding: 16, borderRadius: 14, marginTop: 24 }}>
              <h3 style={{ marginTop: 0 }}>เวลารับกล้อง</h3>

              <label style={{ display: "block", marginTop: 10 }}>
                <input
                  type="radio"
                  name="pickupType"
                  checked={pickupType === "normal"}
                  onChange={() => {
                    setPickupType("normal");
                    setPickupTime("10:00");
                  }}
                />{" "}
                เวลาปกติ 10:00 – 18:00 น. <b>ไม่มีค่าใช้จ่าย</b>
              </label>

              <label style={{ display: "block", marginTop: 10 }}>
                <input
                  type="radio"
                  name="pickupType"
                  checked={pickupType === "before"}
                  onChange={() => setPickupType("before")}
                />{" "}
                รับก่อน 10:00 น.
              </label>

              {pickupType === "before" && (
                <div style={{ marginTop: 10 }}>
                  <input
                    type="time"
                    min="07:00"
                    max="09:59"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    style={{ width: "100%", padding: 10 }}
                  />
                  <p style={{ margin: "8px 0 0", color: "#666" }}>
                    เลือกเวลา 07:00 – 09:59 น. | ค่านอกเวลา +{pickupExtraPrice} บาท
                  </p>
                </div>
              )}

              <label style={{ display: "block", marginTop: 10 }}>
                <input
                  type="radio"
                  name="pickupType"
                  checked={pickupType === "after"}
                  onChange={() => setPickupType("after")}
                />{" "}
                รับหลัง 18:00 น.
              </label>

              {pickupType === "after" && (
                <div style={{ marginTop: 10 }}>
                  <input
                    type="time"
                    min="18:01"
                    max="22:00"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    style={{ width: "100%", padding: 10 }}
                  />
                  <p style={{ margin: "8px 0 0", color: "#666" }}>
                    เลือกเวลา 18:01 – 22:00 น. | ค่านอกเวลา +{pickupExtraPrice} บาท
                  </p>
                </div>
              )}
            </div>

            <div style={{ background: "#fff", padding: 16, borderRadius: 14, marginTop: 16 }}>
              <h3 style={{ marginTop: 0 }}>เวลาคืนกล้อง</h3>

              <label style={{ display: "block", marginTop: 10 }}>
                <input
                  type="radio"
                  name="returnType"
                  checked={returnType === "normal"}
                  onChange={() => {
                    setReturnType("normal");
                    setReturnTime("18:00");
                  }}
                />{" "}
                เวลาปกติ 10:00 – 18:00 น. <b>ไม่มีค่าใช้จ่าย</b>
              </label>

              <label style={{ display: "block", marginTop: 10 }}>
                <input
                  type="radio"
                  name="returnType"
                  checked={returnType === "before"}
                  onChange={() => setReturnType("before")}
                />{" "}
                คืนก่อน 10:00 น.
              </label>

              {returnType === "before" && (
                <div style={{ marginTop: 10 }}>
                  <input
                    type="time"
                    min="07:00"
                    max="09:59"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    style={{ width: "100%", padding: 10 }}
                  />
                  <p style={{ margin: "8px 0 0", color: "#666" }}>
                    เลือกเวลา 07:00 – 09:59 น. | ค่านอกเวลา +{returnExtraPrice} บาท
                  </p>
                </div>
              )}

              <label style={{ display: "block", marginTop: 10 }}>
                <input
                  type="radio"
                  name="returnType"
                  checked={returnType === "after"}
                  onChange={() => setReturnType("after")}
                />{" "}
                คืนหลัง 18:00 น.
              </label>

              {returnType === "after" && (
                <div style={{ marginTop: 10 }}>
                  <input
                    type="time"
                    min="18:01"
                    max="22:00"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    style={{ width: "100%", padding: 10 }}
                  />
                  <p style={{ margin: "8px 0 0", color: "#666" }}>
                    เลือกเวลา 18:01 – 22:00 น. | ค่านอกเวลา +{returnExtraPrice} บาท
                  </p>
                </div>
              )}
            </div>

            <h2 style={{ marginTop: 40 }}>4. สรุปค่าเช่า</h2>
            <div style={{ background: "#fff", padding: 20, borderRadius: 16 }}>
              <p>รุ่นกล้อง: <b>{selected.name}</b></p>
              <p>เลนส์เสริม: <b>{selectedLens || "ไม่มี"}</b></p>
              <p>จำนวนวันเช่า (คิดขั้นต่ำแล้ว): <b>{rentalDays}</b> วัน</p>

              <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "18px 0" }} />

              <p>วันรับกล้อง: <b>{formatThaiDate(startDate)}</b></p>
              <p>เวลารับกล้อง: <b>{displayPickupTime}</b></p>
              <p>วันคืนกล้อง: <b>{formatThaiDate(endDate)}</b></p>
              <p>เวลาคืนกล้อง: <b>{displayReturnTime}</b></p>

              <hr style={{ border: 0, borderTop: "1px solid #eee", margin: "18px 0" }} />

              <p>ค่ากล้อง: <b>{cameraPrice}</b> บาท</p>
              <p>ค่าเลนส์เสริม: <b>{lensPrice}</b> บาท</p>
              <p>ค่ารับนอกเวลา: <b>{pickupExtraPrice}</b> บาท</p>
              <p>ค่าคืนนอกเวลา: <b>{returnExtraPrice}</b> บาท</p>
              <p>ค่านอกเวลารวม: <b>{extraPrice}</b> บาท</p>
              <p>ค่าประกัน (สมาชิก): <b>{insurance}</b> บาท</p>

              <h2>ยอดรวมค่าเช่า: {total} บาท</h2>
              <p style={{ color: "#666" }}>* ค่าประกันแสดงแยก ไม่รวมในยอดค่าเช่า</p>

              <a
                href={`https://line.me/R/oaMessage/@48rent/?${encodeURIComponent(
                  `สนใจเช่ากล้อง

` +
                  `รุ่น: ${selected.name}
` +
                  `เลนส์เสริม: ${selectedLens || "ไม่มี"}
` +
                  `วันรับ: ${formatThaiDate(startDate)}
` +
                  `เวลารับ: ${displayPickupTime}
` +
                  `วันคืน: ${formatThaiDate(endDate)}
` +
                  `เวลาคืน: ${displayReturnTime}
` +
                  `จำนวนวันเช่า: ${rentalDays} วัน
` +
                  `ค่ากล้อง: ${cameraPrice} บาท
` +
                  `ค่าเลนส์เสริม: ${lensPrice} บาท
` +
                  `ค่ารับนอกเวลา: ${pickupExtraPrice} บาท
` +
                  `ค่าคืนนอกเวลา: ${returnExtraPrice} บาท
` +
                  `ค่านอกเวลารวม: ${extraPrice} บาท
` +
                  `ค่าประกัน: ${insurance} บาท
` +
                  `ยอดรวมค่าเช่า: ${total} บาท`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 20,
                  background: "#00c854",
                  color: "#fff",
                  padding: "14px 24px",
                  borderRadius: 12,
                  textDecoration: "none"
                }}
              >
                ส่งสรุปทาง line เพื่อตรวจสอบคิว
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
