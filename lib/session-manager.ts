// Custom session manager để hỗ trợ nhiều session cùng lúc
// Lưu session info vào localStorage với key riêng cho mỗi role

export interface SessionInfo {
  userId: string;
  email: string;
  name: string;
  role: string;
  timestamp: number;
}

const SESSION_KEYS = {
  admin: 'bimax_admin_session',
  user: 'bimax_user_session',
};

export const SessionManager = {
  // Lưu session
  setSession(role: 'admin' | 'user', session: SessionInfo) {
    if (typeof window === 'undefined') return;
    
    const key = role === 'admin' ? SESSION_KEYS.admin : SESSION_KEYS.user;
    localStorage.setItem(key, JSON.stringify(session));
  },

  // Lấy session
  getSession(role: 'admin' | 'user'): SessionInfo | null {
    if (typeof window === 'undefined') return null;
    
    const key = role === 'admin' ? SESSION_KEYS.admin : SESSION_KEYS.user;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    try {
      const session = JSON.parse(stored);
      // Kiểm tra session còn hạn không (30 ngày)
      const maxAge = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - session.timestamp > maxAge) {
        this.clearSession(role);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  // Xóa session
  clearSession(role: 'admin' | 'user') {
    if (typeof window === 'undefined') return;
    
    const key = role === 'admin' ? SESSION_KEYS.admin : SESSION_KEYS.user;
    localStorage.removeItem(key);
  },

  // Xóa tất cả sessions
  clearAllSessions() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEYS.admin);
    localStorage.removeItem(SESSION_KEYS.user);
  },

  // Kiểm tra có session nào không
  hasSession(role: 'admin' | 'user'): boolean {
    return this.getSession(role) !== null;
  },
};
