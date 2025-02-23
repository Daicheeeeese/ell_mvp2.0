import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 仮のユーザーデータを拡充
const MOCK_USERS = {
  test: {
    email: 'test@gmail.com',
    username: 'test',
    password: 'test'
  },
  partner: {
    email: 'partner@gmail.com',
    username: 'Emily Williams',
    password: 'partner',
    description: 'English Conversation Enthusiast / TOEIC 960 / 20 years old / Female / from Korea🇰🇷'
  }
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: typeof MOCK_USERS['test'] | typeof MOCK_USERS['partner'] | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// セッションの有効期限を5分に設定
const SESSION_DURATION = 5 * 60 * 1000; // 5分をミリ秒で表現

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<typeof MOCK_USERS['test'] | typeof MOCK_USERS['partner'] | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);

  // 初期化時に保存されているセッション情報を確認
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      const { user: savedUser, expiry } = JSON.parse(savedSession);
      if (expiry > Date.now()) {
        setUser(savedUser);
        setSessionExpiry(expiry);
      } else {
        // 期限切れの場合はセッション情報を削除
        localStorage.removeItem('userSession');
      }
    }
  }, []);

  // セッション期限の監視
  useEffect(() => {
    if (sessionExpiry) {
      const timeoutId = setTimeout(() => {
        setUser(null);
        setSessionExpiry(null);
        localStorage.removeItem('userSession');
      }, sessionExpiry - Date.now());

      return () => clearTimeout(timeoutId);
    }
  }, [sessionExpiry]);

  const login = async (email: string, password: string) => {
    if (email === MOCK_USERS.test.email && password === MOCK_USERS.test.password) {
      const expiry = Date.now() + SESSION_DURATION;
      setUser(MOCK_USERS.test);
      setSessionExpiry(expiry);
      
      // セッション情報をローカルストレージに保存
      localStorage.setItem('userSession', JSON.stringify({
        user: MOCK_USERS.test,
        expiry
      }));

      return true;
    } else if (email === MOCK_USERS.partner.email && password === MOCK_USERS.partner.password) {
      const expiry = Date.now() + SESSION_DURATION;
      setUser(MOCK_USERS.partner);
      setSessionExpiry(expiry);
      
      // セッション情報をローカルストレージに保存
      localStorage.setItem('userSession', JSON.stringify({
        user: MOCK_USERS.partner,
        expiry
      }));

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setSessionExpiry(null);
    localStorage.removeItem('userSession');
  };

  // 残り時間（ミリ秒）を取得
  const getRemainingTime = () => {
    return sessionExpiry ? sessionExpiry - Date.now() : 0;
  };

  // デバッグ用：コンソールに残り時間を表示
  useEffect(() => {
    if (sessionExpiry) {
      console.log(`Session will expire in ${Math.round(getRemainingTime() / 1000)} seconds`);
    }
  }, [sessionExpiry]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 