import { useState } from 'react';
import { Users, Plus, Share2, MessageSquare, ClipboardList, Wallet, MapPin, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { useCurrency } from '../contexts/CurrencyContext';

export default function GroupTravelPage() {
  const { formatPrice } = useCurrency();
  const [activeMembers] = useState([
    { name: 'James', avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Marcus', avatar: 'https://i.pravatar.cc/150?u=3' }
  ]);

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20 shadow-xl rounded-[4rem] p-12 bg-luxury-gold/5 border border-luxury-gold/10">
        <div className="max-w-xl">
           <h1 className="luxury-text text-6xl mb-6 text-black">Group <span className="italic text-luxury-gold">Synergy</span></h1>
           <p className="text-black/60 font-light leading-relaxed text-lg mb-8 uppercase tracking-tight">
             Coordinate with your travel party in real-time. Shared budgets, collective voting on activities, and unified itineraries.
           </p>
           <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                    {activeMembers.map((m, i) => (
                        <img key={i} src={m.avatar} className="w-12 h-12 rounded-full border-4 border-white" alt={m.name} />
                    ))}
                    <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center border-4 border-white hover:bg-luxury-gold transition-colors">
                        <UserPlus className="w-5 h-5" />
                    </button>
                </div>
                <div className="h-8 w-[1px] bg-black/10 mx-4" />
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-luxury-gold hover:text-black transition-colors">
                    <Share2 className="w-4 h-4" /> Invite via Link
                </button>
           </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
             <div className="glass-panel p-6 rounded-3xl flex items-center gap-6 bg-white border border-black/5 shadow-sm">
                <div className="text-right">
                    <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Shared Budget</div>
                    <div className="text-3xl luxury-text text-black">{formatPrice(12450)}</div>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-luxury-gold flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-luxury-gold" />
                </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Collaborative Board */}
        <div className="lg:col-span-2 space-y-12">
             <div className="flex items-center justify-between">
                <h2 className="luxury-text text-3xl italic text-black">Planning <span className="text-luxury-gold">Board</span></h2>
                <div className="flex gap-2">
                    <TabButton active label="Proposals" />
                    <TabButton label="Finalized" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <ProposalCard 
                    title="Villa Santorini" 
                    proposer="James" 
                    votes={2} 
                    price={formatPrice(450)}
                    image="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600"
                    formatPrice={formatPrice}
                 />
                 <ProposalCard 
                    title="Aman Venice" 
                    proposer="Sarah" 
                    votes={1} 
                    price={formatPrice(1200)}
                    image="https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=600"
                    formatPrice={formatPrice}
                 />
             </div>
        </div>

        {/* Real-time Group Chat / Activity */}
        <aside className="space-y-8">
            <div className="glass-panel p-8 rounded-[3rem] h-[600px] flex flex-col bg-white border border-black/5 shadow-sm">
                <h3 className="luxury-text text-2xl mb-6 italic text-black">Group <span className="text-luxury-gold">Feed</span></h3>
                <div className="flex-grow space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                    <ActivityItem user="Sarah" action="voted for" target="Villa Santorini" />
                    <ActivityItem user="Marcus" action="added" target="Private Boat Tour" />
                    <ActivityItem user="James" action="updated" target="Accommodation Budget" />
                    <ActivityItem user="Sarah" action="commented" target="'This looks incredible!'" />
                </div>
                <div className="mt-8 bg-black/5 rounded-2xl p-2 flex items-center gap-2 border border-black/5">
                    <input type="text" placeholder="Add a comment..." className="bg-transparent flex-grow px-4 text-xs outline-none text-black placeholder:text-black/30" />
                    <button className="p-2 bg-black text-white rounded-xl hover:bg-luxury-gold transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
}

function TabButton({ active, label }: any) {
    return (
        <button className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${active ? 'bg-black text-white shadow-md' : 'text-black/40 hover:text-black bg-black/5'}`}>
            {label}
        </button>
    )
}

function ProposalCard({ title, proposer, votes, price, image }: any) {
    return (
        <div className="glass-panel overflow-hidden rounded-[2.5rem] group border border-black/5 hover:border-luxury-gold/30 transition-all bg-white shadow-sm hover:shadow-lg">
            <div className="h-48 overflow-hidden relative">
                <img src={image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] flex items-center gap-2 text-black font-bold border border-black/5">
                    <Users className="w-3 h-3 text-luxury-gold" /> {votes} Votes
                </div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="luxury-text text-xl mb-1 text-black">{title}</h4>
                        <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">Proposed by {proposer}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <span className="text-xl font-light text-black">{price} <span className="text-[10px] uppercase text-black/20 font-bold">/ night</span></span>
                    <button className="px-6 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-sm">Vote</button>
                </div>
            </div>
        </div>
    )
}

function ActivityItem({ user, action, target }: any) {
    return (
        <div className="flex gap-4 items-start">
             <div className="w-2 h-2 rounded-full bg-luxury-gold mt-1.5" />
             <p className="text-xs leading-relaxed text-black/60 font-medium">
                <span className="font-bold text-black">{user}</span> {action} <span className="italic text-luxury-gold">{target}</span>
             </p>
        </div>
    )
}
