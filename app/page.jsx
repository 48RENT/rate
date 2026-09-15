"use client";

import { useState } from "react";

const cameras = [
  {
    name: "Ricoh GR IIIx",
    firstDay: 600,
    nextDay: 390,
    image: "/ricohgriiix.jpg",
    type: "special",
    deposit: 3000,
  },
  {
    name: "DJI Pocket 3",
    firstDay: 500,
    nextDay: 290,
    image: "/pocket3.jpg",
    type: "special",
    deposit: 3000,
  },
  {
    name: "FUJI X-A7",
    firstDay: 400,
    nextDay: 190,
    image: "/xa7.jpg",
    type: "fuji",
    deposit: 1000,
  },
  {
    name: "GoPro 13 Black",
    firstDay: 500,
    nextDay: 290,
    image: "/gopro13.jpg",
    type: "normal",
    deposit: 1000,
  },
  {
    name: "FUJI X-T200",
    firstDay: 450,
    nextDay: 190,
    image: "/xt200.jpg",
    type: "fuji",
    deposit: 1000,
  },
  {
    name: "FUJI X-T100",
    firstDay: 400,
    nextDay: 190,
    image: "/xt100.jpg",
    type: "fuji",
    deposit: 1000,
  },
  {
    name: "FUJI X-A5",
    firstDay: 350,
    nextDay: 190,
    image: "/xa5.jpg",
    type: "fuji",
    deposit: 1000,
  },
  {
    name: "FUJI X-A3",
    firstDay: 300,
    nextDay: 150,
    image: "/xa3.jpg",
    type: "fuji",
    deposit: 1000,
  },
  {
    name: "SONY A5100",
    firstDay: 350,
    nextDay: 190,
    image: "/a5100.jpg",
    type: "sony",
    deposit: 1000,
  },
  {
    name: "Canon M10",
    firstDay: 350,
    nextDay: 190,
    image: "/canonm10.jpg",
    type: "canon",
    deposit: 1000,
  },
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

/*
  ช่วงเวลานอกเวลาปกติ

  เวลาปกติ: 10:00–18:00 = 0 บาท

  ก่อนเวลา:
  06:00–06:59 = 400 บาท
  07:00–07:59 = 300 บาท
  08:00–08:59 = 200 บาท
  09:00–09:59 = 100 บาท

  หลังเวลา:
  19:00–19:59 = 100 บาท
  20:00–20:59 = 200 บาท
  21:00–21:59 = 300 บาท
  22:00–22:59 = 400 บาท
*/


function calcDays(start, end) {
  if (!start || !end) return 0;

  const s = new Date(start);
  const e = new Date(end);

  const diff = Math.ceil(
    (e - s) / (1000 * 60 * 60 * 24)
  );

  return diff >= 0 ? diff + 1 : 0;
}


function formatThaiDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Page() {
  const [selected, setSelected] = useState(null);
  const [selectedLens, setSelectedLens] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [pickupTimeOption, setPickupTimeOption] =
    useState("normal");

  const [returnTimeOption, setReturnTimeOption] =
    useState("normal");

  const rawDays = calcDays(startDate, endDate);

  const minDays = selected
    ? selected.name === "Ricoh GR IIIx" ||
      selected.name === "DJI Pocket 3"
      ? 3
      : 2
    : 0;

  const rentalDays =
    rawDays > 0 ? Math.max(rawDays, minDays) : 0;

  const cameraPrice =
    selected && rentalDays > 0
      ? selected.firstDay +
        Math.max(0, rentalDays - 1) *
          selected.nextDay
      : 0;

  const lensPrice =
    selectedLens && rentalDays > 0
      ? rentalDays * 200
      : 0;

  const pickupOption = getTimeOption(
    pickupTimeOption
  );

  const returnOption = getTimeOption(
    returnTimeOption
  );

  const pickupExtraPrice = pickupOption.price;
  const returnExtraPrice = returnOption.price;

  const extraPrice =
    pickupExtraPrice + returnExtraPrice;

  const insurance = selected
    ? selectedLens
      ? Math.max(selected.deposit, 3000)
      : selected.deposit
    : 0;

  const total =
    cameraPrice +
    lensPrice +
    extraPrice;

  const lineMessage =
    `สนใจเช่ากล้อง\n\n` +
    `รุ่น: ${selected?.name || "-"}\n` +
    `เลนส์เสริม: ${selectedLens || "ไม่มี"}\n\n` +
    `วันรับกล้อง: ${formatThaiDate(startDate)}\n` +
    `เวลารับกล้อง: ${pickupOption.label}\n\n` +
    `วันคืนกล้อง: ${formatThaiDate(endDate)}\n` +
    `เวลาคืนกล้อง: ${returnOption.label}\n\n` +
    `จำนวนวันเช่า: ${rentalDays} วัน\n` +
    `ค่ากล้อง: ${cameraPrice} บาท\n` +
    `ค่าเลนส์เสริม: ${lensPrice} บาท\n` +
    `ค่ารับนอกเวลา: ${pickupExtraPrice} บาท\n` +
    `ค่าคืนนอกเวลา: ${returnExtraPrice} บาท\n` +
    `ค่านอกเวลารวม: ${extraPrice} บาท\n` +
    `ค่าประกัน: ${insurance} บาท\n\n` +
    `ยอดรวมค่าเช่า: ${total} บาท`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: 28,
          }}
        >
          48RENT Camera Rental
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
          }}
        >
          ราคาเฉพาะสมาชิกเท่านั้น
        </p>

        {/* =========================
            1. เลือกรุ่นกล้อง
        ========================== */}

        <h2 style={{ marginTop: 30 }}>
          1. เลือกรุ่นกล้อง
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {cameras.map((cam) => (
            <div
              key={cam.name}
              onClick={() => {
                setSelected(cam);
                setSelectedLens("");
              }}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 16,
                cursor: "pointer",
                border:
                  selected?.name === cam.name
                    ? "2px solid #111"
                    : "1px solid #ddd",
              }}
            >
              <img
                src={cam.image}
                alt={cam.name}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "contain",
                }}
              />

              <h3 style={{ fontSize: 15 }}>
                {cam.name}
              </h3>

              <p>
                วันแรก {cam.firstDay} | วันต่อไป{" "}
                {cam.nextDay}
              </p>
            </div>
          ))}
        </div>

        {selected && (
          <>
            {/* =========================
                2. เลือกเลนส์
            ========================== */}

            <h2 style={{ marginTop: 40 }}>
              2. เลือกเลนส์เสริม
            </h2>

            {lensMap[selected.type] ? (
              <select
                value={selectedLens}
                onChange={(e) =>
                  setSelectedLens(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <option value="">
                  ไม่เลือกเลนส์เสริม
                </option>

                {lensMap[selected.type].map(
                  (lens) => (
                    <option
                      key={lens}
                      value={lens}
                    >
                      {lens}
                    </option>
                  )
                )}
              </select>
            ) : (
              <p>รุ่นนี้ไม่มีเลนส์เสริม</p>
            )}

            {/* =========================
                3. วันและเวลา
            ========================== */}

            <h2 style={{ marginTop: 40 }}>
              3. เลือกวันและเวลารับ-คืน
            </h2>

            <p>
              เวลาปกติ 10:00–18:00 น.
              <br />
              นอกเวลาคิดค่าบริการตามช่วงเวลาที่เลือก
            </p>

            <p>
              ขั้นต่ำการเช่า: Ricoh GR IIIx /
              DJI Pocket 3 = 3 วัน,
              รุ่นอื่นทั้งหมด = 2 วัน
            </p>

            {/* วันรับ */}

            <h3 style={{ marginTop: 24 }}>
              วันรับกล้อง
            </h3>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 10,
              }}
            />

            {/* เวลารับ */}

            <h3 style={{ marginTop: 20 }}>
              เวลารับกล้อง
            </h3>

           <select
  value={pickupTimeOption}
  onChange={(e) =>
    setPickupTimeOption(e.target.value)
  }
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  }}
>
  <option value="normal">
    เวลาปกติ 10.00–18.00 น. — ไม่มีค่านอกเวลา
  </option>

  <optgroup label="รอบเช้า">
    <option value="before6">
      6.00 น. - 6.59 น.
    </option>
    <option value="before7">
      7.00 น. - 7.59 น.
    </option>
    <option value="before8">
      8.00 น. - 8.59 น.
    </option>
    <option value="before9">
      9.00 น. - 9.59 น.
    </option>
  </optgroup>

  <optgroup label="รอบเย็น">
    <option value="after19">
      19.00 น. - 19.59 น.
    </option>
    <option value="after20">
      20.00 น. - 20.59 น.
    </option>
    <option value="after21">
      21.00 น. - 21.59 น.
    </option>
    <option value="after22">
      22.00 น. - 22.59 น.
    </option>
  </optgroup>
</select>

            {/* วันคืน */}

            <h3 style={{ marginTop: 24 }}>
              วันคืนกล้อง
            </h3>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 10,
              }}
            />

            {/* เวลาคืน */}

            <h3 style={{ marginTop: 20 }}>
              เวลาคืนกล้อง
            </h3>

            <select
  value={returnTimeOption}
  onChange={(e) =>
    setReturnTimeOption(e.target.value)
  }
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  }}
>
  <option value="normal">
    เวลาปกติ 10.00–18.00 น. — ไม่มีค่านอกเวลา
  </option>

  <optgroup label="รอบเช้า">
    <option value="before6">
      6.00 น. - 6.59 น.
    </option>
    <option value="before7">
      7.00 น. - 7.59 น.
    </option>
    <option value="before8">
      8.00 น. - 8.59 น.
    </option>
    <option value="before9">
      9.00 น. - 9.59 น.
    </option>
  </optgroup>

  <optgroup label="รอบเย็น">
    <option value="after19">
      19.00 น. - 19.59 น.
    </option>
    <option value="after20">
      20.00 น. - 20.59 น.
    </option>
    <option value="after21">
      21.00 น. - 21.59 น.
    </option>
    <option value="after22">
      22.00 น. - 22.59 น.
    </option>
  </optgroup>
</select>

            <p
              style={{
                marginTop: 12,
                color: "#444",
              }}
            >
              ระบบจะคิดค่านอกเวลาแยกตามเวลารับ
              และเวลาคืนที่เลือก
            </p>

            {/* =========================
                4. สรุปค่าเช่า
            ========================== */}

            <h2 style={{ marginTop: 40 }}>
              4. สรุปค่าเช่า
            </h2>

            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 16,
              }}
            >
              <p>
                รุ่นกล้อง:{" "}
                <b>{selected.name}</b>
              </p>

              <p>
                เลนส์เสริม:{" "}
                <b>
                  {selectedLens || "ไม่มี"}
                </b>
              </p>

              <hr />

              <p>
                วันรับกล้อง:{" "}
                <b>
                  {formatThaiDate(startDate)}
                </b>
              </p>

              <p>
                เวลารับกล้อง:{" "}
                <b>{pickupOption.label}</b>
              </p>

              <p>
                วันคืนกล้อง:{" "}
                <b>
                  {formatThaiDate(endDate)}
                </b>
              </p>

              <p>
                เวลาคืนกล้อง:{" "}
                <b>{returnOption.label}</b>
              </p>

              <hr />

              <p>
                จำนวนวันเช่า (คิดขั้นต่ำแล้ว):{" "}
                <b>{rentalDays}</b> วัน
              </p>

              <p>
                ค่ากล้อง:{" "}
                <b>{cameraPrice}</b> บาท
              </p>

              <p>
                ค่าเลนส์เสริม:{" "}
                <b>{lensPrice}</b> บาท
              </p>

              <p>
                ค่ารับนอกเวลา:{" "}
                <b>{pickupExtraPrice}</b> บาท
              </p>

              <p>
                ค่าคืนนอกเวลา:{" "}
                <b>{returnExtraPrice}</b> บาท
              </p>

              <p>
                ค่านอกเวลารวม:{" "}
                <b>{extraPrice}</b> บาท
              </p>

              <p>
                ค่าประกัน (สมาชิก):{" "}
                <b>{insurance}</b> บาท
              </p>

              <hr />

              <h2>
                ยอดรวมค่าเช่า: {total} บาท
              </h2>

              <p
                style={{
                  color: "#666",
                }}
              >
                * ค่าประกันแสดงแยก
                ไม่รวมในยอดค่าเช่า
              </p>

              {/* =========================
                  LINE
              ========================== */}

              <a
                href={`https://line.me/R/oaMessage/@48rent/?${encodeURIComponent(
                  lineMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 20,
                  background: "#111",
                  color: "#fff",
                  padding: "14px 24px",
                  borderRadius: 12,
                  textDecoration: "none",
                }}
              >
                ส่งสรุปเข้า LINE เพื่อจอง
              </a>

              <p
                style={{
                  marginTop: 10,
                }}
              >
                กรุณาแคปหน้าสรุปราคา
                แล้วส่งใน LINE เพื่อจอง
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
