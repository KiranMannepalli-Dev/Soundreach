import { useState } from 'react';
import { DollarSign, Headphones, Shield, Settings, ArrowUpRight, CheckCircle, Speaker } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Partners() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="pb-0 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative px-6 sm:px-10 lg:px-16 pt-28 lg:pt-32 mb-10 lg:mb-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 w-full relative z-10">
            <h1 className="animate-reveal-left font-podium text-6xl sm:text-7xl lg:text-9xl uppercase tracking-tight text-white leading-none mb-6">
              Monetize Your <span className="bg-gradient-to-r from-red-500 to-rose-700 bg-clip-text text-transparent">Space</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 mb-10 font-light leading-relaxed max-w-xl">
              Turn your existing overhead audio into a new, zero-effort revenue stream. Join thousands of retail locations on the SoundReach Network.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <a href="#partner-inquiry" className="group inline-flex items-center gap-3 bg-red-600 px-8 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-700 hover:scale-105 shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)] cursor-pointer">
                BECOME A PARTNER
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <CheckCircle className="h-5 w-5 text-red-500" /> Free hardware integration
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative flex justify-center">
            {/* Visual background effect */}
            <div className="absolute inset-0 bg-red-600/10 blur-[100px] rounded-full"></div>
            
            <div className="relative bg-white border border-black/10 p-8 sm:p-12 w-full max-w-md shadow-2xl z-10">
              <div className="flex justify-between items-center mb-8 border-b border-black/10 pb-6">
                <div>
                  <div className="text-black/60 text-xs uppercase tracking-widest mb-1">Estimated Monthly</div>
                  <div className="text-black font-podium text-3xl">$4,250.00</div>
                </div>
                <div className="h-12 w-12 bg-red-600/10 flex items-center justify-center rounded-full">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-black/70 text-sm">Active Locations</span>
                  <span className="text-black font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/70 text-sm">Ad Impressions</span>
                  <span className="text-black font-bold">840K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/70 text-sm">Fill Rate</span>
                  <span className="text-red-600 font-bold">98.2%</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-black/10">
                <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 w-3/4"></div>
                </div>
                <div className="text-center text-xs text-black/40 mt-3">Live Dashboard Preview</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 lg:py-24 px-6 sm:px-10 lg:px-16 bg-neutral-950 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal animationClass="animate-reveal-left">
              <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-white">
                Why Partner With <span className="text-red-600">Us?</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Zero Cost', desc: 'We provide all necessary streaming hardware and software at absolutely no cost to you.', icon: Settings },
              { title: 'Brand Safe', desc: 'You have complete control over which brands and categories can advertise in your stores.', icon: Shield },
              { title: 'Premium Content', desc: 'Interleaved with high-quality, fully licensed background music curated for your brand.', icon: Headphones },
              { title: 'Pure Profit', desc: 'Turn an existing operational expense (music licensing) into a profitable revenue center.', icon: DollarSign }
            ].map((benefit, i) => (
              <div key={i} className="bg-white border border-black/10 p-8 shadow-lg transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1 rounded-sm group flex flex-col items-center text-center">
                <benefit.icon className="h-10 w-10 text-red-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-podium text-xl uppercase text-black mb-3">{benefit.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Process */}
      <section className="relative py-12 lg:py-24 px-6 sm:px-10 lg:px-16 bg-black overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
        >
          <source src="/4934935_Person_People_1920x1080.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        <div className="max-w-7xl mx-auto relative z-20">
          <div className="max-w-3xl">
            <ScrollReveal animationClass="animate-blur-reveal">
              <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-white mb-6">
                Plug & Play <br/><span className="text-red-600">Integration</span>
              </h2>
            </ScrollReveal>
            <p className="text-white/70 text-lg mb-10 font-light">
              Getting started is literally so easy. Our hardware plugs straight into your setup. No complex wiring, no IT stress. Just pure vibes.
            </p>
            
            <div className="space-y-8">
              {[
                { step: '01', title: 'Connect Hardware', desc: 'Plug our pre-configured streaming receiver into your amp and watch the magic happen.' },
                { step: '02', title: 'Set Preferences', desc: 'Log in, curate your aesthetic with the right music genres, and block any ads that don\'t pass the vibe check.' },
                { step: '03', title: 'Secure The Bag', desc: 'Music plays, ads slide in seamlessly, and you start generating that sweet passive income.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="font-podium text-4xl text-white/20 group-hover:text-red-600 transition-colors shrink-0">{item.step}</div>
                  <div>
                    <h3 className="font-podium text-xl uppercase text-white mb-2">{item.title}</h3>
                    <p className="text-white/70 text-sm font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Inquiry Form */}
      <section id="partner-inquiry" className="py-12 lg:py-24 px-6 sm:px-10 lg:px-16 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-white mb-6">
            Join The Network
          </h2>
          <p className="text-white/60 mb-12 max-w-2xl mx-auto">
            Ready to monetize your foot traffic? Provide your details below and a partnership manager will be in touch with a customized revenue projection.
          </p>

          {isSubmitted ? (
            <div className="bg-white border border-black/10 shadow-lg p-8 sm:p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
              <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="font-podium text-3xl uppercase tracking-wider text-black">
                Request Received!
              </h3>
              <p className="text-black/70 font-inter max-w-sm mx-auto">
                Thanks for your interest. A partnership manager will be in touch shortly with your customized revenue projection.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-8 text-sm uppercase tracking-widest text-red-600 hover:text-red-700 font-bold transition-colors"
              >
                Submit Another Request
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
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Work Email</label>
                <input type="email" className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Business Name</label>
                <input type="text" className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Number of Locations</label>
                <select className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors appearance-none">
                  <option>1 - 10</option>
                  <option>11 - 50</option>
                  <option>51 - 200</option>
                  <option>201+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Primary Business Type</label>
                <select className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors appearance-none">
                  <option>Grocery / Supermarket</option>
                  <option>Fitness Center / Gym</option>
                  <option>Convenience Store</option>
                  <option>Shopping Mall</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <button className="w-full group flex justify-center items-center gap-3 bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-700 mt-8 shadow-lg">
              REQUEST REVENUE PROJECTION
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
