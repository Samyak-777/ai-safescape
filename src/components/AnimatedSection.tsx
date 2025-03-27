
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: 'near' | 'medium' | 'far';
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  duration?: 'fast' | 'normal' | 'slow';
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  delay = 0,
  distance = 'medium',
  direction = 'up',
  threshold = 0.2,
  duration = 'normal',
  easing = 'ease-out',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const distanceValues = {
    near: '10px',
    medium: '20px',
    far: '40px',
  };

  const durationValues = {
    fast: '0.4s',
    normal: '0.8s',
    slow: '1.2s',
  };

  const getTransform = () => {
    switch (direction) {
      case 'up': return `translateY(${distanceValues[distance]})`;
      case 'down': return `translateY(-${distanceValues[distance]})`;
      case 'left': return `translateX(${distanceValues[distance]})`;
      case 'right': return `translateX(-${distanceValues[distance]})`;
      case 'none': return 'none';
      default: return `translateY(${distanceValues[distance]})`;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={sectionRef}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getTransform(),
        transition: `opacity ${durationValues[duration]} ${easing} ${delay}s, transform ${durationValues[duration]} ${easing} ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
