import React, { useState } from 'react';

export const Hero = ({ onStartBooking, onViewServices }) => {
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;
    const rotateX = (-y / card.height) * 10;
    const rotateY = (x / card.width) * 10;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  return (
    <section className="hero-fullscreen" aria-label="Khu vực giới thiệu Salon 1995">
      <div className="hero-radial-glow hero-glow-1" />
      <div className="hero-radial-glow hero-glow-2" />
      <div className="hero-grid-pattern" />

      <div className="container-wide hero-content-layout">
        {/* Left Column */}
        <div className="hero-text-col">
          <div className="hero-subtitle">
            Viện Tóc & Dưỡng Sinh Hoàng Gia • Thành Lập 1995
          </div>

          <h1 className="hero-title">
            Đẳng Cấp Thư Thái <br />
            <span className="gold-gradient-text">Khởi Sắc Vẻ Đẹp Hoàng Kim</span>
          </h1>

          <p className="hero-desc">
            Sự giao thoa hoàn mỹ giữa phương pháp <strong>đả thông kinh lạc 12 vị thảo dược cổ truyền</strong> và nghệ thuật thiết kế tóc chuẩn <strong>tỷ lệ vàng gương mặt</strong>. Không gian hoàng gia tĩnh tại nâng niu từng phút giây thư giãn của quý khách.
          </p>

          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-hero-cta" 
              onClick={onStartBooking} 
              aria-label="Đặt lịch hẹn chăm sóc tóc và dưỡng sinh ngay"
            >
              Đặt Lịch Hẹn Ngay
            </button>

            <button 
              className="btn btn-secondary btn-hero-cta" 
              onClick={onViewServices}
              aria-label="Xem bảng giá dịch vụ Salon 1995"
            >
              Xem Dịch Vụ & Bảng Giá
            </button>
          </div>

          {/* Highlight Stats Row */}
          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <div className="stat-number">12+</div>
              <div className="stat-label">Vị Thảo Mộc Nấu Tươi Mỗi Ngày</div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-number">4.9 ★</div>
              <div className="stat-label">Google Rating (1.850+ Đánh Giá)</div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Master Stylist & KTV Đào Tạo Chuyên Sâu</div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-number">15K+</div>
              <div className="stat-label">Khách Hàng Hài Lòng & Tái Đặt Lịch</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Royal Showcase Card */}
        <div className="hero-visual-col">
          <div 
            className="hero-3d-card"
            style={tiltStyle}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="hero-card-media">
              <img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80" 
                alt="Không gian làm đẹp sang trọng tại Salon 1995" 
                className="hero-card-img"
              />
              <div className="hero-card-overlay-tag">
                Không Gian VIP Riêng Tư
              </div>
            </div>

            <div className="hero-card-body">
              <div className="hero-card-header">
                <div>
                  <span className="badge badge-gold">Đặc Quyền Khách Hàng 1995</span>
                  <h3 className="hero-card-heading">Gói Trải Nghiệm Hoàng Gia</h3>
                </div>
                <div className="hero-card-price-tag">
                  <span className="price-old">550.000đ</span>
                  <span className="price-new">399.000đ</span>
                </div>
              </div>

              <ul className="hero-card-perks">
                <li>
                  <span className="bullet-gold" />
                  <span>Xông đầu thảo dược & gội bồ kết cô đặc 12 vị nấu tươi</span>
                </li>
                <li>
                  <span className="bullet-gold" />
                  <span>Bấm huyệt đả thông kinh lạc cổ vai gáy giải tỏa đau mỏi</span>
                </li>
                <li>
                  <span className="bullet-gold" />
                  <span>Cắt tỉa & sấy tạo kiểu tóc chuẩn tỷ lệ vàng đường nét mặt</span>
                </li>
                <li>
                  <span className="bullet-gold" />
                  <span>Thưởng thức trà dưỡng nhan táo đỏ và yến chưng hạt sen</span>
                </li>
              </ul>

              <div className="hero-card-footer">
                <button 
                  className="btn btn-emerald" 
                  style={{ width: '100%', padding: '15px', borderRadius: 'var(--radius-md)' }}
                  onClick={onStartBooking}
                  aria-label="Nhận ưu đãi và đặt lịch ngay"
                >
                  Nhận Ngay Ưu Đãi Đặt Lịch Online
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
