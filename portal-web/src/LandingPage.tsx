import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [demoCart, setDemoCart] = useState([
    { id: 1, name: 'Coca-Cola', price: 30, emoji: '🥤', qty: 2 },
    { id: 2, name: 'Lays Classic', price: 20, emoji: '🥔', qty: 1 },
    { id: 3, name: 'Amul Milk', price: 35, emoji: '🥛', qty: 1 },
    { id: 4, name: 'Paneer Tikka', price: 48, emoji: '🍞', qty: 1 },
  ]);
  const [isDemoPaid, setIsDemoPaid] = useState(false);
  const demoTotal = demoCart.reduce((a, c) => a + c.price * c.qty, 0);

  const testimonials = [
    { text: 'SmartQueue has completely transformed the way we handle checkout. Our queues are gone, and customers love the seamless experience!', author: 'Rahul Mehta', role: 'Store Manager, FreshMart', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { text: 'Easy to use, secure, and incredibly efficient. The real-time dashboard gives us full control over operations.', author: 'Priya Sharma', role: 'Operations Head, DailyNeeds', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: "'Inter', -apple-system, sans-serif", overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(1.5deg)} 50%{transform:translateY(-14px) rotate(-1deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
        @keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes scanLaser { 0%{top:12%} 50%{top:78%} 100%{top:12%} }
        @keyframes glowRing { 0%,100%{opacity:0.12;transform:translateY(-50%) scale(1)} 50%{opacity:0.25;transform:translateY(-50%) scale(1.04)} }
        @keyframes shimmer { 0%{left:-120%} to{left:120%} }
        .ph1{animation:floatA 7s ease-in-out infinite}
        .ph2{animation:floatB 9s ease-in-out infinite}
        .badge{animation:floatBadge 3s ease-in-out infinite}
        .laser{animation:scanLaser 2s ease-in-out infinite;position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#16C45B,transparent)}
        .ring{animation:glowRing 6s ease-in-out infinite}
        .grid-bg{background-image:linear-gradient(rgba(22,196,91,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(22,196,91,0.05) 1px,transparent 1px);background-size:40px 40px}
        a{text-decoration:none}
        button{font-family:inherit}
      `}</style>

      {/* ──────────────── NAVIGATION ──────────────── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{ width: 38, height: 38, background: '#16C45B', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 14px rgba(22,196,91,0.3)' }}>🛒</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 17, color: '#0f172a', letterSpacing: '-0.3px', lineHeight: 1 }}>SmartQueue</div>
              <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>Enterprise Ecosystem</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[
              { l: 'Home', h: '#home', a: true }, { l: 'Features', h: '#features' }, { l: 'How It Works', h: '#how' },
              { l: 'Solutions', h: '#portals' }, { l: 'About Us', h: '#why' }, { l: 'Resources ▾', h: '#' }, { l: 'Contact', h: '#' },
            ].map(x => (
              <a key={x.l} href={x.h} style={{ fontSize: 12, fontWeight: 700, color: x.a ? '#16C45B' : '#475569', borderBottom: x.a ? '2px solid #16C45B' : 'none', paddingBottom: x.a ? 2 : 0 }}>{x.l}</a>
            ))}
          </div>
          <a href="#portals" style={{ background: '#16C45B', color: '#fff', fontWeight: 800, fontSize: 12, padding: '10px 18px', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 12px rgba(22,196,91,0.25)' }}>
            Access Portals <span style={{ fontSize: 16 }}>▦</span>
          </a>
        </div>
      </nav>

      {/* ──────────────── HERO ──────────────── */}
      <header id="home" style={{ background: '#060d1a', position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />
        {/* Glow rings */}
        <div className="ring" style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', width: 520, height: 520, borderRadius: '50%', border: '1px solid rgba(22,196,91,0.12)', pointerEvents: 'none' }} />
        <div className="ring" style={{ position: 'absolute', right: '13%', top: '50%', transform: 'translateY(-50%)', width: 380, height: 380, borderRadius: '50%', border: '2px solid rgba(22,196,91,0.2)', pointerEvents: 'none', animationDelay: '1s' }} />
        <div style={{ position: 'absolute', right: '20%', top: '50%', transform: 'translateY(-50%)', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle,rgba(22,196,91,0.14) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
          {/* Left content */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 50, background: 'rgba(22,196,91,0.1)', border: '1px solid rgba(22,196,91,0.22)', marginBottom: 26 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16C45B' }} />
              <span style={{ fontSize: 9.5, fontWeight: 800, color: '#16C45B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI-Powered Self-Checkout Platform</span>
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.07, color: '#fff', letterSpacing: '-1px', margin: '0 0 20px' }}>
              The Future of Shopping<br />
              is <span style={{ color: '#16C45B' }}>Queue-Free</span>
            </h1>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.72, maxWidth: 420, margin: '0 0 32px' }}>
              SmartQueue Enterprise empowers retailers with a smart self-checkout ecosystem. Shoppers scan, pay, and exit seamlessly with instant verification.
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="#portals" style={{ padding: '13px 26px', background: '#16C45B', color: '#fff', fontWeight: 800, fontSize: 13, borderRadius: 9, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 6px 20px rgba(22,196,91,0.35)' }}>
                Explore Platform →
              </a>
              <a href="#" style={{ padding: '13px 22px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>▶</span>
                Watch Demo
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
              <div style={{ display: 'flex' }}>
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop',
                ].map((s, i) => <img key={i} src={s} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #060d1a', marginLeft: i > 0 ? -10 : 0, objectFit: 'cover' }} />)}
              </div>
              <div>
                <div style={{ color: '#f59e0b', fontSize: 11 }}>★★★★★</div>
                <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginTop: 1 }}>Trusted by 500+ Retail Stores</div>
              </div>
            </div>
          </div>

          {/* Right: Phone mockups */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18 }}>
            {/* Phone 1 - Cart */}
            <div className="ph1" style={{ width: 200, height: 415, background: '#18243a', borderRadius: 38, border: '5px solid #212e45', boxShadow: '0 30px 70px rgba(0,0,0,0.75)', overflow: 'hidden', position: 'relative', flexShrink: 0, zIndex: 2 }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 58, height: 13, background: '#18243a', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, zIndex: 10 }} />
              <div style={{ height: '100%', background: '#fff', padding: '18px 12px 12px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 900, fontSize: 12, color: '#0f172a' }}>My Cart</span>
                  <span style={{ fontSize: 10, color: '#16C45B', fontWeight: 700, cursor: 'pointer' }} onClick={() => setDemoCart(p => [...p, { id: Date.now(), name: 'Pepsi', price: 30, emoji: '🥤', qty: 1 }])}>+ Add</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {demoCart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '7px 8px', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 14 }}>{item.emoji}</span>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 800, color: '#0f172a' }}>{item.name}</div>
                          <div style={{ fontSize: 8, color: '#94a3b8' }}>₹{item.price}.00</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 8, background: '#f1f5f9', color: '#475569', fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>{item.qty}×</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b' }}>Total Amount:</span>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#0f172a' }}>₹{demoTotal}.00</span>
                  </div>
                  <button onClick={() => setIsDemoPaid(true)} style={{ width: '100%', padding: '9px 0', background: '#16C45B', color: '#fff', fontWeight: 800, fontSize: 9, borderRadius: 8, border: 'none', cursor: 'pointer' }}>Proceed to Pay</button>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 6 }}>
                    {['UPI', 'VISA', 'MC', 'RuPay'].map(b => <span key={b} style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700 }}>{b}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 2 - QR */}
            <div className="ph2" style={{ width: 178, height: 370, background: '#18243a', borderRadius: 34, border: '4px solid #212e45', boxShadow: '0 20px 55px rgba(0,0,0,0.65)', overflow: 'hidden', position: 'relative', flexShrink: 0, zIndex: 1, marginLeft: -18 }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 50, height: 12, background: '#18243a', borderBottomLeftRadius: 9, borderBottomRightRadius: 9, zIndex: 10 }} />
              {isDemoPaid ? (
                <div style={{ height: '100%', background: '#fff', padding: '20px 14px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center' }}>
                  <div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dcfce7', color: '#16C45B', fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>✓</div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#0f172a' }}>Payment Successful</div>
                    <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 3 }}>Show this QR code at exit gate</div>
                  </div>
                  <div style={{ width: 100, height: 100, background: '#f8fafc', borderRadius: 12, padding: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', height: '100%', background: '#0f172a', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <QrCode size={36} style={{ color: '#16C45B' }} />
                      <span style={{ fontSize: 7, color: '#fff', fontWeight: 800, letterSpacing: '0.1em' }}>EXIT PASS</span>
                    </div>
                  </div>
                  <div style={{ width: '100%' }}>
                    <div style={{ fontSize: 8, fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 5 }}>Order ID: SQ123456789</div>
                    <div style={{ fontSize: 8, color: '#16C45B', fontWeight: 800, marginTop: 5 }}>Thank you for shopping!</div>
                    <button onClick={() => setIsDemoPaid(false)} style={{ marginTop: 4, fontSize: 7, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Reset</button>
                  </div>
                </div>
              ) : (
                <div style={{ height: '100%', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, textAlign: 'center', gap: 8 }}>
                  <span style={{ fontSize: 26 }}>💳</span>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#475569' }}>Awaiting Checkout</div>
                  <div style={{ fontSize: 8, color: '#334155', lineHeight: 1.5 }}>Click "Proceed to Pay" on the cart to see your exit QR</div>
                </div>
              )}
            </div>

            {/* Floating badges */}
            {[
              { text: '✓ Secure Payment', style: { top: -22, right: -12 } as React.CSSProperties, delay: '0s' },
              { text: '✓ QR Generated', style: { top: '42%', left: -52 } as React.CSSProperties, delay: '1s' },
              { text: '✓ AI Verification', style: { bottom: 28, right: -22 } as React.CSSProperties, delay: '2s' },
              { text: '✓ Exit Approved', style: { top: -32, left: 16 } as React.CSSProperties, delay: '0.5s' },
            ].map((b, i) => (
              <div key={i} className="badge" style={{ position: 'absolute', ...b.style, background: 'rgba(6,13,26,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(22,196,91,0.25)', padding: '6px 12px', borderRadius: 8, fontSize: 9, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.35)', animationDelay: b.delay }}>
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ──────────────── FEATURE STRIP ──────────────── */}
      <section id="features" style={{ background: '#fff', padding: '0 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9', marginTop: -30, position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {[
              { icon: '⚡', title: 'Instant Verification', desc: 'Real-time socket.io updates for exit gates.' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Multiple payment options with enterprise security.' },
              { icon: '📱', title: 'QR Exit Gate', desc: 'Instant QR code generation and verification.' },
              { icon: '🔄', title: 'Real-time Sync', desc: 'Live updates across all devices and dashboards.' },
              { icon: '🛡️', title: 'Enterprise Grade', desc: 'Scalable, reliable & production ready.' },
            ].map((f, i) => (
              <div key={f.title} style={{ padding: '24px 20px', textAlign: 'left', borderLeft: i > 0 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── HOW IT WORKS ──────────────── */}
      <section id="how" style={{ background: '#fff', padding: '80px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0 }}>How <span style={{ color: '#16C45B' }}>SmartQueue</span> Works</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 8, marginBottom: 56 }}>A simple 4-step process for a smarter shopping experience</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, position: 'relative', alignItems: 'start' }}>

            {/* Arrows between steps */}
            {[1,2,3].map(i => (
              <div key={i} style={{ position: 'absolute', top: 72, left: `${i * 25 - 2}%`, fontSize: 20, color: '#16C45B', fontWeight: 900, zIndex: 5 }}>→</div>
            ))}

            {/* Step 1 */}
            <div style={{ background: '#fff', border: '2px dashed #e2e8f0', borderRadius: 20, padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#16C45B', color: '#fff', fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(22,196,91,0.35)' }}>1</div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Scan Products</h4>
              <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: 0 }}>Open the app and scan product barcodes using your device camera.</p>
              {/* Scanner phone */}
              <div style={{ width: 108, height: 165, background: '#18243a', borderRadius: 22, border: '3px solid #212e45', overflow: 'hidden', marginTop: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
                <div style={{ height: '100%', background: '#0f172a', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ flex: 1, background: '#1e293b', borderRadius: 10, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {['tl','tr','bl','br'].map(p => <div key={p} style={{ position: 'absolute', [p.includes('t') ? 'top' : 'bottom']: 6, [p.includes('l') ? 'left' : 'right']: 6, width: 12, height: 12, borderTop: p.includes('t') ? '2px solid #16C45B' : 'none', borderBottom: p.includes('b') ? '2px solid #16C45B' : 'none', borderLeft: p.includes('l') ? '2px solid #16C45B' : 'none', borderRight: p.includes('r') ? '2px solid #16C45B' : 'none' }} />)}
                    <div className="laser" />
                    <QrCode size={22} style={{ color: 'rgba(22,196,91,0.35)' }} />
                    <div style={{ position: 'absolute', bottom: 5, right: 5, fontSize: 5, background: '#16C45B', color: '#fff', fontWeight: 800, padding: '1px 4px', borderRadius: 3 }}>CAM ON</div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 7, padding: '4px 7px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><div style={{ fontSize: 7, fontWeight: 800, color: '#0f172a' }}>Maggi Noodles</div><div style={{ fontSize: 6, color: '#94a3b8' }}>₹14.00</div></div>
                    <span style={{ fontSize: 8, color: '#16C45B', fontWeight: 900 }}>✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ background: '#fff', border: '2px dashed #e2e8f0', borderRadius: 20, padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#16C45B', color: '#fff', fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(22,196,91,0.35)' }}>2</div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Make Payment</h4>
              <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: 0 }}>Review your cart and make secure payment using UPI, cards or wallets.</p>
              <div style={{ width: 108, height: 165, background: '#18243a', borderRadius: 22, border: '3px solid #212e45', overflow: 'hidden', marginTop: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
                <div style={{ height: '100%', background: '#fff', padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 8, fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 5 }}>Order Checkout</div>
                  <div style={{ fontSize: 7, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}><span>Cart Total</span><span>₹148.00</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16C45B', fontWeight: 700 }}><span>Discount</span><span>-₹10.00</span></div>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', borderRadius: 8, padding: '7px 8px', color: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6, marginBottom: 5 }}><span style={{ fontWeight: 700 }}>SmartPay</span><span>•••• 4820</span></div>
                    <div style={{ fontSize: 7, fontFamily: 'monospace', fontWeight: 700 }}>₹138.00 TOTAL</div>
                  </div>
                  <button style={{ background: '#16C45B', color: '#fff', fontSize: 7, fontWeight: 800, padding: '6px 0', borderRadius: 7, border: 'none', width: '100%', letterSpacing: '0.04em' }}>✓ PAY SECURELY</button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ background: '#fff', border: '2px dashed #e2e8f0', borderRadius: 20, padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#16C45B', color: '#fff', fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(22,196,91,0.35)' }}>3</div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Get QR Code</h4>
              <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: 0 }}>Receive instant QR code after successful payment confirmation.</p>
              <div style={{ width: 108, height: 165, background: '#18243a', borderRadius: 22, border: '3px solid #212e45', overflow: 'hidden', marginTop: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
                <div style={{ height: '100%', background: '#fff', padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, fontWeight: 900, color: '#16C45B' }}>Order Verified ✓</div>
                    <div style={{ fontSize: 7, color: '#94a3b8', marginTop: 2 }}>Exit Ticket Ready</div>
                  </div>
                  <div style={{ width: 68, height: 68, background: '#f8fafc', borderRadius: 10, padding: 6, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={36} style={{ color: '#0f172a' }} />
                    <span style={{ fontSize: 6, fontFamily: 'monospace', fontWeight: 900, marginTop: 3 }}>PASS#SQ01</span>
                  </div>
                  <div style={{ width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 7 }}>
                    <span style={{ color: '#94a3b8' }}>Valid For</span>
                    <span style={{ color: '#16C45B', fontWeight: 800 }}>1 Gate Exit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ background: '#fff', border: '2px dashed #e2e8f0', borderRadius: 20, padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#16C45B', color: '#fff', fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(22,196,91,0.35)' }}>4</div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Exit Seamlessly</h4>
              <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: 0 }}>Show QR code at the exit gate for instant verification and you're good to go!</p>
              <div style={{ width: 140, height: 125, background: '#1e293b', borderRadius: 16, border: '2px solid #2a3755', padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 6 }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: '#94a3b8' }}>Exit Kiosk #01</span>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16C45B', boxShadow: '0 0 8px #16C45B' }} />
                </div>
                <div style={{ background: '#0f172a', borderRadius: 8, padding: '5px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 7, color: '#16C45B', fontFamily: 'monospace', fontWeight: 700 }}>✓ PASS VERIFIED</div>
                  <div style={{ fontSize: 9, color: '#fff', fontWeight: 900, marginTop: 2 }}>GATE OPENING</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <span style={{ fontSize: 22 }}>🚪</span>
                  <span style={{ fontSize: 14, color: '#16C45B', fontWeight: 900 }}>➔</span>
                  <span style={{ fontSize: 22 }}>🚶</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── ACCESS PORTALS ──────────────── */}
      <section id="portals" style={{ background: '#fff', padding: '80px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0 }}>Access <span style={{ color: '#16C45B' }}>SmartQueue</span> Portals</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 8, marginBottom: 48 }}>Choose the portal that matches your role and access the right tools instantly</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {/* Customer */}
            <div style={{ background: '#f8fafc', border: '1px solid #e8f0fb', borderRadius: 20, padding: '32px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', transition: 'all 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fff'; el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; el.style.borderColor = 'rgba(22,196,91,0.3)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#f8fafc'; el.style.boxShadow = 'none'; el.style.borderColor = '#e8f0fb'; }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#dcfce7', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>🛒</div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Customer Portal</h3>
                <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.65, maxWidth: 175, margin: '0 0 24px' }}>Scan products, add to cart, make payments and get exit pass QR.</p>
                <button onClick={() => navigate('/customer/login')} style={{ padding: '12px 20px', background: '#16C45B', color: '#fff', fontWeight: 800, fontSize: 11, borderRadius: 9, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22,196,91,0.25)' }}>
                  Enter Customer Portal →
                </button>
              </div>
              <div style={{ width: 88, height: 160, background: '#1a2235', borderRadius: 20, border: '3px solid #212e45', overflow: 'hidden', flexShrink: 0, marginLeft: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                <div style={{ height: '100%', background: '#fff', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 7, fontWeight: 900, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 4 }}>🛒 My Cart</div>
                  {[{ e: '🥤', n: 'Coca-Cola', p: '₹30' }, { e: '🥔', n: 'Lays', p: '₹20' }, { e: '🥛', n: 'Amul Milk', p: '₹35' }].map(item => (
                    <div key={item.n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '3px 5px', borderRadius: 5, fontSize: 6 }}>
                      <span>{item.e} {item.n}</span><span style={{ fontWeight: 700 }}>{item.p}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 6, fontWeight: 900, color: '#0f172a' }}>
                    <span>Total</span><span>₹85.00</span>
                  </div>
                  <div style={{ background: '#16C45B', color: '#fff', fontSize: 6, fontWeight: 800, padding: '5px 0', borderRadius: 6, textAlign: 'center' }}>PAY NOW</div>
                </div>
              </div>
            </div>

            {/* Worker */}
            <div style={{ background: '#f8fafc', border: '1px solid #e8f0fb', borderRadius: 20, padding: '32px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', transition: 'all 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fff'; el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; el.style.borderColor = 'rgba(22,196,91,0.3)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#f8fafc'; el.style.boxShadow = 'none'; el.style.borderColor = '#e8f0fb'; }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#dbeafe', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>🕵️</div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Worker Portal</h3>
                <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.65, maxWidth: 175, margin: '0 0 24px' }}>Verify customer QR codes, check orders and manage exit gates.</p>
                <button onClick={() => navigate('/worker/login')} style={{ padding: '12px 20px', background: '#0B3D2E', color: '#fff', fontWeight: 800, fontSize: 11, borderRadius: 9, border: 'none', cursor: 'pointer' }}>
                  Enter Worker Portal →
                </button>
              </div>
              <div style={{ width: 88, height: 160, background: '#1a2235', borderRadius: 20, border: '3px solid #212e45', overflow: 'hidden', flexShrink: 0, marginLeft: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                <div style={{ height: '100%', background: '#0f172a', padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <div style={{ fontSize: 7, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 4, width: '100%', textAlign: 'center' }}>Worker Verify</div>
                  <div style={{ width: 52, height: 52, background: '#1e2d47', borderRadius: 8, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="laser" />
                    <QrCode size={24} style={{ color: 'rgba(22,196,91,0.6)' }} />
                  </div>
                  <div style={{ fontSize: 6, color: '#16C45B', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SCAN PASS</div>
                  <div style={{ background: '#16C45B', borderRadius: 5, padding: '3px 8px', fontSize: 6, fontWeight: 800, color: '#fff' }}>VERIFIED ✓</div>
                </div>
              </div>
            </div>

            {/* Admin */}
            <div style={{ background: '#f8fafc', border: '1px solid #e8f0fb', borderRadius: 20, padding: '32px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', transition: 'all 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fff'; el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; el.style.borderColor = 'rgba(22,196,91,0.3)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#f8fafc'; el.style.boxShadow = 'none'; el.style.borderColor = '#e8f0fb'; }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#ede9fe', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>📊</div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Admin Dashboard</h3>
                <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.65, maxWidth: 175, margin: '0 0 24px' }}>Manage products, users, orders, analytics and system operations.</p>
                <button onClick={() => navigate('/admin')} style={{ padding: '12px 20px', background: '#6366f1', color: '#fff', fontWeight: 800, fontSize: 11, borderRadius: 9, border: 'none', cursor: 'pointer' }}>
                  Enter Admin Dashboard →
                </button>
              </div>
              {/* Analytics laptop mockup */}
              <div style={{ flexShrink: 0, marginLeft: 16 }}>
                <div style={{ width: 130, height: 85, background: '#1e293b', borderRadius: 10, border: '2px solid #2a3755', padding: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: 6, fontWeight: 800, color: '#16C45B', marginBottom: 4 }}>📊 Analytics</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 34, marginBottom: 4 }}>
                    {[55, 75, 45, 85, 65, 90, 70].map((h, i) => (
                      <div key={i} style={{ flex: 1, background: i === 5 ? '#16C45B' : 'rgba(22,196,91,0.3)', borderRadius: 2, height: `${h}%`, transition: 'all 0.3s' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6, color: '#64748b' }}>
                    <span>₹12,450 Today</span>
                    <span style={{ color: '#16C45B', fontWeight: 700 }}>↑ 8.2%</span>
                  </div>
                </div>
                <div style={{ width: 130, height: 5, background: '#162032', borderRadius: '0 0 5px 5px', margin: '0 auto' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── STATISTICS ──────────────── */}
      <section style={{ background: '#0b1120', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, textAlign: 'center' }}>
          {[
            { icon: '🛒', num: '10,000+', label: 'Orders Processed' },
            { icon: '🏪', num: '500+', label: 'Stores Connected' },
            { icon: '👥', num: '50,000+', label: 'Happy Customers' },
            { icon: '🛡️', num: '99.99%', label: 'System Uptime' },
            { icon: '⚡', num: '< 500ms', label: 'Real-time Sync' },
            { icon: '🎧', num: '24/7', label: 'Support Available' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#16C45B', letterSpacing: '-0.5px' }}>{s.num}</div>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── WHY CHOOSE + TESTIMONIALS ──────────────── */}
      <section id="why" style={{ background: '#fff', padding: '80px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: '0 0 28px' }}>Why Choose <span style={{ color: '#16C45B' }}>SmartQueue</span>?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {['Reduce long billing queues', 'Improve customer experience', 'Secure & contact-less payments', 'Real-time verification & sync', 'Easy to use and integrate', 'Suitable for businesses of all sizes'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#dcfce7', color: '#16C45B', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 18, overflow: 'hidden', position: 'relative', cursor: 'pointer', height: 185 }}>
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop&q=80" alt="Supermarket" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#16C45B', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>▶</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>See SmartQueue in Action</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>01 / 03</div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 24px' }}>Loved by Retailers</h3>
            {testimonials.map((t, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 18, padding: '26px 24px', marginBottom: idx < testimonials.length - 1 ? 18 : 0, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 52, color: 'rgba(22,196,91,0.1)', position: 'absolute', top: 4, left: 14, fontFamily: 'Georgia,serif', lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 18, marginTop: 6 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={t.avatar} alt={t.author} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{t.author}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 6, marginTop: 16, justifyContent: 'center' }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 22 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? '#16C45B' : '#e2e8f0', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── BRAND LOGOS ──────────────── */}
      <section style={{ background: '#fff', padding: '48px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 28 }}>Trusted by Leading Retailers</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44, flexWrap: 'wrap' }}>
            {[{ i: '🍏', n: 'FreshMart' }, { i: '🛒', n: 'DailyNeeds' }, { i: '💎', n: 'ValuePlus' }, { i: '🌾', n: 'GreenBasket' }, { i: '🏬', n: 'UrbanStore' }, { i: '⚡', n: 'QuickBuy' }, { i: '📦', n: 'MegaMart' }].map(b => (
              <span key={b.n} style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#16C45B'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}>
                {b.i} {b.n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── FOOTER ──────────────── */}
      <footer style={{ background: '#0b1120', padding: '56px 24px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1.6fr', gap: 48, paddingBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: '#16C45B', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛒</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>SmartQueue</div>
                <div style={{ fontSize: 8, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Enterprise</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, maxWidth: 240 }}>AI-powered self-checkout ecosystem that makes retail smarter, faster and queue-free.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              {['f', 't', 'in', 'yt', '📷'].map((s, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#64748b', cursor: 'pointer', fontWeight: 700 }}>{s}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Platform</div>
            {['Features', 'How It Works', 'Solutions', 'Security'].map(l => <a key={l} href="#" style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 500 }} onMouseEnter={e => (e.target as HTMLElement).style.color = '#16C45B'} onMouseLeave={e => (e.target as HTMLElement).style.color = '#64748b'}>{l}</a>)}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Resources</div>
            {['User Guide', 'FAQs', 'Blog', 'Help Center'].map(l => <a key={l} href="#" style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 500 }} onMouseEnter={e => (e.target as HTMLElement).style.color = '#16C45B'} onMouseLeave={e => (e.target as HTMLElement).style.color = '#64748b'}>{l}</a>)}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Stay Updated</div>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 14 }}>Enter your email to get the latest updates and product news.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="Enter your email" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
              <button style={{ background: '#16C45B', color: '#fff', fontWeight: 800, fontSize: 11, padding: '9px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe</button>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <span style={{ fontSize: 11, color: '#334155' }}>© 2024 SmartQueue Enterprise. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service'].map(l => <a key={l} href="#" style={{ fontSize: 11, color: '#334155' }}>{l}</a>)}
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ width: 36, height: 36, borderRadius: '50%', background: '#16C45B', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 900, boxShadow: '0 4px 12px rgba(22,196,91,0.35)', position: 'absolute', right: 0, top: -18 }}>↑</button>
        </div>
      </footer>
    </div>
  );
}
