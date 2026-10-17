import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

export default function Network() {
  return (
    <div className="pb-10 lg:pb-20 bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      
      {/* Network Header */}
      <section className="relative px-4 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-32 mb-6 sm:mb-8 lg:mb-20">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto text-center relative z-10">
          <h1 className="animate-tracking-in font-podium uppercase leading-[0.9] tracking-tight text-black dark:text-white text-5xl sm:text-7xl lg:text-9xl mb-4 sm:mb-6">
            Our <span className="bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">Network</span>
          </h1>
          <p className="max-w-2xl mx-auto font-inter text-sm sm:text-lg text-black/70 dark:text-white/70 font-normal leading-relaxed">
            Hit millions of shoppers the exact second they're ready to swipe. We're locked in with the biggest retail chains nationwide. It's giving scale.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link 
              to="/advertisers"
              className="inline-flex items-center gap-2 bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            >
              RUN ADS ON THIS NETWORK
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/partners"
              className="inline-flex items-center gap-2 bg-white dark:bg-black px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-black dark:text-white transition-all border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            >
              MONETIZE YOUR LOCATION &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-4 sm:px-10 lg:px-16 mb-8 sm:mb-10 lg:mb-24">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { label: 'Monthly Reach', value: '12M+', href: '/advertisers' },
              { label: 'Active Venues', value: '5,000+', href: '/partners' },
              { label: 'Top Markets', value: '50+', href: '/platform' },
              { label: 'Brand Lift', value: '24%', href: '/advertisers' }
            ].map((stat, i) => (
              <Link 
                key={i} 
                to={stat.href}
                className="group bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-4 sm:p-8 text-center hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px] transition-all duration-300 cursor-pointer block"
              >
                <div className="font-podium text-3xl sm:text-5xl text-red-600 mb-1 sm:mb-2 group-hover:scale-105 transition-transform">{stat.value}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold group-hover:text-red-600 transition-colors flex items-center justify-center gap-1">
                  {stat.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Types */}
      <section className="px-4 sm:px-10 lg:px-16">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto">
          <ScrollReveal animationClass="animate-tracking-in">
            <h2 className="font-podium text-3xl sm:text-5xl uppercase tracking-wider text-black dark:text-white mb-6 sm:mb-12 border-b border-black/10 dark:border-white/10 pb-4 sm:pb-6">
              Where We Play
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { 
                title: 'Grocery & Supermarkets', 
                count: '2,400+ Locations',
                desc: "Hit shoppers right as they're grabbing snacks in the aisle.", 
                bgImage: '/Grocery&Retail.png' 
              },
              { 
                title: 'Fitness Centers', 
                count: '1,200+ Locations',
                desc: 'Max energy zones. Perfect for flexing health and wellness brands.', 
                bgImage: '/Fitness Centers.png' 
              },
              { 
                title: 'Convenience Stores', 
                count: '1,600+ Locations',
                desc: 'Catch the on-the-go crowd when they need it like, yesterday.', 
                bgImage: '/Futuristic Neon 24_7 Convenience Store.png' 
              },
              { 
                title: 'Shopping Malls', 
                count: '800+ Locations',
                desc: "Vibe with shoppers when they're already in full spending mode.", 
                bgImage: '/Malls.png' 
              }
            ].map((venue, i) => (
              <Link 
                key={i} 
                to="/advertisers"
                className="group relative flex flex-col justify-end min-h-[200px] sm:min-h-[300px] lg:min-h-[320px] p-3 sm:p-5 border-2 border-black dark:border-white/20 shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px] transition-all duration-300 cursor-pointer rounded-xl overflow-hidden bg-black block"
              >
                {/* Background image with hover zoom */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-75 group-hover:opacity-90"
                  style={{ backgroundImage: `url('${venue.bgImage}')` }}
                />
                
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 pointer-events-none" />

                {/* Bottom Content Badge */}
                <div className="relative z-10 w-full">
                  <div className="bg-white text-black p-2.5 sm:p-4 rounded-lg border-2 border-black shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] transform -rotate-1 group-hover:rotate-0 group-hover:scale-[1.02] transition-all duration-300">
                    <div className="text-red-600 font-bold uppercase tracking-widest text-[8px] sm:text-[10px] mb-0.5 sm:mb-1">
                      {venue.count}
                    </div>
                    <h3 className="font-podium text-sm sm:text-lg xl:text-xl uppercase tracking-tight text-black leading-tight group-hover:text-red-600 transition-colors flex items-center justify-between">
                      {venue.title}
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="mt-1 text-black/75 text-[10px] sm:text-xs leading-snug font-inter font-medium">
                      {venue.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Network CTA */}
      <section className="mt-12 sm:mt-20 px-4 sm:px-10 lg:px-16">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto bg-black text-white dark:bg-neutral-900 border-2 border-black dark:border-white/20 shadow-[6px_6px_0_0_rgba(220,38,38,1)] p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl">
          <div>
            <h2 className="font-podium text-2xl sm:text-4xl uppercase tracking-wider text-white">
              Ready to broadcast across our network?
            </h2>
            <p className="mt-2 text-white/70 text-xs sm:text-base max-w-xl">
              Deploy targeted audio ads in minutes or plug your own venue into our streaming architecture.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
              to="/advertisers"
              className="inline-flex justify-center items-center gap-2 bg-red-600 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            >
              LAUNCH CAMPAIGN
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/partners"
              className="inline-flex justify-center items-center gap-2 bg-transparent px-6 py-4 text-xs font-bold uppercase tracking-widest text-white border-2 border-white hover:bg-white/10 transition-all"
            >
              BECOME A PARTNER
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
