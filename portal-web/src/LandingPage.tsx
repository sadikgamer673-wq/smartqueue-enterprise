import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Shield, Zap, RefreshCw, Smartphone, Star, ArrowRight, Play, Check, ChevronLeft, ChevronRight } from 'lucide-react';

// Scroll reveal hook
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// Animated counter hook
function useCounter(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isDemoPaid, setIsDemoPaid] = useState(false);
  const [demoCart, setDemoCart] = useState([
    { id: 1, name: 'Coca-Cola', price: 30, emoji: '🥤', qty: 2 },
    { id: 2, name: 'Lays Classic', price: 20, emoji: '🥔', qty: 1 },
    { id: 3, name: 'Amul Milk', price: 35, emoji: '🥛', qty: 1 },
    { id: 4, name: 'Paneer Tikka', price: 48, emoji: '🍞', qty: 1 },
  ]);
  const [scrolled, setScrolled] = useState(false);
  const demoTotal = demoCart.reduce((a, c) => a + c.price * c.qty, 0);

  // Scroll nav effect
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const { ref: statsRef, inView: statsInView } = useInView();
  const orders = useCounter(10000, statsInView);
  const stores = useCounter(500, statsInView);
  const customers = useCounter(50000, statsInView);

  const testimonials = [
    { text: 'SmartQueue has completely transformed the way we handle checkout. Our queues are gone, and customers love the seamless experience. Revenue is up 23%!', author: 'Rahul Mehta', role: 'Store Manager, FreshMart', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', rating: 5 },
    { text: 'Incredibly efficient and secure. The real-time dashboard gives us full visibility into every transaction. Setup took less than a day!', author: 'Priya Sharma', role: 'Operations Head, DailyNeeds', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', rating: 5 },
    { text: 'Our customers wait time dropped from 12 minutes to under 2. SmartQueue is genuinely a game-changer for modern retail.', author: 'Arjun Kapoor', role: 'Director, ValuePlus Chain', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', rating: 5 },
  ];

  const G = '#16C45B'; // brand green

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; }
        input, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #16C45B; border-radius: 3px; }

        @keyframes floatA { 0%,100%{transform:translateY(0px) rotate(2deg)} 50%{transform:translateY(-18px) rotate(-1deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0px) rotate(-2deg)} 50%{transform:translateY(-12px) rotate(1.5deg)} }
        @keyframes badge-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes scan { 0%{top:10%} 50%{top:82%} 100%{top:10%} }
        @keyframes ring-pulse { 0%,100%{opacity:0.1;transform:translateY(-50%) scale(1)} 50%{opacity:0.22;transform:translateY(-50%) scale(1.05)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fade-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-right { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fade-left { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(22,196,91,0.3)} 50%{box-shadow:0 0 40px rgba(22,196,91,0.6)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes shine { 0%{left:-100%} 100%{left:200%} }
        @keyframes dot-ping { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.5);opacity:0} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .ph1 { animation: floatA 8s ease-in-out infinite; }
        .ph2 { animation: floatB 10s ease-in-out infinite; }
        .badge-f { animation: badge-float 3.5s ease-in-out infinite; }
        .laser-line { animation: scan 2.2s ease-in-out infinite; position:absolute; left:0; right:0; height:2px;
          background: linear-gradient(90deg, transparent, #16C45B 30%, rgba(22,196,91,0.8) 50%, #16C45B 70%, transparent);
          box-shadow: 0 0 8px rgba(22,196,91,0.6); }
        .ring-a { animation: ring-pulse 7s ease-in-out infinite; }
        .ring-b { animation: ring-pulse 7s ease-in-out infinite; animation-delay: 2s; }
        .ring-c { animation: ring-pulse 7s ease-in-out infinite; animation-delay: 4s; }
        .dot-ping { animation: dot-ping 1.5s ease-out infinite; }
        .glow-btn { animation: glow 3s ease-in-out infinite; }
        .shimmer { position: relative; overflow: hidden; }
        .shimmer::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-20deg); animation: shine 2.5s ease-in-out infinite; }
        .grid-dot-bg {
          background-image: radial-gradient(circle, rgba(22,196,91,0.12) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .green-glow { background: radial-gradient(ellipse 60% 50% at 60% 50%, rgba(22,196,91,0.15) 0%, transparent 70%); }
        .card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.12) !important; }
        .portal-card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .portal-card:hover { transform: translateY(-3px); }
        .step-card { transition: all 0.3s ease; }
        .step-card:hover { border-color: #16C45B !important; background: #fafffe !important; }
        .nav-link { position:relative; transition: color 0.2s; }
        .nav-link::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:2px; background:#16C45B; transition:width 0.25s ease; border-radius:2px; }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #16C45B !important; }
        .feature-item { transition: all 0.25s ease; }
        .feature-item:hover { background: #f0fdf4 !important; transform: translateY(-2px); }
        .brand-logo { transition: all 0.2s ease; filter: grayscale(100%) opacity(0.5); }
        .brand-logo:hover { filter: grayscale(0%) opacity(1); transform: scale(1.05); }
        .scroll-reveal { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .scroll-reveal.visible { opacity: 1; transform: translateY(0); }
        .scroll-reveal-left { opacity: 0; transform: translateX(-30px); transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .scroll-reveal-left.visible { opacity: 1; transform: translateX(0); }
        .scroll-reveal-right { opacity: 0; transform: translateX(30px); transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .scroll-reveal-right.visible { opacity: 1; transform: translateX(0); }
        .gradient-text {
          background: linear-gradient(135deg, #16C45B 0%, #0ea5e9 50%, #16C45B 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: gradient-shift 4s ease infinite;
        }
        .ticker-wrap { overflow: hidden; }
        .ticker { display: flex; animation: ticker 30s linear infinite; width: max-content; }
        .ticker:hover { animation-play-state: paused; }
      `}</style>

      {/* ═══════════════════════════ NAVIGATION ═══════════════════════════ */}
      <nav style={{
        background: scrolled ? 'rgba(255,255,255,0.92)' : '#fff',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: '1px solid #f1f5f9',
        position: 'sticky', top: 0, zIndex: 100,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #16C45B, #0ea875)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, boxShadow: '0 4px 16px rgba(22,196,91,0.35)', flexShrink: 0 }}>🛒</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#0f172a', letterSpacing: '-0.4px', lineHeight: 1 }}>SmartQueue</div>
              <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginTop: 1 }}>Enterprise Ecosystem</div>
            </div>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[
              { l: 'Home', h: '#home', active: true }, { l: 'Features', h: '#features' }, { l: 'How It Works', h: '#how' },
              { l: 'Solutions', h: '#portals' }, { l: 'About Us', h: '#why' }, { l: 'Resources', h: '#' }, { l: 'Contact', h: '#' },
            ].map(x => (
              <a key={x.l} href={x.h} className="nav-link" style={{
                fontSize: 12.5, fontWeight: 600, letterSpacing: '0.01em', padding: '6px 12px', borderRadius: 7,
                color: x.active ? G : '#475569', transition: 'color 0.2s',
              }}>{x.l}</a>
            ))}
          </div>

          {/* CTA */}
          <a href="#portals" className="shimmer glow-btn" style={{
            background: `linear-gradient(135deg, ${G}, #0ea875)`, color: '#fff', fontWeight: 800, fontSize: 12.5,
            padding: '11px 20px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(22,196,91,0.35)', transition: 'transform 0.2s',
          }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'}
             onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
            Access Portals <span style={{ fontSize: 15, opacity: 0.9 }}>▦</span>
          </a>
        </div>
      </nav>

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <header id="home" style={{ background: 'linear-gradient(160deg, #060d1a 0%, #0b1628 60%, #071020 100%)', position: 'relative', overflow: 'hidden', minHeight: '95vh', display: 'flex', alignItems: 'center' }}>
        {/* Dot grid */}
        <div className="grid-dot-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />
        {/* Large green glow */}
        <div className="green-glow" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

        {/* Concentric glow rings around phones */}
        <div className="ring-a" style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', width: 560, height: 560, borderRadius: '50%', border: '1px solid rgba(22,196,91,0.1)', pointerEvents: 'none' }} />
        <div className="ring-b" style={{ position: 'absolute', right: '9%', top: '50%', transform: 'translateY(-50%)', width: 420, height: 420, borderRadius: '50%', border: '1.5px solid rgba(22,196,91,0.16)', pointerEvents: 'none' }} />
        <div className="ring-c" style={{ position: 'absolute', right: '15%', top: '50%', transform: 'translateY(-50%)', width: 290, height: 290, borderRadius: '50%', border: '2px solid rgba(22,196,91,0.22)', pointerEvents: 'none' }} />
        {/* Inner glow blob */}
        <div style={{ position: 'absolute', right: '20%', top: '50%', transform: 'translateY(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,196,91,0.18) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }} />

        {/* Floating particles */}
        {[
          { top: '20%', left: '5%', size: 4 }, { top: '70%', left: '8%', size: 3 }, { top: '40%', left: '12%', size: 5 },
          { top: '15%', left: '88%', size: 3 }, { top: '80%', left: '85%', size: 4 },
        ].map((p, i) => (
          <div key={i} style={{ position: 'absolute', top: p.top, left: p.left, width: p.size, height: p.size, borderRadius: '50%', background: G, opacity: 0.5, pointerEvents: 'none', animation: `badge-float ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.7}s` }} />
        ))}

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>

          {/* ── Left content ── */}
          <div style={{ animation: 'fade-right 0.8s cubic-bezier(0.16,1,0.3,1) both' }}>
            {/* Live badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 50, background: 'rgba(22,196,91,0.1)', border: '1px solid rgba(22,196,91,0.25)', marginBottom: 28, backdropFilter: 'blur(10px)' }}>
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: G, display: 'block' }} />
                <span className="dot-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: G, opacity: 0.5 }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 800, color: G, letterSpacing: '0.12em', textTransform: 'uppercase' }}>AI-Powered Self-Checkout Platform</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.06, color: '#fff', letterSpacing: '-1.5px', marginBottom: 22 }}>
              The Future of<br />
              Shopping is{' '}
              <span className="gradient-text">Queue-Free</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}>
              SmartQueue Enterprise empowers supermarkets with an AI-powered self-checkout ecosystem. Shoppers scan, pay, and exit in seconds — no queues, no friction.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
              <a href="#portals" className="shimmer" style={{
                padding: '14px 28px', background: `linear-gradient(135deg, ${G}, #0ea875)`,
                color: '#fff', fontWeight: 800, fontSize: 13.5, borderRadius: 10,
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 24px rgba(22,196,91,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(22,196,91,0.5)'; }}
                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(22,196,91,0.4)'; }}>
                Explore Platform <ArrowRight size={15} />
              </a>
              <a href="#" style={{
                padding: '14px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
                color: '#fff', fontWeight: 700, fontSize: 13.5, borderRadius: 10,
                display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(10px)',
                transition: 'all 0.2s',
              }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={10} fill="white" />
                </div>
                Watch Demo
              </a>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex' }}>
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop',
                ].map((s, i) => (
                  <img key={i} src={s} alt="" style={{ width: 34, height: 34, borderRadius: '50%', border: '2.5px solid #060d1a', marginLeft: i > 0 ? -11 : 0, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#f59e0b', fontSize: 12, letterSpacing: '0.05em' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" />)}
                  <span style={{ color: '#fff', fontWeight: 700, marginLeft: 5 }}>5.0</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: 11.5, fontWeight: 600, marginTop: 3 }}>Trusted by <strong style={{ color: '#fff' }}>500+</strong> Retail Stores</div>
              </div>
            </div>
          </div>

          {/* ── Right: Phone Mockups ── */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, animation: 'fade-left 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>

            {/* Phone 1 — Cart */}
            <div className="ph1" style={{
              width: 210, height: 430, background: 'linear-gradient(160deg, #1c2b42, #141e30)',
              borderRadius: 42, border: '5px solid #253348', overflow: 'hidden', position: 'relative', flexShrink: 0, zIndex: 2,
              boxShadow: '0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}>
              {/* Dynamic Island */}
              <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 80, height: 22, background: '#000', borderRadius: 12, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea875', opacity: 0.8 }} />
              </div>
              {/* Screen */}
              <div style={{ height: '100%', background: '#f8fafc', paddingTop: 42, padding: '42px 11px 10px', display: 'flex', flexDirection: 'column' }}>
                {/* App status bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #e8f0fe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: G }} />
                    <span style={{ fontSize: 8, fontWeight: 800, color: '#0f172a' }}>SmartQueue</span>
                  </div>
                  <span style={{ fontSize: 8, color: G, fontWeight: 700 }}>+ Add</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>🛒 My Cart</div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {demoCart.map((item, i) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '7px 9px', borderRadius: 10, border: '1px solid #eef2ff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animation: `slide-up 0.3s ease ${i * 0.05}s both` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 15 }}>{item.emoji}</span>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 800, color: '#0f172a' }}>{item.name}</div>
                          <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 1 }}>₹{item.price}.00 each</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ background: '#f0fdf4', border: '1px solid rgba(22,196,91,0.2)', borderRadius: 6, padding: '2px 7px', fontSize: 8, fontWeight: 800, color: '#16C45B' }}>{item.qty}×</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Footer */}
                <div style={{ borderTop: '1px solid #eef2ff', paddingTop: 8, marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, fontSize: 9, color: '#64748b' }}>
                    <span>{demoCart.length} items</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{demoTotal}.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 9 }}>
                    <span style={{ color: '#16C45B', fontWeight: 700 }}>Discount (5%)</span>
                    <span style={{ color: '#16C45B', fontWeight: 700 }}>-₹{Math.floor(demoTotal * 0.05)}.00</span>
                  </div>
                  <button onClick={() => setIsDemoPaid(true)} style={{
                    width: '100%', padding: '9px 0', background: `linear-gradient(135deg, ${G}, #0ea875)`,
                    color: '#fff', fontWeight: 900, fontSize: 9.5, borderRadius: 9, border: 'none',
                    letterSpacing: '0.03em', boxShadow: '0 4px 14px rgba(22,196,91,0.35)',
                  }}>Proceed to Pay →</button>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 6 }}>
                    {['UPI', 'VISA', 'MC', 'RuPay'].map(b => (
                      <span key={b} style={{ fontSize: 6.5, color: '#94a3b8', fontWeight: 700, background: '#f8fafc', padding: '1px 5px', borderRadius: 3, border: '1px solid #e2e8f0' }}>{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 2 — QR */}
            <div className="ph2" style={{
              width: 186, height: 385, background: 'linear-gradient(160deg, #1c2b42, #141e30)',
              borderRadius: 38, border: '4px solid #253348', overflow: 'hidden', position: 'relative', flexShrink: 0, zIndex: 1, marginLeft: -22,
              boxShadow: '0 30px 65px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
              <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 70, height: 18, background: '#000', borderRadius: 10, zIndex: 10 }} />
              {isDemoPaid ? (
                <div style={{ height: '100%', background: 'linear-gradient(160deg, #f0fdf4, #fff)', padding: '28px 14px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center' }}>
                  <div>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #16C45B, #0ea875)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 6px 18px rgba(22,196,91,0.4)', animation: 'slide-up 0.4s ease both' }}>
                      <Check size={18} color="white" strokeWidth={3} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#0f172a' }}>Payment Successful!</div>
                    <div style={{ fontSize: 8, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>Show QR code at<br />the exit gate</div>
                  </div>
                  {/* Premium QR Display */}
                  <div style={{ background: '#fff', borderRadius: 16, padding: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(22,196,91,0.2)' }}>
                    <div style={{ background: '#0f172a', borderRadius: 10, width: 90, height: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <QrCode size={44} style={{ color: G }} />
                      <span style={{ fontSize: 6, color: '#fff', fontWeight: 800, letterSpacing: '0.12em', fontFamily: 'monospace' }}>EXIT PASS</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6.5, marginTop: 6 }}>
                      <span style={{ color: '#94a3b8' }}>Verified by AI</span>
                      <span style={{ color: G, fontWeight: 800 }}>✓ Valid</span>
                    </div>
                  </div>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 5 }}>Order: SQ-{Date.now().toString().slice(-6)}</div>
                    <div style={{ fontSize: 8, color: G, fontWeight: 800, marginTop: 5 }}>Thank you for shopping! 🎉</div>
                    <button onClick={() => setIsDemoPaid(false)} style={{ marginTop: 5, fontSize: 7, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Reset Demo</button>
                  </div>
                </div>
              ) : (
                <div style={{ height: '100%', background: 'linear-gradient(160deg, #0f172a, #1e293b)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 18, textAlign: 'center', gap: 10 }}>
                  <div style={{ fontSize: 28 }}>💳</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#475569' }}>Awaiting Payment</div>
                  <div style={{ fontSize: 8, color: '#334155', lineHeight: 1.6, maxWidth: 130 }}>Click <strong style={{ color: G }}>"Proceed to Pay"</strong> on the left phone to see your exit QR code</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    {[...Array(3)].map((_, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? G : '#1e293b', border: `1px solid ${G}` }} />)}
                  </div>
                </div>
              )}
            </div>

            {/* Floating glass badges */}
            {[
              { text: 'Secure Payment', icon: '🔒', style: { top: -24, right: -8 } as React.CSSProperties, delay: '0s' },
              { text: 'QR Generated', icon: '✅', style: { top: '42%', left: -54 } as React.CSSProperties, delay: '1.2s' },
              { text: 'AI Verified', icon: '🤖', style: { bottom: 32, right: -24 } as React.CSSProperties, delay: '2s' },
              { text: 'Exit Approved', icon: '🚀', style: { top: -34, left: 14 } as React.CSSProperties, delay: '0.6s' },
            ].map((b, i) => (
              <div key={i} className="badge-f" style={{
                position: 'absolute', ...b.style, animationDelay: b.delay,
                background: 'rgba(10,18,30,0.82)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(22,196,91,0.22)', padding: '7px 13px', borderRadius: 9,
                fontSize: 9.5, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span>{b.icon}</span> {b.text}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════ FEATURE STRIP ═══════════════════════════ */}
      <div id="features" style={{ background: '#fff', padding: '0 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            background: '#fff', borderRadius: 20, marginTop: -36, position: 'relative', zIndex: 10,
            boxShadow: '0 8px 48px rgba(0,0,0,0.08)', border: '1px solid #f0f4ff',
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          }}>
            {[
              { icon: <Zap size={18} />, title: 'Instant Verification', desc: 'Real-time socket.io updates for all exit gates', color: '#fef9c3', iconColor: '#ca8a04' },
              { icon: <Shield size={18} />, title: 'Secure Payments', desc: 'Enterprise-grade encryption on every transaction', color: '#fef2f2', iconColor: '#dc2626' },
              { icon: <QrCode size={18} />, title: 'QR Exit Gate', desc: 'Auto-generated pass after successful payment', color: '#f0fdf4', iconColor: G },
              { icon: <RefreshCw size={18} />, title: 'Real-time Sync', desc: 'Live updates across all devices instantly', color: '#eff6ff', iconColor: '#3b82f6' },
              { icon: <Smartphone size={18} />, title: 'Enterprise Grade', desc: 'Scalable for any retail size, reliable 99.99%', color: '#fdf4ff', iconColor: '#9333ea' },
            ].map((f, i) => (
              <div key={f.title} className="feature-item" style={{
                padding: '24px 20px', textAlign: 'left', borderLeft: i > 0 ? '1px solid #f1f5f9' : 'none',
                borderRadius: i === 0 ? '20px 0 0 20px' : i === 4 ? '0 20px 20px 0' : 0,
                cursor: 'default',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.iconColor, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', marginBottom: 5, letterSpacing: '-0.2px' }}>{f.title}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section id="how" style={{ background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)', padding: '96px 32px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64, animation: 'fade-up 0.6s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 50, background: 'rgba(22,196,91,0.08)', border: '1px solid rgba(22,196,91,0.2)', marginBottom: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: G, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Simple 4-Step Process</span>
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px', margin: '0 0 12px' }}>
              How <span style={{ color: G }}>SmartQueue</span> Works
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>A beautifully simple checkout experience — from aisle to exit in under 2 minutes</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative', alignItems: 'start' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: 64, left: '12.5%', width: '75%', height: 2, background: 'linear-gradient(90deg, #dcfce7, #16C45B, #dcfce7)', borderRadius: 1, zIndex: 0 }} />

            {[
              {
                n: 1, title: 'Scan Products', desc: 'Open the SmartQueue app and point your camera at any barcode to instantly add items to cart.',
                phone: (
                  <div style={{ width: 110, height: 168, background: 'linear-gradient(160deg,#1c2b42,#141e30)', borderRadius: 22, border: '3px solid #253348', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.3)', marginTop: 8 }}>
                    <div style={{ height: '100%', background: '#0f172a', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ flex: 1, background: '#1e2d47', borderRadius: 10, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Corner brackets */}
                        {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
                          <div key={v+h} style={{ position: 'absolute', [v]: 6, [h]: 6, width: 14, height: 14, borderTop: v==='top' ? `2.5px solid ${G}` : 'none', borderBottom: v==='bottom' ? `2.5px solid ${G}` : 'none', borderLeft: h==='left' ? `2.5px solid ${G}` : 'none', borderRight: h==='right' ? `2.5px solid ${G}` : 'none', borderRadius: v==='top'&&h==='left' ? '3px 0 0 0' : v==='top'&&h==='right' ? '0 3px 0 0' : v==='bottom'&&h==='left' ? '0 0 0 3px' : '0 0 3px 0' }} />
                        ))}
                        <div className="laser-line" />
                        <QrCode size={24} style={{ color: 'rgba(22,196,91,0.3)' }} />
                        <div style={{ position: 'absolute', bottom: 4, right: 4, fontSize: 5, background: G, color: '#fff', fontWeight: 800, padding: '1px 4px', borderRadius: 3 }}>LIVE</div>
                      </div>
                      <div style={{ background: '#fff', borderRadius: 7, padding: '5px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <div><div style={{ fontSize: 7, fontWeight: 800, color: '#0f172a' }}>Maggi Noodles</div><div style={{ fontSize: 6, color: '#94a3b8' }}>₹14.00</div></div>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={8} style={{ color: G }} /></div>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                n: 2, title: 'Make Payment', desc: 'Choose from UPI, cards, or wallet payments. Secure checkout with a single tap.',
                phone: (
                  <div style={{ width: 110, height: 168, background: 'linear-gradient(160deg,#1c2b42,#141e30)', borderRadius: 22, border: '3px solid #253348', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.3)', marginTop: 8 }}>
                    <div style={{ height: '100%', background: '#fff', padding: '9px 9px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 8, fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 5 }}>Checkout</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 7 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}><span>Subtotal</span><span>₹148.00</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: G, fontWeight: 700 }}><span>Discount</span><span>-₹7.40</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0f172a', fontWeight: 900, borderTop: '1px solid #f1f5f9', paddingTop: 3 }}><span>Total</span><span>₹140.60</span></div>
                      </div>
                      {/* Card */}
                      <div style={{ background: 'linear-gradient(135deg,#1e40af,#6366f1)', borderRadius: 9, padding: '7px 9px', color: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 5.5, marginBottom: 6, opacity: 0.8 }}><span style={{ fontWeight: 800 }}>SmartPay</span><span>•••• 4820</span></div>
                        <div style={{ fontSize: 7.5, fontFamily: 'monospace', fontWeight: 800 }}>₹140.60</div>
                      </div>
                      <button style={{ background: `linear-gradient(135deg,${G},#0ea875)`, color: '#fff', fontSize: 7, fontWeight: 900, padding: '7px 0', borderRadius: 8, border: 'none', letterSpacing: '0.04em', boxShadow: '0 4px 12px rgba(22,196,91,0.3)' }}>✓ PAY SECURELY</button>
                    </div>
                  </div>
                )
              },
              {
                n: 3, title: 'Get QR Code', desc: 'Instantly receive your digital exit pass QR code upon payment confirmation.',
                phone: (
                  <div style={{ width: 110, height: 168, background: 'linear-gradient(160deg,#1c2b42,#141e30)', borderRadius: 22, border: '3px solid #253348', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.3)', marginTop: 8 }}>
                    <div style={{ height: '100%', background: 'linear-gradient(160deg,#f0fdf4,#fff)', padding: '9px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ textAlign: 'center' }}><div style={{ fontSize: 7.5, fontWeight: 900, color: G }}>✓ Verified!</div><div style={{ fontSize: 6.5, color: '#94a3b8', marginTop: 2 }}>Exit ticket ready</div></div>
                      <div style={{ background: '#fff', borderRadius: 12, padding: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: '1px solid rgba(22,196,91,0.15)' }}>
                        <div style={{ background: '#0f172a', borderRadius: 8, width: 68, height: 68, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                          <QrCode size={38} style={{ color: G }} />
                          <span style={{ fontSize: 5, color: '#fff', fontFamily: 'monospace', fontWeight: 800 }}>PASS#SQ01</span>
                        </div>
                      </div>
                      <div style={{ width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: 5, display: 'flex', justifyContent: 'space-between', fontSize: 7 }}><span style={{ color: '#94a3b8' }}>Valid</span><span style={{ color: G, fontWeight: 800 }}>1 Exit Only</span></div>
                    </div>
                  </div>
                )
              },
              {
                n: 4, title: 'Exit Seamlessly', desc: 'Scan your QR at the exit gate. AI verifies in milliseconds — walk right through!',
                phone: (
                  <div style={{ width: 142, height: 130, background: 'linear-gradient(160deg,#1e293b,#0f172a)', borderRadius: 16, border: '2px solid #253348', padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 6 }}>
                      <span style={{ fontSize: 8, fontWeight: 800, color: '#94a3b8' }}>Exit Gate #01</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: G, boxShadow: `0 0 8px ${G}`, position: 'relative' }}>
                          <div className="dot-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: G, opacity: 0.4 }} />
                        </div>
                        <span style={{ fontSize: 6, color: G, fontWeight: 700 }}>LIVE</span>
                      </div>
                    </div>
                    <div style={{ background: '#0f172a', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 6.5, color: G, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}>✓ PASS VERIFIED</div>
                      <div style={{ fontSize: 10, color: '#fff', fontWeight: 900, marginTop: 2, letterSpacing: '0.02em' }}>GATE OPEN</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                      <span style={{ fontSize: 24 }}>🚪</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 11, color: G, fontWeight: 900 }}>➔</span>
                        <div style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${G}, transparent)`, borderRadius: 1 }} />
                      </div>
                      <span style={{ fontSize: 24 }}>🚶</span>
                    </div>
                  </div>
                )
              },
            ].map((step, i) => (
              <div key={step.n} className="step-card" style={{
                background: '#fff', border: '2px solid #f1f5f9', borderRadius: 20, padding: '28px 20px 24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
                position: 'relative', zIndex: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                animation: `fade-up 0.6s ease ${i * 0.12}s both`,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, #0ea875)`, color: '#fff', fontWeight: 900, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px rgba(22,196,91,0.4)`, zIndex: 1 }}>{step.n}</div>
                <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.2px' }}>{step.title}</h4>
                <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.65 }}>{step.desc}</p>
                {step.phone}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ ACCESS PORTALS ═══════════════════════════ */}
      <section id="portals" style={{ background: '#fff', padding: '96px 32px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 50, background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.12em' }}>3 Powerful Portals</span>
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px', margin: '0 0 12px' }}>
              Access <span style={{ color: G }}>SmartQueue</span> Portals
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Each portal is purpose-built for its role — giving every user exactly the tools they need</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                icon: '🛒', label: 'Customer Portal', color: '#dcfce7', textColor: G,
                desc: 'Scan products, build your cart, pay securely, and get your exit QR in seconds.',
                btn: { label: 'Enter Customer Portal', bg: `linear-gradient(135deg, ${G}, #0ea875)`, shadow: '0 6px 20px rgba(22,196,91,0.35)', path: '/customer/login' },
                phone: (
                  <div style={{ width: 95, height: 170, background: 'linear-gradient(160deg,#1c2b42,#141e30)', borderRadius: 22, border: '3px solid #253348', overflow: 'hidden', flexShrink: 0, marginLeft: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
                    <div style={{ height: '100%', background: '#f8fafc', padding: 9, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ fontSize: 7.5, fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #eef2ff', paddingBottom: 4, display: 'flex', alignItems: 'center', gap: 3 }}>🛒 <span>My Cart</span></div>
                      {[{ e: '🥤', n: 'Coca-Cola', p: '₹60' }, { e: '🥔', n: 'Lays', p: '₹20' }, { e: '🥛', n: 'Amul Milk', p: '₹35' }].map(item => (
                        <div key={item.n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '4px 6px', borderRadius: 7, border: '1px solid #f1f5f9', fontSize: 6.5 }}>
                          <span>{item.e} {item.n}</span><span style={{ fontWeight: 700, color: '#0f172a' }}>{item.p}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid #eef2ff', paddingTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 7, fontWeight: 900, color: '#0f172a' }}><span>Total</span><span>₹115.00</span></div>
                      <div style={{ background: `linear-gradient(135deg,${G},#0ea875)`, color: '#fff', fontSize: 6.5, fontWeight: 900, padding: '6px 0', borderRadius: 8, textAlign: 'center', boxShadow: '0 4px 12px rgba(22,196,91,0.3)' }}>PAY NOW ✓</div>
                    </div>
                  </div>
                ),
              },
              {
                icon: '🕵️', label: 'Worker Portal', color: '#dbeafe', textColor: '#3b82f6',
                desc: 'Verify customer QR passes, manage exit gates, and monitor live activity in real-time.',
                btn: { label: 'Enter Worker Portal', bg: 'linear-gradient(135deg, #0B3D2E, #1a5c40)', shadow: '0 6px 20px rgba(11,61,46,0.3)', path: '/worker/login' },
                phone: (
                  <div style={{ width: 95, height: 170, background: 'linear-gradient(160deg,#1c2b42,#141e30)', borderRadius: 22, border: '3px solid #253348', overflow: 'hidden', flexShrink: 0, marginLeft: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
                    <div style={{ height: '100%', background: '#0f172a', padding: 9, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                      <div style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: 5, borderBottom: '1px solid rgba(255,255,255,0.07)', width: '100%', textAlign: 'center' }}>Gate Verify</div>
                      <div style={{ width: 56, height: 56, background: '#1e2d47', borderRadius: 10, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(22,196,91,0.2)` }}>
                        <div className="laser-line" />
                        <QrCode size={26} style={{ color: 'rgba(22,196,91,0.5)' }} />
                      </div>
                      <div style={{ fontSize: 6, color: G, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace' }}>SCANNING…</div>
                      <div style={{ background: `linear-gradient(135deg,${G},#0ea875)`, borderRadius: 6, padding: '4px 12px', fontSize: 6.5, fontWeight: 900, color: '#fff', boxShadow: '0 4px 10px rgba(22,196,91,0.3)' }}>VERIFIED ✓</div>
                    </div>
                  </div>
                ),
              },
              {
                icon: '📊', label: 'Admin Dashboard', color: '#ede9fe', textColor: '#6366f1',
                desc: 'Full analytics, product management, user control, and real-time operational insights.',
                btn: { label: 'Enter Admin Dashboard', bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', shadow: '0 6px 20px rgba(99,102,241,0.35)', path: '/admin' },
                phone: (
                  <div style={{ flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ width: 136, height: 92, background: 'linear-gradient(160deg,#1e293b,#0f172a)', borderRadius: 12, border: '2px solid #253348', padding: 9, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 6.5, fontWeight: 800, color: G }}>📊 Dashboard</span>
                        <span style={{ fontSize: 6, color: '#64748b' }}>Today</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 36, marginBottom: 5 }}>
                        {[40,65,45,80,55,92,70,85,60,88].map((h, i) => (
                          <div key={i} style={{ flex: 1, background: i === 5 || i === 7 || i === 9 ? `linear-gradient(to top,${G},#0ea875)` : 'rgba(22,196,91,0.25)', borderRadius: 3, height: `${h}%` }} />
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 6.5, color: '#94a3b8' }}>₹12,450 today</span>
                        <span style={{ fontSize: 6.5, color: G, fontWeight: 800 }}>↑ 8.2%</span>
                      </div>
                    </div>
                    <div style={{ width: 136, height: 6, background: '#162032', borderRadius: '0 0 5px 5px' }} />
                  </div>
                ),
              },
            ].map((p, i) => (
              <div key={p.label} className="portal-card card-hover" style={{
                background: '#fafbff', border: '1px solid #eef2ff', borderRadius: 22, padding: '32px 28px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)', animation: `fade-up 0.6s ease ${i * 0.1}s both`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 15, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16, boxShadow: `0 4px 14px ${p.color}` }}>{p.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.3px' }}>{p.label}</h3>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7, maxWidth: 180, margin: '0 0 24px' }}>{p.desc}</p>
                  <button onClick={() => navigate(p.btn.path)} style={{
                    padding: '12px 20px', background: p.btn.bg, color: '#fff', fontWeight: 800, fontSize: 11.5,
                    borderRadius: 10, border: 'none', boxShadow: p.btn.shadow, display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'transform 0.2s',
                  }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
                     onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
                    {p.btn.label} <ArrowRight size={13} />
                  </button>
                </div>
                {p.phone}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ STATISTICS ═══════════════════════════ */}
      <section ref={statsRef} style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0b1628 100%)', padding: '72px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(22,196,91,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="grid-dot-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24, textAlign: 'center' }}>
            {[
              { icon: '🛒', num: orders, suffix: '+', label: 'Orders Processed' },
              { icon: '🏪', num: stores, suffix: '+', label: 'Stores Connected' },
              { icon: '👥', num: customers, suffix: '+', label: 'Happy Customers' },
              { icon: '🛡️', num: null, fixed: '99.99%', label: 'System Uptime' },
              { icon: '⚡', num: null, fixed: '< 500ms', label: 'Real-time Sync' },
              { icon: '🎧', num: null, fixed: '24/7', label: 'Support Available' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(22,196,91,0.1)', border: '1px solid rgba(22,196,91,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: G, letterSpacing: '-0.8px', lineHeight: 1 }}>
                  {s.fixed ?? (s.num?.toLocaleString() + (s.suffix || ''))}
                </div>
                <div style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ WHY CHOOSE + TESTIMONIALS ═══════════════════════════ */}
      <section id="why" style={{ background: '#fff', padding: '96px 32px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>

          {/* Left */}
          <div style={{ animation: 'fade-right 0.7s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 50, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 20 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: G, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Why SmartQueue?</span>
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 32 }}>
              Built for the<br />Future of <span style={{ color: G }}>Retail</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
              {[
                { t: 'Eliminate billing queues', d: 'Reduce checkout wait time by up to 85%' },
                { t: 'Premium customer experience', d: 'Contactless, frictionless, and fast' },
                { t: 'Bank-grade secure payments', d: 'PCI-DSS compliant payment processing' },
                { t: 'Real-time sync everywhere', d: 'Instant updates across all devices' },
                { t: 'Zero-setup integration', d: 'Works with your existing infrastructure' },
                { t: 'Scales with your business', d: 'From single stores to enterprise chains' },
              ].map(item => (
                <div key={item.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#dcfce7', border: '1.5px solid rgba(22,196,91,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} style={{ color: G }} strokeWidth={3} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{item.t}</div>
                    <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Video */}
            <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', cursor: 'pointer', height: 195, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }} role="button">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80" alt="Supermarket" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => (e.target as HTMLImageElement).style.transform = 'scale(1.04)'}
                onMouseLeave={e => (e.target as HTMLImageElement).style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(0,0,0,0.25)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.target as HTMLElement).style.transform = 'scale(1.12)'}
                  onMouseLeave={e => (e.target as HTMLElement).style.transform = 'scale(1)'}>
                  <Play size={20} style={{ color: G }} fill={G} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>See SmartQueue in Action</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>01 / 03</div>
              </div>
            </div>
          </div>

          {/* Right: Testimonials */}
          <div style={{ animation: 'fade-left 0.7s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 50, background: '#fef9c3', border: '1px solid #fde68a', marginBottom: 20 }}>
              <Star size={10} fill="#ca8a04" style={{ color: '#ca8a04' }} />
              <span style={{ fontSize: 9, fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Customer Reviews</span>
            </div>
            <h3 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 28 }}>Loved by Retailers<br /><span style={{ color: G }}>Worldwide</span></h3>

            {/* Active Testimonial */}
            <div style={{ background: 'linear-gradient(160deg,#f8faff,#fff)', border: '1px solid #eef2ff', borderRadius: 22, padding: '30px 28px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.06)', marginBottom: 20 }}>
              <div style={{ fontSize: 72, color: 'rgba(22,196,91,0.08)', position: 'absolute', top: -8, left: 14, fontFamily: 'Georgia,serif', lineHeight: 1, fontWeight: 900 }}>"</div>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
              </div>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 22, position: 'relative', zIndex: 1 }}>"{testimonials[activeTestimonial].text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].author} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(22,196,91,0.2)' }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{testimonials[activeTestimonial].author}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{testimonials[activeTestimonial].role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setActiveTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)} style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = G; (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = G; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}>
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => setActiveTestimonial(p => (p + 1) % testimonials.length)} style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = G; (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = G; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? G : '#e2e8f0', border: 'none', cursor: 'pointer', transition: 'all 0.35s ease' }} />
              ))}
            </div>

            {/* Mini stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { icon: '⏱️', num: '85%', label: 'Queue Reduction', color: '#f0fdf4' },
                { icon: '📈', num: '23%', label: 'Revenue Increase', color: '#eff6ff' },
                { icon: '😊', num: '4.9★', label: 'Customer Rating', color: '#fef9c3' },
                { icon: '🔒', num: '100%', label: 'Payment Security', color: '#fdf4ff' },
              ].map(s => (
                <div key={s.label} style={{ background: s.color, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>{s.num}</div>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ BRAND TICKER ═══════════════════════════ */}
      <section style={{ background: '#f8fafc', padding: '48px 0', borderBottom: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', fontSize: 10.5, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 28 }}>Trusted by Leading Retailers</p>
        <div className="ticker-wrap">
          <div className="ticker">
            {[
              { icon: '🍏', name: 'FreshMart' }, { icon: '🛒', name: 'DailyNeeds' }, { icon: '💎', name: 'ValuePlus' }, { icon: '🌾', name: 'GreenBasket' },
              { icon: '🏬', name: 'UrbanStore' }, { icon: '⚡', name: 'QuickBuy' }, { icon: '📦', name: 'MegaMart' }, { icon: '🌿', name: 'NatureFresh' },
              { icon: '🎯', name: 'SmartMart' }, { icon: '🏆', name: 'PremiumPick' },
              { icon: '🍏', name: 'FreshMart' }, { icon: '🛒', name: 'DailyNeeds' }, { icon: '💎', name: 'ValuePlus' }, { icon: '🌾', name: 'GreenBasket' },
              { icon: '🏬', name: 'UrbanStore' }, { icon: '⚡', name: 'QuickBuy' }, { icon: '📦', name: 'MegaMart' }, { icon: '🌿', name: 'NatureFresh' },
              { icon: '🎯', name: 'SmartMart' }, { icon: '🏆', name: 'PremiumPick' },
            ].map((b, i) => (
              <div key={i} className="brand-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 800, color: '#64748b', marginRight: 48, whiteSpace: 'nowrap', cursor: 'pointer' }}>
                <span style={{ fontSize: 18 }}>{b.icon}</span> {b.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
      <footer style={{ background: 'linear-gradient(160deg, #060d1a 0%, #0b1628 100%)', padding: '72px 32px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1.8fr', gap: 48, paddingBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
              <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${G}, #0ea875)`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, boxShadow: '0 6px 18px rgba(22,196,91,0.35)' }}>🛒</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>SmartQueue</div>
                <div style={{ fontSize: 8.5, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em' }}>Enterprise</div>
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.75, maxWidth: 250 }}>AI-powered self-checkout ecosystem that makes retail smarter, faster, and completely queue-free.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
              {[{ l: 'f', c: '#1877f2' }, { l: 't', c: '#1da1f2' }, { l: 'in', c: '#0077b5' }, { l: 'yt', c: '#ff0000' }, { l: '📷', c: '#e1306c' }].map((s, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, color: '#64748b', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = s.c; (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.border = `1px solid ${s.c}`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)'; }}>
                  {s.l}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { h: 'Platform', links: ['Features', 'How It Works', 'Solutions', 'Security', 'API Docs'] },
            { h: 'Resources', links: ['User Guide', 'FAQs', 'Blog', 'Help Center', 'Status'] },
            { h: 'Company', links: ['About Us', 'Careers', 'Contact Us', 'Press', 'Privacy Policy'] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 18 }}>{col.h}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: 12.5, color: '#475569', marginBottom: 12, fontWeight: 500, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = G}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = '#475569'}>{l}</a>
              ))}
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>Stay Updated</div>
            <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.7, marginBottom: 16 }}>Get the latest product news and updates.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="email" placeholder="Enter your email" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, padding: '11px 14px', color: '#fff', fontSize: 12.5, outline: 'none', fontFamily: 'inherit', transition: 'border 0.2s', width: '100%' }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = G}
                onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'} />
              <button style={{ background: `linear-gradient(135deg, ${G}, #0ea875)`, color: '#fff', fontWeight: 800, fontSize: 12, padding: '11px 0', borderRadius: 9, border: 'none', boxShadow: '0 4px 14px rgba(22,196,91,0.35)', transition: 'transform 0.2s', width: '100%' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
                Subscribe →
              </button>
            </div>
            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {['🔒 Secure', '✓ No Spam', '📧 Weekly'].map(b => (
                <span key={b} style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div style={{ maxWidth: 1280, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '22px 0 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <span style={{ fontSize: 12, color: '#334155' }}>© 2024 SmartQueue Enterprise. All rights reserved. Made with ❤️ in India</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#334155', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = G}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#334155'}>{l}</a>
            ))}
          </div>
          {/* Back to top */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
            width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, #0ea875)`,
            color: '#fff', border: 'none', fontSize: 14, fontWeight: 900,
            boxShadow: '0 6px 18px rgba(22,196,91,0.4)', position: 'absolute', right: 0, top: -20,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s',
          }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1) translateY(-2px)'}
             onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1) translateY(0)'}>↑</button>
        </div>
      </footer>
    </div>
  );
}
