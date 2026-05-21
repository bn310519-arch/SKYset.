import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Map, Users, Share2, BookOpen, User, Search, MessageSquare, Sun, TrendingUp, Globe, Info, Phone, Instagram, MessageCircle, MapPin } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import TripPlannerPage from './pages/TripPlannerPage';
import GroupTravelPage from './pages/GroupTravelPage';
import SocialFeedPage from './pages/SocialFeedPage';
import TravelJournalPage from './pages/TravelJournalPage';
import ProfilePage from './pages/ProfilePage';
import ServicesPage from './pages/ServicesPage';
import CheckoutPage from './pages/CheckoutPage';
import Chatbot from './components/Chatbot';
import Logo from './components/Logo';
import { CurrencyProvider, useCurrency, Currency } from './contexts/CurrencyContext';

export default function App() {
  return (
    <CurrencyProvider>
        <AppContent />
    </CurrencyProvider>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/planner" element={<TripPlannerPage />} />
              <Route path="/groups" element={<GroupTravelPage />} />
              <Route path="/social" element={<SocialFeedPage />} />
              <Route path="/journal" element={<TravelJournalPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Chatbot />
      
      <footer className="py-16 px-6 md:px-12 border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16 text-left">
          <div className="lg:col-span-1">
            <Logo className="mb-6" iconSize={40} textSize="text-3xl" />
            <p className="text-xs text-black/40 leading-relaxed font-light mb-6">
              Redefining global travel through bespoke itineraries and exclusive sanctuary access.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-luxury-gold transition-colors cursor-pointer">
                <Globe className="w-4 h-4 text-black/20 group-hover:text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-luxury-gold transition-colors cursor-pointer">
                <Users className="w-4 h-4 text-black/20" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-6 font-mono">Discovery</h4>
            <ul className="space-y-4 text-xs font-medium text-black/40">
              <li><Link to="/search" className="hover:text-luxury-gold transition-colors">Global Destinations</Link></li>
              <li><Link to="/planner" className="hover:text-luxury-gold transition-colors">Trip Architect</Link></li>
              <li><Link to="/social" className="hover:text-luxury-gold transition-colors">Traveler Network</Link></li>
              <li><Link to="/groups" className="hover:text-luxury-gold transition-colors">Shared Expeditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-6 font-mono">Contact</h4>
            <ul className="space-y-4 text-xs font-medium text-black/40">
              <li className="flex items-center gap-3">
                <Phone className="w-3 h-3 text-luxury-gold" />
                <span>+91 8792653387</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-3 h-3 text-luxury-gold" />
                <span>Hassan, Karnataka</span>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="w-3 h-3 text-luxury-gold" />
                <a href="https://instagram.com/bharath_naik_21" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors">@bharath_naik_21</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-3 h-3 text-luxury-gold" />
                <a href="https://wa.me/918792653387" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors">WhatsApp</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-6 font-mono">Resources</h4>
            <ul className="space-y-4 text-xs font-medium text-black/40">
              <li><Link to="/services" className="hover:text-luxury-gold transition-colors">Flights & Transport</Link></li>
              <li><Link to="/services" className="hover:text-luxury-gold transition-colors">Before You Fly</Link></li>
              <li><Link to="/services" className="hover:text-luxury-gold transition-colors">Premium Airport Support</Link></li>
              <li><Link to="/services" className="hover:text-luxury-gold transition-colors">Corporate Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-6 font-mono">Legal</h4>
            <ul className="space-y-4 text-xs font-medium text-black/40">
              <li className="hover:text-luxury-gold transition-colors cursor-pointer">Privacy Charter</li>
              <li className="hover:text-luxury-gold transition-colors cursor-pointer">Terms of Carriage</li>
              <li className="hover:text-luxury-gold transition-colors cursor-pointer">Sustainability</li>
              <li className="hover:text-luxury-gold transition-colors cursor-pointer">Compliance</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-black/20 font-bold uppercase tracking-widest">&copy; 2026 Skyset. All horizons reserved.</p>
          <div className="flex gap-8 text-[10px] text-black/20 font-bold uppercase tracking-widest">
            <span className="hover:text-black transition-colors cursor-pointer">Support</span>
            <span className="hover:text-black transition-colors cursor-pointer">Newsroom</span>
            <span className="hover:text-black transition-colors cursor-pointer">Advisory Board</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Navbar() {
  const { currency, setCurrency } = useCurrency();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 py-4 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/profile" className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-luxury-gold overflow-hidden hover:scale-105 transition-transform">
            <img 
              src="https://i.pravatar.cc/150?u=currentuser" 
              className="w-full h-full object-cover" 
              alt="Profile" 
              referrerPolicy="no-referrer"
            />
          </div>
        </Link>
        <Link to="/">
          <Logo />
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-black/40">
        <Link to="/search" className="hover:text-black transition-colors flex items-center gap-2">
          <Search className="w-4 h-4" /> Explore
        </Link>
        <Link to="/planner" className="hover:text-black transition-colors flex items-center gap-2">
          <Map className="w-4 h-4" /> Planner
        </Link>
        <Link to="/groups" className="hover:text-black transition-colors flex items-center gap-2">
          <Users className="w-4 h-4" /> Groups
        </Link>
        <Link to="/social" className="hover:text-black transition-colors flex items-center gap-2">
          <Share2 className="w-4 h-4" /> Community
        </Link>
        <Link to="/services" className="hover:text-black transition-colors flex items-center gap-2">
          <Info className="w-4 h-4" /> Services
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-black/5 px-3 py-2 rounded-full border border-black/5 transition-colors hover:border-black/10">
          <Globe className="w-3 h-3 text-luxury-gold" />
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer text-black/60"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        <Link to="/journal" className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <BookOpen className="w-5 h-5 text-black/60" />
        </Link>
        <Link to="/profile" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tighter hover:bg-luxury-gold transition-colors">
          <User className="w-4 h-4" /> Profile
        </Link>
      </div>
    </nav>
  );
}
