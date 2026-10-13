import { useState, useEffect } from 'react';
import { X, ChevronRight, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Our Network', href: '/network' },
    { name: 'Platform', href: '/platform' },
    { name: 'For Advertisers', href: '/advertisers' },
    { name: 'Retail Partners', href: '/partners' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white/95 dark:bg-black/95 backdrop-blur-lg border-b border-black/10 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${
          scrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="font-podium text-3xl sm:text-4xl font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2 group cursor-pointer">
            <img src="/icon.png" alt="YedZ Media Logo" className="h-10 w-10 sm:h-14 sm:w-14 object-contain" />
            <span>
              YedZ <span className="text-red-600">MEDIA</span>
            </span>
          </Link>
          
          {/* Desktop Nav Tabs */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative text-base lg:text-lg font-podium tracking-[0.08em] uppercase text-black dark:text-white/80 transition-colors hover:text-red-600 dark:hover:text-red-500 group"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Actions: Theme Toggle + CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle showLabel={false} />
            <Link 
              to="/advertisers"
              className="group flex items-center gap-3 bg-red-600 px-5 lg:px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer overflow-hidden relative"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <div className="flex items-end gap-[2px] h-3 relative z-10">
                <div className="w-[3px] bg-white group-hover:bg-red-100 transition-colors animate-[soundwave_1s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0s' }}></div>
                <div className="w-[3px] bg-white group-hover:bg-red-100 transition-colors animate-[soundwave_1.2s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-[3px] bg-white group-hover:bg-red-100 transition-colors animate-[soundwave_0.8s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-[3px] bg-white group-hover:bg-red-100 transition-colors animate-[soundwave_1.1s_ease-in-out_infinite_alternate]" style={{ animationDelay: '0.1s' }}></div>
              </div>
              <span className="relative z-10 font-podium tracking-[0.1em] text-base lg:text-lg">Premium In-Store Audio</span>
            </Link>
          </div>

          {/* Mobile Actions: Theme Toggle + Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="flex flex-col items-end space-y-1.5 z-50 p-2 cursor-pointer group"
              onClick={() => setMenuOpen(true)}
              aria-label="Open Menu"
            >
              <div className="h-0.5 w-6 bg-black dark:bg-white transition-all group-hover:bg-red-500 group-hover:w-8" />
              <div className="h-0.5 w-8 bg-black dark:bg-white transition-all group-hover:bg-red-500" />
              <div className="h-0.5 w-4 bg-black dark:bg-white transition-all group-hover:bg-red-500 group-hover:w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-white/98 dark:bg-neutral-950/98 backdrop-blur-xl transition-all duration-500 ${
          menuOpen ? 'visible opacity-100 translate-x-0' : 'invisible opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10 border-b border-black/10 dark:border-white/10">
          <Link to="/" onClick={() => setMenuOpen(false)} className="font-podium text-2xl sm:text-4xl font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
            <img src="/icon.png" alt="YedZ Media Logo" className="h-10 w-10 sm:h-14 sm:w-14 object-contain" />
            <span>YedZ <span className="text-red-600">MEDIA</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle showLabel={true} />
            <button 
              className="cursor-pointer p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors group" 
              onClick={() => setMenuOpen(false)}
              aria-label="Close Menu"
            >
              <X className="h-6 w-6 text-black dark:text-white group-hover:text-red-600 transition-colors" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col justify-start pt-8 sm:pt-16 px-8 sm:px-12 gap-0 overflow-y-auto pb-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-end py-3.5 sm:py-5 border-b border-black/5 dark:border-white/5 font-podium text-2xl sm:text-4xl uppercase text-black dark:text-white transition-all duration-500 hover:text-red-600 hover:pr-4"
              style={{
                transitionDelay: `${i * 80 + 80}ms`,
                transform: menuOpen ? 'translateX(0)' : 'translateX(50px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              <ChevronRight className="h-5 w-5 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-red-600 mr-2" />
              {link.name}
            </Link>
          ))}
          
          <Link
            to="/advertisers"
            onClick={() => setMenuOpen(false)}
            className="mt-8 flex items-center justify-center gap-3 bg-black dark:bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:text-red-400 dark:hover:bg-red-700 transition-all border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            style={{
              transitionDelay: `${navLinks.length * 80 + 150}ms`,
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
            <span className="font-podium tracking-[0.1em] text-base">Premium In-Store Audio</span>
          </Link>

          <div 
            className="mt-8 flex flex-row flex-wrap justify-end gap-6 pb-8"
            style={{
              transitionDelay: `${navLinks.length * 100 + 300}ms`,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: menuOpen ? 1 : 0,
            }}
          >
            <a href="tel:+1234567890" className="text-black/70 dark:text-white/70 hover:text-red-600 transition-colors text-sm flex items-center gap-2 font-medium">
              <Phone className="h-4 w-4 text-red-600" /> +1 (555) 123-4567
            </a>
            <a href="mailto:hello@yedzmedia.com" className="text-black/70 dark:text-white/70 hover:text-red-600 transition-colors text-sm flex items-center gap-2 font-medium">
              <Mail className="h-4 w-4 text-red-600" /> hello@yedzmedia.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
