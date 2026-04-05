import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Gallery from './pages/Gallery';
import ImageDetail from './pages/ImageDetail';
import Login from './pages/Login';
import AdminUpload from './pages/AdminUpload';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/image/:id" element={<ImageDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminUpload />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
