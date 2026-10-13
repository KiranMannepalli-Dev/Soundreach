import { useState, useRef } from 'react';
import { ArrowUpRight, CheckCircle, MapPin, Users, Building2, Store, MessageSquare, Wand2, Radio } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

function MassiveScaleSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    <section 
      id="network" 
      className="relative py-10 sm:py-16 px-4 sm:px-10 lg:px-16 border-t border-black/10 dark:border-white/10 bg-white dark:bg-black transition-colors duration-300 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <audio ref={audioRef} src="/advertisement.mp3" preload="auto" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-16">
          <div className="flex-1 w-full flex justify-center lg:justify-start relative">
            <div className="absolute inset-0 bg-red-600/10 blur-[80px] rounded-full scale-75 pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[420px] flex items-center justify-center cursor-pointer">
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute w-28 h-28 sm:w-40 sm:h-40 border-[3px] sm:border-[4px] border-red-500 rounded-full animate-ping opacity-75" style={{ animationDuration: '1.5s' }}></div>
                <div className="absolute w-44 h-44 sm:w-60 sm:h-60 border-[3px] sm:border-[4px] border-black/40 dark:border-white/40 rounded-full animate-ping opacity-50" style={{ animationDuration: '1.5s', animationDelay: '0.4s' }}></div>
                <div className="absolute w-60 h-60 sm:w-80 sm:h-80 border-[3px] sm:border-[4px] border-red-500/40 rounded-full animate-ping opacity-25" style={{ animationDuration: '1.5s', animationDelay: '0.8s' }}></div>
              </div>
              
              <img
                src="/market2.png"
                alt="Network Scale"
                className={`relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-transform duration-700 ${isPlaying ? 'scale-105 sm:scale-110' : 'scale-100'}`}
              />
            </div>
          </div>

          <div className="max-w-2xl flex-1 w-full">
            <ScrollReveal animationClass="animate-tracking-in">
              <h2 className="font-podium text-3xl sm:text-6xl lg:text-8xl uppercase tracking-tight text-black dark:text-white leading-[0.95]">
                Massive <span className="bg-gradient-to-r from-red-600 to-rose-800 bg-clip-text text-transparent">Scale</span>
              </h2>
            </ScrollReveal>
            <p className="mt-3 sm:mt-6 text-black/70 dark:text-white/70 font-inter max-w-xl leading-relaxed text-xs sm:text-base">
              We're taking over thousands of retail spots, gyms, and cafes. This is your ultimate cheat code to live rent-free in your audience's mind while they shop, vibe, and live their best life.
            </p>

            <div className="flex gap-8 sm:gap-16 mt-5 sm:mt-10">
              <div>
                <div className="font-podium text-4xl sm:text-7xl text-red-600">12M+</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 mt-1 sm:mt-2 font-semibold">Monthly Reach</div>
              </div>
              <div>
                <div className="font-podium text-4xl sm:text-7xl text-red-600">5K+</div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 mt-1 sm:mt-2 font-semibold">Venues</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
          {[
            { icon: Store, name: 'Grocery & Retail', count: '2,400+ locations', bgImage: '/Grocery&Retail.png' },
            { icon: Users, name: 'Fitness Centers', count: '1,200+ locations', bgImage: '/Fitness Centers.png' },
            { icon: Building2, name: 'Malls & Plazas', count: '800+ locations', bgImage: '/Malls.png' },
            { icon: MapPin, name: 'Convenience', count: '1,600+ locations', bgImage: '/Futuristic Neon 24_7 Convenience Store.png' }
          ].map((venue, i) => (
            <div 
              key={i} 
              className={`group p-2.5 sm:p-6 flex flex-col justify-end min-h-[160px] sm:min-h-[220px] border border-black/10 dark:border-white/20 shadow-md sm:shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl relative z-20 overflow-hidden ${!venue.bgImage ? 'bg-neutral-100 dark:bg-neutral-900' : 'bg-cover bg-center'}`}
              style={venue.bgImage ? { backgroundImage: `url('${venue.bgImage}')` } : {}}
            >
              <div className={venue.bgImage ? "bg-white text-black p-2 sm:p-3 rounded-lg border-2 border-black shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] transform -rotate-1 sm:-rotate-2 group-hover:rotate-0 sm:group-hover:rotate-1 group-hover:scale-105 transition-all duration-300 w-full sm:w-fit" : ""}>
                <div className="font-podium text-xs sm:text-xl uppercase relative z-10 tracking-tight text-black leading-tight sm:leading-none">{venue.name}</div>
                <div className={`mt-0.5 sm:mt-1 relative z-10 ${venue.bgImage ? 'text-red-600 font-bold uppercase tracking-widest text-[8px] sm:text-[10px]' : 'text-[9px] sm:text-xs font-medium text-black/80'}`}>{venue.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    <section 
      id="advertisers" 
      className="relative py-12 sm:py-20 px-4 sm:px-10 lg:px-16 bg-white dark:bg-black overflow-hidden flex items-center min-h-0 sm:min-h-[500px] border-t border-black/10 dark:border-white/10 transition-colors duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <audio ref={audioRef} src="/cta_ad.mp3" preload="auto" />
      <div className="absolute inset-y-0 right-0 w-full md:w-[65%] lg:w-[60%] z-0">
        <img src="/supermarket.jpg" alt="Supermarket Background" className="w-full h-full object-cover blend-mask-left opacity-90 sm:opacity-100" />

        <div className="absolute top-12 right-12 lg:top-16 lg:right-20 hidden md:flex items-center justify-center z-10 pointer-events-none">
          <div className={`absolute z-20 w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(220,38,38,0.7)] transition-transform duration-500 ${isPlaying ? 'scale-125' : 'scale-100'}`}>
            <img src="/market4.png" alt="Speaker" className="w-full h-full object-contain" />
          </div>

          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute w-28 h-28 border-b-[6px] border-l-[6px] border-red-500 rounded-full animate-ping opacity-90 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" style={{ animationDuration: '3s' }}></div>
            <div className="absolute w-44 h-44 border-b-[6px] border-l-[6px] border-black dark:border-white rounded-full animate-ping opacity-70 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
            <div className="absolute w-64 h-64 border-b-[6px] border-l-[6px] border-red-500 rounded-full animate-ping opacity-50 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" style={{ animationDuration: '3s', animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Mobile: Top-to-bottom soft gradient so text is easily readable and supermarket scene is visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/40 dark:from-black/95 dark:via-black/85 dark:to-black/50 md:hidden pointer-events-none z-20 transition-colors duration-300"></div>
        {/* Desktop: Subtle edge blend */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent dark:from-black/30 dark:via-transparent dark:to-transparent pointer-events-none z-20 transition-colors duration-300"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <ScrollReveal animationClass="animate-reveal-left">
            <h2 className="font-podium text-3xl sm:text-6xl lg:text-8xl uppercase tracking-tight text-black dark:text-white leading-[0.95] mb-3 sm:mb-6">
              Be Heard <span className="text-red-600">Above the Noise</span>
            </h2>
          </ScrollReveal>
          <p className="text-sm sm:text-xl text-black/80 dark:text-white/80 mb-5 sm:mb-10 font-normal leading-relaxed">
            In-store audio hits different. It reaches shoppers right when they're ready to drop cash. Unskippable, totally relevant, and guaranteed to boost your sales. Big W.
          </p>

          <button className="group w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-black dark:bg-red-600 px-6 py-3.5 sm:px-8 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white hover:text-red-400 dark:hover:bg-red-700 transition-all border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
            START YOUR CAMPAIGN
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      {/* ----------------- HERO SECTION ----------------- */}
      <section 
        className="relative w-full overflow-hidden bg-cover bg-center pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-0 lg:min-h-screen flex items-center bg-white dark:bg-black transition-colors duration-300"
        style={{ backgroundImage: "url('/Smart Sound Across Modern Retail Spaces.png')" }}
      >
        {/* Mobile: Top-to-bottom mask so text is crisp and clean over the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/30 dark:from-black/95 dark:via-black/85 dark:to-black/35 md:hidden pointer-events-none transition-colors duration-300" />
        
        {/* Desktop (md+): Left-to-right mask */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-white/80 via-white/35 to-transparent dark:from-black/95 dark:via-black/80 dark:to-transparent pointer-events-none transition-colors duration-300" />
        
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-[120px]" />

        {/* Hero Content */}
        <div className="relative z-30 flex w-full flex-col lg:flex-row items-center justify-between px-4 sm:px-10 lg:px-16 gap-8 lg:gap-12 min-h-0 lg:min-h-[calc(100vh-100px)]">

          {/* Left Column: Text */}
          <div className="flex flex-col flex-1 w-full pt-4 sm:pt-8 lg:pt-0 max-w-2xl">
            <h1 className="flex flex-col font-podium uppercase leading-[0.9] tracking-tight text-black dark:text-white text-[clamp(2.5rem,8vw,6rem)] sm:text-[clamp(3.5rem,9vw,7.5rem)] perspective-[1000px]">
              <span className="bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent animate-punch-1 inline-block">Reach.</span>
              <span className="animate-punch-2 inline-block">Local.</span>
              <span className="animate-punch-3 inline-block">Customers.</span>
            </h1>

            <p className="animate-fade-up-delay-4 mt-4 sm:mt-6 max-w-2xl font-inter text-sm leading-relaxed text-black/90 dark:text-white/90 sm:text-base lg:mt-8 font-semibold">
              We are the ultimate audio flex for physical retail. Turning passive listening into active buying.
            </p>

            <div className="animate-fade-up-delay-5 mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <button className="group w-full sm:w-auto relative overflow-hidden flex justify-center items-center gap-2 bg-black dark:bg-red-600 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white hover:text-red-400 dark:hover:bg-red-700 transition-all border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                <span className="relative z-10 font-bold">START A CAMPAIGN</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-black/80 dark:text-white/80">
                <CheckCircle className="h-4 w-4 text-red-600 shrink-0" />
                <div className="flex items-center gap-1.5 sm:flex-col sm:items-start text-[11px] sm:text-[10px] uppercase tracking-wider font-semibold">
                  <span className="text-black/50 dark:text-white/50">Self-Serve or</span>
                  <span className="text-black/90 dark:text-white/90 font-bold">Managed Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="hidden flex-1 w-full justify-center lg:justify-end relative animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
            {/* Subtle glow behind the image */}
            <div className="absolute inset-0 bg-red-600/10 blur-[100px] rounded-full scale-75"></div>
            <div className="relative z-10 w-full max-w-[500px] xl:max-w-[650px] scale-x-[-1]">
              <img
                src="/market1.png"
                alt="In-store audio market"
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(220,38,38,0.15)] hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- NETWORK SECTION ----------------- */}
      <MassiveScaleSection />

      {/* ----------------- HOW IT WORKS ----------------- */}
      <section 
        id="how-it-works" 
        className="relative py-10 sm:py-20 px-4 sm:px-10 lg:px-16 bg-white dark:bg-black bg-cover bg-center overflow-hidden border-t border-black/10 dark:border-white/10 transition-colors duration-300"
        style={{ backgroundImage: "url('/Parking Area.png')" }}
      >
        {/* Light / Dark Mask - mobile gets a bit more contrast for clear text reading */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/75 md:bg-white/5 md:dark:bg-black/60 pointer-events-none z-0 transition-colors duration-300" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-6 sm:mb-16 lg:mb-20">
            <ScrollReveal animationClass="animate-blur-reveal">
              <h2 className="font-podium text-3xl sm:text-6xl lg:text-8xl uppercase tracking-tight text-black dark:text-white drop-shadow-[0_2px_12px_rgba(255,255,255,1)] dark:drop-shadow-none">
                Launch in <span className="text-red-600">Minutes</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-red-600/0 via-red-600/40 to-red-600/0" />

            {[
              {
                title: 'Vibe Check',
                desc: 'Slide into our DMs (or contact form) with your campaign goals. We consult with you to build a highly targeted audio strategy that actually slaps.',
                icon: MessageSquare
              },
              {
                title: 'We Let Him Cook',
                desc: 'Our creative team takes your notes and cooks up high-quality, engaging audio ads that live rent-free in their heads.',
                icon: Wand2
              },
              {
                title: 'Drop & Track',
                desc: 'Your audio drops across targeted spots. Watch your campaign numbers go brrr in real-time with our tracking dashboard.',
                icon: Radio
              }
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="relative group mb-3 sm:mb-8">
                  {/* Subtle outer pulsing ring that activates on hover */}
                  <div className="absolute -inset-2 rounded-full border-2 border-red-500/0 group-hover:border-red-500/40 group-hover:animate-ping transition-all duration-700"></div>

                  {/* Circle container with continuous float and hover lift */}
                  <div
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-black border-2 border-black dark:border-white shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] flex items-center justify-center relative z-10 transition-all duration-300 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] animate-float"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    {/* Icon with scaling/rotation on hover */}
                    <item.icon className="h-5 w-5 sm:h-8 sm:w-8 text-red-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                </div>
                <h3 className="font-podium text-xl sm:text-3xl uppercase mb-1.5 sm:mb-4 transition-colors text-black dark:text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] dark:drop-shadow-none">{item.title}</h3>
                <p className="text-black dark:text-white/90 text-xs sm:text-sm leading-relaxed max-w-sm sm:max-w-xs drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)] dark:drop-shadow-none font-medium bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- ADVERTISERS / CTA ----------------- */}
      <CTASection />
    </div>
  );
}
