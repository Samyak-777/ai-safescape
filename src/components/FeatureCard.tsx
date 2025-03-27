
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedSection from './AnimatedSection';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon,
  className,
  delay = 0
}) => {
  return (
    <AnimatedSection 
      className={cn(
        "glass-card glass-hover rounded-2xl p-6 flex flex-col h-full", 
        className
      )}
      delay={delay}
    >
      <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
    </AnimatedSection>
  );
};

export default FeatureCard;
