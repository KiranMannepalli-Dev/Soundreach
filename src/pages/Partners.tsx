import { useState } from 'react';
import { DollarSign, Headphones, Shield, Settings, ArrowUpRight, CheckCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Partners() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="pb-0 overflow-hidden bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-32 mb-8 sm:mb-10 lg:mb-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16">
          <div className="flex-1 w-full relative z-10">
            <h1 className="animate-reveal-left font-podium text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-black dark:text-white leading-[0.95] mb-4 sm:mb-6">
              Monetize Your <span className="bg-gradient-to-r from-red-500 to-rose-700 bg-clip-text text-transparent">Space</span>
            </h1>
            <p className="text-sm sm:text-xl text-black/80 dark:text-white/80 mb-6 sm:mb-10 font-normal leading-relaxed max-w-xl">
              Turn your existing overhead audio into a new, zero-effort revenue stream. Join thousands of retail locations on YedZ Media.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <a href="#partner-inquiry" className="group inline-flex justify-center items-center gap-3 bg-red-600 px-6 py-4 sm:px-8 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer">
                BECOME A PARTNER
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-black/60 dark:text-white/60 text-xs sm:text-sm font-medium">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0" /> Free hardware integration
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative flex justify-center">
            {/* Visual background effect */}
            <div className="absolute inset-0 bg-red-600/10 blur-[100px] rounded-full"></div>
            
            <div className="relative bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-8 lg:p-12 w-full max-w-md shadow-2xl z-10">
              <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-black/10 pb-4 sm:pb-6">
                <div>
                  <div className="text-black/60 text-[10px] sm:text-xs uppercase tracking-widest mb-1 font-semibold">Estimated Monthly</div>
                  <div className="text-black font-podium text-2xl sm:text-3xl">$4,250.00</div>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-600/10 flex items-center justify-center rounded-full">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-black/70">Active Locations</span>
                  <span className="text-black font-bold">12</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-black/70">Ad Impressions</span>
                  <span className="text-black font-bold">840K</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-black/70">Fill Rate</span>
                  <span className="text-red-600 font-bold">98.2%</span>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-black/10">
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 w-3/4"></div>
                </div>
                <div className="text-center text-[10px] sm:text-xs text-black/50 mt-2 sm:mt-3 font-semibold">Live Dashboard Preview</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 sm:py-12 lg:py-24 px-4 sm:px-10 lg:px-16 bg-neutral-100 dark:bg-neutral-900/50 border-y border-black/10 dark:border-white/10 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-16">
            <ScrollReveal animationClass="animate-reveal-left">
              <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-black dark:text-white">
                Why Partner With <span className="text-red-600">Us?</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { title: 'Zero Cost', desc: 'We provide all necessary streaming hardware and software at absolutely no cost to you.', icon: Settings },
              { title: 'Brand Safe', desc: 'You have complete control over which brands and categories can advertise in your stores.', icon: Shield },
              { title: 'Premium Content', desc: 'Interleaved with high-quality, fully licensed background music curated for your brand.', icon: Headphones },
              { title: 'Pure Profit', desc: 'Turn an existing operational expense (music licensing) into a profitable revenue center.', icon: DollarSign }
            ].map((benefit, i) => (
              <div key={i} className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-8 transition-all duration-300 hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px] group flex flex-col items-center text-center">
                <benefit.icon className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 mb-3 sm:mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-podium text-lg sm:text-xl uppercase text-black mb-1.5 sm:mb-3">{benefit.title}</h3>
                <p className="text-black/70 text-xs sm:text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Process */}
      <section className="relative py-10 sm:py-12 lg:py-24 px-4 sm:px-10 lg:px-16 bg-white dark:bg-black overflow-hidden border-y border-black/10 dark:border-white/10">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-35"
        >
          <source src="/4934935_Person_People_1920x1080.mp4" type="video/mp4" />
        </video>
        {/* Light overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/45 dark:bg-black/80 z-10"></div>

        <div className="max-w-7xl mx-auto relative z-20">
          <div className="max-w-3xl">
            <ScrollReveal animationClass="animate-blur-reveal">
              <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-black dark:text-white mb-4 sm:mb-6">
                Plug & Play <br/><span className="text-red-600">Integration</span>
              </h2>
            </ScrollReveal>
            <p className="text-black/80 dark:text-white/80 text-sm sm:text-lg mb-6 sm:mb-10 font-normal leading-relaxed">
              Getting started is literally so easy. Our hardware plugs straight into your setup. No complex wiring, no IT stress. Just pure vibes.
            </p>
            
            <div className="space-y-5 sm:space-y-8">
              {[
                { step: '01', title: 'Connect Hardware', desc: 'Plug our pre-configured streaming receiver into your amp and watch the magic happen.' },
                { step: '02', title: 'Set Preferences', desc: 'Log in, curate your aesthetic with the right music genres, and block any ads that don\'t pass the vibe check.' },
                { step: '03', title: 'Secure The Bag', desc: 'Music plays, ads slide in seamlessly, and you start generating that sweet passive income.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 sm:gap-6 items-start group">
                  <div className="font-podium text-3xl sm:text-4xl text-black/30 dark:text-white/30 group-hover:text-red-600 transition-colors shrink-0">{item.step}</div>
                  <div>
                    <h3 className="font-podium text-lg sm:text-xl uppercase text-black dark:text-white mb-1 sm:mb-2">{item.title}</h3>
                    <p className="text-black/70 dark:text-white/70 text-xs sm:text-sm font-normal leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Inquiry Form */}
      <section id="partner-inquiry" className="py-10 sm:py-12 lg:py-24 px-4 sm:px-10 lg:px-16 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-black dark:text-white mb-4 sm:mb-6">
            Join The Network
          </h2>
          <p className="text-black/70 dark:text-white/70 mb-8 sm:mb-12 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            Ready to monetize your foot traffic? Provide your details below and a partnership manager will be in touch with a customized revenue projection.
          </p>

          {isSubmitted ? (
            <div className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-6 sm:p-16 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 min-h-[340px] sm:min-h-[400px]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
              </div>
              <h3 className="font-podium text-2xl sm:text-3xl uppercase tracking-wider text-black">
                Request Received!
              </h3>
              <p className="text-black/80 font-inter text-xs sm:text-base max-w-sm mx-auto">
                Thanks for your interest. A partnership manager will be in touch shortly with your customized revenue projection.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-6 sm:mt-8 text-xs sm:text-sm uppercase tracking-widest text-red-600 hover:text-red-700 font-bold transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-12 space-y-4 sm:space-y-6 text-left" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="partner-first-name" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">First Name</label>
                <input id="partner-first-name" name="firstName" type="text" autoComplete="given-name" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label htmlFor="partner-last-name" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Last Name</label>
                <input id="partner-last-name" name="lastName" type="text" autoComplete="family-name" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="partner-email" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Work Email</label>
                <input id="partner-email" name="email" type="email" autoComplete="email" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label htmlFor="partner-business" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Business Name</label>
                <input id="partner-business" name="businessName" type="text" autoComplete="organization" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="partner-locations" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Number of Locations</label>
                <select id="partner-locations" name="locationsCount" className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors appearance-none">
                  <option className="bg-white text-black">1 - 10</option>
                  <option className="bg-white text-black">11 - 50</option>
                  <option className="bg-white text-black">51 - 200</option>
                  <option className="bg-white text-black">201+</option>
                </select>
              </div>
              <div>
                <label htmlFor="partner-type" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Primary Business Type</label>
                <select id="partner-type" name="businessType" className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors appearance-none">
                  <option className="bg-white text-black">Grocery / Supermarket</option>
                  <option className="bg-white text-black">Fitness Center / Gym</option>
                  <option className="bg-white text-black">Convenience Store</option>
                  <option className="bg-white text-black">Shopping Mall</option>
                  <option className="bg-white text-black">Other</option>
                </select>
              </div>
            </div>

            <button className="w-full group flex justify-center items-center gap-3 bg-red-600 px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all mt-6 sm:mt-8 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
              REQUEST REVENUE PROJECTION
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
