import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
// ... 他のインポート

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* ... 他のルート */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 