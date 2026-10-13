import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-neutral-950 border-2 border-black dark:border-white/20 shadow-[8px_8px_0_0_rgba(220,38,38,1)] w-full max-w-3xl max-h-[85vh] flex flex-col animate-fade-up-delay-1 overflow-hidden transition-colors duration-300">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-black/10 dark:border-white/10 relative z-10">
          <h2 className="font-podium text-2xl sm:text-3xl uppercase tracking-wider text-black dark:text-white">
            {title}
          </h2>
          <button 
            onClick={onClose}
            aria-label="Close Modal"
            className="p-2 text-black/50 dark:text-white/50 hover:text-red-600 dark:hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto relative z-10 font-inter text-sm text-black/80 dark:text-white/80 space-y-6 leading-relaxed flex-1">
          {children}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-black/10 dark:border-white/10 relative z-10 flex justify-end bg-neutral-50 dark:bg-neutral-900">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-black dark:bg-red-600 hover:bg-neutral-800 dark:hover:bg-red-700 text-white text-sm font-bold uppercase tracking-widest transition-colors cursor-pointer border-2 border-black dark:border-white/20 shadow-[3px_3px_0_0_rgba(220,38,38,1)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
