import { useState } from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, MessageSquare, Briefcase, HelpCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="pb-10 lg:pb-20 overflow-hidden bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      
      {/* Contact Header */}
      <section className="relative px-4 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-32 mb-6 sm:mb-8 lg:mb-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto text-center relative z-10">
          <h1 className="animate-scale-glow font-podium uppercase leading-[0.9] tracking-tight text-black dark:text-white text-5xl sm:text-7xl lg:text-9xl mb-4 sm:mb-6">
            Hit Us <span className="bg-gradient-to-r from-red-500 to-rose-700 bg-clip-text text-transparent">Up</span>
          </h1>
          <p className="max-w-2xl mx-auto font-inter text-sm sm:text-lg text-black/70 dark:text-white/70 leading-relaxed mb-6 sm:mb-8">
            Whether you're a brand ready to drop a fire campaign, or a retailer trying to secure the bag with your store's audio, our squad is ready.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/advertisers" className="text-xs uppercase tracking-wider font-bold px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10 hover:border-red-600 text-black dark:text-white transition-colors">
              Advertiser Hub &rarr;
            </Link>
            <Link to="/partners" className="text-xs uppercase tracking-wider font-bold px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10 hover:border-red-600 text-black dark:text-white transition-colors">
              Retail Partner Program &rarr;
            </Link>
            <Link to="/network" className="text-xs uppercase tracking-wider font-bold px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-black/10 dark:border-white/10 hover:border-red-600 text-black dark:text-white transition-colors">
              Network Footprint &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-4 sm:px-10 lg:px-16 mb-8 sm:mb-10 lg:mb-24 relative z-10">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          
          {/* Left Column: Form */}
          <div>
            <h2 className="font-podium text-2xl sm:text-4xl uppercase tracking-wider text-black dark:text-white mb-4 sm:mb-8">
              Drop a Message
            </h2>
            {isSubmitted ? (
              <div className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-6 sm:p-16 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 min-h-[340px] sm:min-h-[400px]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                  <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
                </div>
                <h3 className="font-podium text-2xl sm:text-3xl uppercase tracking-wider text-black">
                  Message Sent!
                </h3>
                <p className="text-black/80 font-inter text-xs sm:base max-w-sm">
                  We've received your details and our team will get back to you shortly. Get ready to turn up the volume on your campaigns!
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 sm:mt-8 text-xs sm:text-sm uppercase tracking-widest text-red-600 hover:text-red-700 font-bold transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] p-5 sm:p-10 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="contact-first-name" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">First Name</label>
                  <input id="contact-first-name" name="firstName" type="text" autoComplete="given-name" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
                </div>
                <div>
                  <label htmlFor="contact-last-name" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Last Name</label>
                  <input id="contact-last-name" name="lastName" type="text" autoComplete="family-name" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Work Email</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Subject</label>
                <select id="contact-subject" name="subject" className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors appearance-none">
                  <option className="bg-white text-black">Advertiser Inquiry</option>
                  <option className="bg-white text-black">Retail Partnership</option>
                  <option className="bg-white text-black">Press / Media</option>
                  <option className="bg-white text-black">General Support</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-[10px] sm:text-xs uppercase tracking-widest text-black/70 font-bold mb-1.5 sm:mb-2">Message</label>
                <textarea id="contact-message" name="message" rows={4} required className="w-full bg-neutral-50 border-2 border-neutral-300 shadow-[3px_3px_0_0_rgba(220,38,38,1)] sm:shadow-[4px_4px_0_0_rgba(220,38,38,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] px-3 sm:px-4 py-2.5 sm:py-3 text-black text-sm focus:outline-none focus:border-red-600 transition-colors resize-none"></textarea>
              </div>
              <button className="w-full group flex justify-center items-center gap-3 bg-red-600 px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-white transition-all mt-4 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
                SEND IT
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            </form>
            )}
          </div>

          {/* Right Column: Contact Info */}
          <div className="flex flex-col gap-6 sm:gap-10">
            <div>
              <h2 className="font-podium text-2xl sm:text-4xl uppercase tracking-wider text-black dark:text-white mb-4 sm:mb-8">
                Direct Contacts
              </h2>
              <div className="flex flex-col gap-4 sm:gap-6">
                
                <div className="flex items-start gap-4 sm:gap-5 p-4 sm:p-6 bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px] transition-all rounded-sm group">
                  <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-podium text-lg sm:text-xl uppercase text-black mb-0.5 sm:mb-1">Sales & Brands</h3>
                    <p className="text-black/70 text-xs sm:text-sm mb-2 sm:mb-3">Ready to drop that campaign?</p>
                    <a href="mailto:sales@yedzmedia.com" className="text-black hover:text-red-600 transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-red-600" /> sales@yedzmedia.com
                    </a>
                    <Link to="/advertisers" className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 uppercase tracking-widest">
                      Advertiser Info &rarr;
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-5 p-4 sm:p-6 bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px] transition-all rounded-sm group">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-podium text-lg sm:text-xl uppercase text-black mb-0.5 sm:mb-1">Retail Partners</h3>
                    <p className="text-black/70 text-xs sm:text-sm mb-2 sm:mb-3">Secure the bag with your store's audio.</p>
                    <a href="mailto:partners@yedzmedia.com" className="text-black hover:text-red-600 transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-red-600" /> partners@yedzmedia.com
                    </a>
                    <Link to="/partners" className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 uppercase tracking-widest">
                      Partner Program &rarr;
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-5 p-4 sm:p-6 bg-white text-black border-2 border-black shadow-[4px_4px_0_0_rgba(220,38,38,1)] sm:shadow-[8px_8px_0_0_rgba(220,38,38,1)] hover:shadow-[2px_2px_0_0_rgba(220,38,38,1)] hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px] transition-all rounded-sm group">
                  <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-podium text-lg sm:text-xl uppercase text-black mb-0.5 sm:mb-1">General Support</h3>
                    <p className="text-black/70 text-xs sm:text-sm mb-2 sm:mb-3">Need help with our platform?</p>
                    <a href="mailto:support@yedzmedia.com" className="text-black hover:text-red-600 transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 mb-1.5 sm:mb-2">
                      <Mail className="h-4 w-4 text-red-600" /> support@yedzmedia.com
                    </a>
                    <a href="tel:+18005551234" className="text-black hover:text-red-600 transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-red-600" /> +1 (800) 555-1234
                    </a>
                    <Link to="/platform" className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 uppercase tracking-widest">
                      Platform Architecture &rarr;
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            <div>
              <h2 className="font-podium text-2xl uppercase tracking-wider text-black dark:text-white mb-6">
                Headquarters
              </h2>
              <div className="relative h-64 bg-black border-2 border-black dark:border-white/20 shadow-[8px_8px_0_0_rgba(220,38,38,1)] flex items-end justify-center overflow-hidden group rounded-sm">
                <iframe 
                  title="HQ Location"
                  className="absolute inset-0 w-full h-full z-0 opacity-60 group-hover:opacity-85 grayscale group-hover:grayscale-0 transition-all duration-700"
                  src="https://maps.google.com/maps?q=Nottingham,%20UK&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none z-10"></div>
                
                <div className="relative z-20 flex flex-col items-center text-center p-6 pointer-events-none">
                  <MapPin className="h-8 w-8 text-red-500 mb-2 group-hover:-translate-y-1 transition-transform drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                  <p className="text-white font-bold text-lg tracking-wider">NOTTINGHAM</p>
                  <p className="text-white/80 text-sm font-medium">United Kingdom</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
