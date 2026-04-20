export default function Page() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#f8f8f8',
      fontFamily: 'Arial, sans-serif',
      padding: '30px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '10px' }}>
          48RENT Camera Rental Calculator
        </h1>

        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          เลือกกล้อง • เลือกวันรับคืน • คำนวณค่าเช่าอัตโนมัติ
        </p>

        <p style={{ textAlign: 'center', color: '#888', marginBottom: '40px' }}>
          เวลารับ-คืน 10:00 – 18:00 น. | นอกเวลา +100 บาท / ชั่วโมง
        </p>

        <section>
          <h2 style={{ marginBottom: '20px' }}>รุ่นกล้องยอดนิยม</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>

            {[
              ['Ricoh GR IIIx', '/ricohgriiix.jpg', 'วันแรก 600 | วันต่อไป 390'],
              ['DJI Pocket 3', '/pocket3.jpg', 'วันแรก 500 | วันต่อไป 290'],
              ['FUJI X-A7', '/xa7.jpg', 'วันแรก 400 | วันต่อไป 190'],
              ['GoPro 13', '/gopro13.jpg', 'วันแรก 500 | วันต่อไป 290'],
              ['FUJI X-T200', '/xt200.jpg', 'วันแรก 450 | วันต่อไป 190'],
              ['FUJI X-T100', '/xt100.jpg', 'วันแรก 400 | วันต่อไป 190'],
              ['FUJI X-A5', '/xa5.jpg', 'วันแรก 350 | วันต่อไป 190'],
              ['FUJI X-A3', '/xa3.jpg', 'วันแรก 300 | วันต่อไป 150'],
              ['SONY A5100', '/a5100.jpg', 'วันแรก 350 | วันต่อไป 190'],
              ['Canon M10', '/canonm10.jpg', 'วันแรก 350 | วันต่อไป 190'],
            ].map((item) => (
              <div key={item[0]} style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}>
                <img
                  src={item[1]}
                  alt={item[0]}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'contain',
                    marginBottom: '12px'
                  }}
                />

                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{item[0]}</h3>
                <p style={{ color: '#555', fontSize: '14px' }}>{item[2]}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{
          marginTop: '50px',
          background: '#fff',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ marginBottom: '20px' }}>สรุปค่าเช่า</h2>

          <p style={{ marginBottom: '10px' }}>
            * การนับวันเช่าคิดตรงวัน เช่น รับ 20 เม.ย. คืน 21 เม.ย. = 2 วัน
          </p>

          <p style={{ marginBottom: '20px' }}>
            ลูกค้าสามารถเลือกวันรับ / วันคืน / เลนส์เสริม / ชั่วโมงนอกเวลา
            แล้วระบบจะคำนวณยอดรวมอัตโนมัติ
          </p>

          <a
            href="https://line.me/R/ti/p/@48rent"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#111',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ทัก LINE เพื่อจอง
          </a>

          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            กรุณาแคปหน้าสรุปราคา แล้วส่งใน LINE เพื่อจอง
          </p>
        </section>
      </div>
    </main>
  )
}
