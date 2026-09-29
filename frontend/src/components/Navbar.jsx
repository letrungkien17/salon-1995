import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuth, onStartBooking }) => {
  const { user, logout } = useAuth();

  const handleNavClick = (tab, elementId = null) => {
    setActiveTab(tab);
    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar" role="banner">
      <div className="container-wide navbar-inner">
        {/* Brand Logo */}
        <div 
          className="logo-brand" 
          onClick={() => handleNavClick('home')} 
          role="button"
          tabIndex={0}
          aria-label="Về trang chủ Salon 1995"
        >
          <div className="logo-icon">1995</div>
          <div className="logo-text">
            <h1>SALON 1995</h1>
            <p>Viện Tóc & Dưỡng Sinh Hoàng Gia</p>
          </div>
        </div>

        {/* Navigation Links (Clean & Text-First) */}
        <nav aria-label="Menu điều hướng chính">
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none' }}
                onClick={() => handleNavClick('home')}
              >
                Trang Chủ
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none' }}
                onClick={() => handleNavClick('services')}
              >
                Dịch Vụ & Bảng Giá
              </button>
            </li>
            <li>
              <button 
                className="nav-link"
                style={{ background: 'none', border: 'none' }}
                onClick={() => handleNavClick('home', 'showcase-heading')}
              >
                Đặc Quyền
              </button>
            </li>
            <li>
              <button 
                className="nav-link"
                style={{ background: 'none', border: 'none' }}
                onClick={() => handleNavClick('home', 'reviews-heading')}
              >
                Đánh Giá Google (4.9★)
              </button>
            </li>
            {user && (
              <li>
                <button 
                  className={`nav-link ${activeTab === 'my-bookings' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none' }}
                  onClick={() => handleNavClick('my-bookings')}
                >
                  Lịch Hẹn Của Tôi
                </button>
              </li>
            )}
            {user && (user.role === 'Admin' || user.role === 'Staff' || user.role === 'Manager') && (
              <li>
                <button 
                  className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-dark)' }}
                  onClick={() => handleNavClick('admin')}
                >
                  Quản Lý Salon
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Actions (Clean Text Buttons) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onStartBooking}
            aria-label="Đặt lịch hẹn chăm sóc tóc ngay"
          >
            <span>Đặt Lịch Ngay</span>
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  background: '#f8f4eb', 
                  padding: '6px 16px', 
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--gold-border)'
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user.fullName}
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                  {user.role}
                </span>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ padding: '6px 14px' }}
                onClick={logout}
                title="Đăng xuất"
                aria-label="Đăng xuất tài khoản"
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onOpenAuth}
              aria-label="Đăng nhập tài khoản"
            >
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
