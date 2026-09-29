import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const BookingWizard = ({ preselectedService, onBookingSuccess, onCancel }) => {
  const { user } = useAuth();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Data loaded from backend
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Form selections
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState(
    preselectedService ? [preselectedService.serviceId] : []
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');

  // Step 5 customer info
  const [customerName, setCustomerName] = useState(user ? user.fullName : '');
  const [customerPhone, setCustomerPhone] = useState(user ? user.phone : '');
  const [customerEmail, setCustomerEmail] = useState(user ? (user.email || '') : '');
  const [note, setNote] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');

  // Success result modal
  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedBranchId && bookingDate) {
      loadSlots();
    }
  }, [selectedBranchId, bookingDate, selectedEmployeeId]);

  const loadInitialData = async () => {
    try {
      const [branchRes, serviceRes, employeeRes] = await Promise.all([
        api.branches.getAll(),
        api.services.getAll(),
        api.employees.getAll()
      ]);
      setBranches(branchRes || []);
      setServices(serviceRes || []);
      setEmployees(employeeRes || []);
      if (branchRes && branchRes.length > 0) {
        setSelectedBranchId(branchRes[0].branchId);
      }
    } catch (err) {
      setErrorMsg('Không thể tải dữ liệu ban đầu từ máy chủ');
    }
  };

  const loadSlots = async () => {
    setSlotsLoading(true);
    try {
      const slots = await api.bookings.getSlots(selectedBranchId, bookingDate, selectedEmployeeId);
      setTimeSlots(slots || []);
      setSelectedSlot('');
    } catch (err) {
      console.error("Lỗi tải khung giờ:", err);
    } finally {
      setSlotsLoading(false);
    }
  };

  const toggleService = (serviceId) => {
    if (selectedServiceIds.includes(serviceId)) {
      setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
    } else {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  const selectedServices = services.filter(s => selectedServiceIds.includes(s.serviceId));
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  const finalTotal = Math.max(0, subtotal - voucherDiscount);

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    try {
      const voucher = await api.vouchers.check(voucherCode.trim());
      let discount = 0;
      if (voucher.discountType === 'percent') {
        discount = subtotal * (voucher.discountValue / 100);
      } else {
        discount = voucher.discountValue;
      }
      setVoucherDiscount(discount);
      setVoucherMessage(`Áp dụng thành công mã "${voucher.voucherCode}": -${formatVND(discount)}`);
    } catch (err) {
      setVoucherDiscount(0);
      setVoucherMessage(err.message || 'Mã giảm giá không hợp lệ');
    }
  };

  const validatePhone = (phone) => {
    const vnPhoneRegex = /^(03|05|07|08|09)\d{8}$/;
    return vnPhoneRegex.test(phone.trim());
  };

  const handleSubmitBooking = async () => {
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên khách hàng');
      return;
    }

    if (!validatePhone(customerPhone)) {
      setErrorMsg('Vui lòng nhập đúng số điện thoại di động Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        branchId: selectedBranchId,
        customerName: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail.trim() || null,
        bookingDate: bookingDate,
        bookingTime: selectedSlot + ':00',
        note: note.trim() || null,
        voucherCode: voucherDiscount > 0 ? voucherCode.trim() : null,
        paymentMethod: paymentMethod,
        services: selectedServiceIds.map(id => ({
          serviceId: id,
          employeeId: selectedEmployeeId
        }))
      };

      const result = await api.bookings.create(payload);
      setCreatedBooking(result);
      if (onBookingSuccess) onBookingSuccess(result);
    } catch (err) {
      setErrorMsg(err.message || 'Không thể tạo đơn đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Chi Nhánh' },
    { num: 2, title: 'Dịch Vụ' },
    { num: 3, title: 'Chuyên Viên' },
    { num: 4, title: 'Ngày & Giờ' },
    { num: 5, title: 'Xác Nhận' }
  ];

  if (createdBooking) {
    return (
      <div className="wizard-container glass-card" style={{ textAlign: 'center', padding: '60px 30px' }}>
        <div style={{ color: 'var(--emerald-main)', fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
          ĐẶT LỊCH HẸN THÀNH CÔNG
        </div>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: 16 }}>
          Cảm ơn quý khách {createdBooking.customerName}!
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          Mã vé hẹn của bạn là: <strong style={{ color: 'var(--gold-dark)', fontSize: '1.3rem', letterSpacing: '0.05em' }}>{createdBooking.bookingCode}</strong>
        </p>

        <div style={{ maxWidth: 480, margin: '0 auto 30px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'left', border: '1px solid var(--gold-border)' }}>
          <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-sub)' }}>Khách hàng:</span>
            <strong style={{ color: 'var(--text-main)' }}>{createdBooking.customerName} - {createdBooking.customerPhone}</strong>
          </div>
          <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-sub)' }}>Chi nhánh:</span>
            <strong style={{ color: 'var(--text-main)' }}>{createdBooking.branchName}</strong>
          </div>
          <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-sub)' }}>Thời gian hẹn:</span>
            <strong style={{ color: 'var(--gold-dark)' }}>{createdBooking.bookingTime} ngày {createdBooking.bookingDate}</strong>
          </div>
          <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-sub)' }}>Dịch vụ:</span>
            <span style={{ color: 'var(--text-main)' }}>{createdBooking.details.map(d => d.serviceName).join(', ')}</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
            <span>Tổng thanh toán:</span>
            <strong style={{ color: 'var(--gold-dark)' }}>{formatVND(createdBooking.finalAmount)}</strong>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 28px' }}>
          Hệ thống đã lưu thông tin và gửi thông báo tới salon. Quý khách vui lòng đến trước 10 phút để được phục vụ chu đáo nhất.
        </p>

        <button className="btn btn-primary" onClick={onCancel}>
          Về Trang Chủ
        </button>
      </div>
    );
  }

  return (
    <div className="wizard-container glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>ĐẶT LỊCH HẸN TRỰC TUYẾN</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chỉ mất 1 phút để chọn khung giờ và chuyên viên yêu thích</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>Đóng</button>
      </div>

      {/* Steps indicator */}
      <div className="wizard-steps">
        {steps.map(s => (
          <div 
            key={s.num} 
            className={`wizard-step ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
          >
            <div className="step-circle">
              {currentStep > s.num ? '✓' : s.num}
            </div>
            <span className="step-title">{s.title}</span>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 18px', borderRadius: 'var(--radius-sm)', marginBottom: 20 }}>
          {errorMsg}
        </div>
      )}

      {/* STEP 1: CHI NHÁNH */}
      {currentStep === 1 && (
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--gold-dark)' }}>
            1. Chọn Chi Nhánh Phục Vụ
          </h3>
          <div className="select-grid">
            {branches.map(b => (
              <div 
                key={b.branchId}
                className={`select-card ${selectedBranchId === b.branchId ? 'selected' : ''}`}
                onClick={() => setSelectedBranchId(b.branchId)}
              >
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{b.branchName}</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>{b.address}</p>
                <div style={{ fontSize: '0.82rem', color: 'var(--gold-dark)', fontWeight: 600 }}>
                  Hotline: {b.phone} | Mở cửa: {b.openingTime.slice(0, 5)} - {b.closingTime.slice(0, 5)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentStep(2)}
            >
              Tiếp Theo: Chọn Dịch Vụ
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DỊCH VỤ */}
      {currentStep === 2 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--gold-dark)' }}>
              2. Chọn Gói Dịch Vụ / Combo (Có thể chọn nhiều)
            </h3>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Đã chọn: <strong style={{ color: 'var(--text-main)' }}>{selectedServiceIds.length}</strong> dịch vụ ({totalDuration} phút)
            </span>
          </div>

          <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 6, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {services.map(s => {
              const isSelected = selectedServiceIds.includes(s.serviceId);
              return (
                <div 
                  key={s.serviceId}
                  className={`select-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleService(s.serviceId)}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                        {s.durationMinutes} phút
                      </span>
                      {isSelected && <span style={{ color: 'var(--gold-dark)', fontWeight: 800 }}>✓ Đã chọn</span>}
                    </div>
                    <h4 style={{ fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: 6 }}>{s.serviceName}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 10 }}>{s.description}</p>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-dark)' }}>
                    {formatVND(s.price)}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
              Quay Lại
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Tạm tính: </span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--gold-dark)' }}>{formatVND(subtotal)}</strong>
              </div>
              <button 
                className="btn btn-primary"
                disabled={selectedServiceIds.length === 0}
                onClick={() => setCurrentStep(3)}
              >
                Tiếp Theo: Chọn Chuyên Viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: CHUYÊN VIÊN / STYLIST */}
      {currentStep === 3 && (
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--gold-dark)' }}>
            3. Chọn Chuyên Viên Phục Vụ
          </h3>

          <div className="select-grid">
            <div 
              className={`select-card ${selectedEmployeeId === null ? 'selected' : ''}`}
              onClick={() => setSelectedEmployeeId(null)}
            >
              <div style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Salon Tự Xếp Thợ Giỏi Nhất</strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Hệ thống sẽ chỉ định Stylist hoặc Kỹ thuật viên dưỡng sinh có tay nghề cao nhất đang sẵn sàng vào giờ bạn chọn.
              </p>
            </div>

            {employees.map(emp => (
              <div 
                key={emp.employeeId}
                className={`select-card ${selectedEmployeeId === emp.employeeId ? 'selected' : ''}`}
                onClick={() => setSelectedEmployeeId(emp.employeeId)}
              >
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{emp.fullName}</strong>
                </div>
                <div className="badge badge-emerald" style={{ marginBottom: 6 }}>
                  {emp.position}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                  Kinh nghiệm chuyên môn cao • Đánh giá 5.0★
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
              Quay Lại
            </button>
            <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
              Tiếp Theo: Chọn Ngày & Giờ
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: NGÀY & GIỜ */}
      {currentStep === 4 && (
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--gold-dark)' }}>
            4. Chọn Ngày & Khung Giờ Trống
          </h3>

          <div style={{ maxWidth: 320, marginBottom: 24 }}>
            <label className="form-label">Chọn Ngày Hẹn:</label>
            <input 
              type="date"
              className="form-control"
              min={new Date().toISOString().split('T')[0]}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>

          <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>
            Khung Giờ Còn Trống Trong Ngày ({bookingDate}):
          </label>

          {slotsLoading ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
              Đang kiểm tra lịch trống salon...
            </div>
          ) : timeSlots.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
              Không có khung giờ nào phù hợp. Vui lòng chọn ngày khác.
            </div>
          ) : (
            <div className="slot-grid">
              {timeSlots.map(slot => (
                <div 
                  key={slot.time}
                  className={`slot-item ${selectedSlot === slot.time ? 'selected' : ''} ${!slot.isAvailable ? 'disabled' : ''}`}
                  onClick={() => slot.isAvailable && setSelectedSlot(slot.time)}
                  title={slot.reason}
                >
                  {slot.time}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
              Quay Lại
            </button>
            <button 
              className="btn btn-primary"
              disabled={!selectedSlot}
              onClick={() => setCurrentStep(5)}
            >
              Tiếp Theo: Xác Nhận Thông Tin
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: THÔNG TIN KHÁCH & VOUCHER & XÁC NHẬN */}
      {currentStep === 5 && (
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--gold-dark)' }}>
            5. Thông Tin Khách Hàng & Xác Nhận Đặt Lịch
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div>
              <div className="form-group">
                <label className="form-label">Họ và Tên (*):</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số Điện Thoại (*):</label>
                <input 
                  type="tel"
                  className="form-control"
                  placeholder="Ví dụ: 0988123456"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email (Nhận xác nhận vé hẹn):</label>
                <input 
                  type="email"
                  className="form-control"
                  placeholder="email@example.com (không bắt buộc)"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ghi Chú Đặc Biệt:</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="Ghi chú sở thích: gội nước ấm, massage vai gáy mạnh/nhẹ, v.v."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gold-border)' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 8 }}>
                Tóm Tắt Lịch Hẹn
              </h4>

              <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <div><strong>Ngày hẹn:</strong> {bookingDate} lúc <span style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>{selectedSlot}</span></div>
                <div><strong>Dịch vụ:</strong> {selectedServices.map(s => s.serviceName).join(' + ')}</div>
                <div><strong>Thời lượng:</strong> {totalDuration} phút</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Mã Giảm Giá (Voucher):</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Nhập mã SALON1995..."
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '8px 12px' }}
                  />
                  <button className="btn btn-secondary btn-sm" onClick={handleApplyVoucher}>
                    Áp Dụng
                  </button>
                </div>
                {voucherMessage && (
                  <p style={{ fontSize: '0.8rem', marginTop: 6, color: voucherDiscount > 0 ? 'var(--emerald-main)' : 'var(--danger)' }}>
                    {voucherMessage}
                  </p>
                )}
                <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                  Gợi ý mã: <strong>SALON1995</strong> (giảm 20%), <strong>DUONGSINH50</strong> (giảm 50k)
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Hình Thức Thanh Toán:</label>
                <select 
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ padding: '8px 12px' }}
                >
                  <option value="Tiền mặt">Thanh toán tiền mặt tại quầy sau khi phục vụ</option>
                  <option value="Chuyển khoản">Chuyển khoản ngân hàng (QR Code)</option>
                  <option value="Momo">Ví điện tử MoMo</option>
                  <option value="ZaloPay">Ví ZaloPay</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                  <span>Tổng tiền dịch vụ:</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.9rem', color: 'var(--emerald-main)' }}>
                    <span>Chiết khấu Voucher:</span>
                    <span>-{formatVND(voucherDiscount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-dark)' }}>
                  <span>Tổng thanh toán:</span>
                  <span>{formatVND(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(4)}>
              Quay Lại
            </button>
            <button 
              className="btn btn-primary"
              disabled={loading}
              onClick={handleSubmitBooking}
              style={{ padding: '14px 36px', fontSize: '1.05rem' }}
            >
              {loading ? 'Đang Xử Lý...' : 'HOÀN TẤT ĐẶT HẸN'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
