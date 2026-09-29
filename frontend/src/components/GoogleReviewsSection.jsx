import React from 'react';

export const GoogleReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Ngọc Mai (Doanh nhân)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      ratingStars: "★★★★★",
      date: "3 ngày trước",
      branch: "Chi nhánh Quận 1 (Minh Khai)",
      service: "Gói Dưỡng Sinh Hoàng Gia 90 phút",
      review: "Mỗi lần đi làm việc mệt mỏi hay đau nhức vai gáy do ngồi máy tính, mình chỉ muốn đến ngay Salon 1995. Nước gội bồ kết nấu thơm nức mũi, bạn chuyên viên bấm huyệt siêu êm và chuẩn huyệt đạo. Ngủ thiếp đi một giấc dậy người nhẹ nhõm như vừa được tái sinh."
    },
    {
      id: 2,
      name: "Thành Đạt (CEO Founder)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      ratingStars: "★★★★★",
      date: "1 tuần trước",
      branch: "Chi nhánh Thảo Điền (Xuân Thủy)",
      service: "Combo Cắt Tóc Tạo Mẫu & Dưỡng Sinh Đầu",
      review: "Đến Salon 1995 vì được đối tác giới thiệu. Phải nói không gian ở Thảo Điền rất sang trọng, yên tĩnh, mùi thảo mộc dễ chịu vô cùng. Stylist tư vấn kiểu tóc rất hợp mặt và kỹ tính từng cọng tóc. Đặt lịch trên web tiện lợi không phải chờ đợi."
    },
    {
      id: 3,
      name: "Khánh Linh (Bác sĩ Da Liễu)",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      ratingStars: "★★★★★",
      date: "2 tuần trước",
      branch: "Chi nhánh Hà Nội (Tràng Thi)",
      service: "Liệu trình Phục Hồi Nano Keratin & Gội Đầu Thảo Mộc",
      review: "Là người trong ngành y tế nên mình cực kỳ khắt khe về nguồn gốc thảo dược và vệ sinh dụng cụ. Ở Salon 1995 mọi thứ được tiệt trùng sạch sẽ, nước lá bồ kết sả chanh thật 100% không pha tạp chất hóa học. Tóc sau khi làm xong bóng mượt tự nhiên."
    }
  ];

  return (
    <section className="section-fullscreen-wrapper" aria-labelledby="reviews-heading">
      <div className="container-wide">
        {/* Google Trust Banner */}
        <div className="google-trust-banner">
          <div className="google-trust-left">
            <div className="google-badge-box">
              <span className="google-icon-g">G</span>
              <div>
                <div className="google-title">Google Đánh Giá Doanh Nghiệp</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--gold-dark)', fontSize: '1.05rem', letterSpacing: '2px' }}>★★★★★</span>
                  <span className="google-score">4.9 / 5.0</span>
                </div>
              </div>
            </div>
            <div className="google-stat-text">
              Dựa trên <strong>1.850+ đánh giá xác thực</strong> từ khách hàng trải nghiệm tại Salon 1995.
            </div>
          </div>

          <div>
            <span className="badge badge-emerald" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
              100% Khách Hàng Xác Thực Trải Nghiệm
            </span>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="reviews-cards-grid">
          {reviews.map((r) => (
            <article key={r.id} className="review-card">
              <div className="review-header">
                <img src={r.avatar} alt={r.name} className="review-avatar" />
                <div>
                  <div className="review-user-name">
                    <span>{r.name}</span>
                  </div>
                  <div className="review-branch">{r.branch}</div>
                </div>
              </div>

              <div className="review-rating-row">
                <span style={{ color: 'var(--gold-dark)', letterSpacing: '2px' }}>{r.ratingStars}</span>
                <span className="review-date">{r.date}</span>
              </div>

              <div className="review-service-tag">
                <span>Dịch vụ:</span>
                <strong>{r.service}</strong>
              </div>

              <p className="review-text">{r.review}</p>

              <div className="review-footer">
                <span className="like-badge">Hài lòng tuyệt đối</span>
                <span className="google-verified-tag">Google Verified</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
