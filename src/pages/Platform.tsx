import { MessageSquare, Wand2, Radio, Target, Activity, ShieldCheck, Zap } from 'lucide-react';
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

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="max-w-3xl">
            <h1 className="animate-blur-reveal font-podium uppercase leading-[0.9] tracking-tight text-black dark:text-white text-5xl sm:text-7xl lg:text-9xl mb-4 sm:mb-6">
              The <span className="bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">Platform</span>
            </h1>
            <p className="font-inter text-sm sm:text-xl text-black/70 dark:text-white/70 max-w-2xl leading-relaxed font-normal">
              A ridiculously smart audio ecosystem built for the physical world. Drop the right message exactly when they're swiping their card.
            </p>
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

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-6 sm:mb-16">
            <ScrollReveal animationClass="animate-flip-down">
              <h2 className="font-podium text-3xl sm:text-6xl uppercase tracking-wider text-black dark:text-white drop-shadow-[0_2px_12px_rgba(255,255,255,1)] dark:drop-shadow-none">
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
                desc: 'Tell us who you\'re trying to reach. We\'ll map out a hyper-targeted audio strategy across our retail footprint.',
                icon: MessageSquare
              },
              {
                title: 'We Let Him Cook',
                desc: 'Our creative team takes your notes and cooks up high-quality, engaging audio ads that live rent-free in their heads.',
                icon: Wand2
              },
              {
                title: 'Drop & Track',
                desc: 'Your audio drops across targeted spots. Watch your campaign numbers go brrr in real-time with our live dashboard.',
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
                    <item.icon className="h-5 w-5 sm:h-8 sm:w-8 text-red-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                </div>
                <h3 className="font-podium text-xl sm:text-2xl uppercase mb-1.5 sm:mb-4 transition-colors text-black dark:text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] dark:drop-shadow-none">{item.title}</h3>
                <p className="text-black dark:text-white/90 text-xs sm:text-sm leading-relaxed max-w-sm sm:max-w-xs drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)] dark:drop-shadow-none font-medium bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="px-4 sm:px-10 lg:px-16 mb-8 lg:mb-20">
        <div 
          className="max-w-7xl mx-auto border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-12 lg:p-16 relative overflow-hidden bg-cover bg-center rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-950 transition-colors duration-300"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12 relative z-10">
            {[
              { icon: Target, title: 'Sniper Targeting', desc: 'Zero in by zip code, venue vibe, time of day, and who\'s actually in the store.' },
              { icon: Activity, title: 'Live Receipts', desc: 'Track impressions, reach, and that sweet sales lift directly from our live dashboard.' },
              { icon: ShieldCheck, title: '100% Brand Safe', desc: 'Totally brand safe. No skips, no ad blockers, and absolutely zero yikes content.' },
              { icon: Zap, title: 'Shape Shifter', desc: 'Instantly swap your ads based on weather, sold-out inventory, or whatever\'s trending locally.' }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col">
                <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 mb-3 sm:mb-6" />
                <h3 className="font-podium text-lg sm:text-xl uppercase tracking-wider text-black dark:text-white mb-1.5 sm:mb-3">{feature.title}</h3>
                <p className="text-black/70 dark:text-white/70 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
