import React, { useState } from 'react';

export const SeoFaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Gội đầu dưỡng sinh tại Salon 1995 có gì khác biệt so với các tiệm thông thường?",
      answer: "Tại Salon 1995, 100% nước gội được nấu tươi mỗi ngày từ 12 vị thảo dược quý (Bồ kết sao vàng, vỏ bưởi, hà thủ ô, cỏ mần trầu, sả chanh...). Quy trình kết hợp kỹ thuật bấm huyệt đả thông kinh lạc vùng đầu, vai gáy chuẩn y học cổ truyền, đi kèm ngọc thạch thiên nhiên và chuông xoay Tây Tạng giúp khách hàng ngủ sâu và phục hồi năng lượng tức thì."
    },
    {
      question: "Tôi có cần đặt lịch trước khi ghé thăm Salon 1995 không?",
      answer: "Để đội ngũ kỹ thuật viên chuẩn bị nồi nước thảo dược nóng riêng biệt và đón tiếp chu đáo nhất không để quý khách phải chờ đợi một phút nào, quý khách vui lòng đặt lịch trước ít nhất 30 phút trên hệ thống website trực tuyến hoặc hotline của Salon 1995."
    },
    {
      question: "Salon 1995 có chính sách bảo hành kiểu tóc sau khi làm không?",
      answer: "Có! Salon 1995 cam kết chính sách bảo hành tóc chu đáo: Miễn phí chỉnh sửa phom uốn, nhuộm lại màu tóc trong vòng 7 ngày nếu quý khách chưa hoàn toàn ưng ý. Đội ngũ Master Stylist luôn đồng hành chăm sóc vẻ đẹp của bạn."
    },
    {
      question: "Liệu trình dưỡng sinh có phù hợp cho người hay đau đầu, mất ngủ, căng thẳng không?",
      answer: "Đặc biệt phù hợp! Các động tác bấm huyệt Phong Trì, Bách Hội, Thái Dương, Kiên Tỉnh cùng hương thơm tinh dầu tự nhiên sẽ kích thích tăng cường tuần hoàn máu não, giải tỏa bó cơ cứng ở cổ vai gáy, từ đó xua tan đau đầu và đem lại giấc ngủ sâu, an yên."
    },
    {
      question: "Salon 1995 có những hình thức thanh toán nào?",
      answer: "Chúng tôi hỗ trợ đa dạng phương thức thanh toán linh hoạt: Tiền mặt, Thẻ tín dụng/ghi nợ (Visa, Mastercard), Chuyển khoản QR ngân hàng 24/7 và cổng thanh toán điện tử VNPay tiện lợi."
    }
  ];

  return (
    <section className="section-fullscreen-wrapper faq-section-bg" aria-labelledby="faq-heading">
      <div className="container-wide">
        <div className="section-header-center">
          <div className="badge-luxury">
            Giải Đáp Thắc Mắc & Tiêu Chí SEO Google
          </div>
          <h2 id="faq-heading" className="section-title-large">
            Câu Hỏi Thường Gặp Về Dịch Vụ
          </h2>
          <p className="section-subtitle-wide">
            Những thông tin cần thiết giúp quý khách chuẩn bị cho buổi trải nghiệm thư giãn hoàng gia trọn vẹn nhất tại Salon 1995.
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item ${isOpen ? 'active' : ''}`}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <button 
                  className="faq-question-btn" 
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-q-text">{faq.question}</span>
                  <span className="faq-indicator">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div id={`faq-answer-${index}`} className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
