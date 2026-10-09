import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Network from './pages/Network';
import Platform from './pages/Platform';
import Advertisers from './pages/Advertisers';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import AboutUs from './pages/AboutUs';
import JokePopups from './components/JokePopups';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollHandler />
      <div className="bg-black text-white font-inter w-full overflow-x-hidden selection:bg-red-500/30 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/network" element={<Network />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/advertisers" element={<Advertisers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/about" element={<AboutUs />} />
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />
        <JokePopups />
      </div>
    </Router>
  );
}

export default App;
