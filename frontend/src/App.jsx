import React, { useState, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { FullWidthShowcase } from './components/FullWidthShowcase';
import { ServicesList } from './components/ServicesList';
import { RoyalProcess } from './components/RoyalProcess';
import { GoogleReviewsSection } from './components/GoogleReviewsSection';
import { SeoFaqSection } from './components/SeoFaqSection';
import { BookingWizard } from './components/BookingWizard';
import { MyAppointments } from './components/MyAppointments';
import { AuthModal } from './components/AuthModal';
import { RoyalScissorsParticles } from './components/RoyalScissorsParticles';

// Tách biệt an toàn cho module Admin: tự động fallback nếu chưa đẩy file AdminDashboard lên repo
const AdminDashboard = lazy(() => 
  import('./components/AdminDashboard')
    .then(mod => ({ default: mod.AdminDashboard }))
    .catch(() => ({ 
      default: () => (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: 12 }}>Khu Vực Quản Trị Salon</h3>
          <p>Chức năng quản trị đang được phát triển nội bộ và bảo mật.</p>
        </div>
      ) 
    }))
);

const MainContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleStartBooking = (service = null) => {
    setSelectedService(service);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToServices = () => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById('services-list-title');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('services-list-title');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="site-master-wrapper">
      {/* Exclusive Royal Interactive Particles Effect */}
      <RoyalScissorsParticles />

      {/* Global Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onStartBooking={() => handleStartBooking(null)}
      />

      <main id="main-content" className="main-viewport-content">
        {activeTab === 'home' && (
          <>
            <Hero 
              onStartBooking={() => handleStartBooking(null)} 
              onViewServices={handleScrollToServices}
            />

            <FullWidthShowcase onStartBooking={() => handleStartBooking(null)} />

            <ServicesList onSelectServiceForBooking={handleStartBooking} />

            <RoyalProcess />

            <GoogleReviewsSection />

            <SeoFaqSection />
          </>
        )}

        {activeTab === 'services' && (
          <div style={{ paddingTop: 20 }}>
            <ServicesList onSelectServiceForBooking={handleStartBooking} />
            <RoyalProcess />
            <SeoFaqSection />
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="section-fullscreen-wrapper" style={{ padding: '40px 0 80px' }}>
            <div className="container-wide">
              <BookingWizard 
                preselectedService={selectedService} 
                onCancel={() => setActiveTab('home')}
                onBookingSuccess={() => {
                  if (user) {
                    setActiveTab('my-bookings');
                  }
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'my-bookings' && (
          <div className="section-fullscreen-wrapper" style={{ padding: '40px 0 80px' }}>
            <div className="container-wide">
              <MyAppointments onOpenBooking={() => handleStartBooking(null)} />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="section-fullscreen-wrapper" style={{ padding: '30px 0 60px' }}>
            <div className="container-wide">
              <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Đang tải bảng quản trị...</div>}>
                <AdminDashboard />
              </Suspense>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
