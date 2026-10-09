import ScrollReveal from '../components/ScrollReveal';

export default function AboutUs() {
  return (
    <div className="pb-10 lg:pb-20 overflow-hidden">
      
      {/* Header Section */}
      <section className="relative px-6 sm:px-10 lg:px-16 pt-28 lg:pt-32 mb-8 lg:mb-20 min-h-[30vh] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto relative z-10 w-full text-center">
          <ScrollReveal animationClass="animate-tracking-in">
            <h1 className="font-podium text-6xl sm:text-7xl lg:text-9xl uppercase tracking-tight text-white mb-6">
              Who Are <span className="bg-gradient-to-r from-red-600 to-rose-800 bg-clip-text text-transparent">We?</span>
            </h1>
          </ScrollReveal>
          <p className="max-w-4xl mx-auto sm:whitespace-nowrap font-inter text-lg sm:text-xl text-white/70 leading-relaxed">
            We are the ultimate audio flex for physical retail. Turning passive listening into active buying.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-6 sm:px-10 lg:px-16 mb-10 lg:mb-24 relative">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-800/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-900/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 relative z-10">
          <div className="flex flex-col gap-10">
            <ScrollReveal animationClass="animate-reveal-left">
              <h2 className="font-podium text-3xl sm:text-4xl uppercase text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-red-600 inline-block"></span> The Vision
              </h2>
              <p className="text-white/70 font-inter leading-relaxed text-lg font-light">
                We started SoundReach because we were tired of the same old boring background music in stores. We realized that in-store audio is prime real estate—a totally captive audience right at the point of purchase. But nobody was doing it right. 
              </p>
            </ScrollReveal>
          </div>
          
          <div className="flex flex-col gap-10">
            <ScrollReveal animationClass="animate-reveal-right">
              <h2 className="font-podium text-3xl sm:text-4xl uppercase text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-red-600 inline-block"></span> The Mission
              </h2>
              <p className="text-white/70 font-inter leading-relaxed text-lg font-light">
                Our mission is simple: to make in-store audio slap. We want to help brands connect with their audiences in the physical world with the same precision and vibe they expect online. We're turning every grocery aisle, gym, and convenience store into a premium audio channel.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Our Vibe (White UI Section) */}
      <section className="px-6 sm:px-10 lg:px-16 mb-10 lg:mb-24">
        <div className="max-w-7xl mx-auto bg-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <ScrollReveal animationClass="animate-scale-glow">
            <h2 className="font-podium text-4xl sm:text-5xl uppercase tracking-wider text-black mb-12 relative z-10 text-center">
              Our <span className="text-red-600">Vibe</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {[
              { title: 'No Cap.', desc: 'Total transparency with our advertisers and partners. We keep it 100.' },
              { title: 'Always Cooking.', desc: 'Constantly innovating new ways to grab attention through sound.' },
              { title: 'W Results.', desc: 'We only care about campaigns that actually drive sales and lift.' }
            ].map((val, idx) => (
              <div key={idx} className="flex flex-col p-6 transition-all duration-300">
                <div className="font-podium text-2xl text-red-600 uppercase tracking-wide mb-3">{val.title}</div>
                <p className="text-black/80 text-sm font-inter leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section (White UI Cards) */}
      <section className="px-6 sm:px-10 lg:px-16 mb-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animationClass="animate-fade-up">
            <h2 className="font-podium text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wider text-white mb-12 text-center border-b border-white/10 pb-6">
              The <span className="text-red-600">Founder</span>
            </h2>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            {/* Founder 1 */}
            <div className="group bg-white border border-black/10 shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1 transition-all duration-300 p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 bg-black rounded-full overflow-hidden border-4 border-red-600/20 group-hover:border-red-600/80 transition-colors duration-500">
                <img src="/Kiran%20Mannepalli.jpeg" alt="Karthik Mannepalli - Founder" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-podium text-3xl sm:text-4xl text-black uppercase tracking-wide">Karthik Mannepalli</h3>
                <div className="text-red-600 text-sm font-bold tracking-widest uppercase mt-2 mb-6">Founder & CEO</div>
                <p className="text-black/80 text-base font-inter leading-relaxed">
                  "Voice is the ultimate conversion tool. We built this audio ad network because we knew we could bring customers right to the checkout through the raw power of sound. It's about turning passive listening into active buying."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
