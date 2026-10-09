import { ArrowUpRight, MapPin, Users, Store, Building2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Network() {
  return (
    <div className="pb-10 lg:pb-20">
      
      {/* Network Header */}
      <section className="relative px-6 sm:px-10 lg:px-16 pt-28 lg:pt-32 mb-8 lg:mb-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="animate-tracking-in font-podium uppercase leading-[0.9] tracking-tight text-white text-6xl sm:text-7xl lg:text-9xl mb-6">
            Our <span className="bg-gradient-to-r from-red-500 to-rose-700 bg-clip-text text-transparent">Network</span>
          </h1>
          <p className="max-w-2xl mx-auto font-inter text-lg text-white/70">
            Hit millions of shoppers the exact second they're ready to swipe. We're locked in with the biggest retail chains nationwide. It's giving scale.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-6 sm:px-10 lg:px-16 mb-10 lg:mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Monthly Reach', value: '12M+' },
              { label: 'Active Venues', value: '5,000+' },
              { label: 'Top Markets', value: '50+' },
              { label: 'Brand Lift', value: '24%' }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-black/10 p-8 text-center shadow-lg">
                <div className="font-podium text-4xl sm:text-5xl text-red-500 mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-black/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Types */}
      <section className="px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animationClass="animate-tracking-in">
            <h2 className="font-podium text-4xl sm:text-5xl uppercase tracking-wider text-white mb-12 border-b border-white/10 pb-6">
              Where We Play
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: 'Grocery & Supermarkets', desc: 'Hit shoppers right as they\'re grabbing snacks in the aisle.', icon: Store, image: '/supermarket.jpg' },
              { title: 'Fitness Centers', desc: 'Max energy zones. Perfect for flexing health and wellness brands.', icon: Users, image: '/market2.png' },
              { title: 'Convenience Stores', desc: 'Catch the on-the-go crowd when they need it like, yesterday.', icon: MapPin, image: '/market1.png' },
              { title: 'Shopping Malls', desc: 'Vibe with shoppers when they\'re already in full spending mode.', icon: Building2, image: '/market3.png' }
            ].map((venue, i) => (
              <div key={i} className="group relative bg-white border border-black/10 shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-sm overflow-hidden flex flex-col items-center text-center gap-3 sm:gap-6 p-4 sm:p-6">
                <div className="w-20 h-20 sm:w-32 sm:h-32 shrink-0 bg-black rounded-full overflow-hidden border-2 border-red-900/50 flex items-center justify-center p-1 sm:p-2">
                  {venue.image ? (
                     <img src={venue.image} alt={venue.title} className="w-full h-full object-cover rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                     <venue.icon className="h-8 w-8 sm:h-12 sm:w-12 text-red-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-podium text-sm sm:text-xl xl:text-2xl uppercase text-black mb-1 sm:mb-2 group-hover:text-red-600 transition-colors leading-tight">{venue.title}</h3>
                  <p className="text-black/60 text-[10px] sm:text-sm leading-snug">{venue.desc}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-6 w-6 text-red-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
