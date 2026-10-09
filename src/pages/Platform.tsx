import { MessageSquare, Wand2, Radio, Target, Activity, ShieldCheck, Zap } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Platform() {
  return (
    <div className="pb-10 lg:pb-20 overflow-hidden">
      
      {/* Platform Header with Soundwave Background */}
      <section className="relative px-6 sm:px-10 lg:px-16 pt-28 lg:pt-32 mb-10 lg:mb-24 min-h-[50vh] flex items-center">
        {/* Background Soundwave from Home */}
        <div className="absolute inset-0 w-full h-full flex items-end opacity-20 pointer-events-none z-0">
          {Array.from({ length: 100 }).map((_, i) => (
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

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="max-w-3xl">
            <h1 className="animate-blur-reveal font-podium uppercase leading-[0.9] tracking-tight text-white text-6xl sm:text-7xl lg:text-9xl mb-6">
              The <span className="bg-gradient-to-r from-red-500 to-rose-700 bg-clip-text text-transparent">Platform</span>
            </h1>
            <p className="font-inter text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
              A ridiculously smart audio ecosystem built for the physical world. Drop the right message exactly when they're swiping their card.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="px-6 sm:px-10 lg:px-16 mb-12 lg:mb-32 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ScrollReveal animationClass="animate-flip-down">
              <h2 className="font-podium text-4xl sm:text-6xl uppercase tracking-wider text-white">
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
                <div className="relative group mb-8">
                  {/* Subtle outer pulsing ring that activates on hover */}
                  <div className="absolute -inset-2 rounded-full border-2 border-red-500/0 group-hover:border-red-500/40 group-hover:animate-ping transition-all duration-700"></div>
                  
                  {/* Circle container with continuous float and hover lift */}
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-xl border border-black/5 flex items-center justify-center relative z-10 transition-all duration-500 hover:shadow-[0_0_35px_rgba(220,38,38,0.4)] hover:-translate-y-2 animate-float"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                </div>
                <h3 className="font-podium text-2xl uppercase mb-4 transition-colors">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="px-6 sm:px-10 lg:px-16 mb-8 lg:mb-20">
        <div className="max-w-7xl mx-auto bg-white border border-black/10 shadow-lg p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <ScrollReveal animationClass="animate-scale-glow">
            <h2 className="font-podium text-4xl sm:text-5xl uppercase tracking-wider text-black mb-12 relative z-10">
              God-Tier Features
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 relative z-10">
            {[
              { icon: Target, title: 'Sniper Targeting', desc: 'Zero in by zip code, venue vibe, time of day, and who\'s actually in the store.' },
              { icon: Activity, title: 'Live Receipts', desc: 'Track impressions, reach, and that sweet sales lift directly from our live dashboard.' },
              { icon: ShieldCheck, title: '100% Brand Safe', desc: 'Totally brand safe. No skips, no ad blockers, and absolutely zero yikes content.' },
              { icon: Zap, title: 'Shape Shifter', desc: 'Instantly swap your ads based on weather, sold-out inventory, or whatever\'s trending locally.' }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col">
                <feature.icon className="h-10 w-10 text-red-600 mb-6" />
                <h3 className="font-podium text-xl uppercase tracking-wider text-black mb-3">{feature.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
