import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, CheckCircle, BarChart3, Users, Store, Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { submitLeadToSheet } from '../services/sheetService';
import { adminDataService } from '../services/adminDataService';

export default function Advertisers() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [stats, setStats] = useState(() => adminDataService.getNetworkStats());

  useEffect(() => {
    const unsub = adminDataService.subscribe(() => {
      setStats(adminDataService.getNetworkStats());
    });
    return unsub;
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    await submitLeadToSheet({
      formType: 'Advertisers Page Lead',
      firstName: (formData.get('firstName') as string) || '',
      lastName: (formData.get('lastName') as string) || '',
      email: (formData.get('email') as string) || '',
      company: (formData.get('company') as string) || '',
      goals: (formData.get('campaignGoals') as string) || ''
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleMouseEnter = () => {
    setIsPlaying(true);
    if (audioRef.current) audioRef.current.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="pb-0 overflow-hidden bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      
      {/* Hero Section */}
      <section 
        className="relative pt-24 sm:pt-32 pb-10 sm:pb-12 lg:pt-40 lg:pb-20 bg-white dark:bg-black overflow-hidden flex items-center min-h-0 lg:min-h-[60vh] transition-colors duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <audio ref={audioRef} src="/advertisers_ad.mp3" preload="auto" />
        
        {/* Right Half: Image Background */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[65%] lg:w-[60%] z-0">
          <img src="/supermarket.jpg" alt="Supermarket Background" className="w-full h-full object-cover blend-mask-left opacity-90 lg:opacity-100" />
          
          {/* Simulated Audio Effect (Corner Speaker) */}
          <div className="absolute top-1/4 right-12 lg:top-1/4 lg:right-1/4 hidden sm:flex items-center justify-center z-10 pointer-events-none">
            
            {/* Speaker PNG Image */}
            <div className={`absolute z-20 w-12 h-12 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(220,38,38,0.7)] transition-transform duration-500 ${isPlaying ? 'scale-125' : 'scale-100'}`}>
               <img src="/market4.png" alt="Speaker" className="w-full h-full object-contain" />
            </div>

            {/* Thicker, Glowing Alternating Red and Dark Waves */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute w-32 h-32 border-b-[6px] border-l-[6px] border-red-500 rounded-full animate-ping opacity-90 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" style={{ animationDuration: '3s' }}></div>
              <div className="absolute w-44 h-44 border-b-[6px] border-l-[6px] border-black dark:border-white rounded-full animate-ping opacity-70 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
              <div className="absolute w-64 h-64 border-b-[6px] border-l-[6px] border-red-500 rounded-full animate-ping opacity-50 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" style={{ animationDuration: '3s', animationDelay: '2s' }}></div>
            </div>
          </div>

          {/* Mobile: Top-to-bottom soft gradient so text is easily readable and supermarket scene is visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/40 dark:from-black/95 dark:via-black/85 dark:to-black/50 md:hidden pointer-events-none z-20 transition-colors duration-300"></div>
          {/* Tablet & Desktop: Gradient protecting left side text from photo clutter */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent dark:from-black/95 dark:via-black/75 dark:to-transparent lg:from-white/75 lg:via-white/30 lg:dark:from-black/75 lg:dark:via-black/30 pointer-events-none z-20 transition-colors duration-300"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="animate-flip-down font-podium text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-black dark:text-white leading-[0.95] mb-4 sm:mb-6">
              Be Heard <br/><span className="text-red-600">Above the Noise</span>
            </h1>
            <p className="text-sm sm:text-xl text-black/80 dark:text-white/80 mb-6 sm:mb-10 font-normal leading-relaxed">
              In-store audio hits different. It reaches shoppers right when they're ready to drop cash. Unskippable, totally relevant, and guaranteed to boost your sales. Big W.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <a href="#contact-sales" className="group inline-flex justify-center items-center gap-3 bg-red-600 px-6 py-4 sm:px-8 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer">
                CONTACT SALES
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
              <Link to="/network" className="group inline-flex justify-center items-center gap-3 bg-white dark:bg-black text-black dark:text-white px-6 py-4 sm:px-8 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer">
                {stats.hasVenues ? `SEE ${stats.totalVenues.toLocaleString()} VENUES` : 'EXPLORE VENUE NETWORK'}
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="flex items-center gap-2 text-black/60 dark:text-white/60 text-xs sm:text-sm font-medium mt-4">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0" /> Zero commitments &bull; Live within 48 hours
            </div>
          </div>
        </div>
      </section>

      {/* Why Audio Section */}
      <section className="py-10 sm:py-12 lg:py-24 px-4 sm:px-10 lg:px-16 bg-white dark:bg-black relative">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <ScrollReveal animationClass="animate-flip-down">
              <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-black dark:text-white">
                Why In-Store <span className="text-red-600">Audio?</span>
              </h2>
            </ScrollReveal>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-black/70 dark:text-white/70 max-w-2xl mx-auto leading-relaxed">
              Digital ads are totally cooked. Physical retail audio gives you a captive audience with 100% share of voice right when they're ready to swipe their cards. Absolute main character energy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { title: 'The Checkout Flex', desc: 'Hit customers while they\'re literally holding the product. No scrolling, just buying.', icon: Store, link: '/network', cta: 'Explore Venues' },
              { title: 'Unskippable Vibes', desc: 'Unlike those digital ads getting fast-forwarded, in-store audio can\'t be skipped, blocked, or swiped away. Period.', icon: Users, link: '/platform', cta: 'How Tech Works' },
              { title: 'The Receipts', desc: 'Link those ad plays directly to point-of-sale data to prove the sales lift. We always bring the receipts.', icon: BarChart3, link: '#contact-sales', cta: 'Get Projections' }
            ].map((benefit, i) => (
              benefit.link.startsWith('#') ? (
                <a key={i} href={benefit.link} className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px] group flex flex-col justify-between cursor-pointer">
                  <div>
                    <benefit.icon className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 mb-3 sm:mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="font-podium text-lg sm:text-xl uppercase text-black mb-1.5 sm:mb-3 group-hover:text-red-600 transition-colors">{benefit.title}</h3>
                    <p className="text-black/75 text-xs sm:text-sm leading-relaxed mb-4">{benefit.desc}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 group-hover:underline">
                    {benefit.cta} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              ) : (
                <Link key={i} to={benefit.link} className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px] group flex flex-col justify-between cursor-pointer">
                  <div>
                    <benefit.icon className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 mb-3 sm:mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="font-podium text-lg sm:text-xl uppercase text-black mb-1.5 sm:mb-3 group-hover:text-red-600 transition-colors">{benefit.title}</h3>
                    <p className="text-black/75 text-xs sm:text-sm leading-relaxed mb-4">{benefit.desc}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 group-hover:underline">
                    {benefit.cta} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Proof Section */}
      <section className="py-8 sm:py-10 lg:py-20 bg-neutral-100 dark:bg-neutral-900/50 border-y border-black/10 dark:border-white/10 px-4 sm:px-10 lg:px-16">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
          <div className="w-full md:w-1/2">
            <ScrollReveal animationClass="animate-scale-glow">
              <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-black dark:text-white mb-4 sm:mb-6">
                No Cap <span className="text-red-600">Results</span>
              </h2>
            </ScrollReveal>
            <p className="text-black/70 dark:text-white/70 text-sm sm:text-lg mb-6 sm:mb-8 font-normal leading-relaxed">
              Brands flexing on YedZ Media are seeing insane basket sizes, max product awareness, and wild sales lift for their top SKUs.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              {[
                'Average 24% increase in sales for featured products.',
                '78% of shoppers recall hearing in-store audio messages.',
                'Boosts overall brand affinity and recall by 32%.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-base">
                  <CheckCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-black/80 dark:text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-3 sm:gap-4">
            <a href="#contact-sales" className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer group block">
              <div className="font-podium text-3xl sm:text-5xl text-red-600 mb-1 sm:mb-2 group-hover:scale-105 transition-transform">24%</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold">Avg. Sales Lift</div>
              <span className="text-[10px] text-red-600 font-bold uppercase mt-1 inline-block group-hover:underline">Contact Sales &rarr;</span>
            </a>
            <Link to="/platform" className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer group block">
              <div className="font-podium text-3xl sm:text-5xl text-red-600 mb-1 sm:mb-2 group-hover:scale-105 transition-transform">78%</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold">Ad Recall</div>
              <span className="text-[10px] text-red-600 font-bold uppercase mt-1 inline-block group-hover:underline">Platform &rarr;</span>
            </Link>
            <Link to="/network" className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-4 sm:p-6 lg:p-8 text-center col-span-2 transition-all duration-300 hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer group block">
              <div className="font-podium text-3xl sm:text-5xl text-red-600 mb-1 sm:mb-2 group-hover:scale-105 transition-transform">
                {stats.hasVenues ? stats.reachDisplay : 'Live'}
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold">Monthly In-Store Reach</div>
              <span className="text-[10px] text-red-600 font-bold uppercase mt-1 inline-block group-hover:underline">
                {stats.hasVenues ? `Explore ${stats.totalVenues.toLocaleString()} Venues` : 'Explore Venue Network'} &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Lead Gen Form */}
      <section id="contact-sales" className="py-10 sm:py-12 lg:py-24 px-4 sm:px-10 lg:px-16 bg-white dark:bg-black relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-black dark:text-white">
              Ready to <span className="text-red-600">Secure the Bag?</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-black/70 dark:text-white/70">
              Drop your details below and our team will slide in to build a campaign that absolutely slaps.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-6 sm:p-16 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 min-h-[340px] sm:min-h-[400px]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
              </div>
              <h3 className="font-podium text-2xl sm:text-3xl uppercase tracking-wider text-black">
                Inquiry Submitted!
              </h3>
              <p className="text-black/80 font-inter text-xs sm:text-base max-w-sm mx-auto">
                Our team will slide into your inbox soon to build a campaign that absolutely slaps. Keep an eye out.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-6 sm:mt-8 text-xs sm:text-sm uppercase tracking-widest text-red-600 hover:text-red-700 font-bold transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-12 space-y-4 sm:space-y-6 text-left" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="adv-first-name" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">First Name</label>
                <input id="adv-first-name" name="firstName" type="text" autoComplete="given-name" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label htmlFor="adv-last-name" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Last Name</label>
                <input id="adv-last-name" name="lastName" type="text" autoComplete="family-name" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="adv-email" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Work Email</label>
              <input id="adv-email" name="email" type="email" autoComplete="email" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
            </div>
            <div>
              <label htmlFor="adv-company" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Company / Brand</label>
              <input id="adv-company" name="company" type="text" autoComplete="organization" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
            </div>
            <div>
              <label htmlFor="adv-goals" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Campaign Goals</label>
              <textarea id="adv-goals" name="campaignGoals" rows={3} className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors resize-none"></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full group flex justify-center items-center gap-3 bg-red-600 px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all mt-4 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  RECORDING TO SHEET...
                </>
              ) : (
                <>
                  SUBMIT INQUIRY
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
                </>
              )}
            </button>
            </form>
          )}
        </div>
      </section>

      {/* Retail Partner Cross-Sell Section */}
      <section className="px-4 sm:px-10 lg:px-16 py-10 sm:py-16 bg-neutral-100 dark:bg-neutral-900 border-t border-black/10 dark:border-white/10">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 bg-white dark:bg-black p-6 sm:p-10 border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)]">
          <div>
            <h3 className="font-podium text-2xl sm:text-3xl uppercase tracking-wider text-black dark:text-white mb-2">
              Are You a Store or Venue Owner?
            </h3>
            <p className="text-black/70 dark:text-white/70 text-xs sm:text-sm font-normal max-w-xl">
              Turn your existing in-store sound system into monthly recurring revenue with zero upfront cost or hardware fees.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <Link 
              to="/partners"
              className="inline-flex justify-center items-center gap-2 bg-red-600 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all border-2 border-black dark:border-white/20 shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              EXPLORE PARTNER PROGRAM
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex justify-center items-center gap-2 bg-transparent text-black dark:text-white px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-2 border-black dark:border-white/20 hover:border-red-600"
            >
              TALK TO TEAM
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
