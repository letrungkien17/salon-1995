import React, { useState } from 'react';
import { X, Lock, User, Phone, Mail, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [gender, setGender] = useState('Nữ');
  const [registerRole, setRegisterRole] = useState('Customer');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await login(loginUsername, loginPassword);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập thất bại');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await register({
        fullName,
        phone,
        email: email || null,
        password: registerPassword,
        gender,
        role: registerRole
      });
      setSuccessMsg('Đăng ký tài khoản thành công! Vui lòng nhập mật khẩu để đăng nhập.');
      setLoginUsername(phone);
      setLoginPassword('');
      setMode('login');
    } catch (err) {
      setErrorMsg(err.message || 'Đăng ký thất bại');
    }
  };


  const fillQuickLogin = (u, p) => {
    setLoginUsername(u);
    setLoginPassword(p);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: 12 }}>
          <button 
            style={{ 
              background: 'none', border: 'none', 
              fontSize: '1.2rem', fontWeight: 700, 
              color: mode === 'login' ? 'var(--gold-dark)' : 'var(--text-sub)',
              cursor: 'pointer'
            }}
            onClick={() => { setMode('login'); setErrorMsg(''); }}
          >
            Đăng Nhập
          </button>
          <button 
            style={{ 
              background: 'none', border: 'none', 
              fontSize: '1.2rem', fontWeight: 700, 
              color: mode === 'register' ? 'var(--gold-dark)' : 'var(--text-sub)',
              cursor: 'pointer'
            }}
            onClick={() => { setMode('register'); setErrorMsg(''); }}
          >
            Đăng Ký Khách Hàng
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(231,29,54,0.15)', border: '1px solid rgba(231,29,54,0.4)', color: '#ff4d6d', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(46,196,182,0.15)', border: '1px solid rgba(46,196,182,0.4)', color: '#2ec4b6', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: '0.85rem' }}>
            {successMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Tên Đăng Nhập hoặc Số Điện Thoại:</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--gold-main)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="form-control"
                  style={{ width: '100%', paddingLeft: 42 }}
                  placeholder="Ví dụ: admin hoặc 0988123456"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mật Khẩu:</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--gold-main)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  className="form-control"
                  style={{ width: '100%', paddingLeft: 42 }}
                  placeholder="Nhập mật khẩu của bạn"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: 8, padding: '14px' }}
            >
              {loading ? 'Đang Đăng Nhập...' : 'ĐĂNG NHẬP NGAY'}
            </button>

            {/* Quick Demo Test Logins */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginBottom: 8 }}>
                * Bấm nhanh để thử nghiệm tài khoản mẫu:
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  onClick={() => fillQuickLogin('admin', 'Admin@1995')}
                >
                  👑 Admin
                </button>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  onClick={() => fillQuickLogin('stylist.hoang', 'Staff@1995')}
                >
                  ✂️ Stylist Hoàng
                </button>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  onClick={() => fillQuickLogin('0988123456', '123456')}
                >
                  🌿 Khách Hàng Mai
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Họ và Tên (*):</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Nguyễn Văn A"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số Điện Thoại (*):</label>
              <input 
                type="tel" 
                className="form-control"
                placeholder="10 số di động VN (09..., 03...)"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email:</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật Khẩu (*):</label>
              <input 
                type="password" 
                className="form-control"
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Giới Tính:</label>
              <select 
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Nữ">Nữ</option>
                <option value="Nam">Nam</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vai Trò Tài Khoản (Role):</label>
              <select 
                className="form-control"
                value={registerRole}
                onChange={(e) => setRegisterRole(e.target.value)}
              >
                <option value="Customer">Khách Hàng (Customer)</option>
                <option value="Staff">Kỹ Thuật Viên / Stylist (Staff)</option>
                <option value="Manager">Quản Lý Chi Nhánh (Manager)</option>
                <option value="Receptionist">Lễ Tân (Receptionist)</option>
                <option value="Admin">Quản Trị Viên Hệ Thống (Admin)</option>
              </select>
            </div>


            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: 8, padding: '14px' }}
            >
              {loading ? 'Đang Tạo Tài Khoản...' : 'HOÀN TẤT ĐĂNG KÝ'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
