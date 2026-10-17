import { MessageSquare, Wand2, Radio, Target, Activity, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

export default function Platform() {
  return (
    <div className="pb-10 lg:pb-20 overflow-hidden bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      
      {/* Platform Header with Soundwave Background */}
      <section className="relative px-4 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-32 mb-8 sm:mb-10 lg:mb-24 min-h-0 lg:min-h-[50vh] flex items-center">
        {/* Background Soundwave */}
        <div className="absolute inset-0 w-full h-full flex items-end opacity-20 pointer-events-none z-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i}
              className="flex-1 bg-black dark:bg-white mx-[1px] sm:mx-[2px] animate-[soundwave_1s_ease-in-out_infinite_alternate]"
              style={{
                animationDuration: `${3.5 + (Math.sin(i) * 1.5)}s`,
                animationDelay: `${(i % 5) * 0.4}s`
              }}
            ></div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black transition-colors duration-300"></div>
        </div>

        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto relative z-10 w-full">
          <div className="max-w-3xl">
            <h1 className="animate-blur-reveal font-podium uppercase leading-[0.9] tracking-tight text-black dark:text-white text-5xl sm:text-7xl lg:text-9xl mb-4 sm:mb-6">
              The <span className="bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">Platform</span>
            </h1>
            <p className="font-inter text-sm sm:text-xl text-black/70 dark:text-white/70 max-w-2xl leading-relaxed font-normal mb-6 sm:mb-8">
              A ridiculously smart audio ecosystem built for the physical world. Drop the right message exactly when they're swiping their card.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link 
                to="/advertisers" 
                className="group inline-flex justify-center items-center gap-3 bg-red-600 px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
              >
                LAUNCH A CAMPAIGN
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
              <Link 
                to="/network" 
                className="group inline-flex justify-center items-center gap-3 bg-white dark:bg-black text-black dark:text-white px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
              >
                EXPLORE NETWORK
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section 
        className="relative py-10 sm:py-20 px-4 sm:px-10 lg:px-16 mb-8 sm:mb-12 lg:mb-32 bg-white dark:bg-black bg-cover bg-center overflow-hidden border-y border-black/10 dark:border-white/10 transition-colors duration-300"
        style={{ backgroundImage: "url('/Parking Area.png')" }}
      >
        {/* Light / Dark Mask - mobile gets a bit more contrast for clear text reading */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/75 md:bg-white/5 md:dark:bg-black/60 pointer-events-none z-0 transition-colors duration-300" />

        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto relative z-10">
          <div className="text-center mb-6 sm:mb-16">
            <ScrollReveal animationClass="animate-flip-down">
              <h2 className="font-podium text-3xl sm:text-6xl uppercase tracking-wider text-black dark:text-white drop-shadow-[0_2px_12px_rgba(255,255,255,1)] dark:drop-shadow-none">
                Launch in <span className="text-red-600">Minutes</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 lg:gap-12 relative mb-8 sm:mb-12">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-red-600/0 via-red-600/40 to-red-600/0" />

            {[
              {
                title: 'Vibe Check',
                desc: 'Tell us who you\'re trying to reach. We\'ll map out a hyper-targeted audio strategy across our retail footprint.',
                icon: MessageSquare,
                link: '/contact#contact-sales',
                cta: 'Book Vibe Check'
              },
              {
                title: 'We Let Him Cook',
                desc: 'Our creative team takes your notes and cooks up high-quality, engaging audio ads that live rent-free in their heads.',
                icon: Wand2,
                link: '/advertisers',
                cta: 'Creative Process'
              },
              {
                title: 'Drop & Track',
                desc: 'Your audio drops across targeted spots. Watch your campaign numbers go brrr in real-time with our live dashboard.',
                icon: Radio,
                link: '/network',
                cta: 'Track Reach'
              }
            ].map((item, i) => (
              <Link 
                key={i} 
                to={item.link}
                className="relative flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="relative mb-3 sm:mb-8">
                  {/* Subtle outer pulsing ring that activates on hover */}
                  <div className="absolute -inset-2 rounded-full border-2 border-red-500/0 group-hover:border-red-500/40 group-hover:animate-ping transition-all duration-700"></div>
                  
                  {/* Circle container with continuous float and hover lift */}
                  <div 
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-black border-2 border-black dark:border-white shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] flex items-center justify-center relative z-10 transition-all duration-300 group-hover:shadow-none group-hover:translate-x-[4px] group-hover:translate-y-[4px] animate-float"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    <item.icon className="h-5 w-5 sm:h-8 sm:w-8 text-red-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                </div>
                <h3 className="font-podium text-xl sm:text-2xl uppercase mb-1.5 sm:mb-4 transition-colors text-black dark:text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] dark:drop-shadow-none group-hover:text-red-600 dark:group-hover:text-red-500">{item.title}</h3>
                <p className="text-black dark:text-white/90 text-xs sm:text-sm leading-relaxed max-w-sm sm:max-w-xs drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)] dark:drop-shadow-none font-medium bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm mb-3">{item.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 group-hover:underline">
                  {item.cta} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="flex justify-center">
            <Link 
              to="/advertisers" 
              className="group inline-flex justify-center items-center gap-3 bg-red-600 px-6 py-4 sm:px-8 sm:py-4.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
            >
              LAUNCH YOUR CAMPAIGN IN MINUTES
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="px-4 sm:px-10 lg:px-16 mb-8 lg:mb-20">
        <div 
          className="max-w-7xl 2xl:max-w-[1500px] mx-auto border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-12 lg:p-16 relative overflow-hidden bg-cover bg-center rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-950 transition-colors duration-300"
        >
          {/* Background image overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 dark:opacity-35 pointer-events-none" 
            style={{ backgroundImage: "url('/FuelMax Station at Dusk.png')" }}
          />

          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <ScrollReveal animationClass="animate-scale-glow">
            <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-black dark:text-white mb-6 sm:mb-12 relative z-10">
              God-Tier Features
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {[
              { icon: Target, title: 'Sniper Targeting', desc: 'Zero in by zip code, venue vibe, time of day, and who\'s actually in the store.', link: '/network' },
              { icon: Activity, title: 'Live Receipts', desc: 'Track impressions, reach, and that sweet sales lift directly from our live dashboard.', link: '/advertisers#contact-sales' },
              { icon: ShieldCheck, title: '100% Brand Safe', desc: 'Totally brand safe. No skips, no ad blockers, and absolutely zero yikes content.', link: '/advertisers' },
              { icon: Zap, title: 'Shape Shifter', desc: 'Instantly swap your ads based on weather, sold-out inventory, or whatever\'s trending locally.', link: '/contact' }
            ].map((feature, i) => (
              <Link 
                key={i} 
                to={feature.link}
                className="group flex flex-col p-4 sm:p-5 rounded-lg bg-white/70 dark:bg-neutral-900/70 border border-black/10 dark:border-white/10 hover:border-red-600/50 hover:shadow-[3px_3px_0_0_rgba(220,38,38,1)] hover:-translate-y-1 transition-all duration-300"
              >
                <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 mb-3 sm:mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-podium text-lg sm:text-xl uppercase tracking-wider text-black dark:text-white mb-1.5 sm:mb-3 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors flex items-center justify-between">
                  <span>{feature.title}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-black/70 dark:text-white/70 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-10 lg:px-16 mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto bg-black text-white border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-6 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-red-600/10 pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-podium text-3xl sm:text-5xl lg:text-6xl uppercase tracking-wider mb-4 sm:mb-6">
              Ready to Turn Up <span className="text-red-600">The Volume?</span>
            </h2>
            <p className="text-white/80 text-sm sm:text-lg mb-6 sm:mb-10 font-normal leading-relaxed">
              Launch targeted campaigns that shoppers actually hear, or monetize your store's audio system with zero effort.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link 
                to="/advertisers" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-red-600 px-6 py-4 sm:px-8 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
              >
                START YOUR CAMPAIGN
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link 
                to="/partners" 
                className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-white text-black px-6 py-4 sm:px-8 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
              >
                BECOME A RETAIL PARTNER
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

