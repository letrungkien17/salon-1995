import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const MyAppointments = ({ onOpenBooking }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.getMy();
      setBookings(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Không thể tải danh sách lịch hẹn của bạn');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) return;
    try {
      await api.bookings.updateStatus(bookingId, 'Đã huỷ');
      await loadBookings();
    } catch (err) {
      alert(err.message || 'Không thể hủy lịch hẹn');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return <span className="badge badge-pending">Chờ xác nhận</span>;
      case 'Đã xác nhận':
        return <span className="badge badge-confirmed">Đã xác nhận</span>;
      case 'Đang thực hiện':
        return <span className="badge badge-gold">Đang phục vụ</span>;
      case 'Hoàn thành':
        return <span className="badge badge-completed">Hoàn thành</span>;
      case 'Đã huỷ':
        return <span className="badge badge-cancelled">Đã huỷ</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <section style={{ padding: '40px 0 70px' }}>
      <div className="container-wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: 6 }}>
              Lịch Hẹn Của Tôi
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Theo dõi tình trạng đơn đặt lịch chăm sóc tóc và gội đầu dưỡng sinh của bạn
            </p>
          </div>

          <button className="btn btn-primary btn-sm" onClick={onOpenBooking}>
            Đặt Lịch Mới
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 18px', borderRadius: 'var(--radius-sm)', marginBottom: 20 }}>
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Đang tải danh sách lịch hẹn...
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 8, color: 'var(--text-main)' }}>Bạn chưa có lịch hẹn nào</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              Hãy đặt ngay một liệu trình gội đầu dưỡng sinh hoặc làm tóc để tận hưởng không gian thư thái hoàng gia.
            </p>
            <button className="btn btn-primary" onClick={onOpenBooking}>
              Đặt Lịch Ngay Bây Giờ
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {bookings.map(b => (
              <div key={b.bookingId} className="glass-card" style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 14 }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Mã vé hẹn: </span>
                    <strong style={{ color: 'var(--gold-dark)', fontSize: '1.1rem' }}>{b.bookingCode}</strong>
                    <span style={{ marginLeft: 12 }}>{getStatusBadge(b.status)}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tổng thanh toán: </span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--gold-dark)' }}>{formatVND(b.finalAmount)}</strong>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{b.paymentStatus}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, fontSize: '0.9rem', marginBottom: 16 }}>
                  <div>
                    <div style={{ color: 'var(--gold-dark)', marginBottom: 4 }}>
                      <strong>{b.bookingTime} • Ngày {b.bookingDate}</strong>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <span>Chi nhánh: {b.branchName} ({b.branchAddress})</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ color: 'var(--text-sub)', marginBottom: 4 }}>Dịch vụ thực hiện:</div>
                    <div style={{ color: 'var(--text-main)' }}>
                      {b.details.map(d => (
                        <div key={d.bookingDetailId} style={{ marginBottom: 4 }}>
                          • <strong>{d.serviceName}</strong> ({d.durationMinutes}p) - Thợ: {d.employeeName || 'Salon sắp xếp'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {b.note && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', background: '#f9f8f5', padding: '8px 12px', borderRadius: '4px', marginBottom: 16, border: '1px solid rgba(0,0,0,0.06)' }}>
                    Ghi chú: {b.note}
                  </div>
                )}

                {b.status === 'Chờ xác nhận' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(207,43,66,0.3)' }}
                      onClick={() => handleCancelBooking(b.bookingId)}
                    >
                      Hủy Lịch Hẹn Này
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
