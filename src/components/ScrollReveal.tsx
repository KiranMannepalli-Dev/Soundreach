import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  animationClass?: string;
  className?: string;
}

export default function ScrollReveal({ children, animationClass = 'animate-fade-up', className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} ${isVisible ? animationClass : 'opacity-0'}`}>
      {children}
    </div>
  );
}
