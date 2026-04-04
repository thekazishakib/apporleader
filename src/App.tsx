import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Members from './pages/Members';
import Gallery from './pages/Gallery';
import Workshops from './pages/Workshops';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import RequireAdmin from './components/RequireAdmin';

export default function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="members" element={<Members />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="workshops" element={<Workshops />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:id" element={<BlogPost />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
          </Route>

          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AdminProvider>
  );
}
