import { useState } from 'react';
import { Camera, MapPin, Calendar, Plus, Save, Image as ImageIcon, Trash2, Book } from 'lucide-react';
import { useStore, JournalEntry } from '../lib/store';
import { motion, AnimatePresence } from 'motion/react';

export default function TravelJournalPage() {
  const { journal, addJournalEntry } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', location: '' });

  const handleSave = () => {
    const entry: JournalEntry = {
        id: Math.random().toString(36).substr(2, 9),
        tripId: 'manual',
        title: newEntry.title,
        content: newEntry.content,
        date: new Date().toLocaleDateString(),
        images: [`https://images.unsplash.com/photo-1500835595561-82a0c6499f5a?auto=format&fit=crop&q=80&w=800&h=600&sig=${encodeURIComponent(newEntry.location || 'travel')}`]
    };
    addJournalEntry(entry);
    setIsAdding(false);
    setNewEntry({ title: '', content: '', location: '' });
  };

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12">
      <div className="flex justify-between items-end mb-16 border-b border-black/5 pb-8">
        <div>
           <h1 className="luxury-text text-5xl mb-4 italic text-black">The <span className="text-luxury-gold">Archive</span></h1>
           <p className="text-xs text-black/40 uppercase tracking-[0.3em] font-bold">Documenting your global narratives</p>
        </div>
        <button 
           onClick={() => setIsAdding(true)}
           className="bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-luxury-gold transition-all"
        >
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-16"
            >
                <div className="glass-panel p-8 rounded-[3rem] space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <input 
                            type="text" 
                            placeholder="Chapter Title" 
                            className="bg-black/5 border border-black/5 rounded-2xl p-4 outline-none focus:border-luxury-gold text-black placeholder:text-black/20 font-medium" 
                            value={newEntry.title}
                            onChange={e => setNewEntry(prev => ({...prev, title: e.target.value}))}
                        />
                        <input 
                            type="text" 
                            placeholder="Location" 
                            className="bg-black/5 border border-black/5 rounded-2xl p-4 outline-none focus:border-luxury-gold text-black placeholder:text-black/20 font-medium" 
                            value={newEntry.location}
                            onChange={e => setNewEntry(prev => ({...prev, location: e.target.value}))}
                        />
                    </div>
                    <textarea 
                        placeholder="Write your story..." 
                        rows={6}
                        className="w-full bg-black/5 border border-black/5 rounded-2xl p-6 outline-none focus:border-luxury-gold resize-none text-black placeholder:text-black/20 font-light"
                        value={newEntry.content}
                        onChange={e => setNewEntry(prev => ({...prev, content: e.target.value}))}
                    />
                    <div className="flex justify-between items-center">
                        <button className="flex items-center gap-2 text-[10px] uppercase font-bold text-black/40 hover:text-black transition-colors tracking-widest">
                            <ImageIcon className="w-4 h-4" /> Add Visuals
                        </button>
                        <div className="flex gap-4">
                            <button onClick={() => setIsAdding(false)} className="text-[10px] font-bold uppercase tracking-widest px-6 py-2 border border-black/10 rounded-full hover:border-black transition-all text-black">Cancel</button>
                            <button onClick={handleSave} className="text-[10px] font-bold uppercase tracking-widest px-8 py-2 bg-black text-white rounded-full hover:bg-luxury-gold transition-all">Publish to Archive</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {journal.length > 0 ? journal.map((entry, idx) => (
            <JournalCard key={entry.id} entry={entry} index={idx} />
        )) : (
            <div className="lg:col-span-3 py-32 text-center opacity-40 grayscale group">
                <Book className="w-16 h-16 mx-auto mb-6 text-black/20 group-hover:text-luxury-gold transition-colors" />
                <p className="luxury-text text-2xl italic tracking-widest text-black/20">Your archive is currently empty.</p>
            </div>
        )}
      </div>
    </div>
  );
}

function JournalCard({ entry, index }: { entry: JournalEntry; index: number; [key: string]: any }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
        >
            <div className="aspect-square rounded-[3rem] overflow-hidden mb-6 relative border border-black/5">
                 <img src={entry.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={entry.title} referrerPolicy="no-referrer" />
                 <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-black border border-black/5">
                    <Calendar className="w-3 h-3 text-luxury-gold" /> {entry.date}
                 </div>
            </div>
            <div>
                 <h3 className="luxury-text text-2xl mb-2 group-hover:text-luxury-gold transition-colors text-black">{entry.title}</h3>
                 <p className="text-black/40 text-sm font-light leading-relaxed line-clamp-3 mb-6">{entry.content}</p>
                 <button className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-8 decoration-luxury-gold/40 hover:decoration-luxury-gold transition-all text-black">
                    Read Chapter
                 </button>
            </div>
        </motion.div>
    )
}
