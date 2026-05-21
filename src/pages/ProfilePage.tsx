import { useState } from 'react';
import { useStore } from '../lib/store';
import { User, Map, Compass, Star, LogOut, ChevronRight, Plane, MapPin, CreditCard, Clock, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfilePage() {
  const { trips, loyaltyPoints } = useStore();
  const [activeSection, setActiveSection] = useState<'trips' | 'payments' | 'settings'>('trips');

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar / Sidebar Info */}
        <aside className="lg:col-span-1 space-y-8">
            <div className="text-center px-4">
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <img src="https://i.pravatar.cc/150?u=currentuser" className="w-full h-full rounded-full border-4 border-luxury-gold p-1" alt="Profile" />
                    <div className="absolute bottom-1 right-1 bg-luxury-gold p-2 rounded-full border-4 border-[#fafafa]">
                        <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                </div>
                <h2 className="luxury-text text-3xl mb-1 italic text-black">James <span className="text-luxury-gold">Sterling</span></h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 font-mono">Elite Member since 2024</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-4 border border-black/5">
                <ProfileLink 
                    icon={<Plane className="w-4 h-4" />} 
                    label="My Expeditions" 
                    active={activeSection === 'trips'}
                    onClick={() => setActiveSection('trips')}
                />
                <ProfileLink 
                    icon={<CreditCard className="w-4 h-4" />} 
                    label="Payment Identity" 
                    active={activeSection === 'payments'}
                    onClick={() => setActiveSection('payments')}
                />
                <div className="pt-4 border-t border-black/5">
                    <ProfileLink icon={<LogOut className="w-4 h-4" />} label="Sign Out" isDestructive />
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-12">
            {/* Loyalty Status */}
            <section className="glass-panel p-10 rounded-[4rem] bg-zinc-950 text-white border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 blur-[100px] rounded-full group-hover:bg-luxury-gold/10 transition-all duration-1000" />
                <div className="text-center md:text-left relative z-10">
                    <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-luxury-gold mb-6">Elite Status Tier</h3>
                    <div className="luxury-text text-6xl mb-4 italic text-white/90">DIAMOND <span className="text-white not-italic opacity-10">/ SKY</span></div>
                    <p className="text-sm text-white/40 max-w-md font-light leading-relaxed">
                        You're 2,450 points away from unlocking <span className="text-luxury-gold italic font-medium">Imperial Lounge</span> access worldwide.
                    </p>
                </div>
                <div className="text-center relative z-10">
                    <div className="text-[120px] luxury-text leading-none text-luxury-gold relative inline-block drop-shadow-sm">
                        {loyaltyPoints || 4580}
                        <div className="absolute -top-4 -right-12 text-xs font-bold uppercase tracking-widest text-white/20">PTS</div>
                    </div>
                </div>
            </section>

            <AnimatePresence mode="wait">
                {activeSection === 'trips' && (
                    <motion.div
                        key="trips"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-12"
                    >
                        {/* Saved Trips */}
                        <section>
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
                                <h3 className="luxury-text text-3xl italic text-black">Upcoming <span className="text-luxury-gold">Expeditions</span></h3>
                                <button className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">View All Archive</button>
                            </div>

                            <div className="space-y-6">
                                {trips.length > 0 ? trips.map((trip, idx) => (
                                    <TripSummaryCard key={trip.id} trip={trip} index={idx} />
                                )) : (
                                    <div className="py-20 text-center glass-panel rounded-[3rem] border-dashed border border-black/10">
                                        <Plane className="w-12 h-12 mx-auto mb-4 text-black/10" />
                                        <p className="text-sm text-black/30 italic">No upcoming voyages found.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Global Footprint */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard icon={<Map className="w-5 h-5 text-luxury-gold" />} val="24" label="Countries Explored" />
                            <StatCard icon={<Compass className="w-5 h-5 text-luxury-gold" />} val="12" label="Global Expeditions" />
                            <StatCard icon={<Star className="w-5 h-5 text-luxury-gold" />} val="4.8" label="Average Rating" />
                        </section>
                    </motion.div>
                )}

                {activeSection === 'payments' && (
                    <motion.div
                        key="payments"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-12"
                    >
                        <section>
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
                                <h3 className="luxury-text text-3xl italic text-black">Stored <span className="text-luxury-gold">Instruments</span></h3>
                                <button className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold hover:text-black transition-all">+ Add New Identity</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black text-white relative overflow-hidden group shadow-2xl border border-white/5">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 blur-3xl rounded-full" />
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur">
                                            <CreditCard className="w-6 h-6 text-luxury-gold" />
                                        </div>
                                        <div className="text-[10px] font-black italic tracking-widest opacity-20">PLATINUM SKYSET</div>
                                    </div>
                                    <div className="text-2xl tracking-[0.2em] font-light mb-8">•••• •••• •••• 8842</div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[7px] uppercase font-bold tracking-widest opacity-30 mb-1">Holder</p>
                                            <p className="text-xs font-bold tracking-widest uppercase">JAMES STERLING</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[7px] uppercase font-bold tracking-widest opacity-30 mb-1">Member Since</p>
                                            <p className="text-xs font-bold tracking-widest">08 / 24</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-panel p-8 rounded-[2.5rem] bg-white border-dashed border-2 border-black/5 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-luxury-gold/40 transition-all">
                                    <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-luxury-gold/5 transition-all">
                                        <Lock className="w-8 h-8 text-black/10 group-hover:text-luxury-gold/40 transition-all" />
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-black/40">Secure Identity Reserve</p>
                                    <p className="text-[10px] text-black/20 font-medium italic mt-1">Connect your crypto vault or bank profile.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
                                <h3 className="luxury-text text-3xl italic text-black">Financial <span className="text-luxury-gold">Log</span></h3>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'Booking #SK-2942', date: 'May 10, 2026', amount: '$4,250.00', status: 'Authorized' },
                                    { label: 'SkyPoints Redemption', date: 'May 08, 2026', amount: '-2,500 PTS', status: 'Secured' },
                                    { label: 'Lounge Access Upgrade', date: 'April 22, 2026', amount: '$150.00', status: 'Authorized' }
                                ].map((item, i) => (
                                    <div key={i} className="glass-panel p-6 rounded-3xl border border-black/5 flex items-center justify-between hover:border-luxury-gold/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-black/20" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-bold text-black uppercase tracking-widest">{item.label}</h5>
                                                <p className="text-[10px] text-black/40 font-medium">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-bold ${item.amount.includes('-') ? 'text-black/40' : 'text-black'}`}>{item.amount}</div>
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <ShieldCheck className="w-3 h-3 text-green-500" />
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-green-600">{item.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProfileLink({ icon, label, isDestructive, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center justify-between w-full p-2 group transition-all font-bold ${isDestructive ? 'text-red-500 hover:text-red-700' : (active ? 'text-luxury-gold' : 'text-black/60 hover:text-luxury-gold')}`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-luxury-gold/10' : 'bg-black/5 group-hover:bg-luxury-gold/10'}`}>
                    {icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-all ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0'}`} />
        </button>
    )
}

function TripSummaryCard({ trip, index }: { trip: any; index: number; [key: string]: any }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center group cursor-pointer hover:border-luxury-gold/30 transition-all border border-black/5"
        >
            <div className="flex items-center gap-6 mb-6 md:mb-0">
                <div className="h-20 w-20 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border border-black/5">
                    <img 
                        src={`https://images.unsplash.com/photo-1500835595561-82a0c6499f5a?auto=format&fit=crop&q=80&w=200&h=200&destination=${encodeURIComponent(trip.destination)}`} 
                        className="w-full h-full object-cover" 
                        alt="Trip" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=200&h=200';
                        }}
                    />
                </div>
                <div>
                    <h4 className="luxury-text text-2xl mb-1 text-black">{trip.destination}</h4>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest flex items-center gap-4">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-luxury-gold" /> {trip.startDate.split('T')[0]}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3 text-luxury-gold" /> {trip.participants.length} Person</span>
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <button className="px-6 py-2 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all text-black/60 hover:text-black">Manager</button>
                <button className="px-6 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-colors shadow-sm">Documents</button>
            </div>
        </motion.div>
    )
}

function StatCard({ icon, val, label }: any) {
    return (
        <div className="glass-panel p-8 rounded-[2.5rem] text-center border border-black/5 shadow-sm">
            <div className="mb-4 inline-block p-4 rounded-2xl bg-black/5 shadow-inner">{icon}</div>
            <div className="text-4xl luxury-text mb-1 text-black">{val}</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">{label}</div>
        </div>
    )
}

