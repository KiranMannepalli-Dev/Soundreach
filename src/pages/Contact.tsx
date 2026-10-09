import { useState } from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, MessageSquare, Briefcase, HelpCircle, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="pb-10 lg:pb-20 overflow-hidden">
      
      {/* Contact Header */}
      <section className="relative px-6 sm:px-10 lg:px-16 pt-28 lg:pt-32 mb-8 lg:mb-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="animate-scale-glow font-podium uppercase leading-[0.9] tracking-tight text-white text-6xl sm:text-7xl lg:text-9xl mb-6">
            Hit Us <span className="bg-gradient-to-r from-red-500 to-rose-700 bg-clip-text text-transparent">Up</span>
          </h1>
          <p className="max-w-2xl mx-auto font-inter text-lg text-white/70">
            Whether you're a brand ready to drop a fire campaign, or a retailer trying to secure the bag with your store's audio, our squad is ready.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-6 sm:px-10 lg:px-16 mb-10 lg:mb-24 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Left Column: Form */}
          <div>
            <h2 className="font-podium text-3xl sm:text-4xl uppercase tracking-wider text-white mb-8">
              Drop a Message
            </h2>
            {isSubmitted ? (
              <div className="bg-white border border-black/10 shadow-lg p-8 sm:p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="font-podium text-3xl uppercase tracking-wider text-black">
                  Message Sent!
                </h3>
                <p className="text-black/70 font-inter max-w-sm">
                  We've received your details and our team will get back to you shortly. Get ready to turn up the volume on your campaigns!
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-sm uppercase tracking-widest text-red-600 hover:text-red-700 font-bold transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="bg-white border border-black/10 shadow-lg p-8 sm:p-10 space-y-6" onSubmit={handleSubmit}>
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
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Work Email</label>
                <input type="email" className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Subject</label>
                <select className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors appearance-none">
                  <option>Advertiser Inquiry</option>
                  <option>Retail Partnership</option>
                  <option>Press / Media</option>
                  <option>General Support</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Message</label>
                <textarea rows={5} className="w-full bg-neutral-50 border border-black/10 px-4 py-3 text-black focus:outline-none focus:border-red-600 transition-colors resize-none"></textarea>
              </div>
              <button className="w-full group flex justify-center items-center gap-3 bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-red-700 mt-4 shadow-[0_0_30px_-5px_rgba(220,38,38,0.3)]">
                SEND IT
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            </form>
            )}
          </div>

          {/* Right Column: Contact Info */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-podium text-3xl sm:text-4xl uppercase tracking-wider text-white mb-8">
                Direct Contacts
              </h2>
              <div className="flex flex-col gap-6">
                
                <div className="flex items-start gap-5 p-6 bg-white border border-black/10 shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1 transition-all rounded-sm group">
                  <Briefcase className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <h3 className="font-podium text-xl uppercase text-black mb-1">Sales & Brands</h3>
                    <p className="text-black/60 text-sm mb-3">Ready to drop that campaign?</p>
                    <a href="mailto:sales@soundreach.com" className="text-black hover:text-red-600 transition-colors text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" /> sales@soundreach.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-white border border-black/10 shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1 transition-all rounded-sm group">
                  <MessageSquare className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <h3 className="font-podium text-xl uppercase text-black mb-1">Retail Partners</h3>
                    <p className="text-black/60 text-sm mb-3">Secure the bag with your store's audio.</p>
                    <a href="mailto:partners@soundreach.com" className="text-black hover:text-red-600 transition-colors text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" /> partners@soundreach.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-white border border-black/10 shadow-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1 transition-all rounded-sm group">
                  <HelpCircle className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <h3 className="font-podium text-xl uppercase text-black mb-1">General Support</h3>
                    <p className="text-black/60 text-sm mb-3">Need help with our platform?</p>
                    <a href="mailto:support@soundreach.com" className="text-black hover:text-red-600 transition-colors text-sm font-medium flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" /> support@soundreach.com
                    </a>
                    <a href="tel:+18005551234" className="text-black hover:text-red-600 transition-colors text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" /> +1 (800) 555-1234
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <div>
              <h2 className="font-podium text-2xl uppercase tracking-wider text-white mb-6">
                Headquarters
              </h2>
              <div className="relative h-64 bg-neutral-950 border border-white/10 flex items-end justify-center overflow-hidden group rounded-sm">
                <iframe 
                  title="HQ Location"
                  className="absolute inset-0 w-full h-full z-0 opacity-50 group-hover:opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700"
                  src="https://maps.google.com/maps?q=Nottingham,%20UK&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none z-10"></div>
                
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
