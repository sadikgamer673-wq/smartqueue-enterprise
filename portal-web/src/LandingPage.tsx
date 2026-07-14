import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode, Shield, Zap, RefreshCw, Smartphone, Star, ArrowRight,
  Play, Check, ChevronLeft, ChevronRight, Scan, CreditCard, Ticket, DoorOpen
} from 'lucide-react';

/* ─── Scroll reveal hook ─── */
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return { ref, visible };
}

/* ─── Counter hook ─── */
function useCounter(target: number, active: boolean, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

/* ─── Tilt card hook ─── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateZ(8px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
  }, []);
  return { ref, onMove, onLeave };
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isDemoPaid, setIsDemoPaid] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [demoCart, setDemoCart] = useState([
    { id: 1, name: 'Coca-Cola', price: 30, emoji: '🥤', qty: 2 },
    { id: 2, name: 'Lays Classic', price: 20, emoji: '🥔', qty: 1 },
    { id: 3, name: 'Amul Milk', price: 35, emoji: '🥛', qty: 1 },
    { id: 4, name: 'Paneer Tikka', price: 48, emoji: '🍞', qty: 1 },
  ]);
  const demoTotal = demoCart.reduce((a, c) => a + c.price * c.qty, 0);

  // Stats counter
  const { ref: statsRef, visible: statsVisible } = useReveal();
  const orders = useCounter(10000, statsVisible);
  const stores = useCounter(500, statsVisible);
  const customers = useCounter(50000, statsVisible);

  // Scroll state
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance step demo
  useEffect(() => {
    const t = setInterval(() => setActiveStep(p => (p + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);

  const G = '#16C45B';

  const testimonials = [
    { text: 'SmartQueue completely eliminated our checkout queues. Revenue up 23%, customer satisfaction at an all-time high. Genuinely game-changing.', author: 'Rahul Mehta', role: 'Store Manager, FreshMart', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', stars: 5 },
    { text: 'The real-time dashboard gives us complete visibility into every transaction. Setup was incredibly smooth — our team loved it.', author: 'Priya Sharma', role: 'Operations Head, DailyNeeds', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', stars: 5 },
    { text: 'Customer wait time dropped from 12 minutes to under 2. The QR exit gate system is pure genius. Highly recommend!', author: 'Arjun Kapoor', role: 'Director, ValuePlus Chain', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', stars: 5 },
  ];

  const heroReveal = useReveal(0);
  const featReveal = useReveal(100);
  const portal1 = useTilt();
  const portal2 = useTilt();
  const portal3 = useTilt();
  const portalTilts = [portal1, portal2, portal3];

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; cursor: pointer; border: none; outline: none; }
        input { font-family: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#16C45B, #0ea875); border-radius: 3px; }

        /* ── Keyframes ── */
        @keyframes hero-float-a  { 0%,100%{transform:translateY(0) rotate(2.5deg)} 50%{transform:translateY(-20px) rotate(-1.5deg)} }
        @keyframes hero-float-b  { 0%,100%{transform:translateY(0) rotate(-2.5deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
        @keyframes badge-bob     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes scan-beam     { 0%{top:8%} 50%{top:84%} 100%{top:8%} }
        @keyframes orb-drift-a   { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.08)} 66%{transform:translate(-20px,20px) scale(0.95)} }
        @keyframes orb-drift-b   { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,25px) scale(1.05)} 66%{transform:translate(30px,-40px) scale(0.97)} }
        @keyframes orb-drift-c   { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,50px)} }
        @keyframes ring-breathe  { 0%,100%{opacity:0.1;transform:translateY(-50%) scale(1)} 50%{opacity:0.22;transform:translateY(-50%) scale(1.06)} }
        @keyframes dot-ping      { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(3);opacity:0} }
        @keyframes fade-up       { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-right    { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fade-left     { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scale-in      { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes shine-sweep   { 0%{left:-120%} 100%{left:160%} }
        @keyframes gradient-x    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes ticker        { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes border-spin   { from{--angle:0deg} to{--angle:360deg} }
        @keyframes count-pop     { 0%{transform:scale(1)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
        @keyframes step-progress { from{width:0%} to{width:100%} }
        @keyframes glass-shimmer { 0%{opacity:0;left:-100%} 50%{opacity:1} 100%{opacity:0;left:200%} }
        @keyframes check-draw    { from{stroke-dashoffset:20} to{stroke-dashoffset:0} }

        /* ── Utility classes ── */
        .float-a  { animation: hero-float-a 8s ease-in-out infinite; }
        .float-b  { animation: hero-float-b 10s ease-in-out infinite; }
        .bob      { animation: badge-bob 3.5s ease-in-out infinite; }
        .laser    { animation: scan-beam 2.2s ease-in-out infinite; position:absolute; left:0; right:0; height:2px;
                    background: linear-gradient(90deg, transparent 0%, #16C45B 30%, #7dffb3 50%, #16C45B 70%, transparent 100%);
                    box-shadow: 0 0 12px rgba(22,196,91,0.7), 0 0 4px #fff; }
        .ring-a   { animation: ring-breathe 7s ease-in-out infinite; }
        .ring-b   { animation: ring-breathe 7s ease-in-out infinite 2s; }
        .ring-c   { animation: ring-breathe 7s ease-in-out infinite 4s; }
        .ping     { animation: dot-ping 1.8s ease-out infinite; }
        .grad-text {
          background: linear-gradient(120deg, #16C45B 0%, #34d399 40%, #06b6d4 70%, #16C45B 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: gradient-x 5s ease infinite;
        }
        .shimmer-btn { position:relative; overflow:hidden; }
        .shimmer-btn::after {
          content:''; position:absolute; top:0; left:-120%; width:50%; height:100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: skewX(-20deg); animation: shine-sweep 3s ease-in-out infinite;
        }
        .ticker-track { animation: ticker 40s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
        .dot-grid {
          background-image: radial-gradient(circle, rgba(22,196,91,0.15) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .hex-grid {
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
        .reveal.show { opacity: 1; transform: translateY(0); }
        .reveal-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
        .reveal-left.show { opacity: 1; transform: translateX(0); }
        .reveal-right { opacity: 0; transform: translateX(30px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
        .reveal-right.show { opacity: 1; transform: translateX(0); }
        .scale-reveal { opacity: 0; transform: scale(0.93); transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1); }
        .scale-reveal.show { opacity: 1; transform: scale(1); }
        .card-3d { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; transform-style: preserve-3d; }
        .feature-pill { transition: all 0.25s ease; cursor: default; }
        .feature-pill:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.1) !important; }
        .step-dot { transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .step-dot.active { transform: scale(1.25); }
        .nav-a { position:relative; transition: color 0.2s; }
        .nav-a::after { content:''; position:absolute; bottom:-2px; left:50%; right:50%; height:2px; background:#16C45B; border-radius:2px; transition: left 0.25s ease, right 0.25s ease; }
        .nav-a:hover::after, .nav-a.active::after { left:0; right:0; }
        .nav-a:hover { color: #16C45B !important; }
        .portal-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .portal-btn:hover { transform: scale(1.05) translateY(-1px); }
        .logo-item { transition: all 0.25s ease; filter: grayscale(100%) opacity(0.45); }
        .logo-item:hover { filter: grayscale(0%) opacity(1); transform: scale(1.08) translateY(-2px); }
        .testimonial-enter { animation: scale-in 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        .stat-num { animation: count-pop 0.4s ease; }
        .step-progress-bar { animation: step-progress 3s linear; }
        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .hero-phone-glow { filter: drop-shadow(0 40px 80px rgba(22,196,91,0.25)); }
      `}</style>

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,1)',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(241,245,249,0.8)' : '#f1f5f9'}`,
        transition: 'all 0.35s ease',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.07)' : 'none',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#16C45B,#0ea875)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 16px rgba(22,196,91,0.35)', flexShrink: 0, transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.08) rotate(-4deg)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1) rotate(0)'}>🛒</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>SmartQueue</div>
              <div style={{ fontSize: 8.5, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Enterprise Ecosystem</div>
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[
              { l: 'Home', h: '#home', active: true }, { l: 'Features', h: '#features' }, { l: 'How It Works', h: '#how' },
              { l: 'Solutions', h: '#portals' }, { l: 'About', h: '#why' }, { l: 'Resources', h: '#' }, { l: 'Contact', h: '#' },
            ].map(x => (
              <a key={x.l} href={x.h} className={`nav-a${x.active ? ' active' : ''}`} style={{ fontSize: 12.5, fontWeight: 600, padding: '7px 13px', borderRadius: 8, color: x.active ? G : '#475569', display: 'block', transition: 'background 0.2s, color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(22,196,91,0.06)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>{x.l}</a>
            ))}
          </div>

          {/* CTA */}
          <a href="#portals" className="shimmer-btn" style={{
            background: 'linear-gradient(135deg,#16C45B,#0ea875)', color: '#fff', fontWeight: 800, fontSize: 13,
            padding: '11px 22px', borderRadius: 11, display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(22,196,91,0.4)', transition: 'transform 0.2s, box-shadow 0.2s',
          }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.03)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(22,196,91,0.5)'; }}
             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(22,196,91,0.4)'; }}>
            Access Portals <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <header id="home" style={{ background: 'linear-gradient(155deg,#050c18 0%,#081528 55%,#060e1e 100%)', position: 'relative', overflow: 'hidden', minHeight: '96vh', display: 'flex', alignItems: 'center' }}>

        {/* Dot grid */}
        <div className="hex-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

        {/* Ambient orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(22,196,91,0.12) 0%,transparent 70%)', filter: 'blur(50px)', animation: 'orb-drift-a 18s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,168,117,0.1) 0%,transparent 70%)', filter: 'blur(60px)', animation: 'orb-drift-b 22s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '35%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)', filter: 'blur(40px)', animation: 'orb-drift-c 14s ease-in-out infinite', pointerEvents: 'none' }} />

        {/* Glow rings around phones */}
        {[580, 440, 310].map((size, i) => (
          <div key={size} className={`ring-${['a','b','c'][i]}`} style={{ position: 'absolute', right: `${[3,8,13][i]}%`, top: '50%', width: size, height: size, borderRadius: '50%', border: `${[1,1.5,2][i]}px solid rgba(22,196,91,${[0.09,0.15,0.22][i]})`, pointerEvents: 'none' }} />
        ))}

        {/* Floating particles */}
        {[
          { x:'8%', y:'22%', s:3, d:'0s' }, { x:'6%', y:'68%', s:2, d:'1s' }, { x:'14%', y:'45%', s:4, d:'2s' },
          { x:'88%', y:'18%', s:2.5, d:'0.5s' }, { x:'91%', y:'75%', s:3, d:'1.5s' }, { x:'82%', y:'50%', s:2, d:'3s' },
          { x:'50%', y:'8%', s:2, d:'2.5s' }, { x:'48%', y:'92%', s:3, d:'0.8s' },
        ].map((p,i) => (
          <div key={i} style={{ position:'absolute', left:p.x, top:p.y, width:p.s, height:p.s, borderRadius:'50%', background:`rgba(22,196,91,0.6)`, animation:`badge-bob ${3+i*0.4}s ease-in-out infinite`, animationDelay:p.d, pointerEvents:'none' }} />
        ))}

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>

          {/* Left */}
          <div style={{ animation: 'fade-right 0.9s cubic-bezier(0.16,1,0.3,1) both' }}>
            {/* Live status pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 50, background: 'rgba(22,196,91,0.08)', border: '1px solid rgba(22,196,91,0.22)', marginBottom: 32, backdropFilter: 'blur(12px)' }}>
              <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: G }} />
                <span className="ping" style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: G, opacity: 0.5 }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 800, color: G, letterSpacing: '0.12em', textTransform: 'uppercase' }}>AI-Powered Self-Checkout Platform</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.05, color: '#fff', letterSpacing: '-2px', marginBottom: 24 }}>
              The Future of<br />
              Shopping is<br />
              <span className="grad-text">Queue-Free</span>
            </h1>

            <p style={{ fontSize: 15.5, color: '#94a3b8', lineHeight: 1.8, maxWidth: 430, marginBottom: 40 }}>
              SmartQueue Enterprise gives supermarkets a seamless AI-powered checkout ecosystem. Shoppers scan, pay, and exit in under 2 minutes — no queues, ever.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 48 }}>
              <a href="#portals" className="shimmer-btn" style={{
                padding: '15px 30px', background: 'linear-gradient(135deg,#16C45B,#0ea875)',
                color: '#fff', fontWeight: 800, fontSize: 14, borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 9,
                boxShadow: '0 10px 30px rgba(22,196,91,0.45)',
                transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
              }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 48px rgba(22,196,91,0.55)'; }}
                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(22,196,91,0.45)'; }}>
                Explore Platform <ArrowRight size={16} strokeWidth={2.5} />
              </a>
              <a href="#how" style={{
                padding: '15px 26px', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.25s ease',
              }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.11)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={11} fill="#fff" />
                </div>
                Watch Demo
              </a>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex' }}>
                {['photo-1534528741775-53994a69daeb','photo-1539571696357-5a69c17a67c6','photo-1507003211169-0a1dd7228f2d','photo-1494790108377-be9c29b29330'].map((id, i) => (
                  <img key={i} src={`https://images.unsplash.com/${id}?w=80&auto=format&fit=crop&q=80`} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '2.5px solid #060d1a', marginLeft: i > 0 ? -12 : 0, objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', transition: 'transform 0.2s' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.transform = 'scale(1.15) translateY(-3px)'}
                    onMouseLeave={e => (e.target as HTMLElement).style.transform = 'scale(1) translateY(0)'} />
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginLeft: 5 }}>5.0</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Trusted by <span style={{ color: '#e2e8f0', fontWeight: 800 }}>500+</span> Retail Stores</div>
              </div>
            </div>
          </div>

          {/* Right: Phones */}
          <div className="hero-phone-glow" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, animation: 'fade-left 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>

            {/* Phone 1 */}
            <div className="float-a" style={{ width: 215, height: 440, background: 'linear-gradient(160deg,#1c2b42,#0f1e33)', borderRadius: 44, border: '5px solid rgba(255,255,255,0.08)', overflow: 'hidden', position: 'relative', flexShrink: 0, zIndex: 2, boxShadow: '0 50px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)' }}>
              <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)', width:84, height:24, background:'#000', borderRadius:14, zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#1a1a1a', border:'1.5px solid #2a2a2a' }} />
                <div style={{ width:5, height:5, borderRadius:'50%', background:G, opacity:0.85, boxShadow:`0 0 6px ${G}` }} />
              </div>
              {/* Screen */}
              <div style={{ height:'100%', background:'linear-gradient(180deg,#f0f7ff 0%,#fff 100%)', padding:'42px 11px 11px', display:'flex', flexDirection:'column' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, paddingBottom:8, borderBottom:'1px solid rgba(22,196,91,0.12)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:G, boxShadow:`0 0 6px ${G}` }} />
                    <span style={{ fontSize:8.5, fontWeight:800, color:'#0f172a' }}>SmartQueue</span>
                  </div>
                  <button style={{ fontSize:8, color:G, fontWeight:800, background:'rgba(22,196,91,0.1)', padding:'2px 7px', borderRadius:20 }}
                    onClick={() => setDemoCart(p => [...p, { id: Date.now(), name: 'Pepsi', price: 30, emoji: '🥤', qty: 1 }])}>+ Add</button>
                </div>
                <div style={{ fontWeight:900, fontSize:11.5, color:'#0f172a', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
                  🛒 My Cart <span style={{ background:'rgba(22,196,91,0.12)', color:G, fontSize:8, fontWeight:800, padding:'2px 6px', borderRadius:10 }}>{demoCart.length}</span>
                </div>
                <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:5 }}>
                  {demoCart.map((item, i) => (
                    <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff', padding:'7px 9px', borderRadius:11, border:'1px solid #eef2ff', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', animation:'fade-up 0.3s ease both', animationDelay:`${i*0.04}s` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <span style={{ fontSize:16 }}>{item.emoji}</span>
                        <div>
                          <div style={{ fontSize:9, fontWeight:800, color:'#0f172a' }}>{item.name}</div>
                          <div style={{ fontSize:7.5, color:'#94a3b8', marginTop:1 }}>₹{item.price} each</div>
                        </div>
                      </div>
                      <div style={{ background:'rgba(22,196,91,0.1)', border:'1px solid rgba(22,196,91,0.2)', borderRadius:7, padding:'2px 8px', fontSize:8, fontWeight:900, color:G }}>{item.qty}×</div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:'1.5px solid #f0f4ff', paddingTop:9, marginTop:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, marginBottom:3 }}>
                    <span style={{ color:'#64748b' }}>{demoCart.length} items</span>
                    <span style={{ fontWeight:800, color:'#0f172a' }}>₹{demoTotal}.00</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:8.5, marginBottom:9 }}>
                    <span style={{ color:G, fontWeight:700 }}>Loyalty Discount</span>
                    <span style={{ color:G, fontWeight:700 }}>-₹{Math.floor(demoTotal*0.05)}</span>
                  </div>
                  <button onClick={() => setIsDemoPaid(true)} style={{ width:'100%', padding:'10px 0', background:'linear-gradient(135deg,#16C45B,#0ea875)', color:'#fff', fontWeight:900, fontSize:10, borderRadius:10, boxShadow:'0 6px 18px rgba(22,196,91,0.4)', letterSpacing:'0.02em', transition:'transform 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
                    Proceed to Pay →
                  </button>
                  <div style={{ display:'flex', justifyContent:'center', gap:7, marginTop:6 }}>
                    {['UPI','VISA','MC','RuPay'].map(b => <span key={b} style={{ fontSize:6.5, color:'#94a3b8', fontWeight:700, background:'#f8fafc', padding:'1px 6px', borderRadius:4, border:'1px solid #e2e8f0' }}>{b}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 2 */}
            <div className="float-b" style={{ width: 188, height: 390, background:'linear-gradient(160deg,#1c2b42,#0f1e33)', borderRadius:38, border:'4px solid rgba(255,255,255,0.07)', overflow:'hidden', flexShrink:0, zIndex:1, marginLeft:-24, boxShadow:'0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
              <div style={{ position:'absolute', top:9, left:'50%', transform:'translateX(-50%)', width:72, height:18, background:'#000', borderRadius:10, zIndex:10 }} />
              {isDemoPaid ? (
                <div style={{ height:'100%', background:'linear-gradient(160deg,#ecfdf5,#f0fdf4)', padding:'28px 14px 14px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', textAlign:'center', animation:'scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
                  <div>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#16C45B,#0ea875)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', boxShadow:'0 8px 24px rgba(22,196,91,0.5)', animation:'scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }}>
                      <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div style={{ fontSize:11.5, fontWeight:900, color:'#0f172a' }}>Payment Successful!</div>
                    <div style={{ fontSize:8.5, color:'#64748b', marginTop:4, lineHeight:1.6 }}>Show QR at exit gate</div>
                  </div>
                  <div style={{ background:'#fff', borderRadius:18, padding:12, boxShadow:'0 12px 40px rgba(0,0,0,0.1)', border:'1px solid rgba(22,196,91,0.2)', animation:'fade-up 0.4s ease 0.2s both' }}>
                    <div style={{ background:'#0f172a', borderRadius:12, width:96, height:96, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5 }}>
                      <QrCode size={48} style={{ color:G }} />
                      <span style={{ fontSize:6, color:'#fff', fontFamily:'monospace', fontWeight:800, letterSpacing:'0.12em' }}>EXIT PASS</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:7, marginTop:7, paddingTop:7, borderTop:'1px solid #f1f5f9' }}>
                      <span style={{ color:'#94a3b8' }}>AI Verified</span>
                      <span style={{ color:G, fontWeight:800 }}>✓ Valid</span>
                    </div>
                  </div>
                  <div style={{ width:'100%', textAlign:'center' }}>
                    <div style={{ fontSize:8.5, fontWeight:700, color:'#0f172a', marginBottom:4 }}>Order: SQ-{Date.now().toString().slice(-6)}</div>
                    <div style={{ fontSize:9, color:G, fontWeight:800 }}>Thank you! 🎉</div>
                    <button onClick={() => setIsDemoPaid(false)} style={{ marginTop:5, fontSize:7, color:'#94a3b8', background:'none', textDecoration:'underline' }}>Reset Demo</button>
                  </div>
                </div>
              ) : (
                <div style={{ height:'100%', background:'linear-gradient(160deg,#0d1b2e,#1e2d47)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, textAlign:'center', gap:12 }}>
                  <div style={{ width:54, height:54, borderRadius:'50%', background:'rgba(22,196,91,0.1)', border:'2px solid rgba(22,196,91,0.2)', display:'flex', alignItems:'center', justifyContent:'center', animation:'badge-bob 3s ease-in-out infinite' }}>
                    <CreditCard size={24} style={{ color:'rgba(22,196,91,0.6)' }} />
                  </div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:'#475569' }}>Awaiting Payment</div>
                  <div style={{ fontSize:8.5, color:'#334155', lineHeight:1.7, maxWidth:130 }}>Click <strong style={{ color:G }}>"Proceed to Pay"</strong> to generate your exit QR</div>
                  <div style={{ display:'flex', gap:5 }}>
                    {[...Array(3)].map((_,i)=> <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:i===0?G:'rgba(22,196,91,0.2)', border:`1px solid rgba(22,196,91,0.4)`, animation:`badge-bob ${2+i*0.5}s ease-in-out infinite`, animationDelay:`${i*0.3}s` }} />)}
                  </div>
                </div>
              )}
            </div>

            {/* Floating glass badges */}
            {[
              { label:'Secure Payment', icon:'🔒', pos:{ top:-26, right:-12 } as React.CSSProperties, delay:'0s' },
              { label:'QR Generated', icon:'✅', pos:{ top:'40%', left:-58 } as React.CSSProperties, delay:'1.2s' },
              { label:'AI Verified', icon:'🤖', pos:{ bottom:30, right:-26 } as React.CSSProperties, delay:'2.1s' },
              { label:'Exit Approved', icon:'🚀', pos:{ top:-36, left:10 } as React.CSSProperties, delay:'0.6s' },
            ].map((b,i) => (
              <div key={i} className="bob glass-card" style={{ position:'absolute', ...b.pos, animationDelay:b.delay, padding:'8px 14px', borderRadius:10, fontSize:10, fontWeight:700, color:'#fff', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:7, boxShadow:'0 12px 32px rgba(0,0,0,0.4)' }}>
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══════════════ FEATURE STRIP ═══════════════ */}
      <div id="features" style={{ background:'#fff', padding:'0 28px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div className={`reveal${featReveal.visible ? ' show' : ''}`} ref={featReveal.ref} style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', borderRadius:22, background:'#fff', marginTop:-40, position:'relative', zIndex:10, boxShadow:'0 12px 56px rgba(0,0,0,0.09)', border:'1px solid #f0f4ff', overflow:'hidden' }}>
            {[
              { icon:<Zap size={20}/>, title:'Instant Verification', desc:'Real-time gate updates', color:'#fefce8', ic:'#ca8a04' },
              { icon:<Shield size={20}/>, title:'Secure Payments', desc:'Bank-grade encryption', color:'#fef2f2', ic:'#dc2626' },
              { icon:<QrCode size={20}/>, title:'QR Exit Gate', desc:'Auto pass generation', color:'#f0fdf4', ic:G },
              { icon:<RefreshCw size={20}/>, title:'Real-time Sync', desc:'Live across all devices', color:'#eff6ff', ic:'#3b82f6' },
              { icon:<Smartphone size={20}/>, title:'Enterprise Grade', desc:'99.99% uptime SLA', color:'#fdf4ff', ic:'#9333ea' },
            ].map((f,i)=> (
              <div key={f.title} className="feature-pill" style={{ padding:'26px 22px', borderLeft:i>0?'1px solid #f1f5f9':'none', background:'#fff', cursor:'default' }}>
                <div style={{ width:44, height:44, borderRadius:14, background:f.color, display:'flex', alignItems:'center', justifyContent:'center', color:f.ic, marginBottom:14, transition:'transform 0.25s ease' }}
                  onMouseEnter={e=> (e.currentTarget as HTMLElement).style.transform='scale(1.1) rotate(-5deg)'}
                  onMouseLeave={e=> (e.currentTarget as HTMLElement).style.transform='scale(1) rotate(0)'}>{f.icon}</div>
                <div style={{ fontWeight:800, fontSize:13.5, color:'#0f172a', marginBottom:5 }}>{f.title}</div>
                <div style={{ fontSize:11.5, color:'#64748b', lineHeight:1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how" style={{ background:'linear-gradient(180deg,#fff 0%,#f8fafc 100%)', padding:'100px 28px', borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          {(() => { const r = useReveal(); return (
            <div className={`reveal${r.visible?' show':''}`} ref={r.ref} style={{ textAlign:'center', marginBottom:72 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 16px', borderRadius:50, background:'rgba(22,196,91,0.08)', border:'1px solid rgba(22,196,91,0.2)', marginBottom:18 }}>
                <span style={{ fontSize:9.5, fontWeight:800, color:G, textTransform:'uppercase', letterSpacing:'0.12em' }}>Simple 4-Step Process</span>
              </div>
              <h2 style={{ fontSize:38, fontWeight:900, color:'#0f172a', letterSpacing:'-1px', marginBottom:14 }}>
                How <span style={{ color:G }}>SmartQueue</span> Works
              </h2>
              <p style={{ fontSize:15, color:'#64748b', maxWidth:520, margin:'0 auto', lineHeight:1.75 }}>
                From aisle to exit in under 2 minutes — beautifully simple for everyone
              </p>
            </div>
          );})()}

          {/* Step progress indicator */}
          <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:48 }}>
            {[{ icon:<Scan size={14}/>, l:'Scan' },{ icon:<CreditCard size={14}/>, l:'Pay' },{ icon:<QrCode size={14}/>, l:'QR Code' },{ icon:<DoorOpen size={14}/>, l:'Exit' }].map((s,i)=>(
              <button key={s.l} onClick={()=>setActiveStep(i)} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 18px', borderRadius:50, background:activeStep===i?'linear-gradient(135deg,#16C45B,#0ea875)':'rgba(22,196,91,0.06)', color:activeStep===i?'#fff':G, fontWeight:700, fontSize:11.5, border:`1.5px solid ${activeStep===i?'transparent':'rgba(22,196,91,0.2)'}`, transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)', boxShadow:activeStep===i?'0 6px 20px rgba(22,196,91,0.35)':'none', transform:activeStep===i?'scale(1.05)':'scale(1)', cursor:'pointer' }}>
                {s.icon} {s.l}
              </button>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:22, position:'relative' }}>
            {/* Connector */}
            <div style={{ position:'absolute', top:68, left:'12.5%', width:'75%', height:2, background:'linear-gradient(90deg,transparent,rgba(22,196,91,0.3),#16C45B,rgba(22,196,91,0.3),transparent)', borderRadius:1, zIndex:0 }} />

            {[
              { n:1, icon:<Scan size={20}/>, title:'Scan Products', desc:'Use the app camera to scan any barcode. Items auto-add to your live cart.',
                visual:(
                  <div style={{ width:112,height:172,background:'linear-gradient(160deg,#1c2b42,#0f1e33)',borderRadius:24,border:'3px solid rgba(255,255,255,0.07)',overflow:'hidden',marginTop:10,boxShadow:'0 20px 50px rgba(0,0,0,0.3)' }}>
                    <div style={{ height:'100%',background:'#0f172a',padding:8,display:'flex',flexDirection:'column',gap:6 }}>
                      <div style={{ flex:1,background:'#1e293b',borderRadius:12,position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center' }}>
                        {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h])=>(
                          <div key={v+h} style={{ position:'absolute',[v]:7,[h]:7,width:14,height:14,borderTop:v==='top'?`2.5px solid ${G}`:'none',borderBottom:v==='bottom'?`2.5px solid ${G}`:'none',borderLeft:h==='left'?`2.5px solid ${G}`:'none',borderRight:h==='right'?`2.5px solid ${G}`:'none' }} />
                        ))}
                        <div className="laser" />
                        <QrCode size={26} style={{ color:'rgba(22,196,91,0.3)' }} />
                        <div style={{ position:'absolute',bottom:4,right:4,fontSize:5.5,background:G,color:'#fff',fontWeight:800,padding:'1px 5px',borderRadius:4 }}>LIVE</div>
                      </div>
                      <div style={{ background:'linear-gradient(135deg,#fff,#f0fdf4)',borderRadius:8,padding:'5px 8px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 2px 10px rgba(0,0,0,0.12)' }}>
                        <div><div style={{ fontSize:7.5,fontWeight:800,color:'#0f172a' }}>Maggi Noodles</div><div style={{ fontSize:7,color:'#94a3b8' }}>₹14.00</div></div>
                        <div style={{ width:16,height:16,borderRadius:'50%',background:'#dcfce7',display:'flex',alignItems:'center',justifyContent:'center' }}><Check size={9} style={{ color:G }} /></div>
                      </div>
                    </div>
                  </div>
                )
              },
              { n:2, icon:<CreditCard size={20}/>, title:'Make Payment', desc:'Pay instantly via UPI, cards, or wallets. Secure one-tap checkout.',
                visual:(
                  <div style={{ width:112,height:172,background:'linear-gradient(160deg,#1c2b42,#0f1e33)',borderRadius:24,border:'3px solid rgba(255,255,255,0.07)',overflow:'hidden',marginTop:10,boxShadow:'0 20px 50px rgba(0,0,0,0.3)' }}>
                    <div style={{ height:'100%',background:'#fff',padding:'9px 9px 8px',display:'flex',flexDirection:'column',justifyContent:'space-between' }}>
                      <div style={{ fontSize:8.5,fontWeight:900,color:'#0f172a',borderBottom:'1px solid #f1f5f9',paddingBottom:5 }}>Checkout</div>
                      <div style={{ fontSize:7.5,display:'flex',flexDirection:'column',gap:3.5 }}>
                        <div style={{ display:'flex',justifyContent:'space-between',color:'#64748b' }}><span>Subtotal</span><span>₹148.00</span></div>
                        <div style={{ display:'flex',justifyContent:'space-between',color:G,fontWeight:700 }}><span>Discount</span><span>-₹7.40</span></div>
                        <div style={{ display:'flex',justifyContent:'space-between',color:'#0f172a',fontWeight:900,borderTop:'1px solid #f1f5f9',paddingTop:4 }}><span>Total</span><span>₹140.60</span></div>
                      </div>
                      <div style={{ background:'linear-gradient(135deg,#1e40af,#6366f1)',borderRadius:9,padding:'7px 9px',color:'#fff' }}>
                        <div style={{ display:'flex',justifyContent:'space-between',fontSize:6,marginBottom:6,opacity:0.75 }}><span style={{ fontWeight:700 }}>SmartPay</span><span>•••• 4820</span></div>
                        <div style={{ fontSize:8,fontFamily:'monospace',fontWeight:800 }}>₹140.60</div>
                      </div>
                      <button style={{ background:`linear-gradient(135deg,${G},#0ea875)`,color:'#fff',fontSize:7.5,fontWeight:900,padding:'8px 0',borderRadius:9,boxShadow:'0 4px 14px rgba(22,196,91,0.35)',letterSpacing:'0.03em' }}>✓ PAY SECURELY</button>
                    </div>
                  </div>
                )
              },
              { n:3, icon:<Ticket size={20}/>, title:'Get QR Pass', desc:'Instant digital exit pass generated after payment confirmation.',
                visual:(
                  <div style={{ width:112,height:172,background:'linear-gradient(160deg,#1c2b42,#0f1e33)',borderRadius:24,border:'3px solid rgba(255,255,255,0.07)',overflow:'hidden',marginTop:10,boxShadow:'0 20px 50px rgba(0,0,0,0.3)' }}>
                    <div style={{ height:'100%',background:'linear-gradient(160deg,#ecfdf5,#fff)',padding:9,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between' }}>
                      <div style={{ textAlign:'center' }}><div style={{ fontSize:8,fontWeight:900,color:G }}>✓ Order Verified!</div><div style={{ fontSize:7,color:'#94a3b8',marginTop:2 }}>Exit ticket ready</div></div>
                      <div style={{ background:'#fff',borderRadius:14,padding:10,boxShadow:'0 6px 20px rgba(0,0,0,0.1)',border:'1px solid rgba(22,196,91,0.15)' }}>
                        <div style={{ background:'#0f172a',borderRadius:10,width:70,height:70,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4 }}>
                          <QrCode size={40} style={{ color:G }} />
                          <span style={{ fontSize:5.5,color:'#fff',fontFamily:'monospace',fontWeight:800,letterSpacing:'0.1em' }}>PASS#SQ01</span>
                        </div>
                      </div>
                      <div style={{ width:'100%',borderTop:'1px solid #f1f5f9',paddingTop:5,display:'flex',justifyContent:'space-between',fontSize:7 }}><span style={{ color:'#94a3b8' }}>Validity</span><span style={{ color:G,fontWeight:800 }}>1 Exit Only</span></div>
                    </div>
                  </div>
                )
              },
              { n:4, icon:<DoorOpen size={20}/>, title:'Exit Seamlessly', desc:'Scan QR at gate. AI verifies in milliseconds — walk right through!',
                visual:(
                  <div style={{ width:148,height:130,background:'linear-gradient(160deg,#1e293b,#0f172a)',borderRadius:18,border:'2px solid rgba(255,255,255,0.07)',padding:11,display:'flex',flexDirection:'column',justifyContent:'space-between',marginTop:14,boxShadow:'0 20px 50px rgba(0,0,0,0.3)' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(255,255,255,0.07)',paddingBottom:6 }}>
                      <span style={{ fontSize:8,fontWeight:800,color:'#94a3b8' }}>Exit Gate #01</span>
                      <div style={{ display:'flex',alignItems:'center',gap:4 }}>
                        <span style={{ position:'relative',display:'inline-flex',width:8,height:8 }}>
                          <span style={{ position:'absolute',inset:0,borderRadius:'50%',background:G,boxShadow:`0 0 8px ${G}` }} />
                          <span className="ping" style={{ position:'absolute',inset:0,borderRadius:'50%',background:G,opacity:0.5 }} />
                        </span>
                        <span style={{ fontSize:7,color:G,fontWeight:700 }}>LIVE</span>
                      </div>
                    </div>
                    <div style={{ background:'#0f172a',borderRadius:9,padding:'7px 8px',textAlign:'center' }}>
                      <div style={{ fontSize:7,color:G,fontFamily:'monospace',fontWeight:700,letterSpacing:'0.04em' }}>✓ PASS VERIFIED</div>
                      <div style={{ fontSize:11,color:'#fff',fontWeight:900,marginTop:2,letterSpacing:'0.02em' }}>GATE OPEN</div>
                    </div>
                    <div style={{ display:'flex',justifyContent:'space-around',alignItems:'center' }}>
                      <span style={{ fontSize:26 }}>🚪</span>
                      <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:3 }}>
                        <span style={{ fontSize:13,color:G,fontWeight:900 }}>➔</span>
                        <div style={{ width:32,height:1.5,background:`linear-gradient(90deg,${G},transparent)`,borderRadius:1 }} />
                      </div>
                      <span style={{ fontSize:26 }}>🚶</span>
                    </div>
                  </div>
                )
              },
            ].map((step,i) => {
              const r = useReveal(i * 80);
              return (
                <div key={step.n} className={`reveal${r.visible?' show':''}`} ref={r.ref} onClick={()=>setActiveStep(i)} style={{ background:activeStep===i?'linear-gradient(160deg,#f0fdf4,#fff)':'#fff', border:`2px solid ${activeStep===i?G:'#f1f5f9'}`, borderRadius:22, padding:'28px 20px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:10, textAlign:'center', position:'relative', zIndex:1, boxShadow:activeStep===i?`0 8px 40px rgba(22,196,91,0.18)`:'0 4px 16px rgba(0,0,0,0.04)', cursor:'pointer', transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
                  {/* Progress bar */}
                  {activeStep===i && <div style={{ position:'absolute', top:0, left:0, height:3, background:`linear-gradient(90deg,${G},#0ea875)`, borderRadius:'22px 22px 0 0', width:'0%', animation:'step-progress 3s linear forwards' }} />}
                  <div style={{ width:38, height:38, borderRadius:'50%', background:activeStep===i?`linear-gradient(135deg,${G},#0ea875)`:'rgba(22,196,91,0.1)', color:activeStep===i?'#fff':G, fontWeight:900, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:activeStep===i?'0 6px 18px rgba(22,196,91,0.45)':'none', transition:'all 0.3s ease', zIndex:1 }}>{step.n}</div>
                  <div style={{ color:activeStep===i?G:'#94a3b8', transition:'color 0.3s' }}>{step.icon}</div>
                  <h4 style={{ fontSize:14.5, fontWeight:800, color:'#0f172a', letterSpacing:'-0.2px' }}>{step.title}</h4>
                  <p style={{ fontSize:11.5, color:'#64748b', lineHeight:1.65 }}>{step.desc}</p>
                  {step.visual}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ ACCESS PORTALS ═══════════════ */}
      <section id="portals" style={{ background:'#fff', padding:'100px 28px', borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          {(() => { const r = useReveal(); return (
            <div className={`reveal${r.visible?' show':''}`} ref={r.ref} style={{ textAlign:'center', marginBottom:60 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 16px', borderRadius:50, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', marginBottom:18 }}>
                <span style={{ fontSize:9.5, fontWeight:800, color:'#6366f1', textTransform:'uppercase', letterSpacing:'0.12em' }}>3 Powerful Portals</span>
              </div>
              <h2 style={{ fontSize:38, fontWeight:900, color:'#0f172a', letterSpacing:'-1px', marginBottom:14 }}>
                Access <span style={{ color:G }}>SmartQueue</span> Portals
              </h2>
              <p style={{ fontSize:15, color:'#64748b', maxWidth:490, margin:'0 auto', lineHeight:1.75 }}>Purpose-built tools for every role — from shopper to store manager</p>
            </div>
          );})()}

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {[
              { icon:'🛒', label:'Customer Portal', color:'#dcfce7', ic:G, desc:'Scan, pay & exit effortlessly. Your full self-checkout in your pocket.', btnBg:'linear-gradient(135deg,#16C45B,#0ea875)', btnShadow:'0 8px 24px rgba(22,196,91,0.4)', path:'/customer/login',
                phone:(
                  <div style={{ width:95,height:172,background:'linear-gradient(160deg,#1c2b42,#0f1e33)',borderRadius:22,border:'3px solid rgba(255,255,255,0.07)',overflow:'hidden',flexShrink:0,marginLeft:16,boxShadow:'0 12px 36px rgba(0,0,0,0.4)' }}>
                    <div style={{ height:'100%',background:'#f8fafc',padding:9,display:'flex',flexDirection:'column',gap:4 }}>
                      <div style={{ fontSize:7.5,fontWeight:900,color:'#0f172a',borderBottom:'1px solid #eef2ff',paddingBottom:4,display:'flex',alignItems:'center',gap:3 }}>🛒 Cart</div>
                      {[{ e:'🥤',n:'Cola',p:'₹60'},{e:'🥔',n:'Lays',p:'₹20'},{e:'🥛',n:'Milk',p:'₹35'}].map(x=>(
                        <div key={x.n} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',background:'#fff',padding:'4px 6px',borderRadius:7,border:'1px solid #f1f5f9',fontSize:6.5 }}>
                          <span>{x.e} {x.n}</span><span style={{ fontWeight:800 }}>{x.p}</span>
                        </div>
                      ))}
                      <div style={{ borderTop:'1px solid #eef2ff',paddingTop:4,display:'flex',justifyContent:'space-between',fontSize:7,fontWeight:900 }}><span>Total</span><span>₹115</span></div>
                      <div style={{ background:`linear-gradient(135deg,${G},#0ea875)`,color:'#fff',fontSize:7,fontWeight:900,padding:'7px 0',borderRadius:8,textAlign:'center',boxShadow:'0 4px 12px rgba(22,196,91,0.3)' }}>PAY NOW →</div>
                    </div>
                  </div>
                )
              },
              { icon:'🕵️', label:'Worker Portal', color:'#dbeafe', ic:'#3b82f6', desc:'Verify QR passes, manage exit gates, and monitor activity live.', btnBg:'linear-gradient(135deg,#0B3D2E,#1a6b45)', btnShadow:'0 8px 24px rgba(11,61,46,0.35)', path:'/worker/login',
                phone:(
                  <div style={{ width:95,height:172,background:'linear-gradient(160deg,#1c2b42,#0f1e33)',borderRadius:22,border:'3px solid rgba(255,255,255,0.07)',overflow:'hidden',flexShrink:0,marginLeft:16,boxShadow:'0 12px 36px rgba(0,0,0,0.4)' }}>
                    <div style={{ height:'100%',background:'#0f172a',padding:9,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:7 }}>
                      <div style={{ fontSize:7,color:'#64748b',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',paddingBottom:5,borderBottom:'1px solid rgba(255,255,255,0.07)',width:'100%',textAlign:'center' }}>Gate Verify</div>
                      <div style={{ width:58,height:58,background:'#1e293b',borderRadius:10,position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(22,196,91,0.2)' }}>
                        <div className="laser" />
                        <QrCode size={28} style={{ color:'rgba(22,196,91,0.45)' }} />
                      </div>
                      <div style={{ fontSize:6.5,color:G,fontWeight:900,textTransform:'uppercase',letterSpacing:'0.1em',fontFamily:'monospace' }}>SCANNING…</div>
                      <div style={{ background:`linear-gradient(135deg,${G},#0ea875)`,borderRadius:7,padding:'4px 14px',fontSize:7,fontWeight:900,color:'#fff',boxShadow:'0 4px 12px rgba(22,196,91,0.3)' }}>VERIFIED ✓</div>
                    </div>
                  </div>
                )
              },
              { icon:'📊', label:'Admin Dashboard', color:'#ede9fe', ic:'#6366f1', desc:'Full analytics, inventory control, and real-time operational insights.', btnBg:'linear-gradient(135deg,#6366f1,#8b5cf6)', btnShadow:'0 8px 24px rgba(99,102,241,0.4)', path:'/admin',
                phone:(
                  <div style={{ flexShrink:0, marginLeft:16 }}>
                    <div style={{ width:138,height:94,background:'linear-gradient(160deg,#1e293b,#0f172a)',borderRadius:12,border:'2px solid rgba(255,255,255,0.07)',padding:10,boxShadow:'0 12px 36px rgba(0,0,0,0.4)' }}>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7 }}>
                        <span style={{ fontSize:7,fontWeight:800,color:G }}>📊 Sales Today</span>
                        <span style={{ fontSize:6.5,color:G,fontWeight:700 }}>↑8.2%</span>
                      </div>
                      <div style={{ display:'flex',alignItems:'flex-end',gap:2,height:36,marginBottom:6 }}>
                        {[38,62,42,78,52,90,68,82,58,86].map((h,i)=>(
                          <div key={i} style={{ flex:1,background:[5,7,9].includes(i)?`linear-gradient(to top,${G},#0ea875)`:'rgba(22,196,91,0.22)',borderRadius:3,height:`${h}%`,transition:'height 0.4s ease' }} />
                        ))}
                      </div>
                      <div style={{ display:'flex',justifyContent:'space-between',fontSize:7 }}>
                        <span style={{ color:'#94a3b8' }}>₹12,450 revenue</span>
                        <span style={{ color:G,fontWeight:800 }}>148 orders</span>
                      </div>
                    </div>
                    <div style={{ width:138,height:6,background:'#0f1825',borderRadius:'0 0 6px 6px',margin:'0 auto' }} />
                  </div>
                )
              },
            ].map((p,i) => {
              const t = portalTilts[i];
              const r = useReveal(i * 100);
              return (
                <div key={p.label} className={`card-3d reveal${r.visible?' show':''}`} ref={(el) => { (r.ref as React.MutableRefObject<HTMLDivElement|null>).current = el; (t.ref as React.MutableRefObject<HTMLDivElement|null>).current = el; }} onMouseMove={t.onMove} onMouseLeave={t.onLeave} style={{ background:'linear-gradient(160deg,#fafbff,#fff)', border:'1px solid #eef2ff', borderRadius:24, padding:'34px 30px', display:'flex', justifyContent:'space-between', alignItems:'center', textAlign:'left', boxShadow:'0 6px 28px rgba(0,0,0,0.06)', transitionDelay:`${i*0.08}s` }}>
                  <div style={{ flex:1 }}>
                    <div style={{ width:52, height:52, borderRadius:16, background:p.color, fontSize:26, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:`0 6px 18px ${p.color}`, transition:'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
                      onMouseEnter={e=> (e.currentTarget as HTMLElement).style.transform='scale(1.15) rotate(-6deg)'}
                      onMouseLeave={e=> (e.currentTarget as HTMLElement).style.transform='scale(1) rotate(0)'}>{p.icon}</div>
                    <h3 style={{ fontSize:18, fontWeight:900, color:'#0f172a', letterSpacing:'-0.4px', marginBottom:10 }}>{p.label}</h3>
                    <p style={{ fontSize:12.5, color:'#64748b', lineHeight:1.72, maxWidth:180, marginBottom:26 }}>{p.desc}</p>
                    <button onClick={() => navigate(p.path)} className="portal-btn" style={{ padding:'13px 22px', background:p.btnBg, color:'#fff', fontWeight:800, fontSize:12, borderRadius:11, boxShadow:p.btnShadow, display:'flex', alignItems:'center', gap:7 }}>
                      {p.label.split(' ')[0]} Portal <ArrowRight size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                  {p.phone}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATISTICS ═══════════════ */}
      <section ref={statsRef} style={{ background:'linear-gradient(135deg,#050c18,#0b1628)', padding:'80px 28px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 80% at 50% 50%,rgba(22,196,91,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div className="hex-grid" style={{ position:'absolute', inset:0, opacity:0.25, pointerEvents:'none' }} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:20, textAlign:'center' }}>
            {[
              { icon:'🛒', val:orders, suffix:'+', label:'Orders Processed' },
              { icon:'🏪', val:stores, suffix:'+', label:'Stores Connected' },
              { icon:'👥', val:customers, suffix:'+', label:'Happy Customers' },
              { icon:'🛡️', val:null, fixed:'99.99%', label:'System Uptime' },
              { icon:'⚡', val:null, fixed:'<500ms', label:'Real-time Sync' },
              { icon:'🎧', val:null, fixed:'24/7', label:'Support' },
            ].map((s,i)=> {
              const r = useReveal(i * 80);
              return (
                <div key={s.label} className={`reveal${r.visible?' show':''}`} ref={r.ref} style={{ transitionDelay:`${i*0.08}s` }}>
                  <div style={{ width:54,height:54,borderRadius:16,background:'rgba(22,196,91,0.1)',border:'1px solid rgba(22,196,91,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 14px',transition:'transform 0.3s ease' }}
                    onMouseEnter={e=> (e.currentTarget as HTMLElement).style.transform='scale(1.12) translateY(-3px)'}
                    onMouseLeave={e=> (e.currentTarget as HTMLElement).style.transform='scale(1) translateY(0)'}>{s.icon}</div>
                  <div style={{ fontSize:32,fontWeight:900,color:G,letterSpacing:'-1px',lineHeight:1,marginBottom:6 }}>
                    {s.fixed ?? (s.val?.toLocaleString() + (s.suffix || ''))}
                  </div>
                  <div style={{ fontSize:11,color:'#64748b',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em' }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY CHOOSE + TESTIMONIALS ═══════════════ */}
      <section id="why" style={{ background:'#fff', padding:'100px 28px', borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'start' }}>

          {(() => { const r = useReveal(); return (
            <div className={`reveal-left${r.visible?' show':''}`} ref={r.ref}>
              <div style={{ display:'inline-flex',alignItems:'center',gap:6,padding:'5px 16px',borderRadius:50,background:'#f0fdf4',border:'1px solid #bbf7d0',marginBottom:20 }}>
                <span style={{ fontSize:9.5,fontWeight:800,color:G,textTransform:'uppercase',letterSpacing:'0.12em' }}>Why SmartQueue?</span>
              </div>
              <h2 style={{ fontSize:36,fontWeight:900,color:'#0f172a',letterSpacing:'-1px',marginBottom:36,lineHeight:1.1 }}>
                Built for the Future<br />of <span style={{ color:G }}>Modern Retail</span>
              </h2>
              <div style={{ display:'flex',flexDirection:'column',gap:18,marginBottom:40 }}>
                {[
                  { t:'Eliminate billing queues',d:'Reduce checkout wait time by up to 85%' },
                  { t:'Premium customer experience',d:'Contactless, frictionless, and lightning fast' },
                  { t:'Bank-grade secure payments',d:'PCI-DSS compliant on every transaction' },
                  { t:'Real-time sync everywhere',d:'Instant updates across all devices and portals' },
                  { t:'Zero-setup integration',d:'Works with your existing store infrastructure' },
                  { t:'Scales with your business',d:'From single stores to enterprise retail chains' },
                ].map((item,i) => (
                  <div key={item.t} style={{ display:'flex',alignItems:'flex-start',gap:14,animation:`fade-right 0.5s ease ${i*0.08}s both` }}>
                    <div style={{ width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,#dcfce7,#bbf7d0)',border:'1.5px solid rgba(22,196,91,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1,transition:'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
                      onMouseEnter={e=> (e.currentTarget as HTMLElement).style.transform='scale(1.2) rotate(10deg)'}
                      onMouseLeave={e=> (e.currentTarget as HTMLElement).style.transform='scale(1) rotate(0)'}>
                      <Check size={12} style={{ color:G }} strokeWidth={3} />
                    </div>
                    <div>
                      <div style={{ fontSize:14,fontWeight:700,color:'#0f172a' }}>{item.t}</div>
                      <div style={{ fontSize:12,color:'#94a3b8',marginTop:2 }}>{item.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Video preview */}
              <div style={{ borderRadius:22,overflow:'hidden',position:'relative',cursor:'pointer',height:200,boxShadow:'0 16px 50px rgba(0,0,0,0.15)',transition:'transform 0.3s ease' }}
                onMouseEnter={e=> (e.currentTarget as HTMLElement).style.transform='scale(1.01)'}
                onMouseLeave={e=> (e.currentTarget as HTMLElement).style.transform='scale(1)'}>
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80" alt="" style={{ width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.45)',transition:'transform 0.5s ease' }}
                  onMouseEnter={e=> (e.target as HTMLElement).style.transform='scale(1.05)'}
                  onMouseLeave={e=> (e.target as HTMLElement).style.transform='scale(1)'} />
                <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 50%)' }} />
                <div style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12 }}>
                  <div style={{ width:58,height:58,borderRadius:'50%',background:'rgba(255,255,255,0.95)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 10px 32px rgba(0,0,0,0.3)',transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
                    onMouseEnter={e=> (e.currentTarget as HTMLElement).style.transform='scale(1.15)'}
                    onMouseLeave={e=> (e.currentTarget as HTMLElement).style.transform='scale(1)'}>
                    <Play size={22} fill={G} style={{ color:G,marginLeft:2 }} />
                  </div>
                  <div style={{ fontSize:14,fontWeight:800,color:'#fff',textShadow:'0 2px 10px rgba(0,0,0,0.5)' }}>See SmartQueue in Action</div>
                  <div style={{ fontSize:11,color:'rgba(255,255,255,0.65)',fontWeight:600 }}>3 min overview · HD</div>
                </div>
              </div>
            </div>
          );})()}

          {(() => { const r = useReveal(100); return (
            <div className={`reveal-right${r.visible?' show':''}`} ref={r.ref}>
              <div style={{ display:'inline-flex',alignItems:'center',gap:6,padding:'5px 16px',borderRadius:50,background:'#fef9c3',border:'1px solid #fde68a',marginBottom:20 }}>
                <Star size={10} fill="#ca8a04" style={{ color:'#ca8a04' }} /><span style={{ fontSize:9.5,fontWeight:800,color:'#92400e',textTransform:'uppercase',letterSpacing:'0.12em' }}>Customer Reviews</span>
              </div>
              <h3 style={{ fontSize:30,fontWeight:900,color:'#0f172a',letterSpacing:'-0.7px',marginBottom:30,lineHeight:1.15 }}>
                Loved by Retailers<br /><span style={{ color:G }}>Worldwide</span> 🌍
              </h3>

              {/* Testimonial card */}
              <div key={activeTestimonial} className="testimonial-enter" style={{ background:'linear-gradient(160deg,#f8faff,#fff)',border:'1px solid #eef2ff',borderRadius:24,padding:'32px 28px',boxShadow:'0 10px 48px rgba(0,0,0,0.07)',marginBottom:22,position:'relative',overflow:'hidden' }}>
                <div style={{ fontSize:80,color:'rgba(22,196,91,0.07)',position:'absolute',top:-12,left:10,fontFamily:'Georgia,serif',lineHeight:1,fontWeight:900,pointerEvents:'none' }}>"</div>
                <div style={{ display:'flex',gap:3,marginBottom:18 }}>
                  {[...Array(testimonials[activeTestimonial].stars)].map((_,i)=> <Star key={i} size={14} fill="#f59e0b" style={{ color:'#f59e0b' }} />)}
                </div>
                <p style={{ fontSize:14.5,color:'#334155',lineHeight:1.82,fontStyle:'italic',marginBottom:24,position:'relative',zIndex:1 }}>"{testimonials[activeTestimonial].text}"</p>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:13 }}>
                    <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].author} style={{ width:46,height:46,borderRadius:'50%',objectFit:'cover',border:'2.5px solid rgba(22,196,91,0.25)',boxShadow:'0 4px 14px rgba(0,0,0,0.1)' }} />
                    <div>
                      <div style={{ fontSize:14,fontWeight:800,color:'#0f172a' }}>{testimonials[activeTestimonial].author}</div>
                      <div style={{ fontSize:11.5,color:'#94a3b8',fontWeight:600,marginTop:2 }}>{testimonials[activeTestimonial].role}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex',gap:8 }}>
                    {[ChevronLeft,ChevronRight].map((Icon,dir)=>(
                      <button key={dir} onClick={()=>setActiveTestimonial(p=>(p+(dir===0?-1:1)+testimonials.length)%testimonials.length)} style={{ width:36,height:36,borderRadius:'50%',border:'1.5px solid #e2e8f0',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
                        onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.background=G; el.style.color='#fff'; el.style.borderColor=G; el.style.transform='scale(1.1)'; }}
                        onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='#fff'; el.style.color='#64748b'; el.style.borderColor='#e2e8f0'; el.style.transform='scale(1)'; }}>
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress dots */}
              <div style={{ display:'flex',gap:6,justifyContent:'center',marginBottom:28 }}>
                {testimonials.map((_,i)=>(
                  <button key={i} onClick={()=>setActiveTestimonial(i)} style={{ height:8,width:i===activeTestimonial?28:8,borderRadius:4,background:i===activeTestimonial?G:'#e2e8f0',border:'none',transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
                ))}
              </div>

              {/* Stat mini cards */}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                {[
                  { icon:'⏱️',num:'85%',label:'Queue Reduction',bg:'#f0fdf4',color:G },
                  { icon:'📈',num:'23%',label:'Revenue Increase',bg:'#eff6ff',color:'#3b82f6' },
                  { icon:'😊',num:'4.9★',label:'Customer Rating',bg:'#fef9c3',color:'#ca8a04' },
                  { icon:'🔒',num:'100%',label:'Payment Security',bg:'#fdf4ff',color:'#9333ea' },
                ].map(s=>(
                  <div key={s.label} style={{ background:s.bg,borderRadius:16,padding:'16px 18px',display:'flex',alignItems:'center',gap:12,transition:'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
                    onMouseEnter={e=> (e.currentTarget as HTMLElement).style.transform='scale(1.04) translateY(-2px)'}
                    onMouseLeave={e=> (e.currentTarget as HTMLElement).style.transform='scale(1) translateY(0)'}>
                    <span style={{ fontSize:22 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:20,fontWeight:900,color:s.color,letterSpacing:'-0.5px' }}>{s.num}</div>
                      <div style={{ fontSize:10.5,color:'#64748b',fontWeight:600,marginTop:1 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );})()}
        </div>
      </section>

      {/* ═══════════════ TICKER ═══════════════ */}
      <section style={{ background:'#f8fafc', padding:'48px 0', borderBottom:'1px solid #f1f5f9', overflow:'hidden' }}>
        <p style={{ textAlign:'center', fontSize:10.5, color:'#94a3b8', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:28 }}>Trusted by Leading Retailers</p>
        <div style={{ overflow:'hidden' }}>
          <div className="ticker-track" style={{ display:'flex', width:'max-content' }}>
            {[...Array(2)].map((_,ri)=>(
              <div key={ri} style={{ display:'flex', gap:56, paddingRight:56 }}>
                {[{ i:'🍏',n:'FreshMart' },{ i:'🛒',n:'DailyNeeds' },{ i:'💎',n:'ValuePlus' },{ i:'🌾',n:'GreenBasket' },{ i:'🏬',n:'UrbanStore' },{ i:'⚡',n:'QuickBuy' },{ i:'📦',n:'MegaMart' },{ i:'🌿',n:'NatureFresh' },{ i:'🎯',n:'SmartMart' },{ i:'🏆',n:'PremiumPick' }].map(b=>(
                  <div key={b.n} className="logo-item" style={{ display:'flex',alignItems:'center',gap:8,fontSize:14,fontWeight:800,color:'#64748b',whiteSpace:'nowrap',cursor:'pointer' }}>
                    <span style={{ fontSize:20 }}>{b.i}</span> {b.n}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{ background:'linear-gradient(160deg,#050c18,#0b1628)', padding:'72px 28px 0', borderTop:'1px solid rgba(255,255,255,0.04)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:'30%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(22,196,91,0.06) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1.8fr 1fr 1fr 1fr 1.8fr', gap:48, paddingBottom:60, position:'relative', zIndex:1 }}>
          <div>
            <div style={{ display:'flex',alignItems:'center',gap:11,marginBottom:20 }}>
              <div style={{ width:42,height:42,background:'linear-gradient(135deg,#16C45B,#0ea875)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,boxShadow:'0 8px 22px rgba(22,196,91,0.4)' }}>🛒</div>
              <div>
                <div style={{ fontSize:18,fontWeight:900,color:'#fff',letterSpacing:'-0.5px' }}>SmartQueue</div>
                <div style={{ fontSize:9,color:'#475569',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.09em' }}>Enterprise</div>
              </div>
            </div>
            <p style={{ fontSize:13,color:'#475569',lineHeight:1.78,maxWidth:255 }}>AI-powered self-checkout ecosystem making retail smarter, faster, and completely queue-free.</p>
            <div style={{ display:'flex',gap:8,marginTop:24 }}>
              {[{ l:'f',c:'#1877f2' },{ l:'t',c:'#1da1f2' },{ l:'in',c:'#0077b5' },{ l:'▶',c:'#ff0000' },{ l:'📷',c:'#e1306c' }].map((s,i)=>(
                <div key={i} style={{ width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#64748b',cursor:'pointer',fontWeight:700,transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
                  onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.background=s.c; el.style.color='#fff'; el.style.borderColor=s.c; el.style.transform='scale(1.15) translateY(-2px)'; }}
                  onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='rgba(255,255,255,0.05)'; el.style.color='#64748b'; el.style.borderColor='rgba(255,255,255,0.08)'; el.style.transform='scale(1) translateY(0)'; }}>
                  {s.l}
                </div>
              ))}
            </div>
          </div>

          {[
            { h:'Platform', links:['Features','How It Works','Solutions','Security','API Docs'] },
            { h:'Resources', links:['User Guide','FAQs','Blog','Help Center','Status'] },
            { h:'Company', links:['About Us','Careers','Contact Us','Press','Privacy Policy'] },
          ].map(col=>(
            <div key={col.h}>
              <div style={{ fontSize:11,fontWeight:800,color:'#fff',textTransform:'uppercase',letterSpacing:'0.09em',marginBottom:20 }}>{col.h}</div>
              {col.links.map(l=>(
                <a key={l} href="#" style={{ display:'block',fontSize:13,color:'#475569',marginBottom:13,fontWeight:500,transition:'all 0.2s ease' }}
                  onMouseEnter={e=>{ const el=e.target as HTMLElement; el.style.color=G; el.style.paddingLeft='4px'; }}
                  onMouseLeave={e=>{ const el=e.target as HTMLElement; el.style.color='#475569'; el.style.paddingLeft='0'; }}>{l}</a>
              ))}
            </div>
          ))}

          <div>
            <div style={{ fontSize:11,fontWeight:800,color:'#fff',textTransform:'uppercase',letterSpacing:'0.09em',marginBottom:16 }}>Stay Updated</div>
            <p style={{ fontSize:13,color:'#475569',lineHeight:1.72,marginBottom:18 }}>Get the latest product updates and news.</p>
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              <input type="email" placeholder="your@email.com" style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'12px 15px',color:'#fff',fontSize:13,outline:'none',fontFamily:'inherit',transition:'border 0.2s,box-shadow 0.2s',width:'100%' }}
                onFocus={e=>{ (e.target as HTMLElement).style.borderColor=G; (e.target as HTMLElement).style.boxShadow=`0 0 0 3px rgba(22,196,91,0.12)`; }}
                onBlur={e=>{ (e.target as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'; (e.target as HTMLElement).style.boxShadow='none'; }} />
              <button style={{ background:'linear-gradient(135deg,#16C45B,#0ea875)',color:'#fff',fontWeight:800,fontSize:13,padding:'12px 0',borderRadius:10,boxShadow:'0 6px 20px rgba(22,196,91,0.4)',transition:'transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.25s',width:'100%' }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 12px 32px rgba(22,196,91,0.5)'; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 6px 20px rgba(22,196,91,0.4)'; }}>
                Subscribe →
              </button>
              <div style={{ display:'flex',gap:10 }}>
                {['🔒 Secure','✓ No Spam','📧 Weekly'].map(b=> <span key={b} style={{ fontSize:10,color:'#475569',fontWeight:600 }}>{b}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1280,margin:'0 auto',borderTop:'1px solid rgba(255,255,255,0.06)',padding:'22px 0 28px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'relative',zIndex:1 }}>
          <span style={{ fontSize:12.5,color:'#334155' }}>© 2024 SmartQueue Enterprise. Made with ❤️ in India</span>
          <div style={{ display:'flex',gap:24 }}>
            {['Privacy','Terms','Cookies'].map(l=>(
              <a key={l} href="#" style={{ fontSize:12.5,color:'#334155',transition:'color 0.2s' }}
                onMouseEnter={e=>(e.target as HTMLElement).style.color=G}
                onMouseLeave={e=>(e.target as HTMLElement).style.color='#334155'}>{l}</a>
            ))}
          </div>
          <button onClick={()=>window.scrollTo({ top:0,behavior:'smooth' })} style={{ width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,#16C45B,#0ea875)',color:'#fff',fontSize:15,fontWeight:900,boxShadow:'0 8px 22px rgba(22,196,91,0.45)',position:'absolute',right:0,top:-21,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.transform='scale(1.15) translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 16px 36px rgba(22,196,91,0.55)'; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.transform='scale(1) translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 22px rgba(22,196,91,0.45)'; }}>↑</button>
        </div>
      </footer>
    </div>
  );
}
