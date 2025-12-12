import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Event from './pages/Event';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<Event />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
