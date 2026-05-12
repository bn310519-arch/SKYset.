import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, Hotel, MapPin, Filter, Star, Clock, AlertCircle, ShoppingBag, ArrowRightLeft, Search, ChevronDown, Wifi, Waves, Dumbbell, Coffee, Car, Utensils, Calendar as CalendarIcon, User, Layers, Sparkles, Film, Ticket, Clapperboard, Tv, ArrowRight, BookOpen, Sun, MessageCircle, TrendingUp, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../contexts/CurrencyContext';
import { getPersonaInsights } from '../lib/gemini';
import Fuse from 'fuse.js';

const LOCATIONS = [
  // INDIA
  'Mumbai (BOM), India',
  'New Delhi (DEL), India',
  'Bengaluru (BLR), India',
  'Chennai (MAA), India',
  'Hyderabad (HYD), India',
  'Kolkata (CCU), India',
  'Goa (GOI), India',
  'North Goa (GOX), India',
  'Kochi (COK), India',
  'Ahmedabad (AMD), India',
  'Jaipur (JAI), India',
  'Pune (PNQ), India',
  'Lucknow (LKO), India',
  'Thiruvananthapuram (TRV), India',
  'Guwahati (GAU), India',
  'Indore (IDR), India',
  'Bhubaneswar (BBI), India',
  'Chandigarh (IXC), India',
  'Srinagar (SXR), India',
  'Amritsar (ATQ), India',
  'Varanasi (VNS), India',
  'Patna (PAT), India',
  'Coimbatore (CJB), India',
  'Visakhapatnam (VTZ), India',
  'Surat (STV), India',
  'Nagpur (NAG), India',
  'Vadodara (BDQ), India',
  'Rajkot (RAJ), India',
  'Mangaluru (IXE), India',
  'Kozhikode (CCJ), India',
  'Kannur (CNN), India',
  'Madurai (IXM), India',
  'Tiruchirappalli (TRZ), India',
  'Bhopal (BHO), India',
  'Jodhpur (JDH), India',
  'Udaipur (UDR), India',
  'Dehradun (DED), India',
  'Bagdogra (IXB), India',
  'Ranchi (IXR), India',
  'Raipur (RPR), India',
  'Port Blair (IXZ), India',
  'Leh (IXL), India',
  'Jammu (IXJ), India',
  'Agartala (IXA), India',
  'Imphal (IMF), India',
  'Shillong (SHL), India',
  'Aizawl (AJL), India',
  'Dimapur (DMU), India',
  'Itanagar (HGI), India',
  'Gaya (GAY), India',
  'Aurangabad (IXU), India',
  'Vijayawada (VGA), India',
  'Tirupati (TIR), India',
  'Gorakhpur (GOP), India',
  'Allahabad (IXD), India',
  'Jabalpur (JLR), India',
  'Rajkot (RAJ), India',
  'Shirdi (SAG), India',
  'Kushinagar (KBK), India',

  // EUROPE
  'London (LHR), UK',
  'London (LGW), UK',
  'London (STN), UK',
  'Manchester (MAN), UK',
  'Edinburgh (EDI), UK',
  'Birmingham (BHX), UK',
  'Paris (CDG), France',
  'Paris (ORY), France',
  'Nice (NCE), France',
  'Lyon (LYS), France',
  'Marseille (MRS), France',
  'Frankfurt (FRA), Germany',
  'Munich (MUC), Germany',
  'Berlin (BER), Germany',
  'Hamburg (HAM), Germany',
  'Dusseldorf (DUS), Germany',
  'Amsterdam (AMS), Netherlands',
  'Brussels (BRU), Belgium',
  'Zurich (ZRH), Switzerland',
  'Geneva (GVA), Switzerland',
  'Vienna (VIE), Austria',
  'Rome (FCO), Italy',
  'Milan (MXP), Italy',
  'Venice (VCE), Italy',
  'Florence (FLR), Italy',
  'Madrid (MAD), Spain',
  'Barcelona (BCN), Spain',
  'Malaga (AGP), Spain',
  'Lisbon (LIS), Portugal',
  'Porto (OPO), Portugal',
  'Dublin (DUB), Ireland',
  'Copenhagen (CPH), Denmark',
  'Stockholm (ARN), Sweden',
  'Oslo (OSL), Norway',
  'Helsinki (HEL), Finland',
  'Prague (PRG), Czech Republic',
  'Warsaw (WAW), Poland',
  'Budapest (BUD), Hungary',
  'Athens (ATH), Greece',
  'Istanbul (IST), Turkey',
  'Istanbul (SAW), Turkey',

  // NORTH AMERICA
  'New York (JFK), USA',
  'New York (EWR), USA',
  'New York (LGA), USA',
  'Los Angeles (LAX), USA',
  'San Francisco (SFO), USA',
  'Chicago (ORD), USA',
  'Chicago (MDW), USA',
  'Miami (MIA), USA',
  'Orlando (MCO), USA',
  'Las Vegas (LAS), USA',
  'Seattle (SEA), USA',
  'Atlanta (ATL), USA',
  'Dallas (DFW), USA',
  'Houston (IAH), USA',
  'Boston (BOS), USA',
  'Washington DC (IAD), USA',
  'Washington DC (DCA), USA',
  'Denver (DEN), USA',
  'Phoenix (PHX), USA',
  'Philadelphia (PHL), USA',
  'Toronto (YYZ), Canada',
  'Vancouver (YVR), Canada',
  'Montreal (YUL), Canada',
  'Calgary (YYC), Canada',
  'Mexico City (MEX), Mexico',
  'Cancun (CUN), Mexico',

  // MIDDLE EAST
  'Dubai (DXB), UAE',
  'Abu Dhabi (AUH), UAE',
  'Doha (DOH), Qatar',
  'Riyadh (RUH), Saudi Arabia',
  'Jeddah (JED), Saudi Arabia',
  'Muscat (MCT), Oman',
  'Kuwait City (KWI), Kuwait',
  'Amman (AMM), Jordan',
  'Tel Aviv (TLV), Israel',
  'Beirut (BEY), Lebanon',

  // ASIA & PACIFIC
  'Singapore (SIN)',
  'Bangkok (BKK), Thailand',
  'Phuket (HKT), Thailand',
  'Koh Samui (USM), Thailand',
  'Hong Kong (HKG)',
  'Tokyo (HND), Japan',
  'Tokyo (NRT), Japan',
  'Osaka (KIX), Japan',
  'Kyoto (ITM), Japan',
  'Seoul (ICN), South Korea',
  'Shanghai (PVG), China',
  'Beijing (PEK), China',
  'Guangzhou (CAN), China',
  'Taipei (TPE), Taiwan',
  'Kuala Lumpur (KUL), Malaysia',
  'Bali (DPS), Indonesia',
  'Jakarta (CGK), Indonesia',
  'Manila (MNL), Philippines',
  'Ho Chi Minh City (SGN), Vietnam',
  'Hanoi (HAN), Vietnam',
  'Sydney (SYD), Australia',
  'Melbourne (MEL), Australia',
  'Brisbane (BNE), Australia',
  'Perth (PER), Australia',
  'Auckland (AKL), New Zealand',
  'Christchurch (CHC), New Zealand',

  // SOUTH AMERICA
  'Buenos Aires (EZE), Argentina',
  'São Paulo (GRU), Brazil',
  'Rio de Janeiro (GIG), Brazil',
  'Bogotá (BOG), Colombia',
  'Santiago (SCL), Chile',
  'Lima (LIM), Peru',

  // AFRICA
  'Cairo (CAI), Egypt',
  'Johannesburg (JNB), South Africa',
  'Cape Town (CPT), South Africa',
  'Nairobi (NBO), Kenya',
  'Casablanca (CMN), Morocco',
  'Marrakech (RAK), Morocco',
  'Addis Ababa (ADD), Ethiopia',
  'Mauritius (MRU)',
  'Seychelles (SEZ)',
  'Lagos (LOS), Nigeria'
];

function LocationInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => new Fuse(LOCATIONS, {
    threshold: 0.4,
    distance: 100,
  }), []);

  useEffect(() => {
    if (value.length >= 1) {
      const results = fuse.search(value);
      const filtered = results.map(r => r.item);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, fuse]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCityPhoto = (name: string) => {
    const city = name.split(' (')[0];
    return `https://images.unsplash.com/photo-1500835595561-82a0c6499f5a?auto=format&fit=crop&q=80&w=100&h=100&sig=${city}`;
  };

  return (
    <div className={`flex-grow md:w-1/3 space-y-2 relative ${showSuggestions ? 'z-30' : 'z-10'}`} ref={containerRef}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">{label}</label>
      <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
        <MapPin className="text-luxury-gold w-4 h-4 shrink-0" />
        <input 
          type="text" 
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-sm text-black placeholder:text-black/20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length >= 1 && setShowSuggestions(true)}
        />
      </div>
      <AnimatePresence>
        {showSuggestions && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-black/10 shadow-2xl overflow-hidden max-h-80 overflow-y-auto"
          >
            {suggestions.map(s => (
              <button 
                key={s}
                onClick={() => {
                  onChange(s);
                  setShowSuggestions(false);
                }}
                className="w-full p-3 text-left hover:bg-black/5 transition-colors border-b border-black/5 last:border-0 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/5">
                  <img src={getCityPhoto(s)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={s} referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow">
                  <div className="text-xs font-bold text-black uppercase tracking-tight">{s.split(' (')[0]}</div>
                  <div className="text-[9px] text-black/40 uppercase tracking-widest font-medium">
                    {s.includes(',') ? s.split(',')[1].trim() : s.match(/\((.*?)\)/)?.[1] || 'International'}
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-luxury-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') as 'flights' | 'hotels' | 'activities';
  const { formatPrice } = useCurrency();
  
  const [fromLocation, setFromLocation] = useState('Mumbai (BOM), India');
  const [toLocation, setToLocation] = useState(query || 'London (LHR), UK');
  const [checkIn, setCheckIn] = useState('2026-05-15');
  const [checkOut, setCheckOut] = useState('2026-05-20');

  const calculateNights = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
    // Use UTC for date calculations to avoid timezone issues
    const utc1 = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
    const utc2 = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());
    const diff = utc2 - utc1;
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  const [nights, setNights] = useState(calculateNights(checkIn, checkOut));

  const updateCheckOutByNights = (start: string, n: number) => {
    const s = new Date(start);
    if (isNaN(s.getTime())) return;
    const result = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate() + n));
    setCheckOut(result.toISOString().split('T')[0]);
    setNights(n);
  };

  // Helper to ensure check-out is after check-in
  const handleCheckInChange = (date: string) => {
    setCheckIn(date);
    const n = calculateNights(date, checkOut);
    if (n < 1) {
      updateCheckOutByNights(date, 1);
    } else {
      setNights(n);
    }
  };

  const handleCheckOutChange = (date: string) => {
    setCheckOut(date);
    const n = calculateNights(checkIn, date);
    if (n < 1) {
      const s = new Date(date);
      const prev = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate() - 1));
      setCheckIn(prev.toISOString().split('T')[0]);
      setNights(1);
    } else {
      setNights(n);
    }
  };
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'activities' | 'movies'>(
    initialTab && ['flights', 'hotels', 'activities', 'movies'].includes(initialTab) ? (initialTab as any) : 'flights'
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState<string | null>(null);

  const handleSearch = () => {
    setIsUpdating(true);
    // Simulate a live search fetch
    setTimeout(() => {
      setIsUpdating(false);
      setLastSearchTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1500);
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['flights', 'hotels', 'activities', 'movies'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Filters
  const [hotelFilter, setHotelFilter] = useState<'all' | 'highly-rated' | 'resort' | 'business'>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(1500);
  const [starRating, setStarRating] = useState<number | null>(null);
  const [hotelChain, setHotelChain] = useState<string>('all');
  const [hotelSearch, setHotelSearch] = useState<string>('');
  
  const [activityFilter, setActivityFilter] = useState<'all' | 'wellness' | 'culture' | 'food-drink' | 'adventure'>('all');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  
  const [flightStops, setFlightStops] = useState<'all' | '0' | '1' | '2+'>('all');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [cabinClass, setCabinClass] = useState<'all' | 'economy' | 'business' | 'first'>('all');

  const AIRLINES = ['Emirates', 'Singapore Airlines', 'Lufthansa', 'Qatar Airways', 'British Airways', 'Air India'];

  const handleBookHotel = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsBookingModalOpen(true);
  };

  const handleBookActivity = (activity: any) => {
    setSelectedActivity(activity);
    setIsActivityModalOpen(true);
  };

  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  const handleBookMovie = (movie: any) => {
    setSelectedMovie(movie);
    setIsMovieModalOpen(true);
  };

  const flights = [
    { id: 'EK 202', airline: 'Emirates', from: fromLocation.split(',')[0], to: toLocation.split(',')[0], time: '08:45', price: 840, status: 'On Time', gate: 'A12', stops: 0, departureSlot: 'morning', class: 'first' },
    { id: 'SQ 305', airline: 'Singapore Airlines', from: fromLocation.split(',')[0], to: toLocation.split(',')[0], time: '11:20', price: 1250, status: 'Delayed', gate: 'B4', stops: 1, departureSlot: 'morning', class: 'first' },
    { id: 'LH 400', airline: 'Lufthansa', from: fromLocation.split(',')[0], to: toLocation.split(',')[0], time: '14:15', price: 920, status: 'On Time', gate: 'C2', stops: 0, departureSlot: 'afternoon', class: 'business' },
    { id: 'QR 15', airline: 'Qatar Airways', from: fromLocation.split(',')[0], to: toLocation.split(',')[0], time: '19:30', price: 1100, status: 'On Time', gate: 'D5', stops: 1, departureSlot: 'evening', class: 'business' },
    { id: 'BA 18', airline: 'British Airways', from: fromLocation.split(',')[0], to: toLocation.split(',')[0], time: '22:10', price: 980, status: 'On Time', gate: 'E1', stops: 0, departureSlot: 'evening', class: 'first' },
    { id: 'AI 101', airline: 'Air India', from: fromLocation.split(',')[0], to: toLocation.split(',')[0], time: '06:30', price: 750, status: 'On Time', gate: 'F3', stops: 2, departureSlot: 'morning', class: 'economy' },
    { id: 'EK 204', airline: 'Emirates', from: fromLocation.split(',')[0], to: toLocation.split(',')[0], time: '16:45', price: 650, status: 'On Time', gate: 'A15', stops: 0, departureSlot: 'afternoon', class: 'economy' },
  ];

  const filteredFlights = flights.filter(f => {
    if (flightStops !== 'all') {
      if (flightStops === '0' && f.stops !== 0) return false;
      if (flightStops === '1' && f.stops !== 1) return false;
      if (flightStops === '2+' && f.stops < 2) return false;
    }
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airline)) return false;
    if (timeSlot !== 'all' && f.departureSlot !== timeSlot) return false;
    if (cabinClass !== 'all' && f.class !== cabinClass) return false;
    return true;
  });

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 800);
    return () => clearTimeout(timer);
  }, [fromLocation, toLocation, activeTab]);

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12">
      <div className="flex flex-col gap-8 mb-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
                <h1 className="luxury-text text-5xl mb-4 text-black">Find your <span className="text-luxury-gold italic">Escape</span></h1>
                <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-black/40">
                    <button onClick={() => setActiveTab('flights')} className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${activeTab === 'flights' ? 'border-luxury-gold text-black' : 'border-transparent hover:text-black'}`}>
                        <Plane className="w-4 h-4" /> Flights
                    </button>
                    <button onClick={() => setActiveTab('hotels')} className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${activeTab === 'hotels' ? 'border-luxury-gold text-black' : 'border-transparent hover:text-black'}`}>
                        <Hotel className="w-4 h-4" /> Hotels
                    </button>
                    <button onClick={() => setActiveTab('activities')} className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${activeTab === 'activities' ? 'border-luxury-gold text-black' : 'border-transparent hover:text-black'}`}>
                        <ShoppingBag className="w-4 h-4" /> Activities
                    </button>
                    <button onClick={() => setActiveTab('movies')} className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${activeTab === 'movies' ? 'border-luxury-gold text-black' : 'border-transparent hover:text-black'}`}>
                        <Film className="w-4 h-4" /> Movies
                    </button>
                </div>
            </div>
            
            {activeTab === 'hotels' && (
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mr-2">Filter By:</span>
                    {(['all', 'highly-rated', 'resort', 'business'] as const).map(f => (
                        <button 
                            key={f}
                            onClick={() => setHotelFilter(f)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${hotelFilter === f ? 'bg-black text-white border-black' : 'border-black/5 hover:border-black/20 text-black/40'}`}
                        >
                            {f.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            )}

            {activeTab === 'activities' && (
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mr-2">Experience Type:</span>
                    {(['all', 'wellness', 'culture', 'food-drink', 'adventure'] as const).map(f => (
                        <button 
                            key={f}
                            onClick={() => setActivityFilter(f)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${activityFilter === f ? 'bg-black text-white border-black' : 'border-black/5 hover:border-black/20 text-black/40'}`}
                        >
                            {f.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            )}

            {activeTab === 'movies' && (
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mr-2">Featured Hits:</span>
                    {['Trending', 'New Releases', 'Classic Heritage', 'IMAX Specials'].map(f => (
                        <button 
                            key={f}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all border-black/5 hover:border-black/20 text-black/40`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {activeTab === 'flights' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 bg-white/95 shadow-xl border border-black/5 relative z-20"
          >
            <LocationInput label="Origin" value={fromLocation} onChange={setFromLocation} placeholder="City or Airport" />
            <div className="p-3 bg-black/5 rounded-full mt-4 md:mt-6 shrink-0">
              <ArrowRightLeft className="w-4 h-4 text-black/40" />
            </div>
            <LocationInput label="Destination" value={toLocation} onChange={setToLocation} placeholder="City or Airport" />
            <div className="md:w-px h-12 bg-black/5 mx-2 hidden md:block mt-6 shrink-0" />
            
            <div className="flex-grow w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-1/2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Departure</label>
                <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                  <CalendarIcon className="text-luxury-gold w-4 h-4 shrink-0" />
                  <input type="date" value={checkIn} onChange={(e) => handleCheckInChange(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold text-black w-full" />
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Return</label>
                <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                  <CalendarIcon className="text-luxury-gold w-4 h-4 shrink-0" />
                  <input type="date" value={checkOut} onChange={(e) => handleCheckOutChange(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold text-black w-full" />
                </div>
              </div>
            </div>

            <div className="md:w-px h-12 bg-black/5 mx-2 hidden md:block mt-6 shrink-0" />
            <div className="w-full md:w-auto mt-4 md:mt-6 self-start md:self-end">
              <button 
                onClick={handleSearch}
                disabled={isUpdating}
                className="w-full px-12 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold transition-all shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                {isUpdating ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Clock className="w-4 h-4 text-luxury-gold" />
                    </motion.div>
                    Fetching...
                  </>
                ) : (
                  <>
                    Search <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  </>
                )
                  }
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'hotels' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 bg-white/95 shadow-xl border border-black/5 relative z-20"
          >
            <LocationInput label="Destination" value={toLocation} onChange={setToLocation} placeholder="Where to?" />
            <div className="md:w-px h-12 bg-black/5 mx-2 hidden md:block mt-6" />
            <div className="flex-grow w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-5/12 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Check-In</label>
                <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                  <CalendarIcon className="text-luxury-gold w-4 h-4 shrink-0" />
                  <input type="date" value={checkIn} onChange={(e) => handleCheckInChange(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold text-black w-full" />
                </div>
              </div>
              <div className="w-full md:w-2/12 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Nights</label>
                <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                  <Clock className="text-luxury-gold w-4 h-4 shrink-0" />
                  <select 
                    value={nights} 
                    onChange={(e) => updateCheckOutByNights(checkIn, parseInt(e.target.value))}
                    className="bg-transparent border-none outline-none text-xs font-bold text-black w-full appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Night' : 'Nights'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full md:w-5/12 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Check-Out</label>
                <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                  <CalendarIcon className="text-luxury-gold w-4 h-4 shrink-0" />
                  <input type="date" value={checkOut} onChange={(e) => handleCheckOutChange(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold text-black w-full" />
                </div>
              </div>
            </div>
            <div className="md:w-px h-12 bg-black/5 mx-2 hidden md:block mt-6" />
            <div className="w-full md:w-auto mt-4 md:mt-6 self-start md:self-end">
              <button 
                onClick={handleSearch}
                disabled={isUpdating}
                className="w-full px-12 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold transition-all shadow-lg"
              >
                Find Hotels
              </button>
            </div>
          </motion.div>
        )}
        {activeTab === 'activities' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 bg-white/95 shadow-xl border border-black/5 relative z-20"
          >
            <LocationInput label="Destination" value={toLocation} onChange={setToLocation} placeholder="Where to?" />
            <div className="md:w-px h-12 bg-black/5 mx-2 hidden md:block mt-6" />
            <div className="flex-grow w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-1/2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Date</label>
                <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                  <CalendarIcon className="text-luxury-gold w-4 h-4 shrink-0" />
                  <input type="date" value={checkIn} onChange={(e) => handleCheckInChange(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold text-black w-full" />
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Duration</label>
                <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                  <Clock className="text-luxury-gold w-4 h-4 shrink-0" />
                  <div className="flex items-center gap-2 w-full pr-1">
                    {[1, 2, 3, 5].map(n => (
                        <button 
                            key={n}
                            onClick={() => updateCheckOutByNights(checkIn, n)}
                            className={`flex-grow py-1 rounded-lg text-[9px] font-bold border transition-all ${nights === n ? 'bg-black text-white border-black' : 'bg-transparent border-black/5 text-black/40 hover:border-black/20'}`}
                        >
                            {n}D
                        </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-px h-12 bg-black/5 mx-2 hidden md:block mt-6" />
            <div className="w-full md:w-auto mt-4 md:mt-6 self-start md:self-end">
              <button 
                onClick={handleSearch}
                disabled={isUpdating}
                className="w-full px-12 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold transition-all shadow-lg"
              >
                Find Experiences
              </button>
            </div>
          </motion.div>
        )}
        {activeTab === 'movies' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 bg-white/95 shadow-xl border border-black/5 relative z-20"
          >
            <LocationInput label="Select City" value={toLocation} onChange={setToLocation} placeholder="Mumbai, Bengaluru..." />
            <div className="md:w-px h-12 bg-black/5 mx-2 hidden md:block mt-6" />
            <div className="flex-grow space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Search Movies</label>
              <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                <Film className="text-luxury-gold w-4 h-4 shrink-0" />
                <input type="text" placeholder="Search title, genre..." className="bg-transparent border-none outline-none text-xs font-bold text-black w-full" />
              </div>
            </div>
            <div className="md:w-px h-12 bg-black/5 mx-2 hidden md:block mt-6" />
            <div className="w-full md:w-auto mt-4 md:mt-6 self-start md:self-end">
              <button 
                onClick={handleSearch}
                className="w-full px-12 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold transition-all shadow-lg"
              >
                Check Movies
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isUpdating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 border-t-2 border-luxury-gold rounded-full"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/60 animate-pulse">Syncing with Global Carriers</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {lastSearchTime && !isUpdating && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-2 px-6 py-3 bg-green-500/5 border border-green-500/20 rounded-full w-fit mx-auto"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">
            Live prices confirmed at {lastSearchTime}
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-9 space-y-8">
          {activeTab === 'flights' && (
            <div className="glass-panel p-8 rounded-[2.5rem] border border-black/5 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-luxury-gold" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Filter Your Results</h3>
                </div>
                <button 
                  onClick={() => {
                    setFlightStops('all');
                    setSelectedAirlines([]);
                    setTimeSlot('all');
                    setCabinClass('all');
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FilterGroup title="Stops">
                  <div className="flex flex-wrap gap-2">
                    {(['all', '0', '1', '2+'] as const).map(s => (
                      <button 
                        key={s}
                        onClick={() => setFlightStops(s)}
                        className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${flightStops === s ? 'bg-black text-white border-black shadow-md' : 'bg-white border-black/5 text-black/40 hover:border-black/10'}`}
                      >
                        {s === 'all' ? 'All' : s === '0' ? 'Direct' : s === '1' ? '1 Stop' : '2+'}
                      </button>
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="Cabin Class">
                   <div className="flex flex-wrap gap-2">
                    {(['all', 'economy', 'business', 'first'] as const).map(c => (
                      <button 
                        key={c}
                        onClick={() => setCabinClass(c)}
                        className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${cabinClass === c ? 'bg-black text-white border-black shadow-md' : 'bg-white border-black/5 text-black/40 hover:border-black/10'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="Airlines">
                  <div className="flex flex-wrap gap-1.5">
                    {AIRLINES.slice(0, 4).map(airline => {
                      const isSelected = selectedAirlines.includes(airline);
                      return (
                        <button 
                          key={airline}
                          onClick={() => {
                            setSelectedAirlines(prev => 
                              isSelected ? prev.filter(a => a !== airline) : [...prev, airline]
                            );
                          }}
                          className={`px-2 py-1.5 rounded-lg border text-[8px] font-bold uppercase tracking-tighter transition-all ${isSelected ? 'bg-luxury-gold text-white border-luxury-gold shadow-sm' : 'bg-white border-black/5 text-black/40 hover:border-black/10'}`}
                        >
                          {airline}
                        </button>
                      );
                    })}
                  </div>
                </FilterGroup>

                <FilterGroup title="Departure">
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'morning', 'afternoon', 'evening'] as const).map(t => (
                      <button 
                        key={t}
                        onClick={() => setTimeSlot(t)}
                        className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${timeSlot === t ? 'bg-black text-white border-black shadow-md' : 'bg-white border-black/5 text-black/40 hover:border-black/10'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </FilterGroup>
              </div>
            </div>
          )}

          {activeTab === 'hotels' && (
             <div className="glass-panel p-8 rounded-[2.5rem] border border-black/5 bg-white shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-luxury-gold" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Refine Residency</h3>
                  </div>
                  
                  <div className="flex-grow max-w-md relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <input 
                      type="text" 
                      placeholder="Search specific property name..."
                      value={hotelSearch}
                      onChange={(e) => setHotelSearch(e.target.value)}
                      className="w-full bg-black/5 border border-black/5 rounded-full py-3 pl-12 pr-6 text-xs outline-none focus:border-luxury-gold transition-all"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      setHotelFilter('all');
                      setSelectedAmenities([]);
                      setPriceRange(1000);
                      setStarRating(null);
                      setHotelChain('all');
                      setHotelSearch('');
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-red-500 transition-colors whitespace-nowrap"
                  >
                    Reset Experience
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
                  <FilterGroup title="Property Style">
                    <div className="flex flex-wrap gap-2">
                       {(['all', 'highly-rated', 'resort', 'business'] as const).map(f => (
                          <button 
                              key={f}
                              onClick={() => setHotelFilter(f)}
                              className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${hotelFilter === f ? 'bg-black text-white border-black shadow-md' : 'bg-white border-black/5 text-black/40 hover:border-black/10'}`}
                          >
                              {f === 'all' ? 'Every Style' : f.replace('-', ' ')}
                          </button>
                      ))}
                    </div>
                  </FilterGroup>

                  <FilterGroup title="Investment (Max)">
                    <div className="space-y-4 pt-2">
                       <input 
                        type="range" 
                        min="100" 
                        max="2000" 
                        step="100"
                        value={priceRange}
                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                        className="w-full accent-luxury-gold"
                       />
                       <div className="flex justify-between text-[10px] font-bold text-black/40 tracking-widest">
                         <span>{formatPrice(100)}</span>
                         <span className="text-luxury-gold">{formatPrice(priceRange)}</span>
                       </div>
                    </div>
                  </FilterGroup>

                  <FilterGroup title="Stature">
                    <div className="flex flex-wrap gap-2">
                      {[3, 4, 5].map(rating => (
                        <button 
                          key={rating}
                          onClick={() => setStarRating(starRating === rating ? null : rating)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${starRating === rating ? 'bg-black text-white border-black shadow-md' : 'bg-white border-black/5 text-black/40 hover:border-black/10'}`}
                        >
                          {rating} <Star className={`w-2.5 h-2.5 ${starRating === rating ? 'fill-white' : 'fill-black/20'}`} />
                        </button>
                      ))}
                    </div>
                  </FilterGroup>

                  <FilterGroup title="Dynasty">
                    <select 
                      value={hotelChain}
                      onChange={(e) => setHotelChain(e.target.value)}
                      className="w-full bg-white border border-black/5 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-luxury-gold"
                    >
                      <option value="all">All Chains</option>
                      <option value="Aman">Aman</option>
                      <option value="Four Seasons">Four Seasons</option>
                      <option value="Belmond">Belmond</option>
                      <option value="Ritz-Carlton">Ritz-Carlton</option>
                      <option value="Park Hyatt">Park Hyatt</option>
                    </select>
                  </FilterGroup>

                  <FilterGroup title="Essentials & Wellness">
                    <div className="flex flex-wrap gap-2">
                      {['wifi', 'pool', 'gym', 'spa'].map(amenity => {
                        const isSelected = selectedAmenities.includes(amenity);
                        return (
                          <button 
                            key={amenity}
                            onClick={() => setSelectedAmenities(prev => isSelected ? prev.filter(a => a !== amenity) : [...prev, amenity])}
                            className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${isSelected ? 'bg-luxury-gold text-white border-luxury-gold shadow-sm' : 'bg-white border-black/5 text-black/40 hover:border-black/10'}`}
                          >
                            {amenity}
                          </button>
                        );
                      })}
                    </div>
                  </FilterGroup>

                  <FilterGroup title="Exclusives">
                    <div className="flex flex-wrap gap-2">
                      {['butler', 'concierge', 'all-inclusive'].map(amenity => {
                        const isSelected = selectedAmenities.includes(amenity);
                        return (
                          <button 
                            key={amenity}
                            onClick={() => setSelectedAmenities(prev => isSelected ? prev.filter(a => a !== amenity) : [...prev, amenity])}
                            className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${isSelected ? 'bg-luxury-gold text-white border-luxury-gold shadow-sm' : 'bg-white border-black/5 text-black/40 hover:border-black/10'}`}
                          >
                            {amenity}
                          </button>
                        );
                      })}
                    </div>
                  </FilterGroup>
                </div>
             </div>
          )}

          <div className="space-y-6">
            {activeTab === 'flights' && filteredFlights.length > 0 ? (
              filteredFlights.map(flight => (
                <FlightCard key={flight.id} flight={flight} />
              ))
            ) : activeTab === 'flights' ? (
              <div className="p-20 text-center bg-black/5 rounded-[3rem] border border-dashed border-black/10">
                <p className="text-sm text-black/40 font-bold uppercase tracking-widest">No flights found matching your selection</p>
                <button 
                  onClick={() => {
                    setFlightStops('all');
                    setSelectedAirlines([]);
                    setTimeSlot('all');
                    setCabinClass('all');
                  }}
                  className="mt-6 text-xs text-luxury-gold hover:text-black font-bold uppercase tracking-widest transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            ) : null}
            {activeTab === 'hotels' && (
              <div className="space-y-6">
                <HotelResults 
                  destination={toLocation || query} 
                  onBook={handleBookHotel} 
                  filter={hotelFilter} 
                  selectedAmenities={selectedAmenities}
                  priceRange={priceRange}
                  starRating={starRating}
                  hotelChain={hotelChain}
                  hotelSearch={hotelSearch}
                  checkIn={checkIn}
                  checkOut={checkOut}
                />
              </div>
            )}
            {activeTab === 'activities' && (
              <ActivityResults 
                destination={toLocation || query} 
                onBook={handleBookActivity}
                filter={activityFilter}
              />
            )}
            {activeTab === 'movies' && (
              <MovieResults 
                destination={toLocation || query} 
                onBook={handleBookMovie}
              />
            )}
          </div>
        </div>
        
        <div className="lg:col-span-3 space-y-8">
            <div className="glass-panel p-8 rounded-[2.5rem] sticky top-32 border border-black/5 bg-white shadow-xl group overflow-hidden">
                {/* Decorative element */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-luxury-gold via-black to-luxury-gold opacity-30" />
                
                <div className="flex items-center justify-between mb-8">
                    <h3 className="luxury-text text-2xl text-black">Market <span className="italic text-luxury-gold">Insight</span></h3>
                    <TrendingUp className="w-5 h-5 text-luxury-gold" />
                </div>

                <div className="h-44 flex items-end gap-2.5 mb-8 px-2">
                    {[45, 75, 55, 95, 70, 85, 60].map((h, i) => (
                        <div key={i} className="flex-grow bg-black/5 rounded-full group/bar relative">
                            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 pointer-events-none z-10 shadow-xl">
                                {formatPrice(h * 850)}
                            </div>
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`w-full rounded-full transition-all duration-700 ${i === 3 ? 'bg-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-black/10 group-hover/bar:bg-black/20'}`} 
                            />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 text-center">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 block mb-1">Demand</span>
                        <span className="text-sm font-bold text-orange-600 uppercase">Extreme</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/10 text-center">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 block mb-1">Price Trend</span>
                        <span className="text-sm font-bold text-luxury-gold uppercase italic">Surging</span>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/[0.02] border border-black/5 mb-10 relative group-hover:bg-white transition-colors duration-500">
                    <Sparkles className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                    <p className="text-[10px] text-black/60 leading-relaxed font-light">
                      <span className="font-bold text-black uppercase">Elite Tip:</span> Global events in {toLocation.split(',')[0]} are driving a surge in bookings. Secure this rate within <span className="text-luxury-gold font-bold">14 minutes</span> to avoid dynamic price adjustments.
                    </p>
                </div>

                <div className="space-y-4">
                    <button className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-luxury-gold transition-all shadow-xl hover:shadow-luxury-gold/30 flex items-center justify-center gap-3 group/btn">
                        Activate Price Alert
                        <Bell className="w-3 h-3 group-hover/btn:animate-bounce" />
                    </button>
                    <button className="w-full py-5 border border-black/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 hover:text-black hover:border-black transition-all bg-white hover:bg-black/5">
                        Historical Data
                    </button>
                </div>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {isBookingModalOpen && selectedHotel && (
          <BookingModal 
            hotel={selectedHotel} 
            onClose={() => setIsBookingModalOpen(false)} 
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
          />
        )}
        {isActivityModalOpen && selectedActivity && (
          <ActivityBookingModal 
            activity={selectedActivity} 
            onClose={() => setIsActivityModalOpen(false)} 
            date={checkIn}
          />
        )}
        {isMovieModalOpen && selectedMovie && (
          <MovieBookingModal 
            movie={selectedMovie} 
            onClose={() => setIsMovieModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="border-b border-black/5 pb-4 last:border-0 last:pb-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 mb-2 group"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">{title}</span>
        <motion.div
           animate={{ rotate: isOpen ? 0 : 180 }}
           transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-3 h-3 text-black/20 group-hover:text-black transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityBookingModal({ activity, onClose, date: initialDate }: { activity: any; onClose: () => void; date?: string }) {
  const [date, setDate] = useState(initialDate || '2026-05-15');
  const [guests, setGuests] = useState(2);
  const [tier, setTier] = useState('Premium');
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const tiers = [
    { name: 'Standard', price: activity.price, description: 'General access with standard amenities.' },
    { name: 'Premium', price: activity.price * 1.5, description: 'Priority lane, premium refreshments, and gift pack.' },
    { name: 'VIP Elite', price: activity.price * 3, description: 'Private guide, luxury transport, and gourmet lunch.' }
  ];

  const currentPrice = tiers.find(t => t.name === tier)?.price || activity.price;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/20 backdrop-blur-md overflow-y-auto">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-panel w-full max-w-4xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row h-auto md:h-[70vh] border border-black/10 shadow-2xl bg-white my-8">
        <div className="md:w-1/2 h-64 md:h-auto relative">
          <img src={activity.image} className="w-full h-full object-cover" alt={activity.name} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors text-white border border-white/20">
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>
          <div className="absolute bottom-10 left-10 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2 text-luxury-gold">Experience</p>
            <h4 className="text-2xl font-light">{activity.name}</h4>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between overflow-y-auto bg-white custom-scrollbar text-black">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-luxury-gold mb-4">
                <Sparkles className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold uppercase tracking-widest">Exclusive Access</span>
              </div>
              <p className="text-sm text-black/50 leading-relaxed font-light italic">"{activity.description}"</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2">Date</label>
                <div className="flex items-center gap-3 bg-black/5 border border-black/5 rounded-2xl p-4 focus-within:border-luxury-gold transition-colors">
                  <CalendarIcon className="w-4 h-4 text-luxury-gold" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold text-black w-full" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2">Guests</label>
                <div className="flex items-center gap-3 bg-black/5 border border-black/5 rounded-2xl p-4 focus-within:border-luxury-gold transition-colors">
                  <User className="w-4 h-4 text-luxury-gold" />
                  <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))} className="bg-transparent border-none outline-none text-xs font-bold text-black w-full appearance-none cursor-pointer">
                    {[1, 2, 3, 4, 5, 10].map(n => <option key={n} value={n}>{n} Guests</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2">Select Tier</label>
              <div className="space-y-3">
                {tiers.map(t => (
                  <button 
                    key={t.name}
                    onClick={() => setTier(t.name)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${tier === t.name ? 'bg-black text-white border-black shadow-lg' : 'bg-black/5 border-black/5 text-black/60 hover:border-black/20'}`}
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1">{t.name}</div>
                      <div className="text-[9px] opacity-40 italic">{t.description}</div>
                    </div>
                    <div className="text-sm font-light">{formatPrice(t.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-black/5">
            <div className="flex justify-between items-end mb-8">
              <div>
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-2">Total Price</div>
                <div className="text-3xl font-light text-black underline decoration-luxury-gold underline-offset-8">{formatPrice(currentPrice * guests)}</div>
              </div>
              <button 
                onClick={() => navigate(`/checkout?type=activity&id=${activity.id}&name=${encodeURIComponent(activity.name)}&price=${currentPrice}&guests=${guests}&date=${date}&tier=${encodeURIComponent(tier)}`)}
                className="px-10 py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-luxury-gold transition-all shadow-xl"
              >
                Confirm Access
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BookingModal({ hotel, onClose, initialCheckIn, initialCheckOut }: { hotel: any; onClose: () => void; initialCheckIn?: string; initialCheckOut?: string }) {
  const [roomType, setRoomType] = useState('Deluxe Suite');
  const [guests, setGuests] = useState(2);
  
  const [checkIn, setCheckIn] = useState(initialCheckIn || '2026-05-15');
  const [checkOut, setCheckOut] = useState(initialCheckOut || '2026-05-20');

  const calculateNights = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
    const utc1 = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
    const utc2 = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());
    const diff = utc2 - utc1;
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  const [nights, setNights] = useState(calculateNights(checkIn, checkOut));

  const updateCheckOutByNights = (start: string, n: number) => {
    const s = new Date(start);
    if (isNaN(s.getTime())) return;
    const result = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate() + n));
    setCheckOut(result.toISOString().split('T')[0]);
    setNights(n);
  };

  const handleModalCheckInChange = (date: string) => {
    setCheckIn(date);
    const n = calculateNights(date, checkOut);
    if (n < 1) {
      updateCheckOutByNights(date, 1);
    } else {
      setNights(n);
    }
  };

  const handleModalCheckOutChange = (date: string) => {
    setCheckOut(date);
    const n = calculateNights(checkIn, date);
    if (n < 1) {
      const s = new Date(date);
      const prev = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate() - 1));
      setCheckIn(prev.toISOString().split('T')[0]);
      setNights(1);
    } else {
      setNights(n);
    }
  };
  
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    const n = calculateNights(checkIn, checkOut);
    setNights(n);
  }, [checkIn, checkOut]);

  const roomOptions = [
    { name: 'Deluxe Suite', price: hotel.price },
    { name: 'Ocean View', price: hotel.price * 1.25 },
    { name: 'Penthouse', price: hotel.price * 2.5 },
    { name: 'Executive Room', price: hotel.price * 0.9 }
  ];

  const currentPrice = roomOptions.find(r => r.name === roomType)?.price || hotel.price;
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/20 backdrop-blur-md overflow-y-auto">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-panel w-full max-w-5xl rounded-[3rem] overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[85vh] border border-black/10 shadow-2xl bg-white my-8">
        <div className="lg:w-5/12 h-64 lg:h-auto relative">
          <img src={hotel.image} className="w-full h-full object-cover" alt={hotel.name} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors text-white border border-white/20">
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>
          
          <div className="absolute bottom-10 left-10 text-white hidden lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2 text-luxury-gold">Location</p>
            <h4 className="text-xl font-light">{hotel.location}, {hotel.city}</h4>
          </div>
        </div>

        <div className="lg:w-7/12 p-8 md:p-12 flex flex-col justify-between overflow-y-auto bg-white custom-scrollbar">
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-2 text-luxury-gold mb-4">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold/80">Premium Residency</span>
              </div>
              <h2 className="luxury-text text-4xl md:text-5xl mb-4 text-black">{hotel.name}</h2>
              <p className="text-sm text-black/50 leading-relaxed font-light mb-8 italic">
                "{hotel.description}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2">Check-In</label>
                <div className="flex items-center gap-3 bg-black/5 border border-black/5 rounded-2xl p-4 focus-within:border-luxury-gold transition-colors">
                  <CalendarIcon className="w-4 h-4 text-luxury-gold" />
                  <input type="date" value={checkIn} onChange={(e) => handleModalCheckInChange(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold text-black w-full" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2">Nights</label>
                <div className="flex items-center gap-3 bg-black/5 border border-black/5 rounded-2xl p-4 focus-within:border-luxury-gold transition-colors">
                  <Clock className="w-4 h-4 text-luxury-gold" />
                  <select 
                    value={nights} 
                    onChange={(e) => updateCheckOutByNights(checkIn, parseInt(e.target.value))}
                    className="bg-transparent border-none outline-none text-xs font-bold text-black w-full appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Night' : 'Nights'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2">Check-Out</label>
                <div className="flex items-center gap-3 bg-black/5 border border-black/5 rounded-2xl p-4 focus-within:border-luxury-gold transition-colors">
                  <CalendarIcon className="w-4 h-4 text-luxury-gold" />
                  <input type="date" value={checkOut} onChange={(e) => handleModalCheckOutChange(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold text-black w-full" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <Layers className="w-4 h-4 text-luxury-gold" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/40">Select Your Experience</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {roomOptions.map(option => (
                  <button 
                    key={option.name} 
                    onClick={() => setRoomType(option.name)} 
                    className={`p-6 rounded-2xl text-left border transition-all ${roomType === option.name ? 'bg-black text-white border-black shadow-lg' : 'bg-black/5 border-black/5 text-black/60 hover:border-black/20'}`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60">{option.name}</div>
                    <div className="text-lg font-light">{formatPrice(Math.round(option.price))} <span className="text-[10px] opacity-40">/ NT</span></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2">
                   <User className="w-3 h-3" /> Guests
                </div>
                <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))} className="w-full bg-black/5 border border-black/5 rounded-2xl p-5 text-sm font-bold appearance-none outline-none focus:border-luxury-gold text-black cursor-pointer">
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guests</option>)}
                </select>
              </div>
              <div className="flex flex-col justify-end">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2 mb-4">Duration Selection</div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                        <button 
                            key={n}
                            onClick={() => updateCheckOutByNights(checkIn, n)}
                            className={`flex-grow py-3 rounded-xl text-[10px] font-bold border transition-all ${nights === n ? 'bg-luxury-gold text-white border-luxury-gold' : 'bg-black/5 border-black/5 text-black/40 hover:border-black/20'}`}
                        >
                            {n}N
                        </button>
                    ))}
                  </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-black/5">
            <div className="flex justify-between items-end mb-8">
              <div>
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-2">Grand Total</div>
                <div className="text-4xl font-light text-black decoration-luxury-gold decoration-2 underline-offset-8 underline">{formatPrice(Math.round(currentPrice * nights))}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-2">Reward Points</div>
                <div className="text-luxury-gold font-bold">+{Math.round(currentPrice * 0.5)} MILES</div>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/checkout?type=hotel&id=${hotel.id}&name=${encodeURIComponent(hotel.name)}&location=${encodeURIComponent(hotel.location + ', ' + hotel.city)}&price=${currentPrice}&room=${encodeURIComponent(roomType)}&nights=${nights}&guests=${guests}&checkIn=${checkIn}&checkOut=${checkOut}`)}
              className="w-full py-6 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold transition-all shadow-xl"
            >
              Secure Reservation
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const FlightCard: React.FC<{ flight: any }> = ({ flight }) => {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  return (
    <motion.div layout className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-black/5 hover:border-luxury-gold/50 transition-all flex flex-col xl:flex-row gap-6 md:gap-8 items-stretch xl:items-center bg-white shadow-sm hover:shadow-xl relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex items-center gap-6 min-w-[200px] shrink-0 relative z-10">
        <div className="h-14 w-14 bg-black/5 flex items-center justify-center rounded-2xl overflow-hidden shrink-0 border border-black/5">
           <img 
            src={`https://logo.clearbit.com/${flight.airline.toLowerCase().replace(' ', '')}.com`} 
            alt={flight.airline}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://img.icons8.com/ios-filled/50/luxury.png';
            }}
           />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-xl font-bold tracking-tighter text-black truncate">{flight.id}</h4>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">{flight.airline}</span>
            <div className="w-1 h-1 rounded-full bg-black/10 shrink-0" />
            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">{flight.class}</span>
          </div>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-3 items-center gap-2 md:gap-4 text-center px-0 md:px-4 relative z-10">
        <div className="flex flex-col items-center">
          <div className="text-xl md:text-3xl luxury-text text-black w-full min-w-0" title={flight.from}>{flight.from}</div>
          <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1 opacity-60 tracking-[0.2em]">{flight.time}</div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="w-full flex items-center gap-2">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <Plane className="w-4 h-4 text-luxury-gold/40 rotate-90" />
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-black/30 font-bold uppercase tracking-widest">
                {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
            </span>
            <span className="text-[8px] text-luxury-gold font-bold uppercase tracking-tighter mt-0.5">Direct Route</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xl md:text-3xl luxury-text text-black w-full min-w-0" title={flight.to}>{flight.to}</div>
          <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1 opacity-60 tracking-[0.2em]">22:05</div>
        </div>
      </div>

      <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-4 xl:gap-2 xl:pl-10 xl:border-l border-black/5 min-w-[220px] border-t xl:border-t-0 pt-6 xl:pt-0 relative z-10">
        <div className="flex flex-col items-end gap-1 mb-1">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/5 border border-green-500/10 rounded-full mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-green-600">Live Fetch</span>
          </div>
          <div className="text-3xl font-light text-luxury-gold shrink-0 tabular-nums">{formatPrice(flight.price)}</div>
          <div className="text-[8px] text-black/20 font-bold uppercase tracking-widest">INC. TAXES & SURCHARGES</div>
        </div>
        
        <div className="flex flex-col gap-2 w-full max-w-[140px] xl:max-w-none">
          <button 
            onClick={() => navigate(`/checkout?type=flight&id=${flight.id}`)}
            className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-luxury-gold transition-all shadow-xl hover:shadow-luxury-gold/20"
          >
            Book Now
          </button>
          <button className={`flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest font-bold py-1.5 rounded-lg border transition-all ${flight.status === 'Delayed' ? 'text-orange-600 border-orange-500/10 bg-orange-500/5' : 'text-green-600 border-green-500/10 bg-green-500/5'}`}>
             <div className={`w-1 h-1 rounded-full ${flight.status === 'Delayed' ? 'bg-orange-500' : 'bg-green-500'}`} />
             {flight.status}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const HOTEL_DATA = [
  { 
    id: 1, 
    type: 'highly-rated', 
    name: 'Aman Tokyo', 
    chain: 'Aman',
    city: 'Tokyo',
    price: 950, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
    description: 'A sanctuary atop the Otemachi Tower, blending traditional Japanese design with modern luxury.',
    amenities: ['wifi', 'pool', 'gym', 'spa', 'butler'],
    location: 'Otemachi'
  },
  { 
    id: 101, 
    type: 'highly-rated', 
    name: 'The Leela Palace Bengaluru', 
    chain: 'The Leela',
    city: 'Bengaluru',
    price: 280, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    description: 'A majestic palace hotel inspired by the Royal Palace of Mysore, set in nine acres of lush gardens.',
    amenities: ['wifi', 'pool', 'gym', 'spa', 'butler'],
    location: 'Old Airport Road'
  },
  { 
    id: 102, 
    type: 'business', 
    name: 'ITC Gardenia', 
    chain: 'ITC Hotels',
    city: 'Bengaluru',
    price: 220, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
    description: 'A tribute to the Garden City of Bengaluru, this hotel is a masterpiece of sustainable luxury.',
    amenities: ['wifi', 'pool', 'gym', 'spa', 'lounge'],
    location: 'Residency Road'
  },
  { 
    id: 103, 
    type: 'resort', 
    name: 'The Gateway Hotel Mangalore', 
    chain: 'Taj',
    city: 'Mangalore',
    price: 120, 
    rating: 4.5, 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    description: 'Overlooking the confluence of the Gurupura and Netravathi rivers and the Arabian Sea.',
    amenities: ['wifi', 'pool', 'gym', 'restaurant'],
    location: 'Old Port Road'
  },
  { 
    id: 104, 
    type: 'highly-rated', 
    name: 'Hoysala Village Resort', 
    chain: 'Independent',
    city: 'Hassan',
    price: 150, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    description: 'Experience the rustic charm of Malnad coupled with the legendary Hoysala hospitality.',
    amenities: ['pool', 'nature-walk', 'spa', 'traditional-cuisine'],
    location: 'Belur Road'
  },
  { 
    id: 105, 
    type: 'business', 
    name: 'Taj West End', 
    chain: 'Taj',
    city: 'Bengaluru',
    price: 350, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
    description: 'A lush sanctuary in the heart of the city, with over 130 years of history and charm.',
    amenities: ['wifi', 'pool', 'gym', 'spa', 'historic-tours'],
    location: 'Race Course Road'
  },
  { 
    id: 2, 
    type: 'resort', 
    name: 'Four Seasons Maldives', 
    chain: 'Four Seasons',
    city: 'Male',
    price: 820, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    description: 'A secluded paradise offering overwater bungalows and world-class diving in the Landaa Giraavaru.',
    amenities: ['wifi', 'pool', 'beach', 'spa', 'all-inclusive'],
    location: 'Landaa Giraavaru'
  },
  { 
    id: 3, 
    type: 'business', 
    name: 'Park Hyatt London', 
    chain: 'Park Hyatt',
    city: 'London',
    price: 480, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800',
    description: 'Sophisticated living in the heart of London, offering unparalleled service and artistic design.',
    amenities: ['wifi', 'gym', 'lounge', 'conference', 'parking'],
    location: 'Hyde Park'
  },
  { 
    id: 4, 
    type: 'highly-rated', 
    name: 'Belmond Hotel Cipriani', 
    chain: 'Belmond',
    city: 'Venice',
    price: 750, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
    description: 'The legendary Venice retreat where glamorous service meets iconic lagoon views.',
    amenities: ['wifi', 'pool', 'gym', 'michelin-star', 'butler', 'boat-transfer'],
    location: 'Giudecca Island'
  },
  { 
    id: 5, 
    type: 'resort', 
    name: 'Ritz-Carlton Bali', 
    chain: 'Ritz-Carlton',
    city: 'Bali',
    price: 380, 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?q=80&w=800',
    description: 'An elegant beachfront sanctuary in Nusa Dua, inspired by the tropical beauty and heritage of Bali.',
    amenities: ['wifi', 'fireplace', 'hiking', 'spa', 'cuisine'],
    location: 'Nusa Dua'
  },
  { 
    id: 6, 
    type: 'business', 
    name: 'The Obsidian Hub', 
    chain: 'Independent',
    city: 'San Francisco',
    price: 260, 
    rating: 4.5, 
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800',
    description: 'Minimalist luxury designed for the high-performing modern professional.',
    amenities: ['wifi', 'gym', 'workstation', 'sky-bar', 'fast-track'],
    location: 'Tech Valley'
  },
  { 
    id: 7, 
    type: 'highly-rated', 
    name: 'Aman Venice', 
    chain: 'Aman',
    city: 'Venice',
    price: 1100, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?q=80&w=800',
    description: 'Set in a 16th-century palazzo on the Grand Canal, offering a regal Venetian experience.',
    amenities: ['wifi', 'spa', 'butler', 'lounge', 'dining'],
    location: 'Grand Canal'
  },
  { 
    id: 8, 
    type: 'resort', 
    name: 'Four Seasons Bora Bora', 
    chain: 'Four Seasons',
    city: 'Bora Bora',
    price: 1200, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1506929199320-fe3365f68cc5?q=80&w=800',
    description: 'Iconic overwater bungalows surrounded by turquoise lagoons and the peaks of Mount Otemanu.',
    amenities: ['wifi', 'pool', 'diving', 'spa', 'all-inclusive'],
    location: 'Motu Tehotu'
  },
  { 
    id: 9, 
    type: 'highly-rated', 
    name: 'The Oberoi Mumbai', 
    chain: 'Oberoi',
    city: 'Mumbai',
    price: 320, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f9b4?q=80&w=800',
    description: 'Breathtaking views of the Marine Drive and the Arabian Sea with legendary hospitality.',
    amenities: ['wifi', 'pool', 'butler', 'fine-dining', 'view'],
    location: 'Nariman Point'
  },
  { 
    id: 10, 
    type: 'highly-rated', 
    name: 'The Ritz Paris', 
    chain: 'Ritz-Carlton',
    city: 'Paris',
    price: 1300, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1549388604-817d15aa0110?q=80&w=800',
    description: 'An icon of French elegance, offering an unforgettable experience in the heart of the Place Vendôme.',
    amenities: ['wifi', 'pool', 'spa', 'michelin-star', 'butler'],
    location: 'Place Vendôme'
  },
  { 
    id: 11, 
    type: 'business', 
    name: 'The Langham London', 
    chain: 'Independent',
    city: 'London',
    price: 450, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800',
    description: 'Europes first grand hotel, blending historic charm with modern sophistication in Marylebone.',
    amenities: ['wifi', 'pool', 'gym', 'afternoon-tea', 'spa'],
    location: 'Marylebone'
  },
  { 
    id: 12, 
    type: 'resort', 
    name: 'Mandarin Oriental Tokyo', 
    chain: 'Mandarin Oriental',
    city: 'Tokyo',
    price: 880, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
    description: 'Spectacular views from the top of the Nihonbashi Mitsui Tower, merging high-tech with Japanese tradition.',
    amenities: ['wifi', 'spa', 'gym', 'fine-dining', 'sky-bar'],
    location: 'Nihonbashi'
  },
  { 
    id: 13, 
    type: 'highly-rated', 
    name: 'Baccarat Hotel New York', 
    chain: 'Independent',
    city: 'New York',
    price: 920, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=800',
    description: 'A crystal-lit sanctuary in Midtown Manhattan, offering Parisian elegance and impeccable service.',
    amenities: ['wifi', 'pool', 'spa', 'chauffeur', 'bar'],
    location: 'Midtown'
  },
  { 
    id: 14, 
    type: 'highly-rated', 
    name: 'Burj Al Arab Jumeirah', 
    chain: 'Independent',
    city: 'Dubai',
    price: 1500, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1582719478237-7756f343949f?q=80&w=800',
    description: 'The worlds only seven-star hotel, offering unparalleled luxury on its own man-made island.',
    amenities: ['wifi', 'pool', 'beach', 'butler', 'chauffeur'],
    location: 'Umm Suqeim'
  },
  { 
    id: 15, 
    type: 'highly-rated', 
    name: 'Park Hyatt Sydney', 
    chain: 'Park Hyatt',
    city: 'Sydney',
    price: 980, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    description: 'Perfectly positioned between the Sydney Opera House and Harbour Bridge.',
    amenities: ['wifi', 'pool', 'gym', 'view', 'butler'],
    location: 'The Rocks'
  },
  { 
    id: 16, 
    type: 'highly-rated', 
    name: 'The Silo Hotel', 
    chain: 'Independent',
    city: 'Cape Town',
    price: 1100, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    description: 'A magical space towering above the V&A Waterfront, housed in a historic grain silo.',
    amenities: ['wifi', 'pool', 'spa', 'gallery', 'view'],
    location: 'V&A Waterfront'
  },
  { 
    id: 17, 
    type: 'resort', 
    name: 'Marina Bay Sands', 
    chain: 'Independent',
    city: 'Singapore',
    price: 650, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800',
    description: 'Home to the worlds largest rooftop infinity pool with iconic city skyline views.',
    amenities: ['wifi', 'pool', 'casino', 'michelin-star', 'sky-bar'],
    location: 'Marina Bay'
  },
  { 
    id: 18, 
    type: 'highly-rated', 
    name: 'Hotel de Russie', 
    chain: 'Independent',
    city: 'Rome',
    price: 850, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1551882547-ff43c6163745?q=80&w=800',
    description: 'A cosmopolitan destination in the heart of Rome, featuring secret Mediterranean gardens.',
    amenities: ['wifi', 'spa', 'garden', 'fine-dining', 'gym'],
    location: 'Piazza del Popolo'
  },
  { 
    id: 19, 
    type: 'business', 
    name: 'The St. Regis Mexico City', 
    chain: 'Independent',
    city: 'Mexico City',
    price: 520, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800',
    description: 'Elevated luxury on Paseo de la Reforma, blending historic charm with modern service.',
    amenities: ['wifi', 'pool', 'butler', 'spa', 'conference'],
    location: 'Paseo de la Reforma'
  },
  { 
    id: 20, 
    type: 'highly-rated', 
    name: 'Royal Mansour Marrakech', 
    chain: 'Independent',
    city: 'Marrakech',
    price: 1400, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f9b4?q=80&w=800',
    description: 'A masterpiece of Moroccan architecture, where guests reside in their own private riads.',
    amenities: ['wifi', 'pool', 'spa', 'butler', 'garden'],
    location: 'Medina'
  },
  { 
    id: 21, 
    type: 'resort', 
    name: 'Nihi Sumba', 
    chain: 'Independent',
    city: 'Sumba',
    price: 1250, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1506929199320-fe3365f68cc5?q=80&w=800',
    description: 'A remote island escape offering world-class surfing and rugged luxury.',
    amenities: ['wifi', 'pool', 'surfing', 'spa', 'all-inclusive'],
    location: 'West Sumba'
  },
  { 
    id: 22, 
    type: 'highly-rated', 
    name: 'Post Ranch Inn', 
    chain: 'Independent',
    city: 'Big Sur',
    price: 1450, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800',
    description: 'A sanctuary for the soul, perched on the cliffs of Big Sur overlooking the Pacific.',
    amenities: ['wifi', 'pool', 'spa', 'view', 'hiking'],
    location: 'California Coast'
  },
  { 
    id: 23, 
    type: 'resort', 
    name: 'Soneva Jani', 
    chain: 'Independent',
    city: 'Maldives',
    price: 2200, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
    description: 'Ultra-luxury overwater villas with retractable roofs for stargazing.',
    amenities: ['wifi', 'pool', 'spa', 'cinema', 'astronomy'],
    location: 'Noonu Atoll'
  },
  { 
    id: 24, 
    type: 'highly-rated', 
    name: 'Badrutt\'s Palace', 
    chain: 'Independent',
    city: 'St. Moritz',
    price: 890, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1551882547-ff43c6163745?q=80&w=800',
    description: 'The historic landmark in the center of St. Moritz, synonymous with Swiss luxury.',
    amenities: ['wifi', 'pool', 'spa', 'skiing', 'butler'],
    location: 'Swiss Alps'
  },
  { 
    id: 25, 
    type: 'highly-rated', 
    name: 'Canaves Oia Epitome', 
    chain: 'Independent',
    city: 'Santorini',
    price: 950, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?q=80&w=800',
    description: 'A sophisticated sanctuary in Oia, offering stunning sunset views and private pools.',
    amenities: ['wifi', 'pool', 'spa', 'view', 'fine-dining'],
    location: 'Oia'
  },
  { 
    id: 26, 
    type: 'highly-rated', 
    name: 'The Leela Palace Bengaluru', 
    chain: 'The Leela',
    city: 'Bengaluru',
    price: 350, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    description: 'A palace of luxury set amidst seven acres of lush gardens, reflecting the royal heritage of the Mysore Empire.',
    amenities: ['wifi', 'pool', 'spa', 'butler', 'garden', 'fine-dining'],
    location: 'Old Airport Road'
  },
  { 
    id: 27, 
    type: 'business', 
    name: 'Conrad Bengaluru', 
    chain: 'Hilton',
    city: 'Bengaluru',
    price: 280, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
    description: 'Soaring above the Ulsoor Lake, providing contemporary luxury and panoramic city views for the modern traveler.',
    amenities: ['wifi', 'pool', 'gym', 'sky-bar', 'conference'],
    location: 'Ulsoor'
  },
  { 
    id: 28, 
    type: 'resort', 
    name: 'Taj Madikeri Resort & Spa', 
    chain: 'Taj',
    city: 'Coorg',
    price: 420, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800',
    description: 'Perched 4000 feet above sea level in a 180-acre rainforest, offering tranquility amidst the Western Ghats.',
    amenities: ['wifi', 'pool', 'spa', 'hiking', 'nature-walk', 'organic-dining'],
    location: 'Monnangeri'
  },
  { 
    id: 29, 
    type: 'highly-rated', 
    name: 'Vivanta Mangala', 
    chain: 'Taj',
    city: 'Mangalore',
    price: 180, 
    rating: 4.5, 
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800',
    description: 'The premier destination for luxury in Mangalore, blending coastal charm with legendary Taj hospitality.',
    amenities: ['wifi', 'pool', 'gym', 'seafood-specialty', 'lounge'],
    location: 'Old Port Road'
  },
  { 
    id: 30, 
    type: 'resort', 
    name: 'Rosetta by Ferns', 
    chain: 'Independent',
    city: 'Hassan',
    price: 240, 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?q=80&w=800',
    description: 'A luxury coffee plantation resort in Sakleshpur, offering a blend of nature and modern comfort.',
    amenities: ['wifi', 'pool', 'trekking', 'spa', 'plantation-tour'],
    location: 'Sakleshpur'
  },
  { 
    id: 31, 
    type: 'highly-rated', 
    name: 'Taj Lake Palace', 
    chain: 'Taj',
    city: 'Udaipur',
    price: 850, 
    rating: 5.0, 
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f9b4?q=80&w=800',
    description: 'Float on the waters of Lake Pichola in this ethereal white marble palace, a dream of royal Rajputana.',
    amenities: ['wifi', 'spa', 'boat-transfer', 'palace-tour', 'butler'],
    location: 'Lake Pichola'
  },
  { 
    id: 32, 
    type: 'resort', 
    name: 'The Leela Palace Jaipur', 
    chain: 'The Leela',
    city: 'Jaipur',
    price: 550, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1549388604-817d15aa0110?q=80&w=800',
    description: 'Inspired by Rajasthan’s royal heritage, set against the scenic Aravalli Range.',
    amenities: ['wifi', 'pool', 'spa', 'heritage-walk', 'royal-dining'],
    location: 'Amer'
  },
  { 
    id: 33, 
    type: 'highly-rated', 
    name: 'ITC Grand Bharat', 
    chain: 'ITC',
    city: 'Gurgaon',
    price: 480, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1506929199320-fe3365f68cc5?q=80&w=800',
    description: 'An ultimate luxury retreat featuring Indias first all-suite golf resort within a 300-acre estate.',
    amenities: ['wifi', 'golf', 'spa', 'fine-dining', 'luxury-suites'],
    location: 'Manesar'
  },
  { 
    id: 34, 
    type: 'resort', 
    name: 'W Goa', 
    chain: 'Marriott', 
    city: 'Goa',
    price: 400, 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800',
    description: 'A vibrant escape perched on Vagator Beach, where electric energy meets coastal tranquility.',
    amenities: ['wifi', 'pool', 'beach-access', 'spa', 'nightlife'],
    location: 'Vagator'
  },
  { 
    id: 35, 
    type: 'highly-rated', 
    name: 'The Ritz-Carlton, Bangalore', 
    chain: 'Ritz-Carlton',
    city: 'Bengaluru',
    price: 380, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1549300461-11c5b94e8897?q=80&w=800',
    description: 'A sanctuary of luxury in the city center, offering a refined blend of modern elegance and traditional Indian charm.',
    amenities: ['wifi', 'pool', 'spa', 'butler', 'fine-dining', 'club-lounge'],
    location: 'Residency Road'
  },
  { 
    id: 36, 
    type: 'highly-rated', 
    name: 'Taj West End, Bengaluru', 
    chain: 'Taj',
    city: 'Bengaluru',
    price: 420, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    description: 'A lush oasis in the heart of the city, this historic hotel is set amidst 20 acres of tropical gardens.',
    amenities: ['wifi', 'pool', 'spa', 'garden', 'tennis', 'heritage-walk'],
    location: 'Race Course Road'
  },
  { 
    id: 37, 
    type: 'highly-rated', 
    name: 'ITC Gardenia, Bengaluru', 
    chain: 'ITC',
    city: 'Bengaluru',
    price: 360, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
    description: 'Inspired by the spirit of the Garden City, this hotel is a masterpiece of sustainable luxury architecture.',
    amenities: ['wifi', 'pool', 'spa', 'sky-garden', 'michelin-star', 'butler'],
    location: 'Richmond Road'
  },
  { 
    id: 38, 
    type: 'highly-rated', 
    name: 'ITC Windsor, Bengaluru', 
    chain: 'ITC',
    city: 'Bengaluru',
    price: 340, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800',
    description: 'A palatial retreat reflecting the grace and elegance of the British Regency era.',
    amenities: ['wifi', 'pool', 'spa', 'high-tea', 'classic-dining', 'bar'],
    location: 'Sankey Road'
  },
  { 
    id: 39, 
    type: 'highly-rated', 
    name: 'Four Seasons Hotel Bengaluru', 
    chain: 'Four Seasons',
    city: 'Bengaluru',
    price: 400, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800',
    description: 'Modern luxury meets dynamic energy at Embassy ONE, featuring a stunning pool and world-class dining.',
    amenities: ['wifi', 'pool', 'spa', 'club-lounge', 'view', 'gym'],
    location: 'Ganganagar'
  },
  { 
    id: 40, 
    type: 'highly-rated', 
    name: 'The Oberoi, Bengaluru', 
    chain: 'Oberoi',
    city: 'Bengaluru',
    price: 390, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800',
    description: 'Centered around a breathtaking 120-year-old rain tree, offering a serene luxury experience on MG Road.',
    amenities: ['wifi', 'pool', 'garden', 'butler', 'fine-dining', 'verandah'],
    location: 'MG Road'
  },
  { 
    id: 41, 
    type: 'business', 
    name: 'Shangri-La Bengaluru', 
    chain: 'Shangri-La',
    city: 'Bengaluru',
    price: 310, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1506929199320-fe3365f68cc5?q=80&w=800',
    description: 'Experience Asian-inspired hospitality with the citys best panoramic views from the 18th floor.',
    amenities: ['wifi', 'pool', 'spa', 'sky-bar', 'gym', 'chinese-dining'],
    location: 'Palace Road'
  }
];

const ACTIVITY_DATA = [
  {
    id: 1,
    name: 'Private Rooftop Yoga & Meditation',
    city: 'Bengaluru',
    price: 45,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800',
    description: 'A serene sunrise session overlooking the Garden City skyline with a master instructor.',
    type: 'wellness',
    location: 'Indiranagar'
  },
  {
    id: 2,
    name: 'Artisan Coffee Roasting Masterclass',
    city: 'Bengaluru',
    price: 30,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800',
    description: 'Learn the secrets of the perfect brew at a premium boutique roastery.',
    type: 'food-drink',
    location: 'Koramangala'
  },
  {
    id: 3,
    name: 'Heritage Palace Walk',
    city: 'Bengaluru',
    price: 25,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1590732487082-6a1024214740?q=80&w=800',
    description: 'Explore the Tudor-style architecture and royal histories of the Bangalore Palace.',
    type: 'culture',
    location: 'Vasanth Nagar'
  },
  {
    id: 4,
    name: 'Louvre Museum Private Night Tour',
    city: 'Paris',
    price: 250,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800',
    description: 'An exclusive after-hours journey through the worlds most famous museum.',
    type: 'culture',
    location: '1st Arrond.'
  },
  {
    id: 5,
    name: 'Afternoon Tea at The Ritz',
    city: 'London',
    price: 85,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1531050171669-0158fb56f34a?q=80&w=800',
    description: 'A quintessentially British tradition in the opulent Palm Court.',
    type: 'food-drink',
    location: 'Mayfair'
  },
  {
    id: 6,
    name: 'Sumo Wrestling Morning Practice',
    city: 'Tokyo',
    price: 120,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
    description: 'A rare glimpse into the disciplined world of Sumo at an authentic stable.',
    type: 'culture',
    location: 'Ryogoku'
  },
  {
    id: 7,
    name: 'Helicopter Tour over Manhattan',
    city: 'New York',
    price: 350,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1467779009031-53938b78ca38?q=80&w=800',
    description: 'Breathtaking aerial views of the Statue of Liberty and Central Park.',
    type: 'adventure',
    location: 'Downtown'
  },
  {
    id: 8,
    name: 'Private Yacht Sunset Cruise',
    city: 'Dubai',
    price: 500,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800',
    description: 'Luxury cruising around the Palm Jumeirah with premium refreshments.',
    type: 'adventure',
    location: 'Dubai Marina'
  },
  {
    id: 9,
    name: 'Traditional Onsen Experience',
    city: 'Tokyo',
    price: 95,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800',
    description: 'Revitalize your body and soul in healing volcanic hot springs.',
    type: 'wellness',
    location: 'Hakone'
  },
  {
    id: 10,
    name: 'Tuscan Wine Tasting & Vineyard Tour',
    city: 'Florence',
    price: 180,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800',
    description: 'Sample world-class Chianti in the heart of the rolling Italian hills.',
    type: 'food-drink',
    location: 'Chianti'
  },
  {
    id: 11,
    name: 'Opera House Behind-the-Scenes',
    city: 'Sydney',
    price: 75,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800',
    description: 'Discover the architectural marvel and stage secrets of Australias icon.',
    type: 'culture',
    location: 'Circular Quay'
  },
  {
    id: 12,
    name: 'Safari Game Drive at Sunrise',
    city: 'Cape Town',
    price: 220,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800',
    description: 'Spot the Big Five in their natural habitat as the African sun rises.',
    type: 'adventure',
    location: 'Kruger'
  },
  {
    id: 13,
    name: 'Street Food Secret Tour',
    city: 'Singapore',
    price: 65,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800',
    description: 'Explore the hidden flavors of Hawker Centers with a local culinary guide.',
    type: 'food-drink',
    location: 'Chinatown'
  },
  {
    id: 14,
    name: 'Vatican Museums Private Access',
    city: 'Rome',
    price: 210,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1551882547-ff43c6163745?q=80&w=800',
    description: 'Early morning entry to the Sistine Chapel before the crowds arrive.',
    type: 'culture',
    location: 'Prati'
  }
];

const MOVIE_DATA = [
  {
    id: 1,
    name: 'Dune: Part Two',
    genre: 'Sci-Fi / Adventure',
    city: 'Bengaluru',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800',
    description: 'The epic saga continues as Paul Atreides unites with Chani and the Fremen while on a warpath of revenge.',
    duration: '2h 46m',
    language: 'English',
    cinemas: [
      { name: 'PVR: Director\'s Cut, Forum Rex', times: ['10:00 AM', '01:30 PM', '04:45 PM', '08:15 PM'], price: 45 },
      { name: 'Inox: Mantri Square Mall', times: ['11:15 AM', '02:45 PM', '06:00 PM', '09:30 PM'], price: 30 },
      { name: 'Cinepolis: Orion Mall', times: ['12:30 PM', '03:45 PM', '07:00 PM', '10:15 PM'], price: 35 }
    ]
  },
  {
    id: 2,
    name: 'Kalki 2898 AD',
    genre: 'Sci-Fi / Action',
    city: 'Bengaluru',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1614850523296-d811ca9ea012?q=80&w=800',
    description: 'A modern avatar of Vishnu, a Hindu god, is believed to have descended to earth to protect the world from evil forces.',
    duration: '3h 01m',
    language: 'Telugu / Hindi / Kannada',
    cinemas: [
      { name: 'Urvashi Cinema: Lalbagh', times: ['10:30 AM', '02:30 PM', '06:30 PM', '10:30 PM'], price: 40 },
      { name: 'PVR: VEGA City Mall', times: ['11:00 AM', '03:00 PM', '07:00 PM', '11:00 PM'], price: 35 }
    ]
  },
  {
    id: 3,
    name: 'RRR (Heritage Screening)',
    genre: 'Action / Drama',
    city: 'Hassan',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1485095329441-dbf71cd35c70?q=80&w=800',
    description: 'A tale of two legendary revolutionaries and their journey far away from home.',
    duration: '3h 05m',
    language: 'Kannada',
    cinemas: [
      { name: 'Prithvi Theatre', times: ['02:15 PM', '06:15 PM', '09:30 PM'], price: 15 },
      { name: 'Sahyadri Cinema', times: ['10:30 AM', '01:30 PM', '04:30 PM'], price: 12 }
    ]
  },
  {
    id: 4,
    name: 'Oppie (IMAX Edition)',
    genre: 'Biography / Drama',
    city: 'Mumbai',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    duration: '3h 00m',
    language: 'English',
    cinemas: [
      { name: 'PVR: IMAX, Lower Parel', times: ['09:00 AM', '12:45 PM', '04:30 PM', '08:15 PM'], price: 60 },
      { name: 'Inox: Insignia, Nariman Point', times: ['11:30 AM', '03:00 PM', '06:30 PM', '10:00 PM'], price: 55 }
    ]
  }
];

function MovieResults({ destination, onBook }: { destination: string; onBook: (movie: any) => void }) {
    const { formatPrice } = useCurrency();
    
    const filteredMovies = MOVIE_DATA.filter(m => {
        if (!destination || destination.toLowerCase() === 'everywhere') return true;
        const d = destination.toLowerCase();
        return m.city.toLowerCase().includes(d) || d.includes(m.city.toLowerCase());
    });

    const displayMovies = filteredMovies.length > 0 ? filteredMovies : MOVIE_DATA;

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-black/5">
                <div className="flex items-center gap-6">
                    <a href="https://bookmyshow.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                        <img 
                            src="https://in.bmscdn.com/webin/common/icons/logo.svg" 
                            alt="BookMyShow" 
                            className="h-8 md:h-10" 
                            referrerPolicy="no-referrer"
                        />
                    </a>
                    <div className="hidden sm:block w-px h-8 bg-black/10" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 mb-1">Premier Partner</p>
                        <p className="text-[9px] text-black/30 font-medium italic">Official Movie Ticketing Experience</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Discover more at</span>
                    <a 
                        href="https://bookmyshow.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-6 py-2 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-luxury-gold hover:text-luxury-gold transition-all"
                    >
                        bookmyshow.com
                    </a>
                </div>
            </div>

            {filteredMovies.length === 0 && destination && destination.toLowerCase() !== 'everywhere' && (
                <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/10 rounded-2xl flex items-center gap-3">
                    <Clapperboard className="w-5 h-5 text-luxury-gold" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/60">No Cinemas in {destination.split(',')[0]} yet</p>
                        <p className="text-[9px] text-black/30">Showing all trending movie screenings globally.</p>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayMovies.map(movie => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={movie.id}
                        className="group flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-black/5 hover:border-luxury-gold/20 transition-all hover:shadow-2xl"
                    >
                        <div className="relative h-80 overflow-hidden">
                            <img src={movie.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={movie.name} />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-black/80 backdrop-blur text-white text-[8px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest">
                                    {movie.rating} ★
                                </span>
                                <span className="bg-luxury-gold text-white text-[8px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest">
                                    {movie.language.split(' / ')[0]}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <button 
                                    onClick={() => onBook(movie)}
                                    className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-all shadow-lg"
                                >
                                    Book Tickets
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="mb-2">
                                <span className="text-[8px] font-bold text-luxury-gold uppercase tracking-[0.2em]">{movie.genre}</span>
                                <h4 className="text-lg font-medium text-black group-hover:text-luxury-gold transition-colors">{movie.name}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-black/40 text-[9px] font-bold uppercase tracking-widest mb-4">
                                <Clock className="w-3 h-3" />
                                {movie.duration}
                                <div className="w-1 h-1 rounded-full bg-black/10" />
                                <MapPin className="w-3 h-3" />
                                {movie.city}
                            </div>
                            <p className="text-[10px] text-black/40 font-light italic line-clamp-2 mb-6">"{movie.description}"</p>
                            <button 
                                onClick={() => onBook(movie)}
                                className="mt-auto w-full py-3 bg-black/5 text-black rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all border border-black/5 group-hover:border-black"
                            >
                                Check Showtimes
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

function MovieBookingModal({ movie, onClose }: { movie: any; onClose: () => void }) {
    const [selectedCinema, setSelectedCinema] = useState(movie.cinemas[0]);
    const [selectedTime, setSelectedTime] = useState(movie.cinemas[0].times[0]);
    const [tickets, setTickets] = useState(2);
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-panel w-full max-w-5xl rounded-[3rem] overflow-hidden flex flex-col lg:flex-row bg-white border border-black/10 shadow-3xl text-black">
                <div className="lg:w-2/5 h-64 lg:h-auto relative">
                    <img src={movie.image} className="w-full h-full object-cover" alt={movie.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <button onClick={onClose} className="absolute top-6 left-6 p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors text-white">
                        <ChevronDown className="w-5 h-5 rotate-90" />
                    </button>
                    <div className="absolute bottom-10 left-10 text-white pr-10">
                        <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-2 block">Grand Screening</span>
                        <h4 className="text-3xl font-light leading-tight mb-2">{movie.name}</h4>
                        <div className="flex items-center gap-3 text-[10px] opacity-60">
                            <span className="border border-white/30 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest">UA</span>
                            <span>{movie.duration}</span>
                            <span>•</span>
                            <span>{movie.genre}</span>
                        </div>
                    </div>
                </div>

                <div className="lg:w-3/5 p-8 lg:p-14 flex flex-col h-[70vh] lg:h-[80vh] overflow-y-auto custom-scrollbar">
                    <div className="mb-10">
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold mb-6">Select Cinema & Showtime</h5>
                        <div className="space-y-4">
                            {movie.cinemas.map((cinema: any) => (
                                <div 
                                    key={cinema.name}
                                    className={`p-6 rounded-3xl border transition-all ${selectedCinema.name === cinema.name ? 'border-luxury-gold bg-luxury-gold/5' : 'border-black/5 bg-black/5 hover:border-black/20'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h6 className="text-[11px] font-bold uppercase tracking-widest mb-1">{cinema.name}</h6>
                                            <p className="text-[9px] text-black/30">Premium Seating • IMAX Laser</p>
                                        </div>
                                        <div className="text-[10px] font-bold text-luxury-gold">{formatPrice(cinema.price)} / Ticket</div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cinema.times.map((time: string) => (
                                            <button 
                                                key={time}
                                                onClick={() => {
                                                    setSelectedCinema(cinema);
                                                    setSelectedTime(time);
                                                }}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${selectedCinema.name === cinema.name && selectedTime === time ? 'bg-black text-white border-black' : 'bg-white border-black/5 text-black/60 hover:border-luxury-gold'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2">Number of Seats</label>
                            <div className="flex items-center gap-3 bg-black/5 border border-black/5 rounded-2xl p-4">
                                <User className="w-4 h-4 text-luxury-gold" />
                                <select 
                                    value={tickets} 
                                    onChange={(e) => setTickets(parseInt(e.target.value))}
                                    className="bg-transparent border-none outline-none text-xs font-bold text-black w-full appearance-none cursor-pointer"
                                >
                                    {[1, 2, 3, 4, 5, 8, 10].map(n => <option key={n} value={n}>{n} Seats</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-2">Seating Preference</label>
                            <div className="flex items-center gap-3 bg-black/5 border border-black/5 rounded-2xl p-4">
                                <Ticket className="w-4 h-4 text-luxury-gold" />
                                <select className="bg-transparent border-none outline-none text-xs font-bold text-black w-full appearance-none cursor-pointer">
                                    <option>Executive Club</option>
                                    <option>Royal Recliner (+{formatPrice(20)})</option>
                                    <option>Elite Box (+{formatPrice(40)})</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-10 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-1">Total Transaction</p>
                            <div className="text-3xl font-light flex items-baseline gap-2">
                                {formatPrice(selectedCinema.price * tickets)}
                                <span className="text-[10px] text-black/20 uppercase font-medium">Incl. Tax</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(`/checkout?type=movie&id=${movie.id}&name=${encodeURIComponent(movie.name)}&cinema=${encodeURIComponent(selectedCinema.name)}&time=${selectedTime}&tickets=${tickets}&price=${selectedCinema.price}`)}
                            className="w-full sm:w-auto px-12 py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-luxury-gold transition-all shadow-2xl flex items-center justify-center gap-3"
                        >
                            Finalize Booking
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function HotelResults({ 
  destination, 
  onBook, 
  filter, 
  selectedAmenities, 
  priceRange, 
  starRating, 
  hotelChain, 
  hotelSearch,
  checkIn,
  checkOut
 }: { 
  destination: string; 
  onBook: (hotel: any) => void; 
  filter: string; 
  selectedAmenities: string[];
  priceRange: number;
  starRating: number | null;
  hotelChain: string;
  hotelSearch: string;
  checkIn: string;
  checkOut: string;
}) {
    const { formatPrice } = useCurrency();

    const nights = (() => {
        const s = new Date(checkIn);
        const e = new Date(checkOut);
        if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
        const diff = e.getTime() - s.getTime();
        return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    })();
    
    const filteredHotelsByCity = HOTEL_DATA.filter(h => {
        const destLower = destination.toLowerCase();
        if (!destination || destLower === 'everywhere' || destLower.length < 2) return true;
        
        const cityLower = h.city.toLowerCase();
        const locationLower = h.location.toLowerCase();
        const nameLower = h.name.toLowerCase();
        
        let searchTerms = destLower.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        // Handle Bangalore/Bengaluru synonym
        if (searchTerms.some(t => t === 'bangalore' || t === 'bengaluru')) {
            if (!searchTerms.includes('bangalore')) searchTerms.push('bangalore');
            if (!searchTerms.includes('bengaluru')) searchTerms.push('bengaluru');
        }
        
        return searchTerms.some(term => 
            cityLower.includes(term) || 
            locationLower.includes(term) || 
            nameLower.includes(term) ||
            term.includes(cityLower)
        );
    });

    const resultsToFilter = filteredHotelsByCity.length > 0 ? filteredHotelsByCity : HOTEL_DATA;

    const filteredHotels = resultsToFilter.filter(h => {
        // Style filter
        if (filter !== 'all' && h.type !== filter) return false;
        
        // Amenities filter
        if (selectedAmenities.length > 0) {
            if (!selectedAmenities.every(amenity => h.amenities.includes(amenity))) return false;
        }

        // Price filter
        if (h.price > priceRange) return false;

        // Star rating filter
        if (starRating && Math.floor(h.rating) !== starRating) return false;

        // Chain filter
        if (hotelChain !== 'all' && h.chain !== hotelChain) return false;

        // Search query filter
        if (hotelSearch && !h.name.toLowerCase().includes(hotelSearch.toLowerCase())) return false;

        return true;
    });

    const getAmenityIcon = (type: string) => {
        switch(type) {
            case 'wifi': return <Wifi className="w-3.5 h-3.5" />;
            case 'pool': return <Waves className="w-3.5 h-3.5" />;
            case 'gym': return <Dumbbell className="w-3.5 h-3.5" />;
            case 'spa': return <Sparkles className="w-3.5 h-3.5" />;
            case 'butler': return <User className="w-3.5 h-3.5" />;
            case 'beach': return <Waves className="w-3.5 h-3.5" />;
            case 'parking': return <Car className="w-3.5 h-3.5" />;
            case 'coffee': return <Coffee className="w-3.5 h-3.5" />;
            case 'cuisine': return <Utensils className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    if (filteredHotels.length === 0) {
      return (
        <div className="p-20 text-center bg-black/5 rounded-[3rem] border border-dashed border-black/10">
          <p className="text-sm text-black/40 font-bold uppercase tracking-widest">No properties found matching your selection in {destination.split(',')[0]}</p>
          <p className="text-[10px] text-black/20 mt-2">Try broadening your search or resetting filters</p>
        </div>
      );
    }

    return (
        <div className="space-y-8">
            {filteredHotelsByCity.length === 0 && destination && destination.toLowerCase() !== 'everywhere' && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-luxury-gold/5 border border-luxury-gold/10 rounded-2xl flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-luxury-gold" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-black/60">Global Elite Collection</p>
                            <p className="text-[9px] text-black/30 font-medium italic">No exact matches in {destination.split(',')[0]} yet. Showcasing our most prestigious residencies worldwide.</p>
                        </div>
                    </div>
                </motion.div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredHotels.map(h => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={h.id} 
                  className="glass-panel group overflow-hidden rounded-[2.5rem] bg-white border border-black/5 shadow-sm hover:shadow-2xl transition-all"
                >
                    <div className="h-64 overflow-hidden relative">
                        <img src={h.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={h.name} referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-xs font-bold text-black border border-black/5 shadow-lg flex flex-col items-end">
                            <span className="text-[10px] text-black/40 uppercase tracking-tighter block mb-0.5">{nights} {nights === 1 ? 'Night' : 'Nights'} Stay</span>
                            {formatPrice(h.price * nights)}
                        </div>

                        {h.type === 'highly-rated' && (
                            <div className="absolute top-6 left-6 bg-luxury-gold text-white px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl">
                                Elite Collection
                            </div>
                        )}

                        <div className="absolute bottom-6 left-6 flex gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                             {h.amenities.slice(0, 3).map(a => (
                                <div key={a} className="p-2 bg-white/20 backdrop-blur rounded-lg text-white border border-white/20">
                                    {getAmenityIcon(a)}
                                </div>
                             ))}
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="flex items-start justify-between mb-2 gap-4">
                            <div>
                                <h4 className="luxury-text text-3xl text-black mb-1 leading-tight group-hover:text-luxury-gold transition-colors">{h.name}</h4>
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                     <MapPin className="w-3 h-3 text-luxury-gold" />
                                     <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">{h.location}, {h.city}</span>
                                     <div className="w-1 h-1 rounded-full bg-black/10" />
                                     <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold/60">{h.chain}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-luxury-gold/10 rounded-full text-luxury-gold border border-luxury-gold/5 shrink-0 h-fit">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs font-bold">{h.rating}</span>
                            </div>
                        </div>
                        <p className="text-sm text-black/50 mb-8 leading-relaxed font-light line-clamp-2 italic">"{h.description}"</p>
                        <div className="flex gap-4">
                            <button onClick={() => onBook(h)} className="flex-grow py-5 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-lg hover:shadow-luxury-gold/20 flex items-center justify-center gap-2">
                                <Hotel className="w-4 h-4" /> Reserve Suite
                            </button>
                            <button className="p-5 border border-black/10 rounded-2xl hover:border-black transition-all group/btn">
                                <Search className="w-4 h-4 text-black/40 group-hover/btn:text-black transition-colors" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
    )
}
function ActivityResults({ destination, onBook, filter }: { destination: string; onBook: (activity: any) => void; filter: string }) {
    const { formatPrice } = useCurrency();
    
    const filteredActivitiesByCity = ACTIVITY_DATA.filter(a => {
        const destLower = destination.toLowerCase();
        if (!destination || destLower === 'everywhere' || destLower.length < 2) return true;
        
        const cityLower = a.city.toLowerCase();
        const locationLower = a.location.toLowerCase();
        const nameLower = a.name.toLowerCase();
        
        let searchTerms = destLower.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        // Handle Bangalore/Bengaluru synonym
        if (searchTerms.some(t => t === 'bangalore' || t === 'bengaluru')) {
            if (!searchTerms.includes('bangalore')) searchTerms.push('bangalore');
            if (!searchTerms.includes('bengaluru')) searchTerms.push('bengaluru');
        }
        
        return searchTerms.some(term => 
            cityLower.includes(term) || 
            locationLower.includes(term) || 
            nameLower.includes(term) ||
            term.includes(cityLower)
        );
    });

    const resultsToFilter = filteredActivitiesByCity.length > 0 ? filteredActivitiesByCity : ACTIVITY_DATA;

    const filteredActivities = resultsToFilter.filter(a => {
        if (filter !== 'all' && a.type !== filter) return false;
        return true;
    });

    if (filteredActivities.length === 0) {
      return (
        <div className="p-20 text-center bg-black/5 rounded-[3rem] border border-dashed border-black/10">
          <p className="text-sm text-black/40 font-bold uppercase tracking-widest">No activities found in {destination.split(',')[0]}</p>
          <p className="text-[10px] text-black/20 mt-2">Try broadening your search or resetting filters</p>
        </div>
      );
    }

    return (
        <div className="space-y-8">
            {filteredActivitiesByCity.length === 0 && destination && destination.toLowerCase() !== 'everywhere' && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-luxury-gold/5 border border-luxury-gold/10 rounded-2xl flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-luxury-gold" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-black/60">Global Experiences</p>
                            <p className="text-[9px] text-black/30 font-medium italic">No direct matches for your location. Discover our highly-rated experiences around the world.</p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredActivities.map(a => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={a.id}
                        className="glass-panel group overflow-hidden rounded-[2.5rem] bg-white border border-black/5 shadow-sm hover:shadow-2xl transition-all h-full flex flex-col"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img src={a.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={a.name} referrerPolicy="no-referrer" />
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold text-black border border-black/5 shadow-md">
                                {formatPrice(a.price)}
                            </div>
                            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur px-3 py-1.5 rounded-xl text-[8px] font-bold text-white uppercase tracking-widest">
                                {a.type.replace('-', ' ')}
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="luxury-text text-xl text-black group-hover:text-luxury-gold transition-colors line-clamp-1">{a.name}</h4>
                                <div className="flex items-center gap-1 text-luxury-gold/80">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-[10px] font-bold">{a.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-3 h-3 text-luxury-gold" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/30">{a.location}, {a.city}</span>
                            </div>
                            <p className="text-xs text-black/50 mb-6 line-clamp-2 italic italic font-light leading-relaxed flex-grow">"{a.description}"</p>
                            <button 
                                onClick={() => onBook(a)}
                                className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                Acquire Access
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
