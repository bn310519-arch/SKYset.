import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Wallet, Users, Save, Download, Share2, MapPin, Clock, Plus, Trash2, LayoutList, Calendar as CalendarIcon, Hotel } from 'lucide-react';
import { generateItinerary, AISuggestion } from '../lib/gemini';
import { useStore, Trip, ItineraryItem } from '../lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../contexts/CurrencyContext';

export default function TripPlannerPage() {
  const { addTrip } = useStore();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [destination, setDestination] = useState('');
  const [tripDetails, setTripDetails] = useState('');
  const [days, setDays] = useState(3);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('Medium');
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<AISuggestion[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isGroupTrip, setIsGroupTrip] = useState(false);
  const [groupBudget, setGroupBudget] = useState<{name: string, spent: number, total: number}[]>([
    { name: 'Accommodation', spent: 0, total: 1000 },
    { name: 'Airfare', spent: 0, total: 1500 },
    { name: 'Dining', spent: 0, total: 500 }
  ]);

  const handleGenerate = async () => {
    setIsLoading(true);
    const result = await generateItinerary(destination, days, budget, tripDetails);
    setItinerary(result);
    setIsLoading(false);
  };

  const handleSaveTrip = () => {
    const newTrip: Trip = {
        id: Math.random().toString(36).substr(2, 9),
        destination,
        description: tripDetails,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
        budget: parseInt(budget === 'Luxury' ? '5000' : budget === 'Medium' ? '2000' : '800'),
        participants: isGroupTrip ? ['User', 'Friend 1'] : ['User'],
        itinerary: itinerary.map((item, idx) => ({
            id: idx.toString(),
            day: item.day,
            time: item.time,
            activity: item.activity,
            location: item.location,
            cost: item.estimatedCost,
            type: 'activity'
        })),
        status: 'planning'
    };
    addTrip(newTrip);
    alert('Trip saved to your profile!');
  };

  const totalCost = itinerary.reduce((sum, item) => sum + item.estimatedCost, 0);

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
        <div className="max-w-2xl">
          <h1 className="luxury-text text-6xl mb-6 tracking-tighter text-black">Plan your next <span className="italic text-luxury-gold">Legacy</span></h1>
          <p className="text-black/60 font-light leading-relaxed text-lg">
            Our AI architect will curate a bespoke itinerary based on your desires, budget, and travel party preferences.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-[3rem] w-full md:w-[400px] space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Destination</label>
            <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
              <MapPin className="text-luxury-gold w-5 h-5" />
              <input 
                type="text" 
                placeholder="Where to?" 
                className="bg-transparent outline-none w-full text-black placeholder:text-black/20" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Start Date</label>
              <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                <input 
                    type="date" 
                    className="bg-transparent outline-none w-full text-xs text-black" 
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate) {
                        const start = new Date(e.target.value);
                        const end = new Date(endDate);
                        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                        if (diff > 0) setDays(diff);
                      }
                    }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">End Date</label>
              <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                <input 
                    type="date" 
                    className="bg-transparent outline-none w-full text-xs text-black" 
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (startDate) {
                        const start = new Date(startDate);
                        const end = new Date(e.target.value);
                        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                        if (diff > 0) setDays(diff);
                      }
                    }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Duration (Days)</label>
              <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5 focus-within:border-luxury-gold transition-colors">
                <Calendar className="text-luxury-gold w-5 h-5" />
                <input 
                    type="number" 
                    min="1"
                    max="90"
                    placeholder="Days"
                    className="bg-transparent outline-none w-full text-black" 
                    value={days}
                    onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Participants</label>
              <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3 border border-black/5">
                <Users className="text-luxury-gold w-5 h-5" />
                <input 
                    type="number" 
                    min="1"
                    placeholder="Count"
                    className="bg-transparent outline-none w-full text-black" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Budget Level</label>
            <select 
              className="bg-black/5 rounded-2xl p-4 w-full border border-black/5 outline-none appearance-none text-xs text-black focus:border-luxury-gold transition-colors"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value="Economy">Economy</option>
              <option value="Medium">Standard</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Trip Details</label>
            <div className="bg-black/5 rounded-2xl p-4 border border-black/5 focus-within:border-luxury-gold transition-colors">
              <textarea 
                rows={3}
                placeholder="Describe your dream trip (e.g., 'Modern architecture tour with local food focus')..." 
                className="bg-transparent outline-none w-full text-xs text-black placeholder:text-black/20 resize-none" 
                value={tripDetails}
                onChange={(e) => setTripDetails(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 py-2 ml-4">
            <input 
                type="checkbox" 
                id="group" 
                className="w-5 h-5 rounded bg-black/5 border border-black/10 checked:bg-luxury-gold accent-luxury-gold" 
                checked={isGroupTrip}
                onChange={(e) => setIsGroupTrip(e.target.checked)}
            />
            <label htmlFor="group" className="text-xs uppercase tracking-widest font-bold cursor-pointer flex items-center gap-2 text-black/40">
                 <Users className="w-4 h-4" /> Group Planning
            </label>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !destination}
            className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-luxury-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isLoading ? 'Designing...' : 'Generate Itinerary'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {itinerary.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-2 space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-black/5 pb-8 gap-6">
                 <div className="space-y-1">
                  <h2 className="luxury-text text-4xl italic text-black">The <span className="text-luxury-gold">Blueprint</span></h2>
                  {tripDetails && <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest ml-1">{tripDetails}</p>}
                 </div>
                 
                 <div className="flex items-center gap-4">
                    {viewMode === 'calendar' && (
                      <button 
                        onClick={() => navigate(`/search?tab=hotels&q=${destination}`)}
                        className="hidden md:flex items-center gap-2 px-6 py-2 bg-luxury-gold text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-luxury-gold/20"
                      >
                        <Hotel className="w-3.5 h-3.5" /> Book Entire Stay
                      </button>
                    )}
                    <div className="flex bg-black/5 p-1 rounded-full border border-black/5">
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black/60'}`}
                      >
                        <LayoutList className="w-3.5 h-3.5" /> List
                      </button>
                      <button 
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black/60'}`}
                      >
                        <CalendarIcon className="w-3.5 h-3.5" /> Calendar
                      </button>
                    </div>

                    <div className="w-px h-6 bg-black/10 mx-2 hidden md:block" />

                    <div className="flex gap-2">
                      <button onClick={handleSaveTrip} className="p-3 glass-panel rounded-full hover:bg-black hover:text-white transition-all text-black">
                          <Save className="w-5 h-5" />
                      </button>
                      <button className="p-3 glass-panel rounded-full hover:bg-black hover:text-white transition-all text-black">
                          <Share2 className="w-5 h-5" />
                      </button>
                      <button className="p-3 glass-panel rounded-full hover:bg-black hover:text-white transition-all text-black">
                          <Download className="w-5 h-5" />
                      </button>
                    </div>
                 </div>
              </div>

              {viewMode === 'list' ? (
                <div className="space-y-16">
                   {Array.from({ length: days }).map((_, d) => (
                      <div key={d} className="relative pl-12 border-l border-black/5 space-y-8">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-luxury-gold box-content border-4 border-[#fafafa]" />
                          <h3 className="luxury-text text-2xl mb-8 text-black">Day {d + 1}</h3>
                          
                          {itinerary.filter(item => item.day === d + 1).map((item, idx) => (
                              <motion.div 
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="glass-panel p-6 rounded-3xl flex gap-6 items-center"
                              >
                                  <div className="text-luxury-gold font-bold text-xs uppercase tracking-widest min-w-[80px]">{item.time}</div>
                                  <div className="flex-grow">
                                      <h4 className="text-lg font-bold mb-1 tracking-tight text-black">{item.activity}</h4>
                                      <p className="text-xs text-black/40 flex items-center gap-2 font-medium"><MapPin className="w-3 h-3 text-luxury-gold" /> {item.location}</p>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-lg font-light text-black">{formatPrice(item.estimatedCost)}</div>
                                      <p className="text-[10px] text-black/20 italic max-w-[150px] leading-tight mt-1 font-medium">{item.reasoning}</p>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                   ))}
                </div>
              ) : (
                <div className="overflow-x-auto pb-8">
                  <div className="flex gap-6 min-w-max pb-4">
                    {Array.from({ length: days }).map((_, d) => (
                      <div key={d} className="w-[280px] space-y-6">
                        <div className="bg-black text-white p-6 rounded-[2rem] text-center shadow-luxury">
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 block mb-1">Schedule</span>
                          <h3 className="luxury-text text-2xl mb-4">Day {d + 1}</h3>
                          <button 
                            onClick={() => navigate(`/search?tab=hotels&q=${destination}`)}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                            <Hotel className="w-3.5 h-3.5" /> Book Accommodations
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {itinerary.filter(item => item.day === d + 1).map((item, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="glass-panel p-5 rounded-[2rem] border border-black/5 hover:border-luxury-gold/30 transition-all group"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-luxury-gold bg-luxury-gold/5 px-2 py-0.5 rounded-full">{item.time}</span>
                                <span className="text-[10px] font-light text-black/40">{formatPrice(item.estimatedCost)}</span>
                              </div>
                              <h4 className="text-sm font-bold tracking-tight text-black mb-2 line-clamp-2 group-hover:text-luxury-gold transition-colors">{item.activity}</h4>
                              <p className="text-[9px] text-black/40 flex items-center gap-1 font-medium truncate italic">
                                <MapPin className="w-2.5 h-2.5 text-luxury-gold shrink-0" /> {item.location}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-8">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-luxury-gold/10 bg-luxury-gold/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-black">Total Investment</h3>
                        <Wallet className="w-4 h-4 text-luxury-gold" />
                    </div>
                    <div className="text-5xl luxury-text mb-2 text-black">{formatPrice(totalCost)}</div>
                    
                    {/* Budget Utilization Meter */}
                    <div className="mt-6 mb-8 space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Budget Utilization</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          totalCost > (budget === 'Luxury' ? 5000 : budget === 'Medium' ? 2000 : 800) 
                          ? 'text-red-500' 
                          : 'text-luxury-gold'
                        }`}>
                          {Math.round((totalCost / (budget === 'Luxury' ? 5000 : budget === 'Medium' ? 2000 : 800)) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((totalCost / (budget === 'Luxury' ? 5000 : budget === 'Medium' ? 2000 : 800)) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full transition-colors ${
                            totalCost > (budget === 'Luxury' ? 5000 : budget === 'Medium' ? 2000 : 800) 
                            ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                            : 'bg-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-black/20">
                        <span>Optimized</span>
                        <span>{budget} Cap ({formatPrice(budget === 'Luxury' ? 5000 : budget === 'Medium' ? 2000 : 800)})</span>
                      </div>
                    </div>

                    <p className="text-xs text-black/40 mb-8 font-medium">Estimated total excluding international flights and taxes.</p>
                    
                    <button className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-luxury-gold transition-all">
                        Initiate Booking
                    </button>
                </div>

                {isGroupTrip && (
                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="luxury-text text-2xl italic text-black">Collective <span className="text-luxury-gold">Budget</span></h3>
                            <Users className="w-5 h-5 text-luxury-gold" />
                        </div>
                        
                        <div className="space-y-6">
                            {groupBudget.map((b, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-black/60">
                                        <span>{b.name}</span>
                                        <span>75% Spent</span>
                                    </div>
                                    <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-luxury-gold" style={{ width: '75%' }} />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-black/40 font-bold">
                                        <span>{formatPrice(b.spent)}</span>
                                        <span>{formatPrice(b.total)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-3 border border-black/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-black hover:border-black transition-all flex items-center justify-center gap-2">
                            <Plus className="w-3 h-3" /> Add Shared Expense
                        </button>
                    </div>
                )}
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
