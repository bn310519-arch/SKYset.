import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CreditCard, Plane, Calendar, User, MapPin, CheckCircle2, ChevronRight, ArrowLeft, Hotel, Wallet, Lock, QrCode, Coins, Info, Sparkles, Smartphone, Download, Printer, Share2 } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useStore, Trip } from '../lib/store';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type PaymentMethod = 'card' | 'upi' | 'wallet' | 'crypto' | 'transfer';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { addTrip, addLoyaltyPoints } = useStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [upiId, setUpiId] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId] = useState(`SKY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // Card state
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [saveCard, setSaveCard] = useState(false);

  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const name = searchParams.get('name') || (type === 'hotel' ? 'Residency' : 'Airline');
  const room = searchParams.get('room');
  const nights = parseInt(searchParams.get('nights') || '1');
  const guests = parseInt(searchParams.get('guests') || '1');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const priceParam = searchParams.get('price');
  const basePrice = priceParam ? parseFloat(priceParam) : (type === 'hotel' ? 340 : 840);

  // Simulated booking details
  const getDetails = () => {
    if (type === 'hotel') {
      return {
        id: id || 'H-001',
        name: name, 
        type: 'Residency',
        location: searchParams.get('location') || 'Bespoke Destination',
        date: checkIn && checkOut ? `${checkIn} to ${checkOut}` : 'Check-in: May 15, 2026',
        price: basePrice * nights,
        class: room || 'Deluxe Suite',
        passenger: 'Elite Member',
        icon: <Hotel className="w-6 h-6" />
      };
    }
    return {
      id: id || 'EK 202',
      name: name,
      type: 'Airline',
      location: 'BOM',
      to: 'LHR',
      date: 'May 15, 2026',
      price: basePrice,
      class: 'First Class',
      passenger: 'Elite Member',
      icon: <Plane className="w-6 h-6" />
    };
  };

  const details = getDetails();

  const handlePrint = () => {
    try {
      // For iframes, we often need to ensure focus
      window.focus();
      // Ensure the content is visible
      if (!receiptRef.current) return;
      
      // Before printing, we might want to temporarily hide other things
      // though the @media print CSS should handle it.
      window.print();
    } catch (err) {
      console.error('Print failed:', err);
      // Fallback for some environments
      const printContents = receiptRef.current?.innerHTML;
      if (printContents) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Skyset Receipt - ${transactionId}</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&display=swap');
                  .luxury-text { font-family: 'Playfair Display', serif; }
                  body { background: white; padding: 2rem; -webkit-print-color-adjust: exact; }
                  .print\\:hidden { display: none !important; }
                </style>
              </head>
              <body>${printContents}</body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
        }
      }
    }
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      // Ensure images and fonts are loaded
      await document.fonts.ready;
      
      // We set specific styles to the receipt before capturing
      const originalStyle = receiptRef.current.style.cssText;
      receiptRef.current.style.width = '800px'; // Set fixed width for capture consistency
      
      const canvas = await html2canvas(receiptRef.current, {
        scale: 1,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('printable-receipt') as HTMLElement;
          if (el) {
            el.style.borderRadius = '0';
            el.style.boxShadow = 'none';
          }
        }
      });
      
      // Restore styles
      receiptRef.current.style.cssText = originalStyle;
      
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Skyset-Receipt-${transactionId}.pdf`);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Bespoke PDF generation failed. Please try printing to PDF instead.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Skyset Elite Receipt',
          text: `My booking confirmation for ${details.name}. Transaction ID: ${transactionId}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      alert('Sharing is not supported on this browser identity.');
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    // Basic validation
    if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.name)) {
      setError('Please provide valid card details for your elite booking.');
      return;
    }
    if (paymentMethod === 'upi' && (!upiId || !upiId.includes('@'))) {
      setError('Please provide a valid UPI ID (e.g. name@bank).');
      return;
    }
    setError(null);

    setIsProcessing(true);
    setTimeout(() => {
      // Add to store
      const newTrip: Trip = {
        id: `TRIP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        destination: details.location,
        startDate: details.date.split(' to ')[0],
        endDate: details.date.split(' to ')[1] || details.date,
        budget: details.price,
        participants: ['Elite Member'],
        itinerary: [],
        status: 'booked'
      };
      
      addTrip(newTrip);
      addLoyaltyPoints(Math.floor(details.price / 10)); // 10% points
      
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen py-20 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          {!showReceipt ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-12 rounded-[3rem] text-center border border-black/5 bg-white shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-green-500 animate-pulse" />
              </div>
              <h1 className="luxury-text text-5xl mb-4 text-black">Booking <span className="text-luxury-gold italic">Confirmed</span></h1>
              <p className="text-sm text-black/40 font-medium leading-relaxed mb-10">
                Your payment of {formatPrice(details.price)} was successful. Transaction ID: <span className="text-black font-bold">{transactionId}</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowReceipt(true)}
                  className="px-8 py-4 bg-luxury-gold text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:shadow-xl transition-all"
                >
                  Generate Receipt
                </button>
                <button 
                  onClick={() => navigate('/journal')}
                  className="px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:shadow-xl transition-all"
                >
                  Go to Journal
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] shadow-2xl border border-black/5 overflow-hidden print:shadow-none print:border-none"
              ref={receiptRef}
              id="printable-receipt"
            >
              {/* Receipt Header */}
              <div className="bg-zinc-950 p-12 text-white flex justify-between items-start">
                <div>
                  <div className="luxury-text text-3xl mb-1">SKYSET <span className="text-luxury-gold">ELITE</span></div>
                  <p className="text-[8px] uppercase tracking-[0.4em] font-bold opacity-40">Official Payment Receipt</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-1">Receipt No.</p>
                  <p className="text-sm font-mono tracking-tight">{transactionId}</p>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-12 space-y-12">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-black/30 mb-1">Billing To</p>
                      <p className="text-sm font-bold text-black">{cardDetails.name || 'Elite Member'}</p>
                      <p className="text-[10px] text-black/40">Registered Skyset Diamond Member</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-black/30 mb-1">Date of Issue</p>
                      <p className="text-sm font-bold text-black">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-4">
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-black/30 mb-1">Payment Method</p>
                      <p className="text-sm font-bold text-black uppercase tracking-widest">{paymentMethod === 'card' ? 'Credit Card' : paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-black/30 mb-1">Status</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Paid In Full</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-8">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-black/5">
                        <th className="pb-4 text-[9px] uppercase font-bold tracking-widest text-black/30">Description</th>
                        <th className="pb-4 text-[9px] uppercase font-bold tracking-widest text-black/30 text-center">Ref</th>
                        <th className="pb-4 text-[9px] uppercase font-bold tracking-widest text-black/30 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      <tr>
                        <td className="py-6">
                          <p className="text-sm font-bold text-black">{details.name} - {details.class}</p>
                          <p className="text-[10px] text-black/40">{details.date}</p>
                        </td>
                        <td className="py-6 text-center text-xs font-mono text-black/40">{details.id}</td>
                        <td className="py-6 text-right text-sm font-bold text-black">{formatPrice(details.price - 90)}</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-xs text-black/40">Luxury Service Fee & Handling</td>
                        <td className="py-4"></td>
                        <td className="py-4 text-right text-sm text-black/40">{formatPrice(40)}</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-xs text-black/40">Airport Taxes & Regulatory Charges</td>
                        <td className="py-4"></td>
                        <td className="py-4 text-right text-sm text-black/40">{formatPrice(50)}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-black">
                        <td colSpan={2} className="pt-8 text-right text-[10px] uppercase font-bold tracking-widest text-black/30">Total Investment</td>
                        <td className="pt-8 text-right text-3xl luxury-text text-luxury-gold">{formatPrice(details.price)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer Brand */}
                <div className="flex justify-between items-end pt-12 border-t border-black/5 print:hidden">
                  <div className="flex gap-4">
                    <button 
                      onClick={handleDownload}
                      disabled={isGenerating}
                      className="p-3 bg-black/5 rounded-xl hover:bg-luxury-gold hover:text-white transition-all text-black/40 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                          <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                        </motion.div>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="p-3 bg-black/5 rounded-xl hover:bg-luxury-gold hover:text-white transition-all text-black/40"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="p-3 bg-black/5 rounded-xl hover:bg-luxury-gold hover:text-white transition-all text-black/40"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-black mb-1">Skyset International Holding</p>
                    <p className="text-[8px] text-black/30 leading-relaxed max-w-[200px]">This is a digitally generated receipt and does not require a physical signature for verification.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition-all"
            >
              Close and Secure Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors mb-12 group"
      >
        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h2 className="luxury-text text-4xl mb-8 text-black">Booking <span className="text-luxury-gold italic">Summary</span></h2>
            
            <div className="glass-panel p-8 rounded-[2.5rem] border border-black/5 bg-white shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-black/5 pb-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white">
                    {details.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-black">{details.name}</h3>
                    <p className="text-xs text-black/40 font-bold uppercase tracking-widest">{details.id} &bull; {details.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light text-luxury-gold">{formatPrice(details.price)}</div>
                  <p className="text-[10px] text-black/20 font-bold uppercase tracking-widest mt-1">
                    {type === 'hotel' ? `${nights} Nights` : 'Single Journey'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">
                    {type === 'hotel' ? 'Location' : 'Departure'}
                  </p>
                  <div className="flex items-center gap-2">
                    {type === 'hotel' ? <MapPin className="w-4 h-4 text-luxury-gold" /> : <Plane className="w-4 h-4 text-luxury-gold" />}
                    <span className="text-sm font-bold text-black">{details.location} {type !== 'hotel' ? 'Airport' : ''}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">
                    {type === 'hotel' ? 'Guests' : 'Arrival'}
                  </p>
                  <div className="flex items-center gap-2">
                    {type === 'hotel' ? <User className="w-4 h-4 text-luxury-gold" /> : <MapPin className="w-4 h-4 text-luxury-gold" />}
                    <span className="text-sm font-bold text-black">
                        {type === 'hotel' ? `${guests} Guests` : `${details.to} Airport`}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-luxury-gold" />
                    <span className="text-sm font-bold text-black">{details.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="luxury-text text-3xl mb-8">Secure <span className="text-luxury-gold italic">Payment</span></h3>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { id: 'card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'upi', label: 'UPI Payment', icon: <Smartphone className="w-4 h-4" /> },
                { id: 'wallet', label: 'Digital Wallet', icon: <Wallet className="w-4 h-4" /> },
                { id: 'crypto', label: 'Crypto Currency', icon: <Coins className="w-4 h-4" /> },
                { id: 'transfer', label: 'Bank Transfer', icon: <QrCode className="w-4 h-4" /> }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${paymentMethod === method.id ? 'bg-black text-white shadow-xl scale-105' : 'bg-white border border-black/5 text-black/60 hover:bg-black/5'}`}
                >
                  {method.icon} {method.label}
                </button>
              ))}
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-black/5 bg-white shadow-sm overflow-hidden relative">
              <AnimatePresence mode="wait">
                {paymentMethod === 'card' && (
                  <motion.div 
                    key="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12"
                  >
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-black/30 ml-4">Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="ELITE MEMBER"
                          className="w-full bg-black/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-luxury-gold transition-all text-sm font-bold placeholder:text-black/10"
                          value={cardDetails.name}
                          onChange={e => setCardDetails(prev => ({...prev, name: e.target.value.toUpperCase()}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-black/30 ml-4">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="•••• •••• •••• 8888"
                          className="w-full bg-black/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-luxury-gold transition-all text-sm font-bold tracking-widest placeholder:text-black/10"
                          value={cardDetails.number}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                            setCardDetails(prev => ({...prev, number: val.match(/.{1,4}/g)?.join(' ') || val}));
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-black/30 ml-4">Expiry</label>
                          <input 
                            type="text" 
                            placeholder="MM / YY"
                            className="w-full bg-black/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-luxury-gold transition-all text-sm font-bold text-center placeholder:text-black/10"
                            value={cardDetails.expiry}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                              setCardDetails(prev => ({...prev, expiry: val.length >= 2 ? `${val.substring(0, 2)} / ${val.substring(2, 4)}` : val}));
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-black/30 ml-4">CVV</label>
                          <input 
                            type="password" 
                            placeholder="•••"
                            className="w-full bg-black/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-luxury-gold transition-all text-sm font-bold text-center placeholder:text-black/10"
                            maxLength={3}
                            value={cardDetails.cvv}
                            onChange={e => setCardDetails(prev => ({...prev, cvv: e.target.value.replace(/\D/g, '')}))}
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer group mt-4">
                        <div 
                          onClick={() => setSaveCard(!saveCard)}
                          className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${saveCard ? 'bg-black border-black text-white' : 'border-black/10 text-transparent'}`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 group-hover:text-black">Save this card for future elite travels</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-sm aspect-[1.6/1] bg-gradient-to-br from-zinc-900 to-black rounded-[2rem] p-8 text-white relative shadow-2xl group overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 blur-3xl rounded-full" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div className="w-12 h-8 bg-white/10 rounded-md backdrop-blur border border-white/10" />
                            <div className="text-[8px] font-black italic tracking-[0.3em] opacity-40">SKYSET DIAMOND</div>
                          </div>
                          <div className="text-xl tracking-[0.25em] font-light shadow-sm">
                            {cardDetails.number || '•••• •••• •••• 0000'}
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="space-y-1">
                              <div className="text-[7px] uppercase font-bold tracking-widest opacity-30">Member</div>
                              <div className="text-[10px] font-bold tracking-widest uppercase truncate max-w-[120px]">{cardDetails.name || 'Your Name'}</div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-[7px] uppercase font-bold tracking-widest opacity-30">Expiry</div>
                              <div className="text-[10px] font-bold tracking-widest">{cardDetails.expiry || 'MM / YY'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'upi' && (
                  <motion.div 
                    key="upi"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-md mx-auto py-4 space-y-8"
                  >
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-8 grayscale opacity-50 contrast-125" />
                        <div className="h-8 w-px bg-black/10" />
                        <QrCode className="w-8 h-8 text-black/20" />
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-black/30 ml-4">UPI Virtual Address</label>
                            <input 
                                type="text" 
                                placeholder="skyset@elite"
                                className="w-full bg-black/5 border-none rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-luxury-gold transition-all text-sm font-bold text-black placeholder:text-black/10"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value.toLowerCase())}
                            />
                        </div>
                        <p className="text-[9px] text-center text-black/40 leading-relaxed px-4">
                            Ensure you have your banking app ready. A request will be sent to your UPI ID once you authorize the booking.
                        </p>
                    </div>
                    
                    <div className="p-6 bg-black/5 rounded-[2rem] border border-black/5 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-black/20 mb-3">Or Scan QR for instant access</p>
                            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm inline-block">
                                <QrCode className="w-32 h-32 text-black/80" />
                            </div>
                        </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'crypto' && (
                  <motion.div 
                    key="crypto"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-luxury-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Coins className="w-10 h-10 text-luxury-gold" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Web3 Secure Checkout</h4>
                    <p className="text-xs text-black/40 mb-8 max-w-sm mx-auto">Pay using BTC, ETH, or USDC. Identity is verified via your wallet signature.</p>
                    <button className="px-12 py-4 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-xl inline-flex items-center gap-3">
                      <Lock className="w-4 h-4" /> Connect Wallet
                    </button>
                  </motion.div>
                )}

                {(paymentMethod === 'wallet' || paymentMethod === 'transfer') && (
                  <motion.div 
                    key="others"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <div className="bg-black/5 p-8 rounded-[2rem] border border-black/5 mb-6">
                        <QrCode className="w-24 h-24 text-black/20" />
                    </div>
                    <p className="text-xs font-bold text-black uppercase tracking-widest mb-2">Scan & Pay</p>
                    <p className="text-[10px] text-black/40 font-medium italic">Redirecting to secure gateway...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="p-10 rounded-[3rem] border border-white/10 bg-zinc-950 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-luxury-gold/10 transition-all duration-1000" />
            
            <h3 className="luxury-text text-3xl mb-8">Order <span className="text-luxury-gold italic">Total</span></h3>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Base Fare</span>
                <span className="text-sm font-light">{formatPrice(details.price - 90)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Airport Taxes</span>
                <span className="text-sm font-light">{formatPrice(50)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Luxury Service</span>
                <span className="text-sm font-light">{formatPrice(40)}</span>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Final Identity Investment</span>
                  <span className="text-3xl font-light text-luxury-gold">{formatPrice(details.price)}</span>
                </div>
                <p className="text-[8px] text-right font-medium text-luxury-gold">Includes Elite Diamond Lounge Access</p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <Info className="w-4 h-4 text-luxury-gold" />
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">Loyalty Gain</p>
                        <p className="text-[9px] text-white/40 font-medium">Earn +{Math.floor(details.price / 10)} SkyPoints on this booking.</p>
                    </div>
                </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}

            <button 
              onClick={handleConfirm}
              disabled={isProcessing}
              className="w-full py-6 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-luxury-gold hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                    <ShieldCheck className="w-5 h-5 text-luxury-gold" />
                  </motion.div>
                  Verifying Gateway...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-luxury-gold group-hover:text-white transition-colors" /> Confirm & Authorize
                </>
              )}
            </button>

            <div className="mt-8 flex items-center justify-center gap-2">
                <Lock className="w-3 h-3 text-white/20" />
                <p className="text-[8px] text-white/30 uppercase font-bold tracking-[0.2em]">SSL Encrypted Protocol 2.0</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] border border-black/5 bg-white">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-luxury-gold" /> Included Conveniences
            </h4>
            <ul className="space-y-4">
              {[
                'VIP Lounge Priority Access',
                'Priority Identity Checkpoint',
                'Bespoke Concierge Support',
                'Extra 10kg Elite Luggage',
                'Luxury Ground Transfer'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-medium text-black/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold/40" /> {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
