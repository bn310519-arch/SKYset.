import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, RefreshCcw, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function CurrencyWeather({ destination }: { destination?: string }) {
  const [rate, setRate] = useState(1.08); // Mock USD to EUR
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isRefreshing) {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  }, [isRefreshing]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-1 glass-panel rounded-3xl w-fit">
      {/* Weather */}
      <div className="flex items-center gap-4 px-6 py-3 border-r border-white/10 last:border-0">
        <div className="text-luxury-gold">
          <Sun className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="text-xl font-bold tracking-tighter">24°C</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{destination || 'Local'} • Sunny</div>
        </div>
      </div>

      {/* Currency */}
      <div className="flex items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2">
            <div className="flex flex-col">
                <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">USD / EUR</span>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tighter">{rate.toFixed(2)}</span>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                </div>
            </div>
        </div>
        <button 
           onClick={() => {
               setIsRefreshing(true);
               setRate(r => r + (Math.random() - 0.5) * 0.01);
           }}
           className={`p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCcw className="w-4 h-4 text-white/40" />
        </button>
      </div>
    </div>
  );
}
