
import React from 'react';

// WCAG 2.2 Accessibility utilities and constants
export const WCAG_COLORS = {
  // High contrast colors meeting WCAG AA standards (4.5:1 ratio)
  primary: {
    light: '#0066CC', // 4.5:1 on white
    dark: '#4A9EFF', // 4.5:1 on dark backgrounds
  },
  success: {
    light: '#047857', // Green with sufficient contrast
    dark: '#10B981',
  },
  warning: {
    light: '#B45309', // Orange with sufficient contrast  
    dark: '#F59E0B',
  },
  danger: {
    light: '#DC2626', // Red with sufficient contrast
    dark: '#EF4444',
  },
  neutral: {
    light: '#374151', // Gray with sufficient contrast
    dark: '#9CA3AF',
  }
};

export const FOCUS_STYLES = {
  // WCAG 2.4.7 & 2.4.13 compliant focus indicators
  ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  contrast: 'focus-visible:ring-opacity-100', // Ensure high contrast
  size: 'focus-visible:ring-[3px]', // Minimum 3px for visibility
};

export const TOUCH_TARGET_SIZE = {
  // WCAG 2.5.8 - Minimum 24x24px target size
  minimum: 'min-h-[44px] min-w-[44px]', // 44px for better mobile experience
  recommended: 'min-h-[48px] min-w-[48px]',
};

export const MOTION_PREFERENCES = {
  // Respect user's motion preferences
  reduced: 'motion-reduce:transition-none motion-reduce:animate-none',
  safe: 'motion-safe:transition-all motion-safe:duration-300',
};

// Skip link component for keyboard navigation
export const SkipLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-primary-foreground px-4 py-2 z-50 rounded-br-lg font-medium"
  >
    {children}
  </a>
);

// High contrast mode detection
export const useHighContrastMode = () => {
  const [isHighContrast, setIsHighContrast] = React.useState(false);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return isHighContrast;
};

// Reduced motion detection
export const useReducedMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = React.useState(false);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return shouldReduceMotion;
};

export default {
  WCAG_COLORS,
  FOCUS_STYLES,
  TOUCH_TARGET_SIZE,
  MOTION_PREFERENCES,
  SkipLink,
  useHighContrastMode,
  useReducedMotion,
};
