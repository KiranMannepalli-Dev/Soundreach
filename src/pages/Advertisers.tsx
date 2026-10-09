import { useState, useRef } from 'react';
import { ArrowUpRight, CheckCircle, BarChart3, Users, Store, Mail } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Advertisers() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="pb-0 overflow-hidden">
      
      {/* Hero Section (Reused from Home but adapted for dedicated page) */}
      <section 
        className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 bg-neutral-900 overflow-hidden flex items-center min-h-[50vh] lg:min-h-[60vh]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <audio ref={audioRef} src="/advertisers_ad.mp3" preload="auto" />
        
        {/* Right Half: Image Background */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 z-0">
          <img src="/supermarket.jpg" alt="Supermarket Background" className="w-full h-full object-cover opacity-80 lg:opacity-100" />
          
          {/* Simulated Audio Effect (Corner Speaker) */}
          <div className="absolute top-1/4 right-12 lg:top-1/4 lg:right-1/4 hidden sm:flex items-center justify-center z-10 pointer-events-none">
            
            {/* Speaker PNG Image */}
            <div className={`absolute z-20 w-12 h-12 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(220,38,38,0.7)] transition-transform duration-500 ${isPlaying ? 'scale-125' : 'scale-100'}`}>
               <img src="/market4.png" alt="Speaker" className="w-full h-full object-contain" />
            </div>

            {/* Thicker, Glowing Alternating Red and White Waves */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute w-32 h-32 border-b-[6px] border-l-[6px] border-red-500 rounded-full animate-ping opacity-90 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" style={{ animationDuration: '3s' }}></div>
              <div className="absolute w-44 h-44 border-b-[6px] border-l-[6px] border-white rounded-full animate-ping opacity-70 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
              <div className="absolute w-64 h-64 border-b-[6px] border-l-[6px] border-red-500 rounded-full animate-ping opacity-50 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" style={{ animationDuration: '3s', animationDelay: '2s' }}></div>
            </div>
          </div>

          {/* Mask effect to blend smoothly into the left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent pointer-events-none z-20"></div>
          {/* Subtle mobile overlay so text remains readable on small screens */}
          <div className="absolute inset-0 bg-neutral-900/70 lg:hidden pointer-events-none z-20"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="animate-flip-down font-podium text-6xl sm:text-7xl lg:text-9xl uppercase tracking-tight text-white leading-none mb-6">
              Be Heard <br/><span className="text-red-500">Above the Noise</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 mb-10 font-light leading-relaxed">
              In-store audio hits different. It reaches shoppers right when they're ready to drop cash. Unskippable, totally relevant, and guaranteed to boost your sales. Big W.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <a href="#contact-sales" className="group inline-flex items-center gap-3 bg-red-600 px-8 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-700 hover:scale-105 shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)] cursor-pointer">
                CONTACT SALES
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <CheckCircle className="h-5 w-5 text-red-500" /> No commitments
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Audio Section */}
      <section className="py-12 lg:py-24 px-6 sm:px-10 lg:px-16 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ScrollReveal animationClass="animate-flip-down">
              <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-white">
                Why In-Store <span className="text-red-600">Audio?</span>
              </h2>
            </ScrollReveal>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">
              Digital ads are totally cooked. Physical retail audio gives you a captive audience with 100% share of voice right when they're ready to swipe their cards. Absolute main character energy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'The Checkout Flex', desc: 'Hit customers while they\'re literally holding the product. No scrolling, just buying.', icon: Store },
              { title: 'Unskippable Vibes', desc: 'Unlike those digital ads getting fast-forwarded, in-store audio can\'t be skipped, blocked, or swiped away. Period.', icon: Users },
              { title: 'The Receipts', desc: 'Link those ad plays directly to point-of-sale data to prove the sales lift. We always bring the receipts.', icon: BarChart3 }
            ].map((benefit, i) => (
              <div key={i} className="bg-white border border-black/10 p-8 shadow-lg transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1 rounded-sm group">
                <benefit.icon className="h-10 w-10 text-red-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-podium text-xl uppercase text-black mb-3">{benefit.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Proof Section */}
      <section className="py-10 lg:py-20 bg-neutral-900/50 border-y border-white/10 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <ScrollReveal animationClass="animate-scale-glow">
              <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-white mb-6">
                No Cap <span className="text-red-600">Results</span>
              </h2>
            </ScrollReveal>
            <p className="text-white/70 text-lg mb-8 font-light">
              Brands flexing on the SoundReach Network are seeing insane basket sizes, max product awareness, and wild sales lift for their top SKUs.
            </p>
            <ul className="space-y-4">
              {[
                'Average 24% increase in sales for featured products.',
                '78% of shoppers recall hearing in-store audio messages.',
                'Boosts overall brand affinity and recall by 32%.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-red-500 shrink-0" />
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-white border border-black/10 p-8 text-center shadow-lg rounded-sm">
              <div className="font-podium text-5xl text-red-500 mb-2">24%</div>
              <div className="text-xs uppercase tracking-widest text-black/60">Avg. Sales Lift</div>
            </div>
            <div className="bg-white border border-black/10 p-8 text-center shadow-lg rounded-sm">
              <div className="font-podium text-5xl text-red-500 mb-2">78%</div>
              <div className="text-xs uppercase tracking-widest text-black/60">Ad Recall</div>
            </div>
            <div className="bg-white border border-black/10 p-8 text-center col-span-2 shadow-lg rounded-sm">
              <div className="font-podium text-5xl text-red-500 mb-2">12M+</div>
              <div className="text-xs uppercase tracking-widest text-black/60">Monthly Reach</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Gen Form */}
      <section id="contact-sales" className="py-12 lg:py-24 px-6 sm:px-10 lg:px-16 bg-black relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-red-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-white">
              Ready to <span className="text-red-600">Secure the Bag?</span>
            </h2>
            <p className="mt-4 text-white/60">
              Drop your details below and our team will slide in to build a campaign that absolutely slaps.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white border border-black/10 shadow-lg p-8 sm:p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
              <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="font-podium text-3xl uppercase tracking-wider text-black">
                Inquiry Submitted!
              </h3>
              <p className="text-black/70 font-inter max-w-sm mx-auto">
                Our team will slide into your inbox soon to build a campaign that absolutely slaps. Keep an eye out.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-8 text-sm uppercase tracking-widest text-red-600 hover:text-red-700 font-bold transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form className="bg-white border border-black/10 shadow-lg p-8 sm:p-12 space-y-6 text-left" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">First Name</label>
                <input type="text" className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Last Name</label>
                <input type="text" className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Work Email</label>
              <input type="email" className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Company / Brand</label>
              <input type="text" className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Campaign Goals</label>
              <textarea rows={4} className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors resize-none"></textarea>
            </div>
            <button className="w-full group flex justify-center items-center gap-3 bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-700 mt-4 shadow-lg">
              SUBMIT INQUIRY
              <Mail className="h-5 w-5 transition-transform group-hover:scale-110" />
            </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
