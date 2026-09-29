const API_BASE_URL = '/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function request(endpoint, options = {}, isRetry = false) {
  const token = localStorage.getItem('salon1995_access_token') || localStorage.getItem('salon1995_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Xử lý khi token hết hạn (401)
    if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh-token')) {
      const storedRefreshToken = localStorage.getItem('salon1995_refresh_token');
      
      if (storedRefreshToken) {
        if (isRefreshing) {
          // Nếu đang có tiến trình refresh token khác, chờ kết quả
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(newToken => {
              headers['Authorization'] = `Bearer ${newToken}`;
              return request(endpoint, { ...options, headers }, true);
            })
            .catch(err => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: storedRefreshToken })
          });

          const refreshData = await refreshRes.json();

          if (refreshRes.ok && refreshData.success && refreshData.data?.accessToken) {
            const newAccess = refreshData.data.accessToken;
            const newRefresh = refreshData.data.refreshToken;

            localStorage.setItem('salon1995_token', newAccess);
            localStorage.setItem('salon1995_access_token', newAccess);
            localStorage.setItem('salon1995_refresh_token', newRefresh);
            if (refreshData.data.user) {
              localStorage.setItem('salon1995_user', JSON.stringify(refreshData.data.user));
            }

            processQueue(null, newAccess);

            // Re-thử lại request ban đầu với token mới
            headers['Authorization'] = `Bearer ${newAccess}`;
            return request(endpoint, { ...options, headers }, true);
          } else {
            throw new Error('Refresh token expired or revoked');
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          localStorage.removeItem('salon1995_token');
          localStorage.removeItem('salon1995_access_token');
          localStorage.removeItem('salon1995_refresh_token');
          localStorage.removeItem('salon1995_user');
          window.dispatchEvent(new Event('auth-changed'));
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } finally {
          isRefreshing = false;
        }
      } else {
        // Không có refresh token -> đăng xuất
        localStorage.removeItem('salon1995_token');
        localStorage.removeItem('salon1995_access_token');
        localStorage.removeItem('salon1995_user');
        window.dispatchEvent(new Event('auth-changed'));
      }
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Đã xảy ra lỗi khi gọi API');
    }

    return data.data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  auth: {
    login: (username, password) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
    register: (payload) => request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    refreshToken: (refreshToken) => request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    }),
    revokeToken: (refreshToken) => request('/auth/revoke-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    }),
    getMe: () => request('/auth/me')
  },

  // Danh mục & Dịch vụ
  categories: {
    getAll: () => request('/categories')
  },
  services: {
    getAll: (categoryId, search) => {
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      if (search) params.append('search', search);
      const qs = params.toString() ? `?${params.toString()}` : '';
      return request(`/services${qs}`);
    },
    getById: (id) => request(`/services/${id}`)
  },

  // Chi nhánh & Nhân viên
  branches: {
    getAll: () => request('/branches')
  },
  employees: {
    getAll: (branchId, position) => {
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);
      if (position) params.append('position', position);
      const qs = params.toString() ? `?${params.toString()}` : '';
      return request(`/employees${qs}`);
    }
  },

  // Vouchers
  vouchers: {
    check: (code) => request(`/vouchers/check/${code}`)
  },

  // Đặt lịch hẹn
  bookings: {
    create: (payload) => request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    getAll: (date, status, branchId) => {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (status) params.append('status', status);
      if (branchId) params.append('branchId', branchId);
      const qs = params.toString() ? `?${params.toString()}` : '';
      return request(`/orders${qs}`);
    },
    getMy: () => request('/orders/my'),
    getById: (id) => request(`/orders/${id}`),
    updateStatus: (id, status) => request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
    getSlots: (branchId, date, staffId) => {
      const params = new URLSearchParams();
      params.append('branchId', branchId);
      if (date) params.append('date', date);
      if (staffId) params.append('staffId', staffId);
      return request(`/orders/slots?${params.toString()}`);
    }
  }
};
