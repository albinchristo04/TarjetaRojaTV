import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Event from './pages/Event';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';
import DMCA from './pages/legal/DMCA';
import Contact from './pages/legal/Contact';
import About from './pages/legal/About';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<Event />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
