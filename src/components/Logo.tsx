import React from 'react';
import { Plane } from 'lucide-react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  white?: boolean;
}

export default function Logo({ className = "", iconSize = 32, textSize = "text-2xl", white = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative flex items-center justify-center">
        <motion.div
           whileHover={{ rotate: 15, scale: 1.1 }}
           className="relative z-10"
        >
          <Plane 
            size={iconSize} 
            className={`${white ? 'text-white' : 'text-luxury-gold'} transition-colors`} 
          />
        </motion.div>
        <div className={`absolute inset-0 blur-lg opacity-20 ${white ? 'bg-white' : 'bg-luxury-gold'}`} />
      </div>
      
      <div className={`flex items-baseline tracking-tighter ${textSize}`}>
        <span className={`font-black uppercase ${white ? 'text-white' : 'text-black'}`}>
          Sky
        </span>
        <span className="text-luxury-gold font-light italic -ml-0.5 serif">
          set
        </span>
        <div className="w-1 h-1 rounded-full bg-luxury-gold ml-1" />
      </div>
    </div>
  );
}
