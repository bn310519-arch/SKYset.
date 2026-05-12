import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  Car, 
  ShoppingBag, 
  Info, 
  MapPin, 
  Briefcase, 
  ChevronDown, 
  ShieldCheck, 
  Coffee, 
  Globe, 
  Users, 
  Gift,
  HelpCircle,
  Clock,
  Hotel
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'flights',
    title: 'Flights',
    icon: <Plane className="w-6 h-6" />,
    items: [
      { name: 'Book a Flight', desc: 'Find and book your next luxury journey.', link: '/search?tab=flights' },
      { name: 'Manage Booking', desc: 'Update your seat, meal, or travel dates.', link: '/profile' },
      { name: 'Check-in', desc: 'Secure your boarding pass online.', link: '/search?tab=flights' },
      { name: 'Flight Status', desc: 'Real-time updates on departures and arrivals.', link: '/search?tab=flights' }
    ]
  },
  {
    id: 'hotels',
    title: 'Hotels',
    icon: <Hotel className="w-6 h-6" />,
    items: [
      { name: 'Book a Hotel', desc: 'Discover exclusive sanctuaries and boutique retreats.', link: '/search?tab=hotels' },
      { name: 'Loyalty Suites', desc: 'Unlock hidden rooms with your Skyset Elite status.', link: '/profile' },
      { name: 'Spa & Wellness', desc: 'Bespoke rejuvenation packages in premium resorts.', link: '/search?tab=activities' },
      { name: 'Private Residences', desc: 'Home-away-from-home luxury for extended stays.', link: '/search?tab=hotels' }
    ]
  },
  {
    id: 'transport',
    title: 'Transport',
    icon: <Car className="w-6 h-6" />,
    items: [
      { name: 'Car Rentals', desc: 'Premium vehicles waiting for your arrival.', link: '/search?tab=flights' },
      { name: 'Chauffeur Services', desc: 'Door-to-door luxury transportation.', link: '/search?tab=flights' },
      { name: 'Global Transfers', desc: 'Seamless connections between terminals and cities.', link: '/search?tab=flights' },
      { name: 'Airport Parking', desc: 'Reserved spots in secure, premium locations.', link: '/search?tab=flights' }
    ]
  },
  {
    id: 'before-you-fly',
    title: 'Before You Fly',
    icon: <ShieldCheck className="w-6 h-6" />,
    items: [
      { name: 'Visa Requirements', desc: 'Check entry rules for your destination.', link: '/planner' },
      { name: 'Baggage Allowance', desc: 'Details on carry-on and checked luggage limits.', link: '/search?tab=flights' },
      { name: 'Travel Insurance', desc: 'Protect your journey with comprehensive coverage.', link: '/profile' },
      { name: 'Health & Safety', desc: 'Latest updates on vaccinations and protocols.', link: '/planner' }
    ]
  },
  {
    id: 'at-the-airport',
    title: 'At The Airport',
    icon: <Coffee className="w-6 h-6" />,
    items: [
      { name: 'Luxury Lounges', desc: 'Access our exclusive Diamond Sky retreats.', link: '/profile' },
      { name: 'Duty Free', desc: 'Pre-order luxury goods for collection.', link: '/search?tab=activities' },
      { name: 'Terminal Info', desc: 'Maps and guides for major global hubs.', link: '/search?tab=flights' },
      { name: 'Priority Boarding', desc: 'Skip the queues with Elite status.', link: '/profile' }
    ]
  },
  {
    id: 'services',
    title: 'Services',
    icon: <Gift className="w-6 h-6" />,
    items: [
      { name: 'Loyalty Program', desc: 'Earn miles and unlock worldwide benefits.', link: '/profile' },
      { name: 'Special Assistance', desc: 'Dedicated support for all travel needs.', link: '/profile' },
      { name: 'Gift Cards', desc: 'Give the gift of infinite horizons.', link: '/profile' },
      { name: 'Corporate Sales', desc: 'Bespoke solutions for high-volume travelers.', link: '/services' }
    ]
  },
  {
    id: 'corporate',
    title: 'Corporate',
    icon: <Briefcase className="w-6 h-6" />,
    items: [
      { name: 'Business Travel', desc: 'Optimized itineraries for global enterprises.', link: '/planner' },
      { name: 'Sustainability', desc: 'Our commitment to carbon-neutral exploration.', link: '/services' },
      { name: 'Partnerships', desc: 'Exclusive collaborations with luxury brands.', link: '/services' },
      { name: 'Careers', desc: 'Join the team redefining global travel.', link: '/services' }
    ]
  }
];

export default function ServicesPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleItemClick = (item: any) => {
    if (item.link) {
      if (item.link === '/services') {
        setToast(`Request for "${item.name}" registered. Our team will contact you.`);
        setTimeout(() => setToast(null), 3000);
      } else {
        navigate(item.link);
      }
    } else {
      setToast(`${item.name} information is being updated.`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="px-6 md:px-12 max-w-5xl mx-auto py-16 relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-50 bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl border border-luxury-gold/20"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="text-center mb-16">
        <h1 className="luxury-text text-5xl mb-4 text-black">Global <span className="text-luxury-gold italic">Services</span></h1>
        <p className="text-black/40 text-xs font-bold uppercase tracking-[0.3em]">Everything you need for a seamless journey</p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <div key={section.id} className="border-b border-black/5 pb-4">
            <button 
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="flex items-center justify-between w-full py-6 text-left group"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl transition-colors ${openSection === section.id ? 'bg-black text-luxury-gold' : 'bg-black/5 text-black/40 group-hover:bg-black/10'}`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className={`luxury-text text-2xl transition-colors ${openSection === section.id ? 'text-black' : 'text-black/60 group-hover:text-black'}`}>
                    {section.title}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/20 mt-1">
                    {section.items.length} Options Available
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-black/20 transition-transform duration-500 ${openSection === section.id ? 'rotate-180 text-luxury-gold' : ''}`} />
            </button>

            <AnimatePresence>
              {openSection === section.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8 pt-4">
                    {(section.items as any[]).map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleItemClick(item)}
                        className={`p-6 rounded-3xl bg-black/[0.02] border border-black/5 hover:border-luxury-gold/30 transition-all cursor-pointer group/item ${item.link ? 'hover:shadow-lg' : ''}`}
                      >
                        <h4 className="font-bold text-sm text-black mb-1 flex items-center justify-between">
                          {item.name}
                          <Clock className="w-3 h-3 text-black/10 group-hover/item:text-luxury-gold transition-colors" />
                        </h4>
                        <p className="text-xs text-black/40 font-light leading-relaxed">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-20 glass-panel p-10 rounded-[3rem] text-center border border-black/5 shadow-sm">
        <HelpCircle className="w-10 h-10 mx-auto mb-6 text-luxury-gold" />
        <h3 className="luxury-text text-2xl mb-4 text-black italic">Need <span className="text-luxury-gold">Direct Support?</span></h3>
        <p className="text-sm text-black/40 mb-8 max-w-md mx-auto leading-relaxed">Our Global Support team is available 24/7 to assist with bespoke requests and emergency travel needs.</p>
        <button className="bg-black text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-xl">
          Contact Support
        </button>
      </div>
    </div>
  );
}
