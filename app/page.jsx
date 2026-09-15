"use client";

import { useEffect, useRef, useState } from "react";

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
  เวลานอกเวลา

  เวลาปกติ:
  10.00–18.00 น. = ไม่มีค่านอกเวลา

  รอบเช้า:
  06.00–06.59 น. = 400 บาท
  07.00–07.59 น. = 300 บาท
  08.00–08.59 น. = 200 บาท
  09.00–09.59 น. = 100 บาท

  รอบเย็น:
  19.00–19.59 น. = 100 บาท
  20.00–20.59 น. = 200 บาท
  21.00–21.59 น. = 300 บาท
  22.00–22.59 น. = 400 บาท

  หมายเหตุ:
  ราคาจะไม่แสดงใน Dropdown
  แต่ระบบยังใช้คำนวณราคาด้านหลัง
*/

const extraTimeOptions = [
  {
    value: "normal",
    label: "เวลาปกติ 10.00–18.00 น. — ไม่มีค่านอกเวลา",
    price: 0,
  },

  // รอบเช้า
  {
    value: "before6",
    label: "06.00 น. - 06.59 น.",
    price: 400,
  },
  {
    value: "before7",
    label: "07.00 น. - 07.59 น.",
    price: 300,
  },
  {
    value: "before8",
    label: "08.00 น. - 08.59 น.",
    price: 200,
  },
  {
    value: "before9",
    label: "09.00 น. - 09.59 น.",
    price: 100,
  },

  // รอบเย็น
  {
    value: "after19",
    label: "19.00 น. - 19.59 น.",
    price: 100,
  },
  {
    value: "after20",
    label: "20.00 น. - 20.59 น.",
    price: 200,
  },
  {
    value: "after21",
    label: "21.00 น. - 21.59 น.",
    price: 300,
  },
  {
    value: "after22",
    label: "22.00 น. - 22.59 น.",
    price: 400,
  },
];

function calcDays(start, end) {
  if (!start || !end) return 0;

  const s = new Date(start);
  const e = new Date(end);

  const diff = Math.ceil(
    (e - s) / (1000 * 60 * 60 * 24)
  );

  return diff >= 0 ? diff + 1 : 0;
}

function getTimeOption(value) {
  return (
    extraTimeOptions.find(
      (option) => option.value === value
    ) || extraTimeOptions[0]
  );
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

  /*
    ใช้สำหรับเลื่อนหน้าจออัตโนมัติ
    หลังจากลูกค้าเลือกกล้อง
  */
  const lensSectionRef = useRef(null);

  useEffect(() => {
    if (selected && lensSectionRef.current) {
      setTimeout(() => {
        lensSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selected]);

  const rawDays = calcDays(
    startDate,
    endDate
  );

  const minDays = selected
    ? selected.name === "Ricoh GR IIIx" ||
      selected.name === "DJI Pocket 3"
      ? 3
      : 2
    : 0;

  const rentalDays =
    rawDays > 0
      ? Math.max(rawDays, minDays)
      : 0;

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

  const pickupExtraPrice =
    pickupOption.price;

  const returnExtraPrice =
    returnOption.price;

  const extraPrice =
    pickupExtraPrice +
    returnExtraPrice;

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
    `เลนส์เสริม: ${
      selectedLens || "ไม่มี"
    }\n\n` +
    `วันรับกล้อง: ${
      formatThaiDate(startDate)
    }\n` +
    `เวลารับกล้อง: ${
      pickupOption.label
    }\n\n` +
    `วันคืนกล้อง: ${
      formatThaiDate(endDate)
    }\n` +
    `เวลาคืนกล้อง: ${
      returnOption.label
    }\n\n` +
    `จำนวนวันเช่า: ${rentalDays} วัน\n` +
    `ค่ากล้อง: ${cameraPrice} บาท\n` +
    `ค่าเลนส์เสริม: ${lensPrice} บาท\n` +
    `ค่ารับนอกเวลา: ${
      pickupExtraPrice
    } บาท\n` +
    `ค่าคืนนอกเวลา: ${
      returnExtraPrice
    } บาท\n` +
    `ค่านอกเวลารวม: ${
      extraPrice
    } บาท\n` +
    `ค่าประกัน: ${insurance} บาท\n\n` +
    `ยอดรวมค่าเช่า: ${total} บาท`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
        padding: 20,
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* =========================
            HEADER
        ========================== */}

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

        <h2
          style={{
            marginTop: 30,
          }}
        >
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

                /*
                  เมื่อเลือกกล้อง
                  useEffect ด้านบนจะทำการ
                  scroll ไปข้อ 2 ให้อัตโนมัติ
                */
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
                transition:
                  "all 0.2s ease",
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

              <h3
                style={{
                  fontSize: 15,
                }}
              >
                {cam.name}
              </h3>

              <p>
                วันแรก {cam.firstDay} |
                วันต่อไป {cam.nextDay}
              </p>
            </div>
          ))}
        </div>

        {selected && (
          <>
            {/* =========================
                2. เลือกเลนส์
            ========================== */}

            <section
              ref={lensSectionRef}
              style={{
                scrollMarginTop: 20,
              }}
            >
              <h2
                style={{
                  marginTop: 40,
                }}
              >
                2. เลือกเลนส์เสริม
              </h2>

              {lensMap[selected.type] ? (
                <select
                  value={selectedLens}
                  onChange={(e) =>
                    setSelectedLens(
                      e.target.value
                    )
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

                  {lensMap[
                    selected.type
                  ].map((lens) => (
                    <option
                      key={lens}
                      value={lens}
                    >
                      {lens}
                    </option>
                  ))}
                </select>
              ) : (
                <p>
                  รุ่นนี้ไม่มีเลนส์เสริม
                </p>
              )}
            </section>

            {/* =========================
                3. วันและเวลารับ-คืน
            ========================== */}

            <h2
              style={{
                marginTop: 40,
              }}
            >
              3. เลือกวันและเวลารับ-คืน
            </h2>

            <p>
              เวลาปกติ 10.00–18.00 น.
            </p>

            <p>
              ขั้นต่ำการเช่า: Ricoh GR
              IIIx / DJI Pocket 3 = 3 วัน,
              รุ่นอื่นทั้งหมด = 2 วัน
            </p>

            {/* วันรับ */}

            <h3
              style={{
                marginTop: 24,
              }}
            >
              วันรับกล้อง
            </h3>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 10,
              }}
            />

            {/* เวลารับ */}

            <h3
              style={{
                marginTop: 20,
              }}
            >
              เวลารับกล้อง
            </h3>

            <select
              value={pickupTimeOption}
              onChange={(e) =>
                setPickupTimeOption(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <option value="normal">
                เวลาปกติ 10.00–18.00 น.
                — ไม่มีค่านอกเวลา
              </option>

              <optgroup label="รอบเช้า">
                <option value="before6">
                  06.00 น. - 06.59 น.
                </option>

                <option value="before7">
                  07.00 น. - 07.59 น.
                </option>

                <option value="before8">
                  08.00 น. - 08.59 น.
                </option>

                <option value="before9">
                  09.00 น. - 09.59 น.
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

            <h3
              style={{
                marginTop: 24,
              }}
            >
              วันคืนกล้อง
            </h3>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: 10,
                marginTop: 10,
              }}
            />

            {/* เวลาคืน */}

            <h3
              style={{
                marginTop: 20,
              }}
            >
              เวลาคืนกล้อง
            </h3>

            <select
              value={returnTimeOption}
              onChange={(e) =>
                setReturnTimeOption(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <option value="normal">
                เวลาปกติ 10.00–18.00 น.
                — ไม่มีค่านอกเวลา
              </option>

              <optgroup label="รอบเช้า">
                <option value="before6">
                  06.00 น. - 06.59 น.
                </option>

                <option value="before7">
                  07.00 น. - 07.59 น.
                </option>

                <option value="before8">
                  08.00 น. - 08.59 น.
                </option>

                <option value="before9">
                  09.00 น. - 09.59 น.
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
              ค่านอกเวลาจะคำนวณให้อัตโนมัติ
              และแสดงในหน้าสรุปค่าเช่า
            </p>

{/* =========================
    4. สรุปค่าเช่า
========================== */}

<h2
  style={{
    marginTop: 40,
  }}
>
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
    รุ่นกล้อง: <b>{selected.name}</b>
  </p>

  <p>
    เลนส์เสริม:{" "}
    <b>{selectedLens || "ไม่มี"}</b>
  </p>

  <hr />

  <p>
    วันรับกล้อง:{" "}
    <b>{formatThaiDate(startDate)}</b>
  </p>

  <p>
    เวลารับกล้อง:{" "}
    <b>{pickupOption.label}</b>
  </p>

  <p>
    วันคืนกล้อง:{" "}
    <b>{formatThaiDate(endDate)}</b>
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
    ค่ากล้อง: <b>{cameraPrice}</b> บาท
  </p>

  <p>
    ค่าเลนส์เสริม: <b>{lensPrice}</b> บาท
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

  <hr />

  {/* =========================
      สรุปยอดใหญ่
  ========================== */}

  <div
    style={{
      marginTop: 24,
      padding: 20,
      background: "#f8f8f8",
      borderRadius: 14,
    }}
  >
    <h2
      style={{
        marginTop: 0,
        marginBottom: 20,
      }}
    >
      สรุป
    </h2>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        ค่าเช่า
      </span>

      <span
        style={{
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        {total.toLocaleString()} บาท
      </span>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        ค่าประกัน
      </span>

      <span
        style={{
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        {insurance.toLocaleString()} บาท
      </span>
    </div>

    <hr />

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 18,
      }}
    >
      <span
        style={{
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        รวมยอดทั้งหมด
      </span>

      <span
        style={{
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        {(total + insurance).toLocaleString()} บาท
      </span>
    </div>

    <p
      style={{
        marginTop: 16,
        marginBottom: 0,
        color: "#666",
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      * ค่าประกันจะคืนเมื่อคืนกล้องเรียบร้อย
      และกล้องไม่เสียหาย
    </p>
  </div>

  {/* =========================
      LINE BUTTON
  ========================== */}

   <a
    href={`https://line.me/R/oaMessage/@48rent/?${encodeURIComponent(
      lineMessage
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "block",
      marginTop: 20,
      background: "#06C755",
      color: "#fff",
      padding: "15px 24px",
      borderRadius: 12,
      textDecoration: "none",
      textAlign: "center",
      fontWeight: 700,
      fontSize: 16,
    }}
  >
    ส่งรูปเข้า LINE เพื่อจอง
  </a>

  </div>
  </>
)}
</main>
);
}
