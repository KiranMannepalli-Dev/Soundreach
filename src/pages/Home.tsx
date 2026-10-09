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
      className="relative py-12 sm:py-16 px-6 sm:px-10 lg:px-16 border-t border-white/10 bg-neutral-950"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <audio ref={audioRef} src="/advertisement.mp3" preload="auto" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 mb-16">
          <div className="flex-1 w-full flex justify-center lg:justify-start relative">
            <div className="absolute inset-0 bg-red-600/10 blur-[80px] rounded-full scale-75 pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-[420px] flex items-center justify-center cursor-pointer">
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute w-40 h-40 border-[4px] border-red-500 rounded-full animate-ping opacity-75" style={{ animationDuration: '1.5s' }}></div>
                <div className="absolute w-60 h-60 border-[4px] border-white/60 rounded-full animate-ping opacity-50" style={{ animationDuration: '1.5s', animationDelay: '0.4s' }}></div>
                <div className="absolute w-80 h-80 border-[4px] border-red-500/40 rounded-full animate-ping opacity-25" style={{ animationDuration: '1.5s', animationDelay: '0.8s' }}></div>
              </div>
              
              <img
                src="/market2.png"
                alt="Network Scale"
                className={`relative z-10 w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}
              />
            </div>
          </div>

          <div className="max-w-2xl flex-1 w-full">
            <ScrollReveal animationClass="animate-tracking-in">
              <h2 className="font-podium text-5xl sm:text-6xl lg:text-8xl uppercase tracking-tight text-white">
                Massive <span className="bg-gradient-to-r from-red-600 to-rose-800 bg-clip-text text-transparent">Scale</span>
              </h2>
            </ScrollReveal>
            <p className="mt-6 text-white/60 font-inter max-w-xl leading-relaxed">
              We're taking over thousands of retail spots, gyms, and cafes. This is your ultimate cheat code to live rent-free in your audience's mind while they shop, vibe, and live their best life.
            </p>

            <div className="flex gap-8 sm:gap-16 mt-10">
              <div>
                <div className="font-podium text-6xl sm:text-7xl text-red-500">12M+</div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 mt-2">Monthly Reach</div>
              </div>
              <div>
                <div className="font-podium text-6xl sm:text-7xl text-red-500">5K+</div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 mt-2">Venues</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Store, name: 'Grocery & Retail', count: '2,400+ locations' },
            { icon: Users, name: 'Fitness Centers', count: '1,200+ locations' },
            { icon: Building2, name: 'Malls & Plazas', count: '800+ locations' },
            { icon: MapPin, name: 'Convenience', count: '1,600+ locations' }
          ].map((venue, i) => (
            <div key={i} className="group p-6 border border-black/10 bg-white shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-sm relative z-20">
              <venue.icon className="h-8 w-8 text-red-600 group-hover:text-red-700 transition-colors mb-6" />
              <div className="font-podium text-2xl uppercase text-black">{venue.name}</div>
              <div className="text-xs text-black/60 mt-2 font-medium">{venue.count}</div>
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
      className="relative py-12 sm:py-20 bg-neutral-900 overflow-hidden flex items-center min-h-[500px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <audio ref={audioRef} src="/cta_ad.mp3" preload="auto" />
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2 z-0">
        <img src="/supermarket.jpg" alt="Supermarket Background" className="w-full h-full object-cover" />

        <div className="absolute top-12 right-12 lg:top-16 lg:right-20 hidden md:flex items-center justify-center z-10 pointer-events-none">
          <div className={`absolute z-20 w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_0_20px_rgba(220,38,38,0.7)] transition-transform duration-500 ${isPlaying ? 'scale-125' : 'scale-100'}`}>
            <img src="/market4.png" alt="Speaker" className="w-full h-full object-contain" />
          </div>

          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute w-28 h-28 border-b-[6px] border-l-[6px] border-red-500 rounded-full animate-ping opacity-90 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" style={{ animationDuration: '3s' }}></div>
            <div className="absolute w-44 h-44 border-b-[6px] border-l-[6px] border-white rounded-full animate-ping opacity-70 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
            <div className="absolute w-64 h-64 border-b-[6px] border-l-[6px] border-red-500 rounded-full animate-ping opacity-50 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" style={{ animationDuration: '3s', animationDelay: '2s' }}></div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent pointer-events-none z-20"></div>
        <div className="absolute inset-0 bg-neutral-900/70 md:hidden pointer-events-none z-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <ScrollReveal animationClass="animate-reveal-left">
            <h2 className="font-podium text-5xl sm:text-6xl lg:text-8xl uppercase tracking-tight text-white leading-none mb-6">
              Be Heard <span className="text-red-500/80">Above the Noise</span>
            </h2>
          </ScrollReveal>
          <p className="text-lg sm:text-xl text-white/70 mb-10 font-light">
            In-store audio hits different. It reaches shoppers right when they're ready to drop cash. Unskippable, totally relevant, and guaranteed to boost your sales. Big W.
          </p>

          <button className="group inline-flex items-center gap-3 bg-red-600 px-8 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-700 hover:scale-105 shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)]">
            START YOUR CAMPAIGN
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative min-h-screen w-full overflow-hidden bg-black pt-28 lg:pt-32">
        {/* Background Gradients & Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-950/60 via-black to-black" />
        <div className="absolute inset-0 pattern-dots opacity-40"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-700/20 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-900/30 blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-30 flex min-h-[calc(100vh-100px)] flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 gap-12 pb-16 lg:pb-0">

          {/* Left Column: Text */}
          <div className="flex flex-col flex-1 w-full pt-10 lg:pt-0 max-w-2xl">
            <h1 className="flex flex-col font-podium uppercase leading-[0.9] tracking-tight text-white text-[clamp(3.5rem,12vw,11.5rem)] sm:text-[clamp(4.5rem,13vw,11.5rem)] perspective-[1000px]">
              <span className="bg-gradient-to-r from-red-500 to-rose-700 bg-clip-text text-transparent animate-punch-1 inline-block">Reach.</span>
              <span className="animate-punch-2 inline-block">Local.</span>
              <span className="animate-punch-3 inline-block">Customers.</span>
            </h1>

            <p className="animate-fade-up-delay-4 mt-6 max-w-2xl sm:whitespace-nowrap font-inter text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8">
              We are the ultimate audio flex for physical retail. Turning passive listening into active buying.
            </p>

            <div className="animate-fade-up-delay-5 mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
              <button className="group w-full sm:w-auto relative overflow-hidden flex justify-center items-center gap-2 bg-red-600 px-4 py-4 sm:px-6 sm:py-4 text-xs uppercase tracking-widest text-white transition-all hover:bg-red-700 shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)]">
                <span className="relative z-10 font-bold">START A CAMPAIGN</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>

              <div className="hidden items-center gap-3 sm:flex">
                <CheckCircle className="h-6 w-6 text-red-500/40" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Self-Serve or</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/90 font-medium">Managed Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex-1 w-full flex justify-center lg:justify-end relative animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
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
      <section id="how-it-works" className="relative py-12 sm:py-16 px-6 sm:px-10 lg:px-16 bg-black overflow-hidden">

        {/* Background Soundwave */}
        <div className="absolute inset-0 w-full h-full flex items-end opacity-10 pointer-events-none z-0">
          {Array.from({ length: 120 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-white mx-[1px] sm:mx-[2px] animate-[soundwave_1s_ease-in-out_infinite_alternate]"
              style={{
                animationDuration: `${3.5 + (Math.sin(i) * 1.5)}s`,
                animationDelay: `${(i % 5) * 0.4}s`
              }}
            ></div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 lg:mb-20">
            <ScrollReveal animationClass="animate-blur-reveal">
              <h2 className="font-podium text-5xl sm:text-6xl lg:text-8xl uppercase tracking-tight text-white">
                Launch in <span className="text-red-600">Minutes</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-red-900/0 via-red-600/30 to-red-900/0" />

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
                <div className="relative group mb-8">
                  {/* Subtle outer pulsing ring that activates on hover */}
                  <div className="absolute -inset-2 rounded-full border-2 border-red-500/0 group-hover:border-red-500/40 group-hover:animate-ping transition-all duration-700"></div>

                  {/* Circle container with continuous float and hover lift */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-xl border border-black/5 flex items-center justify-center relative z-10 transition-all duration-500 hover:shadow-[0_0_35px_rgba(220,38,38,0.4)] hover:-translate-y-2 animate-float"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    {/* Icon with scaling/rotation on hover */}
                    <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                </div>
                <h3 className="font-podium text-3xl uppercase mb-4 transition-colors">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- ADVERTISERS / CTA ----------------- */}
      <CTASection />
    </>
  );
}
