import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

export default function AboutUs() {
  return (
    <div className="pb-10 lg:pb-20 overflow-hidden bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      
      {/* Header Section */}
      <section className="relative px-4 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-32 mb-6 sm:mb-8 lg:mb-20 min-h-0 flex flex-col justify-center">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto relative z-10 w-full text-center">
          <ScrollReveal animationClass="animate-tracking-in">
            <h1 className="font-podium text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-black dark:text-white mb-4 sm:mb-6">
              Who Are <span className="bg-gradient-to-r from-red-600 to-rose-800 bg-clip-text text-transparent">We?</span>
            </h1>
          </ScrollReveal>
          <p className="max-w-4xl mx-auto font-inter text-sm sm:text-xl text-black/70 dark:text-white/70 leading-relaxed mb-6 sm:mb-8">
            We are the ultimate audio flex for physical retail. Turning passive listening into active buying.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link 
              to="/network"
              className="inline-flex justify-center items-center gap-2 bg-red-600 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all border-2 border-black dark:border-white/20 shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              EXPLORE OUR NETWORK
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex justify-center items-center gap-2 bg-white dark:bg-black text-black dark:text-white px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-2 border-black dark:border-white/20 shadow-[3px_3px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              HIT US UP
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-4 sm:px-10 lg:px-16 mb-8 sm:mb-10 lg:mb-24 relative">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-800/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-900/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 relative z-10">
          <div className="flex flex-col gap-6 sm:gap-10">
            <ScrollReveal animationClass="animate-reveal-left">
              <h2 className="font-podium text-2xl sm:text-4xl uppercase text-black dark:text-white mb-3 sm:mb-4 flex items-center gap-3">
                <span className="w-6 sm:w-8 h-[2px] bg-red-600 inline-block"></span> The Vision
              </h2>
              <p className="text-black/70 dark:text-white/70 font-inter leading-relaxed text-sm sm:text-lg font-light mb-4">
                We started YedZ Media because we were tired of the same old boring background music in stores. We realized that in-store audio is prime real estate—a totally captive audience right at the point of purchase. But nobody was doing it right. 
              </p>
              <Link to="/platform" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600 hover:underline">
                Explore The Platform Architecture &rarr;
              </Link>
            </ScrollReveal>
          </div>
          
          <div className="flex flex-col gap-6 sm:gap-10">
            <ScrollReveal animationClass="animate-reveal-right">
              <h2 className="font-podium text-2xl sm:text-4xl uppercase text-black dark:text-white mb-3 sm:mb-4 flex items-center gap-3">
                <span className="w-6 sm:w-8 h-[2px] bg-red-600 inline-block"></span> The Mission
              </h2>
              <p className="text-black/70 dark:text-white/70 font-inter leading-relaxed text-sm sm:text-lg font-light mb-4">
                Our mission is simple: to make in-store audio slap. We want to help brands connect with their audiences in the physical world with the same precision and vibe they expect online. We're turning every grocery aisle, gym, and convenience store into a premium audio channel.
              </p>
              <Link to="/network" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600 hover:underline">
                See Our 5,000+ Partner Footprint &rarr;
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Our Vibe (White UI Neo-brutalist Card) */}
      <section className="px-4 sm:px-10 lg:px-16 mb-8 sm:mb-10 lg:mb-24">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <ScrollReveal animationClass="animate-scale-glow">
            <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-black mb-6 sm:mb-12 relative z-10 text-center">
              Our <span className="text-red-600">Vibe</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative z-10">
            {[
              { title: 'No Cap.', desc: 'Total transparency with our advertisers and partners. We keep it 100.', link: '/advertisers', cta: 'Advertiser Model' },
              { title: 'Always Cooking.', desc: 'Constantly innovating new ways to grab attention through sound.', link: '/platform', cta: 'Platform Tech' },
              { title: 'W Results.', desc: 'We only care about campaigns that actually drive sales and lift.', link: '/network', cta: 'Audience Scale' }
            ].map((val, idx) => (
              <Link 
                key={idx} 
                to={val.link}
                className="flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 bg-neutral-50 border-2 border-black shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] group cursor-pointer"
              >
                <div>
                  <div className="font-podium text-xl sm:text-2xl text-red-600 uppercase tracking-wide mb-1.5 sm:mb-3">{val.title}</div>
                  <p className="text-black/80 text-xs sm:text-sm font-inter leading-relaxed mb-4">{val.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 group-hover:underline">
                  {val.cta} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="px-4 sm:px-10 lg:px-16 mb-10 sm:mb-16">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto">
          <ScrollReveal animationClass="animate-fade-up">
            <h2 className="font-podium text-3xl sm:text-5xl lg:text-6xl uppercase tracking-wider text-black dark:text-white mb-6 sm:mb-12 text-center border-b border-black/10 dark:border-white/10 pb-4 sm:pb-6">
              The <span className="text-red-600">Founder</span>
            </h2>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            {/* Founder 1 */}
            <div className="group bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px] transition-all duration-300 p-5 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
              <div className="w-28 h-28 sm:w-48 sm:h-48 shrink-0 bg-neutral-900 rounded-full overflow-hidden border-3 sm:border-4 border-red-600/30 group-hover:border-red-600 transition-colors duration-500">
                <img src="/Kiran%20Mannepalli.jpeg" alt="Karthik Mannepalli - Founder" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-podium text-2xl sm:text-4xl text-black uppercase tracking-wide">Karthik Mannepalli</h3>
                <div className="text-red-600 text-xs sm:text-sm font-bold tracking-widest uppercase mt-1 sm:mt-2 mb-3 sm:mb-6">Founder & CEO</div>
                <p className="text-black/80 text-xs sm:text-base font-inter leading-relaxed mb-6">
                  "Voice is the ultimate conversion tool. We built this audio ad network because we knew we could bring customers right to the checkout through the raw power of sound. It's about turning passive listening into active buying."
                </p>
                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-red-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-2.5 shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  TALK TO KARTHIK & TEAM
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto bg-black text-white border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-6 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-red-600/10 pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-podium text-3xl sm:text-5xl lg:text-6xl uppercase tracking-wider mb-4 sm:mb-6">
              Ready to Join <span className="text-red-600">The Movement?</span>
            </h2>
            <p className="text-white/80 text-sm sm:text-lg mb-6 sm:mb-10 font-normal leading-relaxed">
              Whether you want to broadcast your brand to 12M+ shoppers or turn your physical venue into high-yield ad space, we're ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link 
                to="/advertisers" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-red-600 px-6 py-4 sm:px-8 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
              >
                START A CAMPAIGN
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link 
                to="/partners" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-white text-black px-6 py-4 sm:px-8 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
              >
                JOIN AS RETAIL PARTNER
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

