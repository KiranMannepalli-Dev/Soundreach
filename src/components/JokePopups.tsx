import { useState, useEffect } from 'react';
import { Volume2, X } from 'lucide-react';

const JOKES = [
  "Did you know? Customers can't close their ears. We checked. (Biology = 1, Ad Blockers = 0)",
  "ERROR: Shopper reaching for generic brand. Deploying targeted audio ad in aisle 4...",
  "Are you still relying on digital banners? It's 2026. Everyone has ad blindness.",
  "Warning: Unskippable ROI detected. Your accounting department might need a minute.",
  "Fact: 99% of shoppers vibe to our background music. The other 1% are just boring.",
  "You cannot skip this pop-up... just like you can't skip an in-store audio ad. Checkmate.",
  "Your cart is empty. Please proceed to the nearest speaker to be influenced.",
  "Alert: Someone just fast-forwarded a podcast ad. Good thing in-store audio doesn't have a skip button!"
];

export default function JokePopups() {
  const [currentJoke, setCurrentJoke] = useState<string | null>(null);

  useEffect(() => {
    // Wait a bit before showing the first one, then show periodically
    const timer = setTimeout(() => {
      showNextJoke();
      
      const interval = setInterval(() => {
        showNextJoke();
      }, 15000); // Show a new joke every 15 seconds
      
      return () => clearInterval(interval);
    }, 5000); // Initial 5 second delay

    return () => clearTimeout(timer);
  }, []);

  const showNextJoke = () => {
    const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
    setCurrentJoke(randomJoke);
    
    // Auto hide after 6 seconds
    setTimeout(() => {
      setCurrentJoke(null);
    }, 6000);
  };

  if (!currentJoke) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[1000] w-auto sm:w-80 bg-white border border-black/10 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.3)] p-4 sm:p-5 animate-fade-up rounded-sm transition-all duration-500">
      <div className="flex gap-3 sm:gap-4">
        <div className="bg-red-600/10 p-2 sm:p-2.5 h-fit rounded-full shrink-0">
          <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-black font-podium uppercase tracking-widest text-sm">Truth Alert</h4>
            <button onClick={() => setCurrentJoke(null)} className="text-black/30 hover:text-black transition-colors -mt-1 -mr-1 p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-black/70 text-sm font-inter leading-relaxed">
            {currentJoke}
          </p>
        </div>
      </div>
    </div>
  );
}
