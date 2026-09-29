import React from 'react';

export const FullWidthShowcase = ({ onStartBooking }) => {
  const showcases = [
    {
      id: 1,
      num: "01",
      tag: "Thảo Dược Cổ Truyền",
      title: "12 Vị Thảo Mộc Tươi Nấu Nóng Mỗi Ngày",
      desc: "Bồ kết già sao vàng, vỏ bưởi da xanh, hà thủ ô đỏ, sả chanh, cỏ mần trầu... được sơ chế và nấu tươi mỗi sáng. Không hóa chất tẩy rửa, lưu giữ trọn vẹn tinh dầu thanh khiết nuôi dưỡng nang tóc chắc khỏe.",
      stat: "100% Nấu Tươi",
      statSub: "Không hương liệu nhân tạo",
      imgUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 2,
      num: "02",
      tag: "Tạo Mẫu Đẳng Cấp",
      title: "Thiết Kế Tóc Chuẩn Tỷ Lệ Vàng Gương Mặt",
      desc: "Mỗi dáng khuôn mặt là một tác phẩm độc bản. Đội ngũ Master Stylist 10+ năm kinh nghiệm phân tích cấu trúc xương hàm, gò má và chất tóc để kiến tạo phom tóc layer, uốn sóng hay nhuộm màu tôn trọn khí chất quý phái.",
      stat: "Master Stylist",
      statSub: "Đào tạo chuẩn quốc tế",
      imgUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 3,
      num: "03",
      tag: "Trị Liệu Chuyên Sâu",
      title: "Đả Thông Kinh Lạc Đầu & Cổ Vai Gáy",
      desc: "Kỹ thuật day ấn huyệt đạo Thái Dương, Phong Trì, Kiên Tỉnh kết hợp chuông xoay Tây Tạng và lược ngọc dẫn lưu khí huyết. Giải tỏa tức thì tình trạng đau đầu mạn tính, mất ngủ, căng thẳng cơ vai gáy văn phòng.",
      stat: "60 - 90 Phút",
      statSub: "Thư thái trọn vẹn từng giác quan",
      imgUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 4,
      num: "04",
      tag: "Không Gian Tĩnh Tại",
      title: "Kiến Trúc Hoàng Gia Cổ Điển Tĩnh Mịch",
      desc: "Tách biệt hoàn toàn khỏi nhịp sống ồn ào phố thị. Không gian nội thất gỗ ấm cúng, ánh sáng vàng dịu nhẹ cùng hương trầm thơm thoang thoảng mang lại cảm giác bình yên, thư thái tuyệt đối cho quý khách.",
      stat: "Phòng VIP Riêng",
      statSub: "Tối đa sự riêng tư & thư giãn",
      imgUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80"
    }
  ];

  return (
    <section className="section-fullscreen-wrapper" aria-labelledby="showcase-heading">
      <div className="container-wide">
        <div className="section-header-center">
          <div className="badge-luxury">
            Đặc Quyền Thượng Hạng Tại Salon 1995
          </div>
          <h2 id="showcase-heading" className="section-title-large">
            Tôn Vinh Vẻ Đẹp & Khởi Sắc Thần Thái
          </h2>
          <p className="section-subtitle-wide">
            Sự kết hợp tinh hoa giữa liệu pháp y học cổ truyền phương Đông và công nghệ chăm sóc tóc hiện đại, mang đến trải nghiệm làm đẹp vượt mong đợi.
          </p>
        </div>

        <div className="fullscreen-cards-grid">
          {showcases.map((item) => (
            <article key={item.id} className="fullscreen-showcase-card">
              <div 
                className="showcase-card-bg"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(18, 22, 20, 0.88) 75%), url(${item.imgUrl})`
                }}
              />
              <div className="showcase-card-overlay" />

              <div className="showcase-card-content">
                <div className="showcase-top">
                  <span className="showcase-num-tag">{item.num}</span>
                  <span className="badge badge-gold">{item.tag}</span>
                </div>

                <div className="showcase-middle">
                  <h3 className="showcase-card-title">{item.title}</h3>
                  <p className="showcase-card-desc">{item.desc}</p>
                </div>

                <div className="showcase-bottom">
                  <div>
                    <span className="showcase-stat-num">{item.stat}</span>
                    <span className="showcase-stat-label">{item.statSub}</span>
                  </div>

                  <button 
                    className="btn btn-gold-glass"
                    onClick={onStartBooking}
                    aria-label={`Đặt lịch ngay cho dịch vụ ${item.title}`}
                  >
                    Trải Nghiệm
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
