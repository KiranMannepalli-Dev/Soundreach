import { useState, useEffect } from 'react';
import { Volume2, X, ChevronRight, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Our Network', href: '/network' },
    { name: 'Platform', href: '/platform' },
    { name: 'For Advertisers', href: '/advertisers' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  // Handle scroll effect for glassmorphism navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Premium Desktop & Mobile Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-lg border-b border-black/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] ${
          scrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="font-podium text-3xl sm:text-4xl font-bold uppercase tracking-wider text-black flex items-center gap-2 group cursor-pointer">
            <Volume2 className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
            <span className="relative">
              SOUNDREACH
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-500 group-hover:w-full"></span>
            </span>
          </Link>
          
          {/* Desktop Nav Tabs */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative text-lg sm:text-xl font-podium tracking-[0.1em] uppercase text-black transition-colors hover:text-red-600 group"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="group flex items-center gap-3 bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-red-700 shadow-md hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] rounded-sm cursor-pointer overflow-hidden relative">
              <span className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <div className="flex items-end gap-[2px] h-3 relative z-10">
                <div className="w-[3px] bg-white group-hover:bg-red-100 transition-colors animate-[soundwave_1s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0s' }}></div>
                <div className="w-[3px] bg-white group-hover:bg-red-100 transition-colors animate-[soundwave_1.2s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-[3px] bg-white group-hover:bg-red-100 transition-colors animate-[soundwave_0.8s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-[3px] bg-white group-hover:bg-red-100 transition-colors animate-[soundwave_1.1s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.1s' }}></div>
              </div>
              <span className="relative z-10 font-podium tracking-[0.1em] text-lg">Premium In-Store Audio</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col items-end space-y-1.5 z-50 p-2 cursor-pointer group"
            onClick={() => setMenuOpen(true)}
          >
            <div className="h-0.5 w-6 bg-black transition-all group-hover:bg-red-500 group-hover:w-8" />
            <div className="h-0.5 w-8 bg-black transition-all group-hover:bg-red-500" />
            <div className="h-0.5 w-4 bg-black transition-all group-hover:bg-red-500 group-hover:w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-neutral-950/98 backdrop-blur-xl transition-all duration-500 ${
          menuOpen ? 'visible opacity-100 translate-x-0' : 'invisible opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10 border-b border-white/10">
          <Link to="/" onClick={() => setMenuOpen(false)} className="font-podium text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Volume2 className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            SOUNDREACH
          </Link>
          <button 
            className="cursor-pointer p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors group" 
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-6 w-6 text-white group-hover:text-red-500 transition-colors" />
          </button>
        </div>
        
        <div className="flex flex-1 flex-col justify-start pt-12 sm:pt-24 px-8 sm:px-12 gap-0 overflow-y-auto pb-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-end py-4 sm:py-6 border-b border-white/5 font-podium text-2xl sm:text-5xl uppercase text-white transition-all duration-500 hover:text-red-500 hover:pr-4"
              style={{
                transitionDelay: `${i * 100 + 100}ms`,
                transform: menuOpen ? 'translateX(0)' : 'translateX(50px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              <ChevronRight className="h-6 w-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-red-500 mr-2" />
              {link.name}
            </Link>
          ))}
          
          <button
            onClick={() => setMenuOpen(false)}
            className="mt-12 flex items-center justify-center gap-3 bg-red-600 px-8 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-700 shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)]"
            style={{
              transitionDelay: `${navLinks.length * 100 + 200}ms`,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: menuOpen ? 1 : 0,
            }}
          >
            <div className="flex items-end gap-[2px] h-3">
              <div className="w-[3px] bg-white animate-[soundwave_1s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0s' }}></div>
              <div className="w-[3px] bg-white animate-[soundwave_1.2s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-[3px] bg-white animate-[soundwave_0.8s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-[3px] bg-white animate-[soundwave_1.1s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.1s' }}></div>
            </div>
            <span className="font-podium tracking-[0.1em] text-lg">Premium In-Store Audio</span>
          </button>

          <div 
            className="mt-8 flex flex-row flex-wrap justify-end gap-6 pb-8"
            style={{
              transitionDelay: `${navLinks.length * 100 + 300}ms`,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: menuOpen ? 1 : 0,
            }}
          >
            <a href="tel:+1234567890" className="text-white/60 hover:text-red-500 transition-colors text-sm flex items-center gap-2 font-medium">
              <Phone className="h-4 w-4 text-red-600" /> +1 (555) 123-4567
            </a>
            <a href="mailto:hello@soundreach.com" className="text-white/60 hover:text-red-500 transition-colors text-sm flex items-center gap-2 font-medium">
              <Mail className="h-4 w-4 text-red-600" /> hello@soundreach.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
