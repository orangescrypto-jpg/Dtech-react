import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin';
import AdminGuard from './components/AdminGuard'; // <-- Import the Google Login guard

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          
          {/* Admin route is now protected by Google Login */}
          <Route path="admin" element={<AdminGuard><Admin /></AdminGuard>} />
        </Route>

        {/* 404 Catch-all route for any wrong URLs */}
        <Route path="*" element={
          <div className="section-container py-32 text-center">
            <h1 className="text-6xl font-extrabold text-brand-dark mb-4">404</h1>
            <p className="text-brand-gray text-lg mb-8">Oops! The page you are looking for does not exist.</p>
            <a href="/" className="btn-primary inline-block">Return Home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}
