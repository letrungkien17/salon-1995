import React from 'react';

export const Footer = () => {
  return (
    <footer style={{ background: '#f8f6f0', borderTop: '1px solid rgba(184,144,71,0.25)', padding: '70px 0 35px', marginTop: 80 }} role="contentinfo">
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, marginBottom: 50 }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div className="logo-icon" style={{ width: 40, height: 40, fontSize: '0.95rem' }}>1995</div>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>SALON 1995</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-dark)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Viện Tóc & Dưỡng Sinh Hoàng Gia
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 22, lineHeight: 1.8 }}>
              Tiên phong kết hợp phương pháp trị liệu gội đầu dưỡng sinh đả thông kinh lạc với 12 vị thảo dược tươi cổ truyền và kỹ thuật tạo mẫu tóc chuẩn tỷ lệ vàng. Nơi tái tạo sinh khí và nâng tầm vẻ đẹp tự nhiên.
            </p>

            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 8, 
              background: '#ffffff', 
              padding: '8px 18px', 
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--gold-border)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <span style={{ fontWeight: 800, color: '#4285F4' }}>G</span>
              <span style={{ color: 'var(--gold-dark)', letterSpacing: '2px' }}>★★★★★</span>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 700 }}>4.9/5 Google Rating</span>
            </div>
          </div>

          {/* Chi nhánh */}
          <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '1.15rem', marginBottom: 20, borderBottom: '1px solid var(--gold-border)', paddingBottom: 10, fontWeight: 700 }}>
              Hệ Thống Chi Nhánh Toàn Quốc
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div>
                <strong style={{ color: 'var(--text-main)' }}>Quận 1:</strong> 195 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh
              </div>
              <div>
                <strong style={{ color: 'var(--text-main)' }}>Thảo Điền:</strong> 48 Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh
              </div>
              <div>
                <strong style={{ color: 'var(--text-main)' }}>Hà Nội:</strong> 88 Tràng Thi, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội
              </div>
            </div>
          </div>

          {/* Giờ phục vụ & Liên hệ */}
          <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '1.15rem', marginBottom: 20, borderBottom: '1px solid var(--gold-border)', paddingBottom: 10, fontWeight: 700 }}>
              Giờ Phục Vụ & Hotline 24/7
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div>
                Giờ mở cửa: <strong style={{ color: 'var(--text-main)' }}>08:30 - 20:30</strong> (Tất cả các ngày trong tuần)
              </div>
              <div>
                Hotline Đặt Hẹn: <strong style={{ color: 'var(--gold-dark)', fontSize: '1.05rem' }}>090 1995 195</strong>
              </div>
              <div>
                Email Hỗ Trợ: <strong style={{ color: 'var(--text-main)' }}>contact@salon1995.vn</strong>
              </div>
              <div style={{ 
                background: '#eef6f2', 
                border: '1px solid rgba(35, 83, 65, 0.25)', 
                padding: '12px 16px', 
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                color: 'var(--emerald-main)',
                fontWeight: 600
              }}>
                Cam kết bảo hành form tóc 7 ngày và thảo dược nấu tươi 100% trong ngày.
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid rgba(0,0,0,0.06)', 
          paddingTop: 28, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 16, 
          color: 'var(--text-sub)', 
          fontSize: '0.84rem' 
        }}>
          <div>
            © 2026 SALON 1995. Bảo lưu mọi quyền. Viện Tóc & Dưỡng Sinh Hoàng Gia.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>Chính Sách Bảo Mật</span>
            <span>Điều Khoản Dịch Vụ</span>
            <span>Chính Sách Bảo Hành</span>
            <span>Sơ Đồ Trang</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
