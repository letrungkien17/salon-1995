import React from 'react';

export const RoyalProcess = () => {
  const steps = [
    {
      step: '01',
      title: 'Khai Thông Kinh Lạc & Xông Trầm',
      desc: 'Thưởng trà thảo mộc khai vị, ngâm chân muối khoáng thảo dược và day ấn huyệt mở luân xa giải tỏa lo âu.',
      time: '10 phút'
    },
    {
      step: '02',
      title: 'Tẩy Tế Bào Chết Da Đầu Organic',
      desc: 'Làm sạch bã nhờn, gàu và tế bào chết tích tụ sâu trong nang tóc bằng gel muối khoáng trà xanh tự nhiên.',
      time: '10 phút'
    },
    {
      step: '03',
      title: 'Nấu Nước Thảo Dược 12 Vị Gội Sạch',
      desc: 'Dòng nước bồ kết sả chanh ấm nóng tuần hoàn liên tục tưới trên da đầu, kích thích tuần hoàn máu não.',
      time: '20 phút'
    },
    {
      step: '04',
      title: 'Đả Thông Huyệt Vị Đầu Bằng Lược Ngọc',
      desc: 'Sử dụng lược ngọc tự nhiên massage các đường kinh lạc Bách Hội, Phong Trì giúp dễ ngủ, ngủ sâu giấc.',
      time: '15 phút'
    },
    {
      step: '05',
      title: 'Trị Liệu Cổ Vai Gáy Đá Nóng',
      desc: 'Massage bấm huyệt chuyên sâu giải tỏa bó cơ vai gáy, kết hợp chườm túi ngải cứu và đá núi lửa ấm.',
      time: '20 phút'
    },
    {
      step: '06',
      title: 'Xông Tai Thải Độc & Mặt Nạ Mắt Thảo Dược',
      desc: 'Đắp mặt nạ thảo dược làm dịu mắt mỏi do máy tính, xông tinh dầu ấm thanh lọc hệ hô hấp và thư giãn.',
      time: '10 phút'
    },
    {
      step: '07',
      title: 'Sấy Dưỡng Tinh Dầu & Hoàn Thiện Tạo Kiểu',
      desc: 'Bôi tinh chất serum dưỡng ngọn tóc, sấy tạo phom bồng bềnh tự nhiên và thưởng thức yến chưng hạt sen.',
      time: '15 phút'
    }
  ];

  return (
    <section className="section-fullscreen-wrapper process-section-bg" aria-labelledby="process-heading">
      <div className="container-wide">
        <div className="section-header-center">
          <div className="badge-luxury">
            Liệu Trình Chuẩn Y Học Cổ Truyền
          </div>
          <h2 id="process-heading" className="section-title-large">
            Quy Trình 7 Bước Dưỡng Sinh Hoàng Kim
          </h2>
          <p className="section-subtitle-wide">
            Từng thao tác chuẩn xác, tỉ mỉ kết hợp giữa dược liệu tươi và kỹ thuật đả thông kinh lạc chuyên sâu, hồi sinh năng lượng cho cơ thể và mái tóc.
          </p>
        </div>

        <div className="process-cards-container">
          {steps.map((item, idx) => (
            <div key={idx} className="process-card">
              <div className="process-step-indicator">
                <span className="step-num">{item.step}</span>
                <span className="step-time">{item.time}</span>
              </div>
              <h3 className="process-step-title">{item.title}</h3>
              <p className="process-step-desc">{item.desc}</p>
              <div className="process-card-check">
                Tiêu chuẩn Hoàng Gia
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
