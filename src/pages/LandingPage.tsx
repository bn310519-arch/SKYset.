import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, TrendingDown, Star, ArrowRight, Bell, TrendingUp, Sparkles, MessageCircle, BookOpen, Sun, Compass, Mountain, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../lib/store';
import { getDestinationRecommendations } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../contexts/CurrencyContext';
import Logo from '../components/Logo';
import Fuse from 'fuse.js';

const QUICK_SUGGESTIONS = [
  { 
    name: 'Amalfi Coast, Italy', 
    category: 'Coastal Elegance',
    image: 'https://images.unsplash.com/photo-1533903345306-15d1c30952de?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Kyoto, Japan', 
    category: 'Cultural Sanctuary',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Swiss Alps, Switzerland', 
    category: 'Alpine Luxury',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Bora Bora, French Polynesia', 
    category: 'Hidden Paradise',
    image: 'https://images.unsplash.com/photo-1532408840511-2244837882bd?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Maasai Mara, Kenya', 
    category: 'Wild Majesty',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Santorini, Greece', 
    category: 'Indigo Dreams',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Dubai, UAE',
    category: 'Futuristic Luxury',
    image: 'https://images.unsplash.com/photo-1582719478237-7756f343949f?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Paris, France',
    category: 'Eternal Romance',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Mumbai, India',
    category: 'City of Dreams',
    image: 'https://images.unsplash.com/photo-1566552881560-0be11481b4d0?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Hampi, India',
    category: 'Lost Empire',
    image: 'https://images.unsplash.com/photo-1544070078-a212eda27b49?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Coorg, India',
    category: 'Coffee Highlands',
    image: 'https://images.unsplash.com/photo-1636124795773-6987747e9282?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Gokarna, India',
    category: 'Spiritual Coast',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Honnavara, India',
    category: 'Mangrove Magic',
    image: 'https://images.unsplash.com/photo-1616239775080-60b73059437b?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Chikmagalur, India',
    category: 'Coffee Estates',
    image: 'https://images.unsplash.com/photo-1590483734731-0cc09ae74641?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Mahabaleshwar, India',
    category: 'Western Ghats',
    image: 'https://images.unsplash.com/photo-1626019914751-61019d453675?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Mysuru, India',
    category: 'Royal Heritage',
    image: 'https://images.unsplash.com/photo-1621021481146-f9479b1df0da?auto=format&fit=crop&q=80&w=800'
  }
];

const DEST_IMAGES: Record<string, string> = {
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200',
  'maldives': 'https://images.unsplash.com/photo-1514282401347-d1f67f7242bb?auto=format&fit=crop&q=80&w=1200',
  'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1200',
  'swiss alps': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200',
  'amalfi': 'https://images.unsplash.com/photo-1533903345306-15d1c30952de?auto=format&fit=crop&q=80&w=1200',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=1200',
  'hampi': 'https://images.unsplash.com/photo-1581333100576-b73bbe79a05f?q=80&w=1200&auto=format&fit=crop',
  'mysuru': 'https://images.unsplash.com/photo-1621021481146-f9479b1df0da?auto=format&fit=crop&q=80&w=1200',
  'mysore': 'https://images.unsplash.com/photo-1621021481146-f9479b1df0da?auto=format&fit=crop&q=80&w=1200',
  'coorg': 'https://images.unsplash.com/photo-1636124795773-6987747e9282?auto=format&fit=crop&q=80&w=1200',
  'gokarna': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200',
  'chikmagalur': 'https://images.unsplash.com/photo-1600100397608-f40078eb076a?q=80&w=1200&auto=format&fit=crop',
  'mahabaleshwar': 'https://images.unsplash.com/photo-1626019914751-61019d453675?auto=format&fit=crop&q=80&w=1200',
  'agumbe': 'https://images.unsplash.com/photo-1582201942981-d3e72ec504c3?auto=format&fit=crop&q=80&w=1200',
  'bandipur': 'https://images.unsplash.com/photo-1604537466158-719b1972edd8?auto=format&fit=crop&q=80&w=1200',
  'kabini': 'https://images.unsplash.com/photo-1591942001358-132d9dbd7675?auto=format&fit=crop&q=80&w=1200',
  'honnavara': 'https://images.unsplash.com/photo-1616239775080-60b73059437b?auto=format&fit=crop&q=80&w=1200',
  'mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=1200&auto=format&fit=crop',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
  'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
  'safari': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
  'jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop',
  'udaipur': 'https://images.unsplash.com/photo-1596436889106-be35e843f9b4?auto=format&fit=crop&q=80&w=1200',
  'manali': 'https://images.unsplash.com/photo-1563293750-2c9680b512b2?auto=format&fit=crop&q=80&w=1200',
  'munnar': 'https://images.unsplash.com/photo-1590483734731-0cc09ae74641?q=80&w=1200&auto=format&fit=crop',
  'kerala': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200',
  'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1200',
  'amritsar': 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=1200',
  'varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1200',
  'leadenhall': 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=1200',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1200',
  'singapore': 'https://images.unsplash.com/photo-1525625230556-8e8dc4486660?auto=format&fit=crop&q=80&w=1200',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1200',
  'venice': 'https://images.unsplash.com/photo-1523906834658-6e24ef23a67e?auto=format&fit=crop&q=80&w=1200'
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { searchHistory, addSearch } = useStore();
  const { formatPrice } = useCurrency();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickRecs, setShowQuickRecs] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // Fuse instance with even more permissive threshold for better fuzzy matches
  const fuse = useMemo(() => new Fuse(QUICK_SUGGESTIONS, {
    keys: ['name', 'category'],
    threshold: 0.5,
    distance: 100,
    minMatchCharLength: 1,
    includeMatches: true
  }), []);

  const filteredSuggestions = useMemo(() => {
    if (searchQuery.trim() === '') {
      return QUICK_SUGGESTIONS;
    }
    const results = fuse.search(searchQuery);
    return results.length > 0 ? results.map(result => result.item) : [];
  }, [searchQuery, fuse]);

  // Slideshow logic
  useEffect(() => {
    if (showQuickRecs && searchQuery.trim() === '') {
      const interval = setInterval(() => {
        setSlideshowIndex((prev) => (prev + 1) % QUICK_SUGGESTIONS.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showQuickRecs, searchQuery]);

  useEffect(() => {
    async function loadRecs() {
      if (searchHistory.length > 0) {
        setIsLoading(true);
        const recs = await getDestinationRecommendations(searchHistory);
        setRecommendations(recs);
        setIsLoading(false);
      }
    }
    loadRecs();
  }, [searchHistory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearch(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img 
              key={QUICK_SUGGESTIONS[slideshowIndex].image}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.8, scale: 1.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              src={QUICK_SUGGESTIONS[slideshowIndex].image} 
              className="w-full h-full object-cover"
              alt="Destination background"
              crossOrigin="anonymous"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469442232813-7f9f50ee0434?q=80&w=1200&auto=format&fit=crop';
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#fafafa]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="luxury-text text-6xl md:text-9xl mb-8 leading-tight tracking-tighter text-black"
          >
            YOUR NEXT <br /> <span className="text-luxury-gold italic">JOURNEY</span>
          </motion.h1>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="glass-panel p-2 rounded-full flex items-center gap-2 bg-white/90 shadow-2xl relative z-20">
              <form onSubmit={handleSearch} className="flex-grow flex items-center px-6 gap-4">
                <Search className="text-black/20 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Where do you want to go?" 
                  className="bg-transparent border-none outline-none w-full py-4 text-lg font-light tracking-wide focus:ring-0 text-black placeholder:text-black/30"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!showQuickRecs) setShowQuickRecs(true);
                  }}
                  onFocus={() => setShowQuickRecs(true)}
                  onBlur={() => setTimeout(() => setShowQuickRecs(false), 200)}
                />
              </form>
              <button 
                type="submit"
                onClick={handleSearch}
                className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold transition-colors"
                id="hero-explore-submit"
              >
                Explore
              </button>
            </div>

            <AnimatePresence>
              {showQuickRecs && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute left-0 right-0 top-full mt-4 bg-white/95 backdrop-blur-2xl border border-black/5 rounded-[2.5rem] p-8 shadow-2xl z-50 text-left"
                >
                  <div className="flex items-center justify-between mb-6 border-b border-black/5 pb-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Bespoke Suggestions</h4>
                    {searchQuery === '' && (
                        <div className="flex gap-1">
                            {QUICK_SUGGESTIONS.map((_, i) => (
                                <div key={i} className={`w-1 h-1 rounded-full transition-all duration-500 ${i === slideshowIndex ? 'bg-luxury-gold w-3' : 'bg-black/10'}`} />
                            ))}
                        </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSuggestions.length > 0 ? (
                      // If it's a slideshow, we might want to highlight the current one when empty
                      filteredSuggestions.map((s, idx) => (
                        <button
                          key={s.name}
                          onClick={() => {
                            setSearchQuery(s.name);
                            navigate(`/search?q=${encodeURIComponent(s.name)}`);
                          }}
                          className={`flex items-center gap-4 p-3 rounded-2xl transition-all group relative overflow-hidden ${searchQuery === '' && idx === slideshowIndex ? 'bg-black text-white scale-[1.02] shadow-xl' : 'bg-black/5 hover:bg-black hover:text-white'}`}
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img 
                              src={s.image} 
                              className="w-full h-full object-cover" 
                              alt={s.name} 
                              crossOrigin="anonymous"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469442232813-7f9f50ee0434?q=80&w=800'; }}
                            />
                          </div>
                          <div className="flex-grow">
                            <span className="block text-xs font-bold uppercase tracking-widest text-left">{s.name}</span>
                            <span className={`text-[8px] font-light uppercase tracking-widest transition-colors ${searchQuery === '' && idx === slideshowIndex ? 'text-luxury-gold' : 'text-black/40 group-hover:text-luxury-gold'}`}>{s.category}</span>
                          </div>
                          <ArrowRight className={`w-4 h-4 text-luxury-gold transition-all ${searchQuery === '' && idx === slideshowIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center flex flex-col items-center gap-4">
                        <Compass className="w-8 h-8 text-black/10 animate-spin-slow" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">No matching sanctuaries found</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 self-center mr-2">Trending:</span>
            {['Maldives', 'Paris', 'Tokyo', 'Dubai', 'Santorini'].map(dest => (
                <button 
                  key={dest}
                  onClick={() => {
                    setSearchQuery(dest);
                    navigate(`/search?q=${encodeURIComponent(dest)}`);
                  }}
                  className="px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/60 hover:bg-black hover:text-white transition-all"
                >
                  {dest}
                </button>
            ))}
          </motion.div>
        </div>
      </section>

      {searchHistory.length > 0 && (
        <section className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="luxury-text text-4xl mb-2 italic text-black">AI Trip Recommendations</h2>
              <p className="text-black/40 uppercase tracking-[0.3em] text-[10px] font-bold">Based on your search history</p>
            </div>
            {isLoading && <p className="text-xs animate-pulse text-black/40">Curating destinations...</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.length > 0 ? (
              recommendations.map((dest, i) => (
                <DestinationCard key={dest.id} dest={dest} index={i} />
              ))
            ) : (
                [1,2,3].map(i => <div key={i} className="h-[400px] bg-black/5 rounded-3xl animate-pulse" />)
            )}
          </div>
        </section>
      )}

      {/* Featured Deals */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b border-black/5 pb-6">
          <h2 className="luxury-text text-4xl text-black">Exclusive <span className="text-luxury-gold">Deals</span></h2>
          <div className="bg-luxury-gold/10 text-luxury-gold px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
             < Bell className="w-3 h-3" /> Real-time Updates
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TravelDeal 
            image="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200" 
            title="Tokyo Nights: 5-Star Sanctuary"
            price={formatPrice(1240)}
            numericPrice={1240}
            discount="-25%"
            tag="HOTEL"
            type="hotel"
            id="hotel-tokyo-deal"
            location="Tokyo, Japan"
          />
          <TravelDeal 
            image="https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=1200" 
            title="Emirates: Luxury to Dubai"
            price={formatPrice(860)}
            numericPrice={860}
            discount="-15%"
            tag="FLIGHT"
            type="flight"
            id="flight-dubai-deal"
            to="Dubai, UAE"
          />
        </div>
      </section>

      {/* Loyalty Program Teaser */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-24 bg-luxury-gold/5 rounded-[4rem] text-center border border-luxury-gold/5">
        <TrendingUp className="w-12 h-12 text-luxury-gold mx-auto mb-6" />
        <div className="flex flex-col items-center mb-6">
          <Logo textSize="text-5xl" iconSize={48} />
          <span className="luxury-text text-4xl italic text-black/60 -mt-2">Elite</span>
        </div>
        <p className="max-w-2xl mx-auto text-black/60 mb-10 leading-relaxed font-light">
          Join our curated loyalty program. Earn points on every booking, unlock hidden suites, and enjoy complimentary chauffeur services worldwide.
        </p>
        <button className="border border-black text-black px-12 py-5 rounded-full uppercase tracking-[0.2em] text-xs font-bold hover:bg-black hover:text-white transition-all">
          Explore Benefits
        </button>
      </section>
    </div>
  );
}

function DestinationCard({ dest, index }: { dest: any; index: number; [key: string]: any }) {
  const navigate = useNavigate();
  
  // High-quality Fallback images for common destinations
  const getDestImage = (name: string) => {
    const key = Object.keys(DEST_IMAGES).find(k => name.toLowerCase().includes(k.toLowerCase()));
    if (key) return DEST_IMAGES[key];
    
    // Generic fallback based on keywords if no exact match
    if (name.toLowerCase().includes('beach') || name.toLowerCase().includes('coast')) 
      return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200';
    if (name.toLowerCase().includes('mountain') || name.toLowerCase().includes('trek')) 
      return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200';
    if (name.toLowerCase().includes('temple') || name.toLowerCase().includes('heritage')) 
      return 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1200';

    return 'https://images.unsplash.com/photo-1500835595561-82a0c6499f5a?auto=format&fit=crop&q=80&w=1200';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/search?q=${encodeURIComponent(dest.name)}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-6">
        <img 
          src={getDestImage(dest.name)} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={dest.name}
          crossOrigin="anonymous"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469442232813-7f9f50ee0434?q=80&w=1200&auto=format&fit=crop';
          }}
        />
        <div className="absolute top-6 left-6 flex flex-col gap-2">
            {dest.highlights?.slice(0, 2).map((h: string) => (
                <span key={h} className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold text-white">
                    {h}
                </span>
            ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="luxury-text text-2xl group-hover:text-luxury-gold transition-colors text-black">{dest.name}</h3>
          <div className="flex items-center gap-1 text-sm text-luxury-gold">
            <Star className="w-4 h-4 fill-current" />
            <span>5.0</span>
          </div>
        </div>
        <p className="text-black/40 text-sm font-light leading-relaxed line-clamp-2">{dest.description}</p>
      </div>
    </motion.div>
  );
}

function TravelDeal({ image, title, price, numericPrice, discount, tag, type, id, location, to }: any) {
  const navigate = useNavigate();
  
  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams({
      type,
      id,
      name: title,
      price: numericPrice.toString(),
    });
    if (location) params.append('location', location);
    if (to) params.append('to', to);
    
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <div 
      className="glass-panel group cursor-pointer flex flex-col md:flex-row rounded-[2.5rem] overflow-hidden h-[280px]"
      onClick={handleBook}
    >
      <div className="md:w-1/2 overflow-hidden h-full">
        <img 
          src={image} 
          className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 group-hover:scale-105" 
          alt={title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469442232813-7f9f50ee0434?q=80&w=800&auto=format&fit=crop';
          }}
        />
      </div>
      <div className="md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-luxury-gold uppercase block mb-4">{tag}</span>
          <h3 className="luxury-text text-xl mb-2 text-black">{title}</h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-light text-black">{price}</span>
            <span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold">{discount}</span>
          </div>
        </div>
        <button 
          onClick={handleBook}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all text-black hover:text-luxury-gold"
        >
          Book Event <ArrowRight className="w-4 h-4 text-luxury-gold" />
        </button>
      </div>
    </div>
  )
}
