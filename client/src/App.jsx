import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Gallery from './pages/Gallery';
import ImageDetail from './pages/ImageDetail';
import Login from './pages/Login';
import AdminUpload from './pages/AdminUpload';

function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === '/';
  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/image/:id" element={<ImageDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminUpload />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
