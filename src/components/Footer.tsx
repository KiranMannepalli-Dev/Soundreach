import { useState } from 'react';
import { Mail, Phone, ArrowUpRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from './Modal';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <footer id="contact" className="relative border-t border-black/10 dark:border-white/10 bg-white dark:bg-black pt-10 sm:pt-16 pb-8 overflow-hidden text-black dark:text-white transition-colors duration-300">
      <div className="relative z-10 max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">

          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-podium text-2xl font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2 mb-6 group cursor-pointer inline-flex">
              <img src="/icon.png" alt="YedZ Media Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
              <span>YedZ<span className="text-red-600"> MEDIA</span></span>
            </Link>
            <p className="text-black/70 dark:text-white/70 text-sm mb-6 leading-relaxed font-normal">
              The premier programmatic audio ad network transforming in-store retail environments into powerful, unskippable advertising channels.
            </p>
            <div className="flex flex-row flex-wrap gap-x-6 gap-y-3">
              <a href="mailto:hello@yedzmedia.com" className="text-black/80 dark:text-white/80 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm flex items-center gap-2 font-medium">
                <Mail className="h-4 w-4 text-red-600" /> hello@yedzmedia.com
              </a>
              <a href="tel:+1234567890" className="text-black/80 dark:text-white/80 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm flex items-center gap-2 font-medium">
                <Phone className="h-4 w-4 text-red-600" /> +1 (555) 123-4567
              </a>
            </div>
          </div>

          {/* Columns 2 & 3: Explore and Legal (Side-by-side on mobile) */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:gap-12">
            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-podium text-lg uppercase tracking-widest text-black dark:text-white mb-6">Explore</h3>
              <ul className="flex flex-col gap-4">
                <li><Link to="/network" className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold">Our Network</Link></li>
                <li><Link to="/platform" className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold">Platform</Link></li>
                <li><Link to="/advertisers" className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold">For Advertisers</Link></li>
                <li><Link to="/partners" className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold">Retail Partners</Link></li>
                <li><Link to="/about" className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold">About Us</Link></li>
                <li><Link to="/contact" className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold">Contact</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h3 className="font-podium text-lg uppercase tracking-widest text-black dark:text-white mb-6">Legal</h3>
              <ul className="flex flex-col gap-4">
                <li><button onClick={() => setActiveModal('privacy')} className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold cursor-pointer text-left">Privacy Policy</button></li>
                <li><button onClick={() => setActiveModal('terms')} className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold cursor-pointer text-left">Terms of Service</button></li>
                <li><button onClick={() => setActiveModal('cookie')} className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold cursor-pointer text-left">Cookie Policy</button></li>
                <li><button onClick={() => setActiveModal('guidelines')} className="text-black/60 dark:text-white/60 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold cursor-pointer text-left">Ad Guidelines</button></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="bg-black text-white p-5 sm:p-6 border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] md:col-span-2 lg:col-span-1">
            {isSubscribed ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3 py-4 min-h-[140px]">
                <CheckCircle className="h-8 w-8 text-red-500" />
                <h3 className="font-podium text-lg uppercase tracking-widest text-white">Subscribed!</h3>
                <p className="text-white/70 text-xs">You're on the list for the latest updates.</p>
              </div>
            ) : (
              <div className="md:flex md:items-center md:justify-between md:gap-8 lg:block">
                <div className="md:max-w-md lg:max-w-none">
                  <h3 className="font-podium text-lg uppercase tracking-widest text-white mb-2 sm:mb-3">Stay Updated</h3>
                  <p className="text-white/70 text-sm mb-4 md:mb-0 lg:mb-4 font-light leading-relaxed">Subscribe to our newsletter for the latest programmatic audio insights.</p>
                </div>
                <form className="flex md:flex-1 md:max-w-md lg:max-w-none" onSubmit={(e) => { e.preventDefault(); setIsSubscribed(true); }}>
                  <input id="newsletter-email" name="email" type="email" required placeholder="Email Address" autoComplete="email" aria-label="Email Address" className="bg-neutral-900 border-2 border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-[0_0_0_0_rgba(220,38,38,1)] focus:translate-x-[4px] focus:translate-y-[4px] text-white px-4 py-3 w-full focus:outline-none focus:border-red-600 transition-colors text-sm" />
                  <button type="submit" aria-label="Subscribe" className="bg-red-600 px-5 flex items-center justify-center text-white transition-all border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] z-10 cursor-pointer">
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

        {/* Copyright & Socials */}
        <div className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
            <p className="text-black/50 dark:text-white/50 text-sm">
              © {CURRENT_YEAR} YedZ Media. All rights reserved.
            </p>
            <p className="text-black/40 dark:text-white/40 text-xs flex items-center gap-2">
              Design&Developed
              <a href="https://tekloriasolutions.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors group">
                <img src="https://tekloriasolutions.vercel.app/favicon.svg" alt="Tekloria Solutions" className="w-4 h-4 rounded-[2px]" />
                <span className="font-bold text-black/60 dark:text-white/70 group-hover:text-black dark:group-hover:text-white transition-colors">Tekloria Solutions</span>
              </a>
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-black/50 dark:text-white/50 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold">LinkedIn</a>
            <a href="#" className="text-black/50 dark:text-white/50 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold">Twitter</a>
            <a href="#" className="text-black/50 dark:text-white/50 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm uppercase tracking-wider font-bold">Instagram</a>
          </div>
        </div>
      </div>

      {/* Image at the very bottom of the page */}
      <div className="relative z-0 w-full flex justify-center mt-12 [mask-image:linear-gradient(to_top,transparent_0%,black_25%)]">
        <img src="/market3.png" alt="Marketing" className="w-full max-w-[1300px] h-auto object-contain opacity-40 translate-y-4" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent pointer-events-none"></div>
      </div>

      {/* Modals */}
      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Policy">
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">1. Information We Collect</h3>
        <p>We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, fill out a form, and in connection with other activities, services, features or resources we make available.</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">2. How We Use Collected Information</h3>
        <p>YedZ Media may collect and use Users personal information for the following purposes: To improve customer service, to personalize user experience, and to send periodic emails regarding campaign updates or network changes.</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">3. Data Security</h3>
        <p>We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.</p>
      </Modal>

      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Terms of Service">
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">1. Acceptance of Terms</h3>
        <p>By accessing this Website, accessible from yedzmedia.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">2. Use License</h3>
        <p>Permission is granted to temporarily download one copy of the materials on YedZ Media's Website for personal, non-commercial transitory viewing only.</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">3. Limitations</h3>
        <p>YedZ Media or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on YedZ Media's Website.</p>
      </Modal>

      <Modal isOpen={activeModal === 'cookie'} onClose={() => setActiveModal(null)} title="Cookie Policy">
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">1. What Are Cookies</h3>
        <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">2. How We Use Cookies</h3>
        <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">3. Disabling Cookies</h3>
        <p>You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>
      </Modal>

      <Modal isOpen={activeModal === 'guidelines'} onClose={() => setActiveModal(null)} title="Ad Guidelines">
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">1. Audio Quality Standards</h3>
        <p>All submitted audio advertisements must be mastered to -14 LUFS to ensure consistent volume levels across our retail network. Formats accepted: WAV, high-bitrate MP3.</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">2. Content Restrictions</h3>
        <p>YedZ Media maintains a 100% brand-safe environment. We strictly prohibit advertisements containing: explicit language, political campaigning, controversial topics, or deceptive claims.</p>
        <h3 className="text-black text-lg font-podium mt-4 mb-2">3. Retailer Conflicts</h3>
        <p>Ads may be rejected if they directly conflict with the host retailer's primary business (e.g., a fast-food ad playing in a fitness center might be subject to venue-specific blocks). Our platform provides targeting to avoid these conflicts.</p>
      </Modal>

    </footer>
  );
};

export default Footer;
