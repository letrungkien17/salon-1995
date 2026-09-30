import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  useEffect(() => {
    loadAllBookings();
  }, [filterDate, filterStatus]);

  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.getAll(filterDate || null, filterStatus || null, null);
      setBookings(data || []);
    } catch (err) {
      console.error("Lỗi tải lịch hẹn quản lý:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setStatusUpdatingId(bookingId);
    try {
      await api.bookings.updateStatus(bookingId, newStatus);
      await loadAllBookings();
    } catch (err) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const filtered = bookings.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.customerName.toLowerCase().includes(q) ||
           b.customerPhone.includes(q) ||
           b.bookingCode.toLowerCase().includes(q);
  });

  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Chờ xác nhận').length;
  const inProgressCount = bookings.filter(b => b.status === 'Đang thực hiện').length;
  const completedCount = bookings.filter(b => b.status === 'Hoàn thành').length;
  const dailyRevenue = bookings
    .filter(b => b.status === 'Hoàn thành' || b.paymentStatus === 'Đã thanh toán')
    .reduce((sum, b) => sum + (b.finalAmount || 0), 0);

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <section style={{ padding: '30px 0 60px' }}>
      <div className="container-wide">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Bảng Quản Trị & Điều Phối Salon</h2>
              <span className="badge badge-gold">{user?.role || 'Staff'}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Quản lý lịch hẹn, điều phối ca phục vụ thợ và kiểm soát doanh thu
            </p>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={loadAllBookings} disabled={loading}>
            <span>{loading ? 'Đang tải...' : 'Làm Mới Dữ Liệu'}</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: 4 }}>Tổng Lịch Hẹn</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalCount}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: 4 }}>Chờ Xác Nhận</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)' }}>{pendingCount}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: 4 }}>Đang Phục Vụ</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-dark)' }}>{inProgressCount}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: 4 }}>Hoàn Thành</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-main)' }}>{completedCount}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--gold-main)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--gold-dark)', marginBottom: 4, fontWeight: 700 }}>Doanh Thu Ngày</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatVND(dailyRevenue)}</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-sub)', display: 'block', marginBottom: 4 }}>Ngày Lịch Hẹn:</label>
                <input 
                  type="date"
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-sub)', display: 'block', marginBottom: 4 }}>Trạng Thái:</label>
                <select 
                  className="form-control"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">-- Tất cả trạng thái --</option>
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã huỷ">Đã huỷ</option>
                </select>
              </div>

              <div style={{ alignSelf: 'flex-end' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setFilterDate(''); setFilterStatus(''); }}
                >
                  Xóa Lọc
                </button>
              </div>
            </div>

            <div style={{ width: 280 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-sub)', display: 'block', marginBottom: 4 }}>Tìm Khách Hàng / Mã Vé:</label>
              <input 
                type="text"
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%' }}
                placeholder="Nhập tên, SĐT hoặc mã vé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table of Bookings */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
            Đang tải dữ liệu lịch hẹn...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            Không có lịch hẹn nào theo điều kiện lọc hiện tại.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }} className="glass-card">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#faf8f4', borderBottom: '1px solid var(--gold-border)', color: 'var(--gold-dark)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '14px 16px' }}>MÃ VÉ</th>
                  <th style={{ padding: '14px 16px' }}>KHÁCH HÀNG</th>
                  <th style={{ padding: '14px 16px' }}>GIỜ HẸN</th>
                  <th style={{ padding: '14px 16px' }}>DỊCH VỤ & THỢ</th>
                  <th style={{ padding: '14px 16px' }}>TỔNG TIỀN</th>
                  <th style={{ padding: '14px 16px' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.88rem' }}>
                {filtered.map(b => (
                  <tr 
                    key={b.bookingId} 
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#faf8f4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px' }}>
                      <strong style={{ color: 'var(--gold-dark)' }}>{b.bookingCode}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{b.branchName.split('-')[1]?.trim() || b.branchName}</div>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{b.customerPhone}</div>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <div style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>{b.bookingTime}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{b.bookingDate}</div>
                    </td>

                    <td style={{ padding: '16px', maxWidth: 260 }}>
                      {b.details.map(d => (
                        <div key={d.bookingDetailId} style={{ marginBottom: 4 }}>
                          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{d.serviceName}</span>
                          <span style={{ color: 'var(--text-sub)', fontSize: '0.78rem' }}> ({d.employeeName})</span>
                        </div>
                      ))}
                      {b.note && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontStyle: 'italic' }}>
                          * {b.note}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatVND(b.finalAmount)}</div>
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{b.paymentStatus}</span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      {b.status === 'Chờ xác nhận' && <span className="badge badge-pending">Chờ xác nhận</span>}
                      {b.status === 'Đã xác nhận' && <span className="badge badge-confirmed">Đã xác nhận</span>}
                      {b.status === 'Đang thực hiện' && <span className="badge badge-gold">Đang làm</span>}
                      {b.status === 'Hoàn thành' && <span className="badge badge-completed">Hoàn thành</span>}
                      {b.status === 'Đã huỷ' && <span className="badge badge-cancelled">Đã huỷ</span>}
                    </td>

                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {b.status === 'Chờ xác nhận' && (
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                            disabled={statusUpdatingId === b.bookingId}
                            onClick={() => handleUpdateStatus(b.bookingId, 'Đã xác nhận')}
                          >
                            Duyệt
                          </button>
                        )}

                        {b.status === 'Đã xác nhận' && (
                          <button 
                            className="btn btn-emerald btn-sm"
                            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                            disabled={statusUpdatingId === b.bookingId}
                            onClick={() => handleUpdateStatus(b.bookingId, 'Đang thực hiện')}
                          >
                            Bắt Đầu
                          </button>
                        )}

                        {b.status === 'Đang thực hiện' && (
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                            disabled={statusUpdatingId === b.bookingId}
                            onClick={() => handleUpdateStatus(b.bookingId, 'Hoàn thành')}
                          >
                            Hoàn Thành
                          </button>
                        )}

                        {(b.status === 'Chờ xác nhận' || b.status === 'Đã xác nhận') && (
                          <button 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', color: 'var(--danger)', borderColor: 'rgba(207,43,66,0.3)' }}
                            disabled={statusUpdatingId === b.bookingId}
                            onClick={() => handleUpdateStatus(b.bookingId, 'Đã huỷ')}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
