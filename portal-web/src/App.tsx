import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Clock, Trash2, ArrowRight, LogOut, FileText, LayoutDashboard, Database,
  Activity, TrendingUp, Users, Package, AlertTriangle, Camera,
  Home, QrCode, ShoppingCart, User,
  Tag, Heart, MapPin, CreditCard, Shield, Bell, HelpCircle, Headphones, ChevronRight, ShoppingBag
} from 'lucide-react';

// Custom API client since we are running in the browser
const API_URL = 'http://localhost:5000/api/v1';

// Global mock state manager using localStorage
const getLocalStorage = <T,>(key: string, initial: T): T => {
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : initial;
};
const setLocalStorage = <T,>(key: string, val: T) => {
  localStorage.setItem(key, JSON.stringify(val));
};

const addActivityLog = (type: string, message: string) => {
  const logs = getLocalStorage<any[]>('activity_logs', []);
  logs.unshift({ 
    id: Math.random().toString(), 
    type, 
    message, 
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
  });
  setLocalStorage('activity_logs', logs.slice(0, 15));
  window.dispatchEvent(new Event('activity_logs_updated'));
};

// Fallback seed database for offline/fallback use
const FALLBACK_PRODUCTS: Record<string, { name: string; price: number; brand: string }> = {
  '8901764100078': { name: 'Amul Full Cream Milk 1L', price: 62, brand: 'Amul' },
  '8901063007277': { name: 'Britannia Good Day Cookies 200g', price: 35, brand: 'Britannia' },
  '8901012038032': { name: 'Pepsi 500ml', price: 30, brand: 'PepsiCo' },
  '8901058000020': { name: 'Maggi 2-Minute Noodles 70g', price: 14, brand: 'Nestle' },
  '8901058810013': { name: 'Tata Salt 1kg', price: 20, brand: 'Tata' },
};

// --- CUSTOMER TAB NAVIGATION BAR ---
function CustomerTabBar({ activeTab }: { activeTab: string }) {
  return (
    <div className="max-w-4xl mx-auto w-full border-t border-slate-200 bg-white sticky bottom-0 z-40 flex justify-around items-center shrink-0 shadow-lg pb-[env(safe-area-inset-bottom)] h-[calc(5rem+env(safe-area-inset-bottom))]">
      <Link to="/customer/dashboard" className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-green-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-semibold'}`}>
        <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className="text-[11px] tracking-wide mt-0.5">Home</span>
      </Link>
      <Link to="/customer/scan" className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'scan' ? 'text-green-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-semibold'}`}>
        <QrCode size={24} strokeWidth={activeTab === 'scan' ? 2.5 : 2} />
        <span className="text-[11px] tracking-wide mt-0.5">Scan</span>
      </Link>
      <Link to="/customer/cart" className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'cart' ? 'text-green-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-semibold'}`}>
        <ShoppingCart size={24} strokeWidth={activeTab === 'cart' ? 2.5 : 2} />
        <span className="text-[11px] tracking-wide mt-0.5">Cart</span>
      </Link>
      <Link to="/customer/orders" className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'orders' ? 'text-green-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-semibold'}`}>
        <ShoppingBag size={24} strokeWidth={activeTab === 'orders' ? 2.5 : 2} />
        <span className="text-[11px] tracking-wide mt-0.5">Orders</span>
      </Link>
      <Link to="/customer/profile" className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-green-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-semibold'}`}>
        <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        <span className="text-[11px] tracking-wide mt-0.5">Profile</span>
      </Link>
    </div>
  );
}

// --- MAIN WRAPPER APP ---
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Customer Portal */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/scan" element={<CustomerScan />} />
        <Route path="/customer/cart" element={<CustomerCart />} />
        <Route path="/customer/payment" element={<CustomerPayment />} />
        <Route path="/customer/pass" element={<CustomerPass />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />

        {/* Worker Portal */}
        <Route path="/worker/login" element={<WorkerLogin />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/worker/verify" element={<WorkerVerify />} />

        {/* Admin Dashboard */}
        <Route path="/admin/*" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
}

// --- HOMEPAGE / LANDING PAGE ---
function Homepage() {
  const navigate = useNavigate();
  const [sysStatus, setSysStatus] = useState({ backend: 'checking', db: 'checking' });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/products?limit=1`)
      .then((res) => {
        if (res.ok) setSysStatus({ backend: 'online', db: 'online' });
        else setSysStatus({ backend: 'online', db: 'error' });
      })
      .catch(() => setSysStatus({ backend: 'offline', db: 'offline' }));
  }, []);

function Homepage() {
  const navigate = useNavigate();
  const [sysStatus, setSysStatus] = useState({ backend: 'checking', db: 'checking' });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/products?limit=1`)
      .then((res) => {
        if (res.ok) setSysStatus({ backend: 'online', db: 'online' });
        else setSysStatus({ backend: 'online', db: 'error' });
      })
      .catch(() => setSysStatus({ backend: 'offline', db: 'offline' }));
  }, []);

  const testimonials = [
    {
      text: "SmartQueue has completely transformed the way we handle checkout. Our queues are gone, and customers love the seamless experience!",
      author: "Rahul Mehta",
      role: "Store Manager, FreshMart",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    {
      text: "Easy to use, secure, and incredibly efficient. The real-time dashboard gives us full control over operations.",
      author: "Priya Sharma",
      role: "Operations Head, DailyNeeds",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans overflow-x-hidden selection:bg-green-500 selection:text-white">
      {/* Styled Inline Keyframes for Premium Floating Effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0.5deg); }
          50% { transform: translateY(-15px) rotate(-0.5deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50% { transform: translateY(-20px) rotate(0.5deg); }
        }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 9s ease-in-out infinite; }
      `}} />

      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white text-xl font-bold shadow-md">🛒</div>
              <div>
                <span className="text-xl font-black text-slate-900 tracking-tight">SmartQueue</span>
                <p className="text-[9px] text-green-600 font-black -mt-1.5 tracking-wider uppercase">Enterprise Ecosystem</p>
              </div>
            </div>

            {/* Menu Links */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <a href="#home" className="text-green-600">Home</a>
              <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-green-600 transition-colors">How It Works</a>
              <a href="#portals" className="hover:text-green-600 transition-colors">Solutions</a>
              <a href="#why-choose-us" className="hover:text-green-600 transition-colors">About Us</a>
              <a href="#" className="hover:text-green-600 transition-colors flex items-center gap-1">Resources <span className="text-[10px]">▼</span></a>
              <a href="#" className="hover:text-green-600 transition-colors">Contact</a>
            </div>
            
            {/* Access Portals button */}
            <div className="flex items-center gap-4">
              <a href="#portals" className="px-5 py-2.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm flex items-center gap-2 transition-all">
                Access Portals <span className="text-sm">▦</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative bg-slate-950 text-white pt-20 pb-28 border-b border-slate-900 overflow-hidden">
        {/* Glow Highlights */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-12 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-green-500/15 text-green-400 border border-green-500/20 mb-6 uppercase tracking-wider">
                🟢 AI-Powered Self-Checkout Platform
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
                The Future of Shopping is <span className="text-green-500">Queue-Free</span>
              </h1>
              <p className="mt-6 text-sm md:text-base text-slate-400 leading-relaxed max-w-lg">
                SmartQueue Enterprise empowers retailers with a smart self-checkout ecosystem. Shoppers scan, pay, and exit seamlessly with instant verification.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <a href="#portals" className="px-7 py-3.5 text-xs font-extrabold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-all">
                  Explore Platform →
                </a>
                <a href="http://localhost:5000/api/v1/docs" target="_blank" rel="noreferrer" className="px-6 py-3.5 text-xs font-bold text-white bg-transparent border border-slate-700 hover:border-slate-500 rounded-lg flex items-center gap-2 transition-all">
                  <span>▶</span> Watch Demo
                </a>
              </div>

              {/* Trusted Retailers */}
              <div className="mt-12 flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  <img className="w-8 h-8 rounded-full border-2 border-slate-950" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-slate-950" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80" alt="Avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-slate-950" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Avatar" />
                </div>
                <div className="text-xs">
                  <div className="flex text-amber-400 font-bold">⭐⭐⭐⭐⭐</div>
                  <p className="text-slate-400 font-semibold mt-0.5">Trusted by 500+ Retail Stores</p>
                </div>
              </div>
            </div>

            {/* Right Phone Mockups - Light Interface */}
            <div className="lg:col-span-6 flex justify-center items-center gap-8 relative mt-10 lg:mt-0">
              
              {/* Phone 1: Shopping Cart */}
              <div className="w-[230px] h-[450px] bg-slate-900 rounded-[44px] border-[6px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden relative p-3 animate-float-slow shrink-0 select-none">
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-950 rounded-b-xl flex justify-center items-center z-20">
                  <div className="w-14 h-1.5 bg-slate-800 rounded-full"></div>
                </div>
                <div className="h-full bg-white rounded-[34px] p-4 flex flex-col justify-between text-xs text-slate-800 text-left relative z-10">
                  <div>
                    <div className="flex justify-between items-center mb-4 mt-2">
                      <span className="font-black text-sm text-slate-900">My Cart</span>
                      <span className="text-green-600 font-bold">+ Add</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🥤</span>
                          <div>
                            <p className="font-bold text-slate-900 text-[10px]">Coca-Cola</p>
                            <p className="text-[9px] text-slate-400">₹30.00</p>
                          </div>
                        </div>
                        <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">2 ▾</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🥔</span>
                          <div>
                            <p className="font-bold text-slate-900 text-[10px]">Lays Classic</p>
                            <p className="text-[9px] text-slate-400">₹20.00</p>
                          </div>
                        </div>
                        <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">1 ▾</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🥛</span>
                          <div>
                            <p className="font-bold text-slate-900 text-[10px]">Amul Milk</p>
                            <p className="text-[9px] text-slate-400">₹35.00</p>
                          </div>
                        </div>
                        <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">1 ▾</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-800 mb-2.5 pt-2 border-t border-slate-200">
                      <span>Total Amount:</span>
                      <span className="text-slate-900 font-extrabold">₹115.00</span>
                    </div>
                    <button className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-center shadow-md text-[10px] transition-all">
                      Proceed to Pay
                    </button>
                    {/* Mock Payment Badges */}
                    <div className="flex justify-center items-center gap-2 mt-2 opacity-65 grayscale text-[8px] font-bold text-slate-500">
                      <span>UPI</span>
                      <span>VISA</span>
                      <span>MC</span>
                      <span>RuPay</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 2: Payment Receipt & QR */}
              <div className="w-[230px] h-[450px] bg-slate-900 rounded-[44px] border-[6px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden relative p-3 animate-float-slower hidden sm:block shrink-0 select-none">
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-950 rounded-b-xl flex justify-center items-center z-20">
                  <div className="w-14 h-1.5 bg-slate-800 rounded-full"></div>
                </div>
                <div className="h-full bg-white rounded-[34px] p-4 flex flex-col items-center justify-between text-xs text-slate-800 text-center relative z-10">
                  <div className="mt-4">
                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg font-bold mb-2 mx-auto">✓</div>
                    <h5 className="font-extrabold text-[11px] text-slate-900">Payment Successful</h5>
                    <p className="text-[8px] text-slate-400 mt-0.5">Show this QR code at each gate</p>
                  </div>
                  
                  {/* Detailed QR Graphic */}
                  <div className="w-32 h-32 bg-white rounded-2xl p-3 flex items-center justify-center border border-slate-100 shadow-sm">
                    <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white font-extrabold text-[9px] gap-1">
                      <QrCode size={24} className="text-green-500 animate-pulse" />
                      <span>EXIT PASS</span>
                    </div>
                  </div>

                  <div className="w-full text-slate-500 text-[9px] leading-relaxed">
                    <p className="font-extrabold text-slate-900 border-b border-slate-200 pb-2">Order ID: SQ123456789</p>
                    <p className="mt-2 text-green-600 font-extrabold uppercase tracking-wide">Thank you for shopping!</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Features Row */}
      <section id="features" className="bg-white py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-left shadow-xs flex flex-col items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">⚡</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Instant Verification</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Real-time socket.io updates for exit gates.</p>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-left shadow-xs flex flex-col items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">🛡️</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Secure Payments</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Multiple payment options with enterprise security.</p>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-left shadow-xs flex flex-col items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">🔳</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">QR Exit Gate</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Instant QR code generation and verification.</p>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-left shadow-xs flex flex-col items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">🔄</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Real-time Sync</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Live updates across all devices and dashboards.</p>
              </div>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl text-left shadow-xs flex flex-col items-start gap-3 sm:col-span-2 lg:col-span-1">
              <span className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">⚙️</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Enterprise Grade</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Scalable, reliable & production ready.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How SmartQueue Works */}
      <section id="how-it-works" className="bg-white py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-b border-slate-100">
        <h2 className="text-3xl font-black text-slate-950">How <span className="text-green-600">SmartQueue</span> Works</h2>
        <p className="text-slate-500 text-sm mt-2 mb-16">A simple 4-step process for a smarter shopping experience</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col items-center gap-4 text-center shadow-xs relative group">
            <span className="w-8 h-8 rounded-full bg-green-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">1</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Scan Products</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
              Open the app and scan product barcodes using your device camera.
            </p>
            <div className="w-full h-32 bg-slate-50 rounded-xl mt-2 flex items-center justify-center text-slate-400 group-hover:bg-green-50/50 transition-colors relative overflow-hidden">
              {/* Phone scanning graphic */}
              <div className="w-20 h-28 bg-slate-800 rounded-xl border-4 border-slate-700 flex flex-col justify-between p-2">
                <div className="w-full h-1 bg-green-500 animate-bounce"></div>
                <div className="w-full h-6 bg-slate-900 rounded flex items-center justify-center text-[7px] text-white">SCAN</div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col items-center gap-4 text-center shadow-xs relative group">
            <span className="w-8 h-8 rounded-full bg-green-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">2</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Make Payment</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
              Review your cart and make secure payment using UPI, cards or wallets.
            </p>
            <div className="w-full h-32 bg-slate-50 rounded-xl mt-2 flex items-center justify-center text-slate-400 group-hover:bg-green-50/50 transition-colors relative overflow-hidden">
              {/* Card billing payment mockup graphic */}
              <div className="w-20 h-28 bg-slate-800 rounded-xl border-4 border-slate-700 p-2 flex flex-col justify-between text-white text-[7px]">
                <div>
                  <p className="font-bold border-b border-slate-700 pb-1">Checkout</p>
                  <p className="mt-2 text-green-400 font-bold">₹115.00</p>
                </div>
                <button className="w-full py-1 bg-green-500 rounded text-slate-950 font-bold">PAY NOW</button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col items-center gap-4 text-center shadow-xs relative group">
            <span className="w-8 h-8 rounded-full bg-green-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">3</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Get QR Code</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
              Receive instant QR code after successful payment confirmation.
            </p>
            <div className="w-full h-32 bg-slate-50 rounded-xl mt-2 flex items-center justify-center text-slate-400 group-hover:bg-green-50/50 transition-colors relative overflow-hidden">
              {/* QR Mockup inside phone */}
              <div className="w-20 h-28 bg-slate-800 rounded-xl border-4 border-slate-700 p-2 flex flex-col items-center justify-center">
                <QrCode size={24} className="text-green-400" />
                <span className="text-[6px] text-slate-400 mt-2 font-mono">SQ123456</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col items-center gap-4 text-center shadow-xs relative group">
            <span className="w-8 h-8 rounded-full bg-green-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">4</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Exit Seamlessly</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
              Show QR code at the exit gate for instant verification and you're good to go!
            </p>
            <div className="w-full h-32 bg-slate-50 rounded-xl mt-2 flex items-center justify-center text-slate-400 group-hover:bg-green-50/50 transition-colors relative overflow-hidden">
              {/* Exit Gate Illustration mockup */}
              <div className="w-24 h-20 bg-slate-800 rounded border-2 border-slate-700 flex items-center justify-between p-2">
                <span className="text-xl">🚪</span>
                <span className="text-[8px] text-green-400 font-bold animate-pulse">GATE OPEN</span>
                <span className="text-xl">🚶</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Access SmartQueue Portals */}
      <section id="portals" className="bg-white py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-b border-slate-100">
        <h2 className="text-3xl font-black text-slate-950">Access <span className="text-green-600">SmartQueue</span> Portals</h2>
        <p className="text-slate-500 text-sm mt-2 mb-16">Choose the portal that matches your role and access the right tools instantly</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Customer Portal */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex justify-between hover:border-green-500/20 hover:bg-white hover:shadow-md transition-all text-left relative overflow-hidden group">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl mb-6 font-bold shadow-sm">📱</div>
                <h3 className="text-lg font-black text-slate-900">Customer Portal</h3>
                <p className="text-slate-500 text-xs mt-2.5 leading-relaxed max-w-[180px]">
                  Scan products, add to cart, make payments and get QR code for exit.
                </p>
              </div>
              <button onClick={() => navigate('/customer/login')} className="w-36 mt-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-xs">
                Enter Customer Portal →
              </button>
            </div>
            {/* Right Graphic: Phone mockup inside card */}
            <div className="w-24 h-40 bg-slate-900 border-[3px] border-slate-800 rounded-3xl p-1.5 shadow-md flex flex-col justify-between shrink-0 select-none ml-2">
              <div className="h-full bg-slate-50 rounded-2xl p-1.5 flex flex-col justify-between text-[7px] text-slate-800">
                <span className="font-extrabold text-[8px]">My Cart</span>
                <div className="bg-white p-1 rounded-md border border-slate-100 shadow-xs mb-1">Amul Milk x1</div>
                <div className="py-1 bg-green-600 text-white text-center font-bold rounded-md text-[6px]">PAY</div>
              </div>
            </div>
          </div>

          {/* Worker Portal */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex justify-between hover:border-blue-500/20 hover:bg-white hover:shadow-md transition-all text-left relative overflow-hidden group">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-6 font-bold shadow-sm">👷</div>
                <h3 className="text-lg font-black text-slate-900">Worker Portal</h3>
                <p className="text-slate-500 text-xs mt-2.5 leading-relaxed max-w-[180px]">
                  Verify customer QR codes, check orders and manage exit gates.
                </p>
              </div>
              <button onClick={() => navigate('/worker/login')} className="w-36 mt-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-xs">
                Enter Worker Portal →
              </button>
            </div>
            {/* Right Graphic: Scan phone mockup inside card */}
            <div className="w-24 h-40 bg-slate-900 border-[3px] border-slate-800 rounded-3xl p-1.5 shadow-md flex flex-col items-center justify-center shrink-0 select-none ml-2">
              <QrCode size={32} className="text-blue-400" />
              <span className="text-[6px] text-slate-500 mt-2 font-mono">SCAN PASS</span>
            </div>
          </div>

          {/* Admin Dashboard */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex justify-between hover:border-indigo-500/20 hover:bg-white hover:shadow-md transition-all text-left relative overflow-hidden group">
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-6 font-bold shadow-sm">📊</div>
                <h3 className="text-lg font-black text-slate-900">Admin Dashboard</h3>
                <p className="text-slate-500 text-xs mt-2.5 leading-relaxed max-w-[180px]">
                  Manage products, users, orders, analytics and system operations.
                </p>
              </div>
              <button onClick={() => navigate('/admin')} className="w-36 mt-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-xs">
                Enter Admin Dashboard →
              </button>
            </div>
            {/* Right Graphic: Laptop mockup screen */}
            <div className="w-28 h-20 bg-slate-900 rounded-lg p-1 shadow-md border-2 border-slate-800 flex flex-col justify-between shrink-0 select-none ml-1 mt-4">
              <div className="h-full bg-slate-950 rounded flex flex-col justify-between p-1.5 text-[6px] text-white">
                <span className="font-extrabold text-green-400">Total Sales</span>
                <span className="font-black text-[8px]">₹12,450</span>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* KPI Numerical Stats Row */}
      <section className="bg-slate-950 text-white py-16 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xl">🛒</span>
            <h3 className="text-2xl font-black text-white">10,000+</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Orders Processed</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xl">🏪</span>
            <h3 className="text-2xl font-black text-white">500+</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stores Connected</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xl">👥</span>
            <h3 className="text-2xl font-black text-white">50,000+</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Happy Customers</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xl">🛡️</span>
            <h3 className="text-2xl font-black text-white">99.99%</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Uptime</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xl">⚡</span>
            <h3 className="text-2xl font-black text-white">&lt; 500ms</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Real-time Sync</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xl">🎧</span>
            <h3 className="text-2xl font-black text-white">24/7</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Support Available</p>
          </div>
        </div>
      </section>

      {/* Why Choose us & Testimonials */}
      <section id="why-choose-us" className="bg-white py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Values */}
          <div className="lg:col-span-6 text-left">
            <h2 className="text-3xl font-black text-slate-950">Why Choose <span className="text-green-600">SmartQueue</span>?</h2>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span className="text-xs text-slate-600 font-medium">Reduce long billing queues instantly</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span className="text-xs text-slate-600 font-medium">Improve customer check-out experience</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span className="text-xs text-slate-600 font-medium">Secure & contactless payment protocols</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span className="text-xs text-slate-600 font-medium">Real-time verification & sync triggers</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span className="text-xs text-slate-600 font-medium">Easy to use and integrate across any store layouts</span>
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="w-full h-48 bg-slate-100 rounded-2xl border border-slate-200 mt-8 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group cursor-pointer">
              <img className="absolute inset-0 w-full h-full object-cover opacity-60 filter blur-xs group-hover:scale-105 transition-transform animate-pulse" src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80" alt="Supermarket Aisle" />
              <div className="w-12 h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center text-green-600 text-xl font-bold relative z-10 hover:scale-110 transition-transform">▶</div>
              <span className="text-slate-900 font-extrabold text-xs mt-3 relative z-10">See SmartQueue in Action</span>
              <span className="text-[10px] text-slate-700 font-bold mt-0.5 relative z-10">01 / 03</span>
            </div>
          </div>

          {/* Right Testimonials */}
          <div id="testimonials" className="lg:col-span-6 flex flex-col gap-8">
            <h3 className="text-xl font-black text-slate-900 text-left">Loved by Retailers</h3>
            
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-left relative overflow-hidden">
              <span className="text-4xl text-green-500/10 absolute top-4 left-4 font-serif">“</span>
              <p className="text-slate-600 text-sm leading-relaxed mt-4 italic relative z-10">
                {testimonials[activeTestimonial].text}
              </p>
              
              <div className="mt-6 flex items-center gap-3 relative z-10">
                <img className="w-10 h-10 rounded-full object-cover" src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].author} />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">{testimonials[activeTestimonial].author}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="mt-6 flex gap-1.5 justify-end">
                {testimonials.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${activeTestimonial === idx ? 'bg-green-600 w-4' : 'bg-slate-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Brands Logos */}
      <section className="bg-white py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-8">Trusted by Leading Retailers</p>
        <div className="flex flex-wrap justify-center items-center gap-10 opacity-50 grayscale hover:grayscale-0 hover:opacity-85 transition-all text-xs font-black text-slate-500">
          <span>🍏 FreshMart</span>
          <span>🛒 DailyNeeds</span>
          <span>💎 ValuePlus</span>
          <span>🌾 GreenBasket</span>
          <span>🏬 UrbanStore</span>
          <span>⚡ QuickBuy</span>
          <span>📦 MegaMart</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-16 text-slate-400 text-xs relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center text-slate-950 text-base font-bold">🛒</div>
              <span className="text-base font-black text-white tracking-tight">SmartQueue</span>
            </div>
            <p className="text-slate-500 mt-2 leading-relaxed">
              AI-powered self-checkout ecosystem that makes retail smarter, faster and queue-free.
            </p>
            {/* Social media icons rows */}
            <div className="flex items-center gap-3 mt-4 text-slate-500">
              <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer">FB</span>
              <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer">TW</span>
              <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer">LN</span>
              <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer">YT</span>
              <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer">IG</span>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-xs mb-4 uppercase tracking-wider">Platform</h4>
            <div className="flex flex-col gap-2">
              <a href="#features" className="hover:text-green-400">Features</a>
              <a href="#how-it-works" className="hover:text-green-400">How It Works</a>
              <a href="#portals" className="hover:text-green-400">Solutions</a>
              <a href="#" className="hover:text-green-400">Security</a>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-xs mb-4 uppercase tracking-wider">Resources</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-green-400">User Guide</a>
              <a href="#" className="hover:text-green-400">FAQs</a>
              <a href="#" className="hover:text-green-400">Blog</a>
              <a href="#" className="hover:text-green-400">Help Center</a>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-xs mb-4 uppercase tracking-wider">Stay Updated</h4>
            <p className="text-slate-500 mb-3">Subscribe to get the latest updates and product news.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter your email" className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white w-full text-xs focus:outline-none focus:border-green-500" />
              <button className="bg-green-500 hover:bg-green-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs">Subscribe</button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 relative">
          <p>© 2026 SmartQueue Enterprise. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
          {/* Back to top circular button */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute right-8 -top-8 w-10 h-10 rounded-full bg-green-500 hover:bg-green-400 text-slate-950 flex items-center justify-center text-sm font-bold shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95">
            ▲
          </button>
        </div>
      </footer>
    </div>
  );
}

// --- CUSTOMER LOGIN SCREEN (Storyboard 2 & 3) ---
function CustomerLogin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (tab === 'register' && (!name || !email || !password || !phone)) {
      setErrorMsg('Please fill in all registration fields');
      return;
    }
    if (tab === 'login' && (!email || !password)) {
      setErrorMsg('Please enter your email and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const shopperName = tab === 'register' ? name : 'Rahul Sharma';
      setLocalStorage('customer_user', { 
        name: shopperName, 
        email, 
        phone: tab === 'register' ? phone : '9876543210' 
      });
      setLocalStorage('accessToken', 'mock_access_token');
      setLocalStorage('selectedStoreId', 'default_store');
      setLoading(false);
      addActivityLog('CUSTOMER_SESSION', `Shopper ${shopperName} entered the store.`);
      navigate('/customer/dashboard');
    }, 800);
  };

  const handleOAuthLogin = (provider: 'Google' | 'Apple') => {
    setLoading(true);
    setTimeout(() => {
      setLocalStorage('customer_user', { 
        name: `${provider} Shopper`, 
        email: `${provider.toLowerCase()}.shopper@smartqueue.com`, 
        phone: '9876543210' 
      });
      setLocalStorage('accessToken', 'mock_access_token');
      setLocalStorage('selectedStoreId', 'default_store');
      setLoading(false);
      addActivityLog('CUSTOMER_SESSION', `Shopper ${provider} Shopper logged in via OAuth.`);
      navigate('/customer/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 text-center text-white relative">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mx-auto mb-3">🛒</div>
          <h2 className="text-2xl font-black tracking-tight">SmartQueue</h2>
          <p className="text-xs text-green-100 mt-1">Skip the queue, shop smarter</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {/* Tab switchers */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6 border border-slate-200">
            <button type="button" onClick={() => setTab('login')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${tab === 'login' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Login</button>
            <button type="button" onClick={() => setTab('register')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${tab === 'register' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Register</button>
          </div>

          {/* In-app error display */}
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-4 flex justify-between items-center text-red-700 text-xs font-bold">
              <span>⚠️ {errorMsg}</span>
              <button type="button" onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-700 font-extrabold text-sm ml-2">✕</button>
            </div>
          )}

          {tab === 'register' && (
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-green-600 font-medium" />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-green-600 font-medium" />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-green-600 font-medium" />
          </div>

          {tab === 'register' && (
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number</label>
              <div className="flex h-12 rounded-xl border border-slate-200 overflow-hidden bg-white">
                <span className="px-4 flex items-center bg-slate-50 font-bold border-r border-slate-100 text-slate-800">+91</span>
                <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter mobile number" className="flex-1 px-4 focus:outline-none font-medium" />
              </div>
            </div>
          )}

                  <div className="mb-4 text-slate-400 text-[10px] bg-slate-50 border border-slate-100 rounded-lg p-2.5 leading-relaxed">
            💡 <span className="font-bold text-slate-600">Sample credentials:</span> Any email/pass will log you in directly, or use: <span className="font-bold text-green-700">customer@smartqueue.com</span> / <span className="font-bold text-green-700">Customer@123</span>
          </div>

          <button type="submit" disabled={loading} className="w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-xl shadow-sm transition">
            {loading ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="my-6 flex items-center justify-center gap-3">
            <div className="flex-1 h-[1px] bg-slate-200"></div>
            <span className="text-xs font-bold text-slate-400">OR</span>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>

          <button type="button" onClick={() => handleOAuthLogin('Google')} disabled={loading} className="w-full h-12 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition mb-3">
            <span>🌐</span> Continue with Google
          </button>
          <button type="button" onClick={() => handleOAuthLogin('Apple')} disabled={loading} className="w-full h-12 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition">
            <span>🍎</span> Continue with Apple
          </button>

          <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed">
            By continuing, you agree to our <br /> <span className="font-bold text-slate-700 underline">Terms & Conditions</span>
          </p>
        </form>
      </div>
    </div>
  );
}

// Real SmartQueue enabled shopping malls database in Bangalore
const STORES = [
  { id: 'phoenix_marketcity', name: 'Phoenix Marketcity Bengaluru', location: 'Whitefield Main Rd, Mahadevapura, Bengaluru', waitTime: '4 min wait', hours: '10:00 AM - 10:00 PM' },
  { id: 'orion_mall', name: 'Orion Mall', location: 'Brigade Gateway, Dr. Rajkumar Rd, Malleshwaram, Bengaluru', waitTime: '2 min wait', hours: '10:00 AM - 10:00 PM' },
  { id: 'forum_koramangala', name: 'Nexus Mall (Forum) Koramangala', location: 'Hosur Rd, Koramangala, Bengaluru', waitTime: '3 min wait', hours: '10:00 AM - 10:00 PM' },
  { id: 'ub_city', name: 'UB City Mall', location: 'Vittal Mallya Rd, KG Halli, D\' Souza Layout, Bengaluru', waitTime: 'No wait', hours: '11:00 AM - 09:30 PM' },
  { id: 'lulu_mall', name: 'Lulu Global Mall', location: 'Gopalapura, Binnipete, Bengaluru', waitTime: '5 min wait', hours: '09:00 AM - 11:00 PM' },
  { id: 'royal_meenakshi', name: 'Royal Meenakshi Mall', location: 'Bannerghatta Main Rd, Hulimavu, Bengaluru', waitTime: '1 min wait', hours: '10:00 AM - 10:00 PM' },
  { id: 'mantri_square', name: 'Mantri Square Mall', location: 'Sampige Rd, Malleshwaram, Bengaluru', waitTime: '3 min wait', hours: '10:00 AM - 10:00 PM' }
];

// --- CUSTOMER DASHBOARD SCREEN (Storyboard 4) ---
function CustomerDashboard() {
  const navigate = useNavigate();
  const user = getLocalStorage('customer_user', { name: 'Rahul Sharma' });
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(
    getLocalStorage('selected_store', STORES[0])
  );

  const handleSelectStore = (store: typeof STORES[0]) => {
    setSelectedStore(store);
    setLocalStorage('selected_store', store);
    addActivityLog('CUSTOMER_SESSION', `Shopper ${user.name} checked in at ${store.name} (${store.location}).`);
    setShowModal(false);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-40 shrink-0">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-900 tracking-tight">SmartQueue</span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/customer/login'); }} className="text-xs font-bold text-slate-500 hover:text-red-600 transition flex items-center gap-1">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Hello, {user.name} 👋</h2>
          <p className="text-slate-500 text-sm mt-1">Welcome back. Start your shopping trip below.</p>
        </div>

        {/* Store Card with Selection Action */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm border-l-4 border-l-green-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4 items-center">
            <span className="text-4xl">🏪</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-800 text-lg">{selectedStore.name}</h3>
                <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0">{selectedStore.waitTime}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">📍 {selectedStore.location}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[11px] text-green-700 font-bold">Open  ·  Closes 10:00 PM  ·  Hours: {selectedStore.hours}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setShowModal(true)} className="flex-1 md:flex-initial h-12 px-5 border-2 border-slate-200 text-slate-700 hover:border-slate-300 font-bold rounded-xl transition flex items-center justify-center gap-1.5 text-sm">
              Change Mall
            </button>
            <button onClick={() => navigate('/customer/scan')} className="flex-1 md:flex-initial h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-sm transition text-sm">
              Start Shopping
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h4>
          <div className="grid grid-cols-4 gap-4">
            <button onClick={() => navigate('/customer/scan')} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-green-600 hover:shadow-md transition flex flex-col items-center gap-2">
              <span className="text-3xl">📷</span>
              <span className="text-xs font-bold text-slate-700">Scan Product</span>
            </button>
            <button onClick={() => navigate('/customer/cart')} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-green-600 hover:shadow-md transition flex flex-col items-center gap-2">
              <span className="text-3xl">🛒</span>
              <span className="text-xs font-bold text-slate-700">My Cart</span>
            </button>
            <button onClick={() => navigate('/customer/profile')} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-green-600 hover:shadow-md transition flex flex-col items-center gap-2">
              <span className="text-3xl">🎟️</span>
              <span className="text-xs font-bold text-slate-700">Coupons</span>
            </button>
            <button onClick={() => navigate('/customer/profile')} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-green-600 hover:shadow-md transition flex flex-col items-center gap-2">
              <span className="text-3xl">💳</span>
              <span className="text-xs font-bold text-slate-700">Wallet</span>
            </button>
          </div>
        </div>

        {/* Recent Order */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Order Status</h4>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex justify-between items-center">
            <div>
              <h5 className="font-extrabold text-slate-800 text-sm">Order #2156</h5>
              <p className="text-xs text-slate-500 mt-1">12 May, 2026</p>
              <h5 className="font-extrabold text-slate-900 text-lg mt-2">₹1,240.00</h5>
            </div>
            <span className="px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">Completed</span>
          </div>
        </div>
      </div>

      {/* Shopping Mall Selection Modal Backdrop */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">Select Shopping Mall</h3>
                <p className="text-slate-500 text-xs mt-0.5">Select your nearest store location</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>
            
            {/* Malls List */}
            <div className="p-6 overflow-y-auto flex flex-col gap-3">
              {STORES.map((store) => (
                <button 
                  key={store.id}
                  onClick={() => handleSelectStore(store)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex justify-between items-center gap-4 ${selectedStore.id === store.id ? 'border-green-600 bg-green-50/20 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="flex-grow">
                    <h5 className="font-extrabold text-slate-800 text-sm">{store.name}</h5>
                    <p className="text-xs text-slate-500 mt-1 font-medium">📍 {store.location}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Hours: {store.hours}</p>
                  </div>
                  <div className="shrink-0">
                    <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-extrabold rounded-full">
                      {store.waitTime}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <CustomerTabBar activeTab="home" />
    </div>
  );
}

// --- CUSTOMER SCAN SCREEN (Storyboard 5 & 6) ---
function CustomerScan() {
  const navigate = useNavigate();
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    try {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 220 }, false);
      scanner.render(
        (data) => {
          scanner.clear();
          handleScannedBarcode(data);
        },
        () => {}
      );
      scannerRef.current = scanner;
    } catch (e) {
      console.warn('Scanner init fail, using manual code mode.');
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const handleScannedBarcode = (code: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Try live API product retrieval first
    fetch(`${API_URL}/products/barcode/${code}`, { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error('API lookup fail');
        const data = await res.json();
        // Backend typically returns product inside payload block
        const prod = data.data || data;
        setScannedProduct({
          productId: prod._id || prod.productId,
          name: prod.name,
          price: prod.price,
          brand: prod.brand || 'Store Brand'
        });
        setQty(1);
        setSuccessMsg('Product matched on server!');
      })
      .catch(() => {
        // Fallback Database query
        const localProd = FALLBACK_PRODUCTS[code];
        if (localProd) {
          setScannedProduct({
            productId: 'prod_' + code,
            name: localProd.name,
            price: localProd.price,
            brand: localProd.brand
          });
          setQty(1);
          setSuccessMsg('Product found in offline database.');
        } else {
          setErrorMsg(`Barcode ${code} not found. Try: 8901764100078 (Milk) or 8901063007277 (Cookies).`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode) return;
    handleScannedBarcode(manualCode);
  };

  const addToCart = () => {
    const currentCart = getLocalStorage<any[]>('cart_items', []);
    const existsIdx = currentCart.findIndex(item => item.productId === scannedProduct.productId);
    
    if (existsIdx !== -1) {
      currentCart[existsIdx].quantity += qty;
    } else {
      currentCart.push({ ...scannedProduct, quantity: qty });
    }
    setLocalStorage('cart_items', currentCart);
    
    const user = getLocalStorage('customer_user', { name: 'Shopper' });
    addActivityLog('ITEM_SCANNED', `Shopper ${user.name} added ${scannedProduct.name} to cart.`);
    
    setScannedProduct(null);
    setManualCode('');
    setSuccessMsg('Added product to cart successfully.');
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col justify-between relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4 flex items-center justify-between shrink-0">
        <button onClick={() => navigate('/customer/dashboard')} className="text-zinc-400 font-bold flex items-center gap-1">
          ← Back
        </button>
        <span className="font-extrabold">Scan Product</span>
        <div className="w-10"></div>
      </div>

      {/* Camera Scanning cutout area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        {/* Messages */}
        {errorMsg && (
          <div className="w-full max-w-md bg-red-900/60 border border-red-500 p-4 rounded-xl mb-4 text-red-200 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="w-full max-w-md bg-green-900/60 border border-green-500 p-4 rounded-xl mb-4 text-green-200 text-xs font-semibold">
            ✓ {successMsg}
          </div>
        )}

        {scannedProduct ? (
          <div className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold mb-2">✓</div>
              <h3 className="text-lg font-black text-green-800">Item Matched</h3>
            </div>

            <div className="flex gap-4 items-center bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-xl font-bold text-green-800">📦</div>
              <div className="flex-grow">
                <h4 className="font-bold text-slate-800">{scannedProduct.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{scannedProduct.brand}</p>
                <h5 className="font-extrabold text-green-700 mt-1">₹{scannedProduct.price}</h5>
              </div>
              
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 bg-slate-50">-</button>
                <span className="px-3 font-bold text-slate-800">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 bg-slate-50">+</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={addToCart} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition">
                Add & Continue Scanning
              </button>
              <button onClick={() => { addToCart(); navigate('/customer/cart'); }} className="text-green-700 font-bold text-center text-sm py-2 hover:underline">
                View Shopping Cart ({getLocalStorage<any[]>('cart_items', []).length + 1})
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md flex flex-col items-center gap-6">
            <div id="reader" className="w-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 min-h-[220px]">
              <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500 min-h-[220px]">
                <Camera size={36} className="mb-2 text-zinc-600" />
                <p className="text-xs">Camera scanning viewfinder active</p>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="w-full bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Manual Barcode Input</label>
              <div className="flex gap-2">
                <input type="text" value={manualCode} onChange={e => setManualCode(e.target.value)} placeholder="e.g. 8901764100078" className="flex-grow h-12 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-green-600" />
                <button type="submit" className="px-6 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition">Verify</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <CustomerTabBar activeTab="scan" />
    </div>
  );
}

// --- CUSTOMER CART SCREEN (Storyboard 7) ---
function CustomerCart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>(() => getLocalStorage<any[]>('cart_items', []));
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const handlingFee = subtotal > 0 ? 10 : 0;
  const total = subtotal + handlingFee - discount;

  const updateQty = (id: string, delta: number) => {
    const updated = items.map(item => {
      if (item.productId === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);

    setItems(updated);
    setLocalStorage('cart_items', updated);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(item => item.productId !== id);
    setItems(updated);
    setLocalStorage('cart_items', updated);
  };

  const applyCoupon = () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (couponCode.toUpperCase() === 'WELCOME100') {
      setDiscount(Math.min(100, subtotal));
      setSuccessMsg('WELCOME100 coupon applied: ₹100 Discount credited.');
    } else {
      setErrorMsg('Invalid Coupon code. Try using: WELCOME100');
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-40 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/customer/dashboard')} className="text-slate-500 font-bold flex items-center gap-1">
            ← Back
          </button>
          <span className="font-extrabold text-slate-800 text-base">My Shopping Cart</span>
          <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[10px] font-bold">{items.length} items</span>
        </div>
      </div>

      <div className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col gap-4 overflow-y-auto">
        {/* In-app alerts */}
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl text-red-700 text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl text-green-700 text-xs font-bold">
            ✓ {successMsg}
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-slate-400">
            <span className="text-6xl mb-4">🛒</span>
            <h3 className="font-bold text-lg text-slate-700">Your cart is empty</h3>
            <p className="text-xs mt-1 mb-6">Scan items as you walk through the store</p>
            <button onClick={() => navigate('/customer/scan')} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition">Start Scanning</button>
          </div>
        ) : (
          <>
            {/* List */}
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <div key={item.productId} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-xl font-bold">📦</div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">₹{item.price} per unit</p>
                    
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 w-24 h-7 mt-2">
                      <button onClick={() => updateQty(item.productId, -1)} className="w-8 flex items-center justify-center font-bold text-slate-500">-</button>
                      <span className="flex-grow text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="w-8 flex items-center justify-center font-bold text-slate-500">+</button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button onClick={() => deleteItem(item.productId)} className="text-slate-400 hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                    <h5 className="font-extrabold text-slate-900">₹{item.price * item.quantity}</h5>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex gap-2">
              <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Promo Coupon (e.g. WELCOME100)" className="flex-grow px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-green-600 bg-slate-50" />
              <button onClick={applyCoupon} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm transition">Apply</button>
            </div>

            {/* Price breakdown */}
            <div className="bg-slate-100 rounded-xl border border-slate-200 p-4 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Handling / Exit Fee</span>
                <span>₹{handlingFee.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs font-bold text-green-700">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="h-[1px] bg-slate-200 my-1"></div>
              <div className="flex justify-between text-sm font-black text-slate-800">
                <span>Grand Total</span>
                <span className="text-green-700">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => navigate('/customer/payment', { state: { total } })} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-between px-6 shadow-md transition mt-4 shrink-0">
              <span>Proceed to Pay</span>
              <span>₹{total.toFixed(2)} →</span>
            </button>
          </>
        )}
      </div>

      <CustomerTabBar activeTab="cart" />
    </div>
  );
}

// --- CUSTOMER PAYMENT SCREEN (Storyboard 8) ---
function CustomerPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const total = location.state?.total || 141.00;
  const [method, setMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    const cart = getLocalStorage<any[]>('cart_items', []);
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`${API_URL}/inventory/deduct-mock`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ items: cart })
    })
      .then(() => console.log('Backend stock deducted successfully'))
      .catch((err) => console.error('Failed to deduct backend stock:', err))
      .finally(() => {
        setTimeout(() => {
          const orderNum = '#' + Math.floor(2000 + Math.random() * 9000);
          const newOrder = { orderNumber: orderNum, total, items: cart, date: new Date().toLocaleDateString(), status: 'Completed' };
          
          // Store in orders database
          const orders = getLocalStorage<any[]>('customer_orders', []);
          orders.unshift(newOrder);
          setLocalStorage('customer_orders', orders);
          
          // Save as latest exit pass order
          setLocalStorage('pass_order', newOrder);
          setLocalStorage('cart_items', []);
          
          const user = getLocalStorage('customer_user', { name: 'Shopper' });
          addActivityLog('PAYMENT_COMPLETED', `Payment of ₹${total.toFixed(2)} successful for Order ${orderNum} by ${user.name}. Awaiting gate verification.`);
          
          setLoading(false);
          navigate('/customer/pass');
        }, 800);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-40 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/customer/cart')} className="text-slate-500 font-bold flex items-center gap-1">
            ← Back
          </button>
          <span className="font-extrabold text-slate-800 text-base">Select Payment Method</span>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col gap-6 overflow-y-auto">
        {/* Total Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Amount</p>
          <h2 className="text-3xl font-black text-slate-900 mt-2">₹{total.toFixed(2)}</h2>
        </div>

        {/* Methods */}
        <div className="flex flex-col gap-3">
          <button onClick={() => setMethod('upi')} className={`p-4 rounded-xl border flex items-center gap-4 transition text-left ${method === 'upi' ? 'border-green-600 bg-green-50/30' : 'border-slate-200 bg-white'}`}>
            <span className="text-2xl">📱</span>
            <div className="flex-grow">
              <h4 className="font-bold text-slate-800 text-sm">UPI</h4>
              <p className="text-xs text-slate-500 mt-0.5">GooglePay, PhonePe, Paytm</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'upi' ? 'border-green-600' : 'border-slate-300'}`}>
              {method === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>}
            </div>
          </button>

          <button onClick={() => setMethod('card')} className={`p-4 rounded-xl border flex items-center gap-4 transition text-left ${method === 'card' ? 'border-green-600 bg-green-50/30' : 'border-slate-200 bg-white'}`}>
            <span className="text-2xl">💳</span>
            <div className="flex-grow">
              <h4 className="font-bold text-slate-800 text-sm">Credit / Debit Card</h4>
              <p className="text-xs text-slate-500 mt-0.5">Visa, MasterCard, RuPay</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'card' ? 'border-green-600' : 'border-slate-300'}`}>
              {method === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>}
            </div>
          </button>

          <button onClick={() => setMethod('wallet')} className={`p-4 rounded-xl border flex items-center gap-4 transition text-left ${method === 'wallet' ? 'border-green-600 bg-green-50/30' : 'border-slate-200 bg-white'}`}>
            <span className="text-2xl">💼</span>
            <div className="flex-grow">
              <h4 className="font-bold text-slate-800 text-sm">Wallets</h4>
              <p className="text-xs text-slate-500 mt-0.5">Paytm, PhonePe, Amazon Pay</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'wallet' ? 'border-green-600' : 'border-slate-300'}`}>
              {method === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>}
            </div>
          </button>
        </div>

        <div className="flex justify-center items-center gap-1.5 text-xs text-slate-400 mt-4">
          <span>🛡️</span> 100% Secure Payment via Gateway
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 p-4 shrink-0">
        <div className="max-w-xl mx-auto">
          <button onClick={handlePay} disabled={loading} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center">
            {loading ? 'Processing Payment...' : `Pay ₹${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- CUSTOMER EXIT PASS / QR SCREEN (Storyboard 9 & 10) ---
function CustomerPass() {
  const navigate = useNavigate();
  const order = getLocalStorage('pass_order', { orderNumber: '#2156', total: 141, items: [{ name: 'Amul Full Cream Milk 1L', quantity: 1 }] });
  const [timeLeft, setTimeLeft] = useState(105);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(c => c > 0 ? c - 1 : 0), 1000);
    
    // Simulate exit verification approval after 8s
    const timeout = setTimeout(() => {
      setVerified(true);
    }, 8000);

    return () => {
      clearInterval(t);
      clearTimeout(timeout);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-green-600 text-white flex flex-col justify-between p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-white text-green-600 flex items-center justify-center text-4xl mb-6 shadow-lg animate-bounce">✓</div>
          <h2 className="text-3xl font-black mb-2">Exit Approved!</h2>
          <p className="text-green-100 text-sm leading-relaxed mb-8">
            Your payment and items have been verified. You may now pass through the gate exit barrier.
          </p>

          <div className="bg-white/10 w-full p-4 rounded-xl border border-white/20 text-left mb-6">
            <p className="text-[10px] uppercase font-bold text-green-200">Verified Checklist</p>
            <div className="h-[1px] bg-white/20 my-2"></div>
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-center py-1">
                <span className="text-white font-bold">✓</span>
                <span className="text-sm">{item.name} x {item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="bg-white text-green-800 py-3 px-6 rounded-xl font-bold mb-8">
            Thank You! Visit Again 🤝
          </div>
        </div>

        <button onClick={() => navigate('/customer/dashboard')} className="w-full max-w-md mx-auto h-12 bg-white text-green-700 font-bold rounded-xl shadow-md transition">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Success banner */}
      <div className="bg-white border-b border-slate-200 p-6 text-center pt-10 shrink-0">
        <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">✓</div>
        <h2 className="text-xl font-black text-green-800">Payment Successful!</h2>
        <p className="text-xs text-slate-500 mt-1">Show this QR code at the exit gate</p>
        
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-full mt-4">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] text-green-700 font-bold">Valid · Expires in {formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex-grow max-w-md w-full mx-auto p-4 flex flex-col items-center gap-6 justify-center overflow-y-auto">
        {/* QR pass */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg flex flex-col items-center">
          <div className="w-48 h-48 bg-slate-100 flex items-center justify-center border border-slate-200 rounded-xl relative overflow-hidden">
            <span className="text-8xl select-none opacity-80">📱</span>
            <div className="absolute inset-0 border-[6px] border-green-600/30 m-4 rounded-lg"></div>
          </div>
          <h5 className="font-extrabold text-slate-800 mt-4">Order ID: {order.orderNumber}</h5>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2 shrink-0">
        <button onClick={() => navigate('/customer/orders')} className="w-full max-w-md mx-auto h-12 border-2 border-green-600 text-green-700 font-bold rounded-xl transition flex items-center justify-center">
          Go to Orders
        </button>
      </div>
    </div>
  );
}

// --- CUSTOMER ORDERS SCREEN (New Tab) ---
function CustomerOrders() {
  const navigate = useNavigate();
  const orders = getLocalStorage<any[]>('customer_orders', [
    { orderNumber: '#2156', total: 1240, date: '12 May, 2026', status: 'Completed', items: [{ name: 'Grocery Pack', quantity: 1 }] }
  ]);

  return (
    <div className="h-screen bg-slate-50 flex flex-col justify-between overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-40 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/customer/dashboard')} className="text-slate-500 font-bold flex items-center gap-1">
            ← Back
          </button>
          <span className="font-extrabold text-slate-800 text-base">My Orders</span>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col gap-4 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-slate-400">
            <span className="text-6xl mb-4">📦</span>
            <h3 className="font-bold text-lg text-slate-700">No orders found</h3>
            <p className="text-xs mt-1">You haven't completed any checkouts yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((o, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-sm">Order ID: {o.orderNumber}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{o.date}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-[10px] font-bold">
                    {o.status}
                  </span>
                </div>
                <div className="h-[1px] bg-slate-100 my-2"></div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">{o.items?.length || 1} items total</span>
                  <span className="font-black text-slate-800">₹{o.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CustomerTabBar activeTab="orders" />
    </div>
  );
}

// --- CUSTOMER PROFILE SCREEN (New Tab) ---
function CustomerProfile() {
  const navigate = useNavigate();
  const user = getLocalStorage('customer_user', { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '9876543210' });
  const [wallet, setWallet] = useState(500);
  const [successMsg, setSuccessMsg] = useState('');
  const [subPage, setSubPage] = useState<string | null>(null);

  const addMockMoney = () => {
    setWallet(w => w + 500);
    setSuccessMsg('Mock Credit added: +₹500.00 topped up.');
  };

  return (
    <div className="h-screen bg-slate-50/50 flex flex-col justify-between overflow-hidden">
      {/* Custom Mockup Profile Header */}
      <div className="bg-slate-50/50 px-6 pt-10 pb-4 flex items-end justify-between sticky top-0 z-40 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Profile</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Manage your account</p>
        </div>
        <div className="relative p-2.5 bg-white rounded-full border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition">
          <Bell size={20} className="text-slate-700" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white shadow-sm">
            3
          </span>
        </div>
      </div>

      <div className="flex-grow max-w-4xl w-full mx-auto px-6 pb-6 flex flex-col gap-6 overflow-y-auto">
        {successMsg && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl text-green-700 text-xs font-bold shadow-sm">
            ✓ {successMsg}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center justify-between hover:shadow-md transition duration-200">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-700 font-black text-3xl shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="font-extrabold text-slate-800 text-base leading-snug">{user.name}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-extrabold rounded-full w-max">
                  👑 Premium Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-semibold">{user.email || 'customer@smartqueue.com'}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">+91 {user.phone}</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 transition">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Wallet balance */}
        <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-3xl p-5 shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
              👛
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Smart Wallet Balance</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-0.5">₹{wallet.toFixed(2)}</h3>
            </div>
          </div>
          <button onClick={addMockMoney} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-xs shadow-sm transition">
            Top Up
          </button>
        </div>

        {/* First Menu Group */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {/* Coupons */}
          <div onClick={() => setSubPage('coupons')} className="px-6 py-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><Tag size={18} /></div>
              <span className="text-sm font-bold text-slate-700">Coupons</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-black rounded-full">1 Active</span>
              <ChevronRight size={16} className="text-slate-400" />
            </div>
          </div>

          {/* My Orders */}
          <div onClick={() => navigate('/customer/orders')} className="px-6 py-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"><Package size={18} /></div>
              <span className="text-sm font-bold text-slate-700">My Orders</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          {/* Wishlist */}
          <div onClick={() => setSubPage('wishlist')} className="px-6 py-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500"><Heart size={18} /></div>
              <span className="text-sm font-bold text-slate-700">Wishlist</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          {/* Saved Addresses */}
          <div onClick={() => setSubPage('addresses')} className="px-6 py-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500"><MapPin size={18} /></div>
              <span className="text-sm font-bold text-slate-700">Saved Addresses</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          {/* Payment Methods */}
          <div onClick={() => setSubPage('payments')} className="px-6 py-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500"><CreditCard size={18} /></div>
              <span className="text-sm font-bold text-slate-700">Payment Methods</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          {/* Account & Security */}
          <div onClick={() => setSubPage('security')} className="px-6 py-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500"><Shield size={18} /></div>
              <span className="text-sm font-bold text-slate-700">Account & Security</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          {/* Notifications */}
          <div onClick={() => setSubPage('notifications')} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500"><Bell size={18} /></div>
              <span className="text-sm font-bold text-slate-700">Notifications</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </div>

        {/* Second Menu Group */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {/* Help Center */}
          <div onClick={() => setSubPage('help')} className="px-6 py-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500"><HelpCircle size={18} /></div>
              <span className="text-sm font-bold text-slate-700">Help Center</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          {/* Contact Support */}
          <div onClick={() => setSubPage('support')} className="px-6 py-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500"><Headphones size={18} /></div>
              <span className="text-sm font-bold text-slate-700">Contact Support</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>

          {/* Terms & Privacy */}
          <div onClick={() => setSubPage('terms')} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/30 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500"><FileText size={18} /></div>
              <span className="text-sm font-bold text-slate-700">Terms & Privacy</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </div>

        {/* Sign Out Button */}
        <button 
          onClick={() => { localStorage.clear(); navigate('/'); }} 
          className="w-full h-14 bg-red-50/40 hover:bg-red-50 text-red-600 font-extrabold border border-red-200/80 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm text-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Render sub-screens when subPage is active */}
      {subPage === 'addresses' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-hidden animate-fade-in z-50">
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center gap-3 shrink-0">
            <button onClick={() => setSubPage(null)} className="text-slate-500 hover:text-slate-800 transition font-bold text-xl">←</button>
            <span className="font-extrabold text-slate-800 text-lg">Saved Addresses</span>
          </div>
          <div className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto max-w-4xl w-full mx-auto">
            <div className="border border-green-600 bg-green-50/20 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-extrabold text-slate-800 text-sm">🏠 Home</h4>
                <span className="px-2.5 py-0.5 bg-green-100 border border-green-200 text-green-700 text-[10px] font-black rounded-full">DEFAULT</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Flat 402, Signature Residency, 12th Main Road, Indiranagar, Bengaluru - 560038
              </p>
            </div>
            <div className="border border-slate-200 bg-white rounded-3xl p-5 hover:border-slate-300 transition duration-200 shadow-sm">
              <h4 className="font-extrabold text-slate-800 text-sm mb-2">🏢 Office</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Level 6, Tech Park Towers, Outer Ring Road, Bellandur, Bengaluru - 560103
              </p>
            </div>
            <button onClick={() => alert('New address addition is simulated.')} className="w-full h-14 border-2 border-dashed border-slate-200 text-slate-500 hover:border-slate-300 font-bold rounded-2xl text-sm transition flex items-center justify-center gap-1 mt-4">
              + Add New Address
            </button>
          </div>
          <CustomerTabBar activeTab="profile" />
        </div>
      )}

      {subPage === 'coupons' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-hidden animate-fade-in z-50">
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center gap-3 shrink-0">
            <button onClick={() => setSubPage(null)} className="text-slate-500 hover:text-slate-800 transition font-bold text-xl">←</button>
            <span className="font-extrabold text-slate-800 text-lg">My Active Coupons</span>
          </div>
          <div className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto max-w-4xl w-full mx-auto">
            <div className="border border-dashed border-amber-300 bg-amber-50/40 rounded-3xl p-5 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">WELCOME100</h4>
                <p className="text-xs text-slate-500 mt-1">₹100 discount on your first checkout order.</p>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">Min order value: ₹200</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-black rounded-full">ACTIVE</span>
            </div>
            <div className="border border-slate-200 bg-slate-50/50 rounded-3xl p-5 flex justify-between items-center opacity-70">
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">SMARTQ15</h4>
                <p className="text-xs text-slate-500 mt-1">Get 15% discount on all items in cart.</p>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">Expires: 30 Dec, 2026</p>
              </div>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-black rounded-full">LOCKED</span>
            </div>
          </div>
          <CustomerTabBar activeTab="profile" />
        </div>
      )}

      {subPage === 'wishlist' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-hidden animate-fade-in z-50">
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center gap-3 shrink-0">
            <button onClick={() => setSubPage(null)} className="text-slate-500 hover:text-slate-800 transition font-bold text-xl">←</button>
            <span className="font-extrabold text-slate-800 text-lg">Shopping Wishlist</span>
          </div>
          <div className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto max-w-4xl w-full mx-auto">
            {[
              { id: '8901764100078', name: 'Amul Full Cream Milk 1L', price: 62 },
              { id: '8901058000020', name: 'Maggi 2-Minute Noodles 70g', price: 14 },
              { id: '8901063007277', name: 'Britannia Good Day Cookies 200g', price: 35 }
            ].map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 border border-slate-100 bg-white rounded-3xl shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">📦</span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-green-600 font-extrabold mt-1">₹{item.price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const cart = getLocalStorage<any[]>('cart_items', []);
                    const existsIdx = cart.findIndex(c => c.productId === 'prod_' + item.id);
                    if (existsIdx !== -1) {
                      cart[existsIdx].quantity += 1;
                    } else {
                      cart.push({ productId: 'prod_' + item.id, name: item.name, price: item.price, brand: 'Wishlist Item', quantity: 1 });
                    }
                    setLocalStorage('cart_items', cart);
                    setSuccessMsg(`Added ${item.name} to Cart!`);
                    setSubPage(null);
                  }} 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition"
                >
                  + Add to Cart
                </button>
              </div>
            ))}
          </div>
          <CustomerTabBar activeTab="profile" />
        </div>
      )}

      {subPage === 'payments' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-hidden animate-fade-in z-50">
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center gap-3 shrink-0">
            <button onClick={() => setSubPage(null)} className="text-slate-500 hover:text-slate-800 transition font-bold text-xl">←</button>
            <span className="font-extrabold text-slate-800 text-lg">Payment Options</span>
          </div>
          <div className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto max-w-4xl w-full mx-auto">
            <div className="border border-slate-100 bg-white rounded-3xl p-5 flex items-center gap-4 shadow-sm">
              <span className="text-3xl">💳</span>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">HDFC Bank Credit Card</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">•••• •••• •••• 4321 · Expiry: 12/29</p>
              </div>
            </div>
            <div className="border border-slate-100 bg-white rounded-3xl p-5 flex items-center gap-4 shadow-sm">
              <span className="text-3xl">📱</span>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Google Pay UPI</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">rahul.sharma@okaxis</p>
              </div>
            </div>
            <div className="border border-slate-100 bg-white rounded-3xl p-5 flex items-center gap-4 shadow-sm">
              <span className="text-3xl">👛</span>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Linked Smart Wallet</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">Current Balance: ₹{wallet.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <CustomerTabBar activeTab="profile" />
        </div>
      )}

      {subPage === 'security' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-hidden animate-fade-in z-50">
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center gap-3 shrink-0">
            <button onClick={() => setSubPage(null)} className="text-slate-500 hover:text-slate-800 transition font-bold text-xl">←</button>
            <span className="font-extrabold text-slate-800 text-lg">Account & Security</span>
          </div>
          <div className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto max-w-4xl w-full mx-auto">
            <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Biometric Face ID / Fingerprint</h4>
                <p className="text-xs text-slate-400 mt-1">Enable quick biometric store entry passes.</p>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">ENABLED</span>
            </div>
            <div className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Two-Factor Authentication</h4>
                <p className="text-xs text-slate-400 mt-1">Secure checkouts with real-time OTP checks.</p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">DISABLED</span>
            </div>
          </div>
          <CustomerTabBar activeTab="profile" />
        </div>
      )}

      {subPage === 'notifications' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-hidden animate-fade-in z-50">
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center gap-3 shrink-0">
            <button onClick={() => setSubPage(null)} className="text-slate-500 hover:text-slate-800 transition font-bold text-xl">←</button>
            <span className="font-extrabold text-slate-800 text-lg">Notifications</span>
          </div>
          <div className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto max-w-4xl w-full mx-auto">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-800 text-sm">💳 Wallet Top-Up Successful</span>
                <span className="text-[10px] text-slate-400">10 mins ago</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">₹500.00 topped up inside your Smart Wallet balance successfully.</p>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-800 text-sm">🎟️ WELCOME100 Applied!</span>
                <span className="text-[10px] text-slate-400">1 hour ago</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">You unlocked ₹100 discount coupon which can be used on checkout total.</p>
            </div>
          </div>
          <CustomerTabBar activeTab="profile" />
        </div>
      )}

      {subPage === 'help' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-hidden animate-fade-in z-50">
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center gap-3 shrink-0">
            <button onClick={() => setSubPage(null)} className="text-slate-500 hover:text-slate-800 transition font-bold text-xl">←</button>
            <span className="font-extrabold text-slate-800 text-lg">Help Center</span>
          </div>
          <div className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto max-w-4xl w-full mx-auto">
            <h4 className="font-extrabold text-slate-800 text-sm mb-2">Frequently Asked Questions</h4>
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <h5 className="font-extrabold text-slate-800 text-sm">How do I verify checkout exit passes?</h5>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">Present the QR Pass at the gate exit checkpoint to the gate clerk, who will scan it and release the door.</p>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <h5 className="font-extrabold text-slate-800 text-sm">Is my smart wallet safe?</h5>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">Yes, all smart wallet additions are encrypted, PCI-compliant, and fully refunded on request.</p>
            </div>
          </div>
          <CustomerTabBar activeTab="profile" />
        </div>
      )}

      {subPage === 'support' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-hidden animate-fade-in z-50">
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center gap-3 shrink-0">
            <button onClick={() => setSubPage(null)} className="text-slate-500 hover:text-slate-800 transition font-bold text-xl">←</button>
            <span className="font-extrabold text-slate-800 text-lg">Contact Support</span>
          </div>
          <div className="flex-grow p-6 flex flex-col gap-6 text-center overflow-y-auto max-w-4xl w-full mx-auto">
            <div className="w-16 h-16 bg-green-50 text-green-700 rounded-full flex items-center justify-center text-3xl mx-auto mt-4 shadow-sm border border-green-100">
              📞
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-lg">We are here to help!</h4>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Get in touch with support specialists around the clock</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-5 bg-white rounded-3xl border border-slate-150 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Call Us</p>
                <p className="text-sm font-black text-slate-800 mt-2">+91 80 4392 0000</p>
              </div>
              <div className="p-5 bg-white rounded-3xl border border-slate-150 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Us</p>
                <p className="text-sm font-black text-slate-800 mt-2">support@smartqueue.co</p>
              </div>
            </div>
          </div>
          <CustomerTabBar activeTab="profile" />
        </div>
      )}

      {subPage === 'terms' && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-hidden animate-fade-in z-50">
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center gap-3 shrink-0">
            <button onClick={() => setSubPage(null)} className="text-slate-500 hover:text-slate-800 transition font-bold text-xl">←</button>
            <span className="font-extrabold text-slate-800 text-lg">Terms & Privacy</span>
          </div>
          <div className="flex-grow p-6 flex flex-col gap-4 overflow-y-auto text-slate-500 text-xs leading-relaxed font-medium max-w-4xl w-full mx-auto">
            <p className="font-extrabold text-slate-700 text-sm">1. Usage Policy</p>
            <p>By using the SmartQueue checkouts app, you agree to scan item barcodes truthfully and pay fully before leaving the retail gate barrier area.</p>
            <p className="font-extrabold text-slate-700 text-sm mt-3">2. Wallet Balances</p>
            <p>Wallet amounts loaded can be refunded to your original payment cards within 7 business days by contact details request forms.</p>
          </div>
          <CustomerTabBar activeTab="profile" />
        </div>
      )}

      <CustomerTabBar activeTab="profile" />
    </div>
  );
}

// --- WORKER LOGIN SCREEN ---
function WorkerLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!id || !pwd) {
      setErrorMsg('Please fill in employee credentials');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLocalStorage('worker_user', { name: 'Arjun', employeeId: id });
      setLoading(false);
      navigate('/worker/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="bg-green-700 p-8 text-center text-white">
          <div className="text-4xl mb-2">👷</div>
          <h2 className="text-xl font-black">SmartQueue Worker</h2>
          <p className="text-xs text-green-100 mt-1">Exit gate verification portal</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 sm:p-8 flex flex-col gap-4">
          <h3 className="font-bold text-white text-base mb-1">Worker Log In 🔐</h3>
          
          {errorMsg && (
            <div className="bg-red-950/60 border border-red-500 p-4 rounded-xl text-red-200 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Worker ID</label>
            <input type="text" value={id} onChange={e => setId(e.target.value)} placeholder="e.g. EMP001" className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-green-500 font-medium" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Worker@123" className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-green-500 font-medium" />
          </div>

          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/40 text-[11px] text-slate-400 leading-relaxed">
            💡 <span className="font-bold text-slate-300">Sample Worker credentials:</span><br />
            Worker ID: <span className="font-mono text-green-400 font-bold">EMP001</span><br />
            Password: <span className="font-mono text-green-400 font-bold">Worker@123</span>
          </div>

          <button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition mt-2">
            {loading ? 'Verifying Credentials...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- WORKER DASHBOARD SCREEN (Storyboard 3) ---
function WorkerDashboard() {
  const navigate = useNavigate();
  const worker = getLocalStorage('worker_user', { name: 'Arjun', employeeId: 'EMP001' });
  const [tab, setTab] = useState<'dashboard' | 'profile'>('dashboard');

  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    const loadLogs = () => {
      setLogs(getLocalStorage<any[]>('activity_logs', []));
    };
    loadLogs();
    window.addEventListener('storage', loadLogs);
    window.addEventListener('activity_logs_updated', loadLogs);
    return () => {
      window.removeEventListener('storage', loadLogs);
      window.removeEventListener('activity_logs_updated', loadLogs);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-40 shrink-0">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-700 font-extrabold text-xl">
              {worker.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base">Hello, {worker.name} 👋</h4>
              <p className="text-xs text-slate-400 mt-0.5">Good Morning</p>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/worker/login'); }} className="text-xs font-bold text-slate-500 hover:text-red-500 transition">
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col gap-6 overflow-y-auto">
        {tab === 'dashboard' ? (
          <>
            {/* Shift Card */}
            <div className="bg-green-800 rounded-2xl p-6 text-white shadow-md flex justify-between items-center">
              <div>
                <p className="text-xs uppercase font-extrabold text-green-200 tracking-wider">Current Shift</p>
                <h4 className="text-2xl font-black mt-1">09:00 AM - 06:00 PM</h4>
              </div>
              <span className="px-4 py-1.5 bg-green-700/60 rounded-full border border-green-500/40 text-xs font-bold">Active</span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
                <h3 className="text-3xl font-black text-green-600">28</h3>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase mt-2 tracking-wider">Verified Today</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
                <h3 className="text-3xl font-black text-amber-600">2</h3>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase mt-2 tracking-wider">Pending</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
                <h3 className="text-3xl font-black text-slate-800">156</h3>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase mt-2 tracking-wider">Total Scans</p>
              </div>
            </div>

            {/* Scan CTA */}
            <button onClick={() => navigate('/worker/verify')} className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.01] text-lg">
              <Camera size={24} />
              Scan Customer QR Code
            </button>

            {/* Real-time Activity Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📡</span>
                  <h4 className="font-extrabold text-slate-800 text-sm">Real-Time Activity Feed</h4>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  LIVE SYNC
                </div>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  No shopper checkouts or logs recorded yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                  {logs.map((log) => {
                    let badgeBg = 'bg-slate-100 text-slate-700';
                    let label = 'SYS';
                    if (log.type === 'CUSTOMER_SESSION') {
                      badgeBg = 'bg-blue-50 border border-blue-200 text-blue-700';
                      label = 'ENTRY';
                    } else if (log.type === 'ITEM_SCANNED') {
                      badgeBg = 'bg-amber-50 border border-amber-200 text-amber-700';
                      label = 'SCAN';
                    } else if (log.type === 'PAYMENT_COMPLETED') {
                      badgeBg = 'bg-purple-50 border border-purple-200 text-purple-700';
                      label = 'PAY';
                    } else if (log.type === 'GATE_CLEARED') {
                      badgeBg = 'bg-green-50 border border-green-200 text-green-700';
                      label = 'GATE';
                    }

                    return (
                      <div key={log.id} className="flex gap-3 items-start text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 ${badgeBg}`}>
                          {label}
                        </span>
                        <div className="flex-grow">
                          <p className="font-semibold text-slate-700 leading-normal">{log.message}</p>
                          <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{log.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Professional Employee Badge Card */}
            <div className="bg-gradient-to-br from-green-700 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              {/* Background watermark */}
              <div className="absolute right-0 bottom-0 text-white/5 font-black text-9xl pointer-events-none select-none translate-x-10 translate-y-10">
                SQ
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-full bg-white text-green-800 border-4 border-green-500/30 flex items-center justify-center text-3xl font-black shadow-md shrink-0">
                  {worker.name.charAt(0)}
                </div>
                <div className="text-center sm:text-left flex-grow">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs font-bold text-green-300">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    ACTIVE STAFF · ON DUTY
                  </div>
                  <h3 className="text-2xl font-black mt-2 tracking-tight">{worker.name}</h3>
                  <p className="text-xs text-green-200 font-semibold mt-0.5">Gate Operations Specialist</p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">ID: {worker.employeeId || 'EMP001'}</p>
                </div>
              </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Shift & Station */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💼</span>
                  <h4 className="font-extrabold text-slate-800 text-sm">Station & Shift</h4>
                </div>
                <div className="flex flex-col gap-2.5 text-xs text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-semibold">Station</span>
                    <span className="font-bold text-slate-800">Exit Barrier 01</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-semibold">Store</span>
                    <span className="font-bold text-slate-800">SmartQueue Main Store</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Shift Hours</span>
                    <span className="font-bold text-slate-800">09:00 AM - 06:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Shift Metrics (Simulated Live Data) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📈</span>
                  <h4 className="font-extrabold text-slate-800 text-sm">Today's Performance</h4>
                </div>
                <div className="flex flex-col gap-2.5 text-xs text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-semibold">Scan Accuracy</span>
                    <span className="font-bold text-green-600">99.8% (Excellent)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-semibold">Avg. Verify Time</span>
                    <span className="font-bold text-slate-800 font-mono">11.4s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Verified</span>
                    <span className="font-bold text-slate-800">28 Shoppers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Panel */}
            <div className="bg-red-50/50 border border-red-200/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h5 className="font-bold text-red-950 text-sm">End Shift Session</h5>
                <p className="text-xs text-slate-500 mt-0.5">Log out of the exit gate terminal software safely.</p>
              </div>
              <button 
                onClick={() => { localStorage.clear(); navigate('/'); }} 
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center gap-2 shadow-sm text-xs shrink-0"
              >
                <LogOut size={14} /> Sign Out Terminal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto w-full border-t border-slate-200 bg-white h-20 sticky bottom-0 z-40 flex justify-around items-center shrink-0 shadow-lg">
        <button onClick={() => setTab('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${tab === 'dashboard' ? 'text-green-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-semibold'}`}>
          <Home size={24} strokeWidth={tab === 'dashboard' ? 2.5 : 2} />
          <span className="text-[11px] tracking-wide mt-0.5">Dashboard</span>
        </button>
        <button onClick={() => navigate('/worker/verify')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-all font-semibold">
          <QrCode size={24} strokeWidth={2} />
          <span className="text-[11px] tracking-wide mt-0.5">Scan QR</span>
        </button>
        <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-1 transition-all ${tab === 'profile' ? 'text-green-600 scale-105 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-semibold'}`}>
          <User size={24} strokeWidth={tab === 'profile' ? 2.5 : 2} />
          <span className="text-[11px] tracking-wide mt-0.5">Profile</span>
        </button>
      </div>
    </div>
  );
}

// --- WORKER VERIFY SCREEN (Storyboard 5, 6 & 7) ---
function WorkerVerify() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'scan' | 'checklist' | 'success'>('scan');
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [scannedItems, setScannedItems] = useState<Record<string, boolean>>({});

  // Real-time synchronization: Worker pulls customer's exit pass order from localStorage!
  const order = getLocalStorage('pass_order', {
    orderNumber: '#2156',
    total: 141,
    items: [
      { productId: '1', name: 'Amul Full Cream Milk 1L', quantity: 1 },
      { productId: '2', name: 'Britannia Good Day Cookies 200g', quantity: 1 }
    ]
  });

  const handleQRScanned = () => {
    setStep('checklist');
    setVerifiedCount(0);
    setScannedItems({});
  };

  const toggleCheck = (id: string) => {
    const isChecked = !!scannedItems[id];
    const newScanned = { ...scannedItems, [id]: !isChecked };
    setScannedItems(newScanned);

    const count = Object.values(newScanned).filter(Boolean).length;
    setVerifiedCount(count);

    if (count >= order.items.length) {
      setStep('success');
    }
  };

  const approveComplete = () => {
    fetch(`${API_URL}/qr/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approved', token: 'mock' })
    })
    .finally(() => {
      const worker = getLocalStorage('worker_user', { name: 'Arjun' });
      addActivityLog('GATE_CLEARED', `Order ${order.orderNumber} exit verified and gate barrier cleared by worker ${worker.name}.`);
      navigate('/worker/dashboard');
    });
  };

  if (step === 'scan') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/worker/dashboard')} className="text-zinc-400 font-bold">← Cancel</button>
          <span className="font-extrabold">Scan Customer QR</span>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-64 h-64 border-2 border-green-600 rounded-2xl flex flex-col items-center justify-center bg-zinc-950/50 mb-6 relative">
            <Camera size={44} className="text-green-500 mb-2" />
            <p className="text-xs text-zinc-400">Position barcode inside frame</p>
            <div className="absolute inset-0 border-[4px] border-green-500 m-8 rounded-lg animate-pulse"></div>
          </div>

          <button onClick={handleQRScanned} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition">
            Simulate Scan (Order {order.orderNumber})
          </button>
        </div>
      </div>
    );
  }

  if (step === 'checklist') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-40 shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => setStep('scan')} className="text-slate-500 font-bold">← Back</button>
            <span className="font-extrabold text-slate-800">Verify Customer Items</span>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="flex-grow max-w-4xl w-full mx-auto p-6 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-extrabold text-slate-800">Order ID: {order.orderNumber}</h4>
            <p className="text-xs text-slate-500 mt-1">{order.items.length} items total</p>
          </div>

          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checkoff list (Verify All Items)</h5>
          
          <div className="flex flex-col gap-2">
            {order.items.map((item: any, idx: number) => {
              const isChecked = !!scannedItems[idx];
              return (
                <button 
                  key={idx} 
                  onClick={() => toggleCheck(idx.toString())}
                  className={`p-4 rounded-xl border flex items-center justify-between transition text-left ${isChecked ? 'border-green-600 bg-green-50/20' : 'border-slate-200 bg-white'}`}
                >
                  <div>
                    <h5 className={`font-bold text-sm ${isChecked ? 'text-green-800' : 'text-slate-800'}`}>{item.name}</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${isChecked ? 'border-green-600 bg-green-600 text-white' : 'border-slate-300 bg-slate-50'}`}>
                    {isChecked && <span>✓</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>Items Verified</span>
              <span>{verifiedCount} of {order.items.length}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 transition-all duration-300" style={{ width: `${(verifiedCount / order.items.length) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <button onClick={() => setStep('success')} className="w-full max-w-4xl mx-auto h-12 border-2 border-slate-200 text-slate-500 font-bold rounded-xl transition flex items-center justify-center">
            Manual Entry / Bypass
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-4xl mb-6 shadow-lg">✓</div>
        <h2 className="text-2xl font-black text-slate-800">Customer Verified!</h2>
        <p className="text-slate-500 text-sm mt-2 mb-8 leading-relaxed">
          Order verification completed successfully. Shopper is cleared to exit the barrier.
        </p>

        <div className="bg-slate-50 w-full p-4 rounded-xl border border-slate-200 text-left mb-8">
          <h5 className="font-extrabold text-slate-800 text-sm">Order Summary</h5>
          <p className="text-xs text-slate-500 mt-1">Verified Order {order.orderNumber}</p>
        </div>

        <button onClick={approveComplete} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition mb-3">
          Approve & Complete
        </button>
        
        <button onClick={() => setStep('scan')} className="w-full h-12 border-2 border-green-600 text-green-700 font-bold rounded-xl transition">
          Next Customer
        </button>
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD PORTAL ---
function AdminPortal() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Layout */}
      <aside className="w-64 bg-slate-950 text-slate-400 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 px-6 flex items-center gap-2 border-b border-slate-800/60">
            <span className="text-lg font-black text-green-500 tracking-tight">SmartQueue</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded">Admin</span>
          </div>

          <nav className="p-4 flex flex-col gap-1.5">
            <Link to="/admin/analytics" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${location.pathname === '/admin/analytics' ? 'bg-green-600 text-white' : 'hover:bg-slate-900 hover:text-white'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${location.pathname === '/admin/orders' ? 'bg-green-600 text-white' : 'hover:bg-slate-900 hover:text-white'}`}>
              <FileText size={18} /> Orders
            </Link>
            <Link to="/admin/customers" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${location.pathname === '/admin/customers' ? 'bg-green-600 text-white' : 'hover:bg-slate-900 hover:text-white'}`}>
              <Users size={18} /> Customers
            </Link>
            <Link to="/admin/inventory" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${location.pathname === '/admin/inventory' ? 'bg-green-600 text-white' : 'hover:bg-slate-900 hover:text-white'}`}>
              <Package size={18} /> Inventory
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/60">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AdminDashboardView />} />
          <Route path="analytics" element={<AdminDashboardView />} />
          <Route path="orders" element={<AdminOrdersView />} />
          <Route path="customers" element={<AdminCustomersView />} />
          <Route path="inventory" element={<AdminInventoryView />} />
        </Routes>
      </main>
    </div>
  );
}

// --- ADMIN INNER VIEWS ---
function AdminDashboardView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Store Operations</h2>
        <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-full">Live Sync Active</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center"><TrendingUp size={20} /></div>
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">+12.5%</span>
          </div>
          <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-4">Total Revenue</h5>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">₹52,300.00</h3>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center"><FileText size={20} /></div>
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">+8.3%</span>
          </div>
          <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-4">Total Orders</h5>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">320</h3>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center"><Users size={20} /></div>
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">+11.2%</span>
          </div>
          <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-4">Total Customers</h5>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">286</h3>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center"><AlertTriangle size={20} /></div>
            <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">-16.7%</span>
          </div>
          <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-4">Pending Verifications</h5>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">5</h3>
        </div>
      </div>

      {/* Main Charts area mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <h4 className="font-extrabold text-slate-800 mb-4">Revenue Trend Overview</h4>
          <div className="h-64 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center justify-center text-slate-400 font-bold">
            📈 Live Revenue Spline Chart Active
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 className="font-extrabold text-slate-800 mb-4">Top Selling Items</h4>
          <div className="flex flex-col gap-4">
            {topSellingItems.map(item => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-bold text-slate-700">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-500">{item.sales} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOrdersView() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-extrabold text-slate-800 text-lg mb-6">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-500">
          <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
            <tr>
              <th className="px-6 py-3.5 font-bold">Order ID</th>
              <th className="px-6 py-3.5 font-bold">Customer</th>
              <th className="px-6 py-3.5 font-bold">Amount</th>
              <th className="px-6 py-3.5 font-bold">Items</th>
              <th className="px-6 py-3.5 font-bold">Status</th>
              <th className="px-6 py-3.5 font-bold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentOrders.map(o => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-bold text-slate-800">{o.id}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{o.customer}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{o.amount}</td>
                <td className="px-6 py-4 font-semibold">{o.items}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${o.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs">{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCustomersView() {
  const customers = [
    { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '9876543210', joined: '12 May, 2026', orders: 12 },
    { name: 'Priya Singh', email: 'priya.singh@gmail.com', phone: '9826384910', joined: '10 May, 2026', orders: 5 },
    { name: 'Amit Kumar', email: 'amit.kumar@gmail.com', phone: '8172948291', joined: '8 May, 2026', orders: 18 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-extrabold text-slate-800 text-lg mb-6">Registered Customers</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-500">
          <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
            <tr>
              <th className="px-6 py-3.5 font-bold">Name</th>
              <th className="px-6 py-3.5 font-bold">Email</th>
              <th className="px-6 py-3.5 font-bold">Phone</th>
              <th className="px-6 py-3.5 font-bold">Joined</th>
              <th className="px-6 py-3.5 font-bold">Order Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map(c => (
              <tr key={c.email} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-bold text-slate-800">{c.name}</td>
                <td className="px-6 py-4 font-medium">{c.email}</td>
                <td className="px-6 py-4 font-medium text-slate-700">+91 {c.phone}</td>
                <td className="px-6 py-4 text-xs">{c.joined}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{c.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminInventoryView() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-extrabold text-slate-800 text-lg mb-6">Inventory Stock Listing</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inventoryAlerts.map(item => (
          <div key={item.name} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
              <p className="text-xs text-slate-500 mt-1">Status: {item.qty}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold`} style={{ backgroundColor: `${item.color}15`, color: item.color }}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const topSellingItems = [
  { name: 'Amul Full Cream Milk 1L', sales: 120 },
  { name: 'Rice 1kg', sales: 98 },
  { name: 'Britannia Good Day Cookies 200g', sales: 75 },
  { name: 'Aashirvaad Atta 5kg', sales: 60 }
];

const recentOrders = [
  { id: '#2156', customer: 'Rahul Sharma', amount: '₹141.00', items: '4 items', status: 'Completed', time: '2 mins ago' },
  { id: '#2155', customer: 'Priya Singh', amount: '₹356.00', items: '8 items', status: 'Completed', time: '5 mins ago' },
  { id: '#2154', customer: 'Amit Kumar', amount: '₹1,240.00', items: '12 items', status: 'Completed', time: '12 mins ago' },
  { id: '#2153', customer: 'Neha Patel', amount: '₹832.00', items: '6 items', status: 'Completed', time: '18 mins ago' },
  { id: '#2152', customer: 'Vikram Joshi', amount: '₹943.00', items: '9 items', status: 'Pending', time: '25 mins ago' }
];

const inventoryAlerts = [
  { name: 'Britannia Brown Bread', qty: '20 Left', status: 'Low Stock', color: '#EA580C' },
  { name: 'Aashirvaad Atta 5kg', qty: '15 Left', status: 'Low Stock', color: '#EA580C' },
  { name: 'Amul Curd 400g', qty: '30 Left', status: 'Low Stock', color: '#EA580C' },
  { name: 'Sugar 5kg', qty: '0 Left', status: 'Out of Stock', color: '#DC2626' }
];
