import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

export const ServicesList = ({ onSelectServiceForBooking }) => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cinema'); // 'cinema' or 'grid'

  const getServiceImage = (serviceName, categoryName) => {
    const text = (serviceName + ' ' + (categoryName || '')).toLowerCase();
    if (text.includes('gội') || text.includes('dưỡng sinh') || text.includes('spa') || text.includes('thảo dược')) {
      return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80";
    }
    if (text.includes('cắt') || text.includes('tạo mẫu') || text.includes('barber') || text.includes('stylist')) {
      return "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80";
    }
    if (text.includes('uốn') || text.includes('duỗi') || text.includes('sóng')) {
      return "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80";
    }
    if (text.includes('nhuộm') || text.includes('color') || text.includes('highlight') || text.includes('balayage')) {
      return "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80";
    }
    if (text.includes('phục hồi') || text.includes('keratin') || text.includes('nano') || text.includes('collagen')) {
      return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80";
    }
    return "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80";
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catsRes, servsRes] = await Promise.all([
        api.categories.getAll(),
        api.services.getAll()
      ]);
      setCategories(catsRes || []);
      setServices(servsRes || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s => {
    const matchCategory = activeCategoryId === 0 || s.categoryId === activeCategoryId;
    const matchSearch = !search || s.serviceName.toLowerCase().includes(search.toLowerCase()) || (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <section className="section-fullscreen-wrapper services-section" aria-labelledby="services-list-title">
      <div className="container-wide">
        {/* Header Center */}
        <div className="section-header-center">
          <div className="badge-luxury">
            Thực Đơn Chăm Sóc & Trị Liệu 1995
          </div>
          <h2 id="services-list-title" className="section-title-large">
            Bảng Giá Dịch Vụ & Liệu Trình Hoàng Gia
          </h2>
          <p className="section-subtitle-wide">
            Minh bạch mức giá và cam kết hiệu quả. Mọi liệu trình đều sử dụng nguyên liệu thảo mộc tươi tự nhiên và dòng mỹ phẩm cao cấp nhập khẩu chính hãng.
          </p>
        </div>

        {/* Toolbar */}
        <div className="services-toolbar">
          <div className="search-bar-luxury">
            <input 
              type="text"
              className="search-input"
              placeholder="Tìm kiếm: gội đầu dưỡng sinh, cắt tóc, phục hồi keratin, uốn sóng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Tìm kiếm dịch vụ salon"
            />
          </div>

          <div className="view-mode-toggle" aria-label="Chế độ hiển thị thẻ">
            <button 
              className={`view-toggle-btn ${viewMode === 'cinema' ? 'active' : ''}`}
              onClick={() => setViewMode('cinema')}
              aria-label="Xem thẻ toàn màn hình"
            >
              Toàn Màn Hình
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Xem dạng lưới thu nhỏ"
            >
              Dạng Lưới
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="tabs tabs-luxury" role="tablist">
          <button 
            role="tab"
            aria-selected={activeCategoryId === 0}
            className={`tab-btn-luxury ${activeCategoryId === 0 ? 'active' : ''}`}
            onClick={() => setActiveCategoryId(0)}
          >
            Tất Cả ({services.length})
          </button>
          {categories.map(cat => (
            <button 
              key={cat.categoryId}
              role="tab"
              aria-selected={activeCategoryId === cat.categoryId}
              className={`tab-btn-luxury ${activeCategoryId === cat.categoryId ? 'active' : ''}`}
              onClick={() => setActiveCategoryId(cat.categoryId)}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Services Display */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Đang tải danh mục dịch vụ hoàng gia...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Không tìm thấy dịch vụ nào phù hợp với từ khóa "{search}".</p>
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setActiveCategoryId(0); }}>
              Xem toàn bộ dịch vụ
            </button>
          </div>
        ) : viewMode === 'cinema' ? (
          /* FULL-WIDTH CINEMA CARDS */
          <div className="services-cinema-container">
            {filteredServices.map(service => {
              const img = getServiceImage(service.serviceName, service.category?.categoryName);
              return (
                <article key={service.serviceId} className="cinema-service-card">
                  <div className="cinema-card-media">
                    <img 
                      src={img} 
                      alt={`Dịch vụ ${service.serviceName}`} 
                      className="cinema-card-img"
                      loading="lazy"
                    />
                    <div className="cinema-card-badges">
                      <span className="badge badge-gold">
                        {service.category?.categoryName || 'Dịch Vụ Salon 1995'}
                      </span>
                      <span className="badge badge-emerald">
                        Ưa Chuộng
                      </span>
                    </div>
                  </div>

                  <div className="cinema-card-content">
                    <div className="cinema-card-header">
                      <div>
                        <h3 className="cinema-service-title">{service.serviceName}</h3>
                        <div className="cinema-service-meta-tags">
                          <span className="meta-tag">
                            Thời lượng: {service.durationMinutes} phút
                          </span>
                          <span className="meta-tag">
                            Đánh giá: 4.9 ★ (250+ lượt đặt)
                          </span>
                          <span className="meta-tag">
                            Cam kết hài lòng 100%
                          </span>
                        </div>
                      </div>

                      <div className="cinema-price-box">
                        <span className="cinema-price-label">Giá trọn gói niêm yết</span>
                        <span className="cinema-service-price">{formatPrice(service.price)}</span>
                      </div>
                    </div>

                    <p className="cinema-service-desc">{service.description}</p>

                    <div className="cinema-highlights">
                      <div className="highlight-item">
                        <span className="bullet-gold" />
                        <span>Thảo mộc nấu tươi 100% tự nhiên</span>
                      </div>
                      <div className="highlight-item">
                        <span className="bullet-gold" />
                        <span>Kỹ thuật viên đả thông kinh lạc chuyên nghiệp</span>
                      </div>
                      <div className="highlight-item">
                        <span className="bullet-gold" />
                        <span>Thưởng trà dưỡng nhan & yến sào khai vị</span>
                      </div>
                    </div>

                    <div className="cinema-card-footer">
                      <button 
                        className="btn btn-primary cinema-book-btn"
                        onClick={() => onSelectServiceForBooking(service)}
                        aria-label={`Đặt lịch hẹn cho dịch vụ ${service.serviceName}`}
                      >
                        Đặt Lịch Hẹn Ngay
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* COMPACT GRID CARDS */
          <div className="services-grid-fullscreen">
            {filteredServices.map(service => {
              const img = getServiceImage(service.serviceName, service.category?.categoryName);
              return (
                <article key={service.serviceId} className="compact-service-card">
                  <div className="compact-card-thumb">
                    <img src={img} alt={service.serviceName} loading="lazy" />
                    <span className="badge badge-gold compact-badge">
                      {service.category?.categoryName || 'Salon 1995'}
                    </span>
                  </div>

                  <div className="compact-card-body">
                    <div className="service-duration-row">
                      <span>{service.durationMinutes} phút</span>
                      <span style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>4.9 ★</span>
                    </div>

                    <h3 className="compact-service-title">{service.serviceName}</h3>
                    <p className="compact-service-desc">{service.description}</p>

                    <div className="compact-card-footer">
                      <div>
                        <div className="compact-price-label">Giá niêm yết</div>
                        <div className="compact-price">{formatPrice(service.price)}</div>
                      </div>

                      <button 
                        className="btn btn-emerald btn-sm"
                        onClick={() => onSelectServiceForBooking(service)}
                        aria-label={`Chọn đặt ${service.serviceName}`}
                      >
                        Đặt Ngay
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
