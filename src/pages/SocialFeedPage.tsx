import { useState } from 'react';
import { Camera, MapPin, Heart, MessageCircle, Send, Plus, Users, Compass, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function SocialFeedPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'friends'>('discover');

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div>
           <h1 className="luxury-text text-5xl mb-4 text-black">Wander <span className="text-luxury-gold italic">Together</span></h1>
           <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                <button onClick={() => setActiveTab('discover')} className={`pb-2 border-b-2 transition-all ${activeTab === 'discover' ? 'border-luxury-gold text-black' : 'border-transparent hover:text-black'}`}>Discover</button>
                <button onClick={() => setActiveTab('friends')} className={`pb-2 border-b-2 transition-all ${activeTab === 'friends' ? 'border-luxury-gold text-black' : 'border-transparent hover:text-black'}`}>Following</button>
                <div className="flex-grow h-[1px] bg-black/5" />
           </div>
        </div>
        
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3">
             <Search className="w-4 h-4 text-black/40" />
             <input type="text" placeholder="Find travelers..." className="bg-transparent text-xs outline-none w-48 text-black placeholder:text-black/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
            <SocialPost 
                user="Alex Rivera"
                avatar="https://i.pravatar.cc/150?u=alex"
                location="Bali, Indonesia"
                image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800"
                caption="Finally made it to the Sacred Monkey Forest. The architecture here is just surreal."
                likes={1240}
                comments={82}
            />
            <SocialPost 
                user="Elena Chen"
                avatar="https://i.pravatar.cc/150?u=elena"
                location="Kyoto, Japan"
                image="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800"
                caption="Cherry blossoms at golden hour. Nothing compares to this peaceful moment."
                likes={3105}
                comments={156}
            />
        </div>

        <aside className="space-y-8">
            <div className="glass-panel p-8 rounded-[3rem] border border-black/5">
                <h3 className="luxury-text text-2xl mb-6 italic text-black">Active <span className="text-luxury-gold">Expeditions</span></h3>
                <p className="text-xs text-black/40 mb-8 leading-relaxed font-medium">Connect with groups currently planning these journeys.</p>
                
                <div className="space-y-6">
                    <ExpeditionItem 
                        dest="Iceland Northern Lights"
                        members={8}
                        days="Remaining: 12d"
                        image="https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=200"
                    />
                    <ExpeditionItem 
                        dest="Patagonia Trekking"
                        members={12}
                        days="Remaining: 5d"
                        image="https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=200"
                    />
                </div>

                <button className="w-full mt-10 py-5 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-colors">
                    Start New Group
                </button>
            </div>

            <div className="glass-panel p-8 rounded-[3rem]">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-black/60">Top Guide</h3>
                <div className="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/150?u=guide" className="w-12 h-12 rounded-full border-2 border-luxury-gold" alt="Guide" referrerPolicy="no-referrer" />
                    <div>
                        <h4 className="font-bold text-black">Julian Vane</h4>
                        <div className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest text-black/40">Global Elite Guide</div>
                    </div>
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
}

function SocialPost({ user, avatar, location, image, caption, likes, comments }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <img src={avatar} className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all duration-500" alt={user} referrerPolicy="no-referrer" />
                    <div>
                        <h4 className="font-bold text-sm tracking-tight text-black">{user}</h4>
                        <p className="text-[10px] text-black/40 flex items-center gap-1 uppercase tracking-widest leading-none font-bold">
                            <MapPin className="w-2 h-2 text-luxury-gold" /> {location}
                        </p>
                    </div>
                </div>
                <button className="p-2 hover:bg-black/5 rounded-full transition-all">
                    <Plus className="w-5 h-5 text-black/20 hover:text-black" />
                </button>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-6">
                <img src={image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Post" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex items-center gap-8 mb-4 ml-2">
                <div className="flex items-center gap-2 group/action cursor-pointer">
                    <Heart className="w-5 h-5 text-black/20 group-hover/action:text-red-500 transition-colors" />
                    <span className="text-xs font-bold text-black/40">{likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 group/action cursor-pointer">
                    <MessageCircle className="w-5 h-5 text-black/20 group-hover/action:text-luxury-gold transition-colors" />
                    <span className="text-xs font-bold text-black/40">{comments}</span>
                </div>
                <div className="flex items-center gap-2 group/action cursor-pointer ml-auto">
                    <Send className="w-5 h-5 text-black/20 group-hover/action:text-black transition-colors" />
                </div>
            </div>

            <p className="px-2 text-sm leading-relaxed text-black/70 font-light">
                <span className="font-bold mr-2 text-black">{user}</span> {caption}
            </p>
        </motion.div>
    )
}

function ExpeditionItem({ dest, members, days, image }: any) {
    return (
        <div className="flex items-center gap-4 group cursor-pointer">
            <img src={image} className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all border border-black/5" alt={dest} referrerPolicy="no-referrer" />
            <div className="flex-grow">
                <h4 className="text-sm font-bold tracking-tight mb-1 text-black">{dest}</h4>
                <div className="flex items-center gap-3 text-[10px] text-black/40 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-luxury-gold" /> {members}</span>
                    <span>{days}</span>
                </div>
            </div>
        </div>
    )
}
