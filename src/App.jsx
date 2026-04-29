import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Admin from './pages/Admin'; // <-- Added Admin import

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
          <Route path="admin" element={<Admin />} /> {/* <-- Added Admin route */}
        </Route>
      </Routes>
    </Router>
  );
}
