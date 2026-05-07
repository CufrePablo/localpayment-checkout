import React, { useState } from 'react'
import StripeCheckout, { Product } from './StripeCheckout'
import { themes } from './themes'

// ─── Product ──────────────────────────────────────────────────────────────────

const PRODUCT: Product = {
  name: 'Nike Air Max TN Plus',
  seller: 'Nike',
  price: 129.99,
  currency: 'USD',
  originalPrice: 179.99,
  gradient: 'linear-gradient(135deg, #111 0%, #2c2c2c 100%)',
}

// ─── Pins ──────────────────────────────────────────────────────────────────────

type Pin =
  | { id: number; isAd?: false; h: number; img: string; label?: string; author: string; saves: string }
  | { id: number; isAd: true;  h: number; img: string; label: string;  author: string; saves: string; cta: string }

const PINS: Pin[] = [
  {
    id: 1, h: 295,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=295&fit=crop&q=80',
    label: 'Seiko Presage Automatic',
    author: 'WatchFam', saves: '14.2k',
  },
  {
    id: 2, h: 200,
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=200&fit=crop&q=80',
    author: 'SetupInspo', saves: '8.7k',
  },
  {
    id: 3, h: 235,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=235&fit=crop&q=80',
    author: 'SneakerHead', saves: '21.4k',
  },
  // AD PIN ↓
  {
    id: 4, isAd: true, h: 215,
    img: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=215&fit=crop&q=80',
    label: 'Nike Air Max TN Plus · USD $129.99',
    author: 'Nike', saves: '—', cta: 'Buy',
  },
  {
    id: 5, h: 285,
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=285&fit=crop&q=80',
    author: 'Outfits', saves: '9.4k',
  },
  {
    id: 6, h: 210,
    img: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&h=210&fit=crop&q=80',
    label: 'Street layering 2025',
    author: 'UrbanCuts', saves: '5.1k',
  },
  {
    id: 7, h: 255,
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=255&fit=crop&q=80',
    author: 'InteriorGoals', saves: '3.3k',
  },
  {
    id: 8, h: 195,
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=195&fit=crop&q=80',
    label: 'Clean casual fits',
    author: 'StyleGrid', saves: '6.8k',
  },
  {
    id: 9, h: 250,
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=250&fit=crop&q=80',
    author: 'KicksCulture', saves: '18.6k',
  },
  {
    id: 10, h: 220,
    img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=220&fit=crop&q=80',
    author: 'MinimalDrip', saves: '2.9k',
  },
]

// ─── Pinterest Header ─────────────────────────────────────────────────────────

function PinterestHeader() {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#000' }}>

      {/* Status bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 18px 0',
        fontSize: 12, fontFamily: 'DM Sans', color: '#fff', fontWeight: 600,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
            <rect x="0" y="4" width="3" height="7" rx="1" />
            <rect x="4" y="2.5" width="3" height="8.5" rx="1" />
            <rect x="8" y="1" width="3" height="10" rx="1" />
            <rect x="12" y="0" width="3" height="11" rx="1" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 3C10.5 3 12.7 4.1 14.2 5.9L15.5 4.5C13.6 2.3 11 1 8 1C5 1 2.4 2.3.5 4.5L1.8 5.9C3.3 4.1 5.5 3 8 3Z" fill="white"/>
            <path d="M8 6C9.7 6 11.2 6.7 12.3 7.8L13.6 6.4C12.2 5 10.2 4 8 4C5.8 4 3.8 5 2.4 6.4L3.7 7.8C4.8 6.7 6.3 6 8 6Z" fill="white"/>
            <path d="M8 9C9 9 9.8 9.4 10.4 10L8 12.5L5.6 10C6.2 9.4 7 9 8 9Z" fill="white"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0" y="1" width="22" height="10" rx="3" stroke="white" strokeWidth="1.2"/>
            <rect x="1.5" y="2.5" width="14" height="7" rx="1.5" fill="white"/>
            <path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* "For you" row — matches reference layout */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        padding: '14px 16px 12px',
      }}>
        {/* Title + underline accent */}
        <div>
          <h1 style={{
            fontFamily: 'DM Sans', fontSize: 26, fontWeight: 800,
            color: '#fff', letterSpacing: '-0.02em', lineHeight: 1,
          }}>
            For you
          </h1>
          <div style={{ height: 3, width: '100%', background: '#fff', borderRadius: 2, marginTop: 5 }} />
        </div>

        {/* Sparkle / ideas button — reference shows a rounded square icon top-right */}
        <button style={{
          width: 40, height: 40, borderRadius: 12,
          background: '#1e1e1e', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

function BottomNav() {
  return (
    <div style={{
      position: 'sticky', bottom: 0, background: '#000',
      borderTop: '1px solid #111',
      display: 'flex', alignItems: 'center', padding: '6px 0 22px',
    }}>
      {/* Home — active */}
      <button style={navBtn(true)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
          <path d="M9 21V12h6v9" fill="#000"/>
        </svg>
        <span style={navLabel(true)}>Home</span>
      </button>

      {/* Search */}
      <button style={navBtn(false)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <span style={navLabel(false)}>Search</span>
      </button>

      {/* Create — center plus */}
      <button style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
        <div style={{
          width: 42, height: 28, borderRadius: 8,
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
      </button>

      {/* Messages */}
      <button style={navBtn(false)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span style={navLabel(false)}>Messages</span>
      </button>

      {/* Profile */}
      <button style={navBtn(false)}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'linear-gradient(135deg, #e85d04, #d62828)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'DM Sans',
        }}>P</div>
        <span style={navLabel(false)}>Profile</span>
      </button>
    </div>
  )
}

const navBtn = (active: boolean): React.CSSProperties => ({
  flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0',
  color: active ? '#fff' : 'rgba(255,255,255,.4)',
})

const navLabel = (active: boolean): React.CSSProperties => ({
  fontFamily: 'DM Sans', fontSize: 10,
  color: active ? '#fff' : 'rgba(255,255,255,.4)', fontWeight: active ? 600 : 400,
})

// ─── TikTok ───────────────────────────────────────────────────────────────────

function TikTokHeader() {
  return (
    <div style={{ background: '#000', padding: '32px 16px 0' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, fontFamily: 'DM Sans', color: 'white', fontWeight: 600, marginBottom: 12,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 5 }}><span>●●●</span><span>WiFi</span><span>🔋</span></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingBottom: 14 }}>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Following', 'For You', 'LIVE'].map((l, i) => (
            <span key={l} style={{
              fontFamily: 'DM Sans', fontSize: 15,
              fontWeight: i === 1 ? 700 : 400,
              color: i === 1 ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>{l}</span>
          ))}
        </div>
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', right: 0 }}>
          <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.5" />
          <path d="M10.5 10.5L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

function TikTokFeed({ onBuy }: { onBuy: () => void }) {
  return (
    <div style={{ flex: 1, background: '#000', position: 'relative', overflow: 'hidden', minHeight: 400 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
        }}>▶️</div>
      </div>
      <div style={{ position: 'absolute', right: 12, bottom: 80, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        {[{ icon: '❤️', c: '234K' }, { icon: '💬', c: '4.2K' }, { icon: '🔁', c: '12K' }, { icon: '↗️', c: 'Share' }].map(({ icon, c }) => (
          <div key={c} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28 }}>{icon}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'white', marginTop: 2 }}>{c}</div>
          </div>
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 60, padding: '16px 14px 20px',
        background: 'linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#111,#333)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👟</div>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'white', fontWeight: 600 }}>Nike</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.6)' }}>Ad</div>
          </div>
        </div>
        <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'white', marginBottom: 12 }}>
          🔥 Nike Air Max TN Plus — limited restock 👟
        </p>
        <button onClick={onBuy} style={{
          padding: '10px 20px', background: '#FE2C55', color: 'white',
          border: 'none', borderRadius: 24, fontFamily: 'DM Sans',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>🛒 Buy · USD $129.99</button>
      </div>
    </div>
  )
}

// ─── Pin Card ─────────────────────────────────────────────────────────────────

function PinCard({ pin, onBuy }: { pin: Pin; onBuy: () => void }) {
  const [saved, setSaved] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ breakInside: 'avoid', marginBottom: 6, cursor: 'pointer', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (pin.isAd) onBuy() }}
    >
      {/* Image wrapper */}
      <div style={{
        borderRadius: 14, overflow: 'hidden', position: 'relative',
        boxShadow: pin.isAd
          ? '0 0 0 2px #E60023, 0 6px 24px rgba(230,0,35,.22)'
          : 'none',
      }}>
        <img
          src={pin.img}
          alt={pin.label ?? ''}
          loading="lazy"
          style={{
            display: 'block', width: '100%', height: pin.h, objectFit: 'cover',
            borderRadius: 14, transition: 'filter .18s',
            filter: hovered ? 'brightness(.86)' : 'brightness(1)',
          }}
        />

        {/* Hover actions — desktop only */}
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 14,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
            padding: 8, gap: 6,
          }}>
            {pin.isAd ? (
              <button
                onClick={e => { e.stopPropagation(); onBuy() }}
                style={{
                  padding: '7px 16px', borderRadius: 20, border: 'none',
                  background: '#E60023', color: '#fff', fontFamily: 'DM Sans',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(230,0,35,.45)',
                }}>
                Buy
              </button>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); setSaved(!saved) }}
                style={{
                  padding: '7px 16px', borderRadius: 20, border: 'none',
                  background: '#E60023', color: '#fff', fontFamily: 'DM Sans',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(230,0,35,.4)',
                }}>
                {saved ? '✓ Saved' : 'Save'}
              </button>
            )}
            <button
              onClick={e => e.stopPropagation()}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,.92)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,.2)',
              }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#111">
                <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
              </svg>
            </button>
          </div>
        )}

        {/* Ad overlays */}
        {pin.isAd && (
          <>
            {/* Sponsored pill — top-left */}
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: 'rgba(0,0,0,.62)', backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              borderRadius: 20, padding: '3px 10px',
              border: '1px solid rgba(255,255,255,.12)',
            }}>
              <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.88)', fontWeight: 500, letterSpacing: '.03em' }}>
                Sponsored
              </span>
            </div>

            {/* Price pill — bottom-left */}
            <div style={{
              position: 'absolute', bottom: 10, left: 10,
              background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              borderRadius: 20, padding: '5px 10px',
              boxShadow: '0 2px 8px rgba(0,0,0,.25)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M3 3h2l.4 2M7 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1-10H5.4L4 9h9l1-6z" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: 'DM Sans', fontSize: 11.5, color: '#111', fontWeight: 700 }}>
                USD $129.99
              </span>
            </div>
          </>
        )}

        {/* "..." button on non-ad pins — overlaid bottom-right */}
        {!pin.isAd && !hovered && (
          <button
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', bottom: 8, right: 8,
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0,0,0,.48)', backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <svg width="14" height="4" viewBox="0 0 14 4" fill="rgba(255,255,255,.85)">
              <circle cx="2" cy="2" r="1.5"/>
              <circle cx="7" cy="2" r="1.5"/>
              <circle cx="12" cy="2" r="1.5"/>
            </svg>
          </button>
        )}
      </div>

      {/* Caption — only for pins with a label */}
      {pin.label && (
        <div style={{ padding: '6px 4px 4px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
          <p style={{
            fontFamily: 'DM Sans', fontSize: 12.5,
            fontWeight: pin.isAd ? 600 : 400,
            color: pin.isAd ? '#fff' : 'rgba(255,255,255,.7)',
            lineHeight: 1.35, flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{pin.label}</p>
          {pin.isAd ? (
            <button
              onClick={e => { e.stopPropagation(); onBuy() }}
              style={{
                flexShrink: 0, padding: '5px 14px', borderRadius: 20, border: 'none',
                background: '#E60023', color: '#fff',
                fontFamily: 'DM Sans', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(230,0,35,.35)',
                letterSpacing: '.02em',
              }}>
              Buy
            </button>
          ) : (
            <button
              onClick={e => e.stopPropagation()}
              style={{
                flexShrink: 0, padding: 4, border: 'none', background: 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
              }}>
              <svg width="14" height="4" viewBox="0 0 14 4" fill="rgba(255,255,255,.4)">
                <circle cx="2" cy="2" r="1.5"/>
                <circle cx="7" cy="2" r="1.5"/>
                <circle cx="12" cy="2" r="1.5"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

type ThemeKey = 'pinterest' | 'tiktok' | 'instagram'

export default function App() {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [themeKey, setThemeKey] = useState<ThemeKey>('pinterest')
  const theme = themes[themeKey]
  const isTikTok = themeKey === 'tiktok'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 0',
      gap: 16,
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Demo label */}
      <div style={{
        textAlign: 'center', color: 'rgba(255,255,255,.4)',
        fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase',
        fontFamily: 'DM Sans',
      }}>
        LocalPayment · Whitelabel Checkout Demo
      </div>

      {/* Theme switcher */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'rgba(255,255,255,.07)', borderRadius: 28, padding: 4,
        border: '1px solid rgba(255,255,255,.1)',
      }}>
        {(['pinterest', 'tiktok', 'instagram'] as ThemeKey[]).map(key => (
          <button key={key} onClick={() => setThemeKey(key)} style={{
            padding: '7px 20px', borderRadius: 24, border: 'none',
            background: themeKey === key ? '#fff' : 'transparent',
            color: themeKey === key ? '#111' : 'rgba(255,255,255,.5)',
            fontFamily: 'DM Sans', fontSize: 13,
            fontWeight: themeKey === key ? 600 : 400,
            cursor: 'pointer', transition: 'all .2s', textTransform: 'capitalize',
          }}>{key}</button>
        ))}
      </div>

      {/* Phone frame */}
      <div style={{
        width: 390, maxWidth: '100vw', height: 800,
        background: themeKey === 'instagram' ? '#fff' : '#000',
        borderRadius: 48,
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,.7), 0 0 0 1.5px rgba(255,255,255,.12), inset 0 0 0 1px rgba(0,0,0,.5)',
        position: 'relative', display: 'flex', flexDirection: 'column',
      }}>
        {/* Dynamic island / notch */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 34, background: '#000',
          borderRadius: '0 0 20px 20px', zIndex: 100,
        }} />

        {isTikTok ? (
          <>
            <TikTokHeader />
            <TikTokFeed onBuy={() => setCheckoutOpen(true)} />
            <div style={{ background: '#000', display: 'flex', padding: '8px 0 24px', borderTop: '1px solid #1a1a1a' }}>
              {[
                { icon: '🏠', label: 'Home' },
                { icon: '🔍', label: 'Search' },
                { icon: '➕', label: '' },
                { icon: '📩', label: 'Inbox' },
                { icon: '👤', label: 'Profile' },
              ].map(({ icon, label }, i) => (
                <button key={i} style={{
                  flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                }}>
                  {i === 2 ? (
                    <div style={{
                      width: 40, height: 28, borderRadius: 6,
                      background: 'linear-gradient(90deg, #69C9D0 0%, #FE2C55 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, color: 'white',
                    }}>+</div>
                  ) : (
                    <span style={{ fontSize: 22 }}>{icon}</span>
                  )}
                  {label && (
                    <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.6)' }}>{label}</span>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <PinterestHeader />

            {/* Masonry feed */}
            <div style={{
              flex: 1, overflowY: 'auto', overflowX: 'hidden',
              padding: '4px 6px 0',
              columns: 2, columnGap: 6,
              background: '#000',
              WebkitOverflowScrolling: 'touch',
            } as React.CSSProperties}>
              {PINS.map(pin => (
                <PinCard key={pin.id} pin={pin} onBuy={() => setCheckoutOpen(true)} />
              ))}
            </div>

            <BottomNav />
          </>
        )}

        {/* Checkout sheet — inside phone */}
        <StripeCheckout
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          product={PRODUCT}
          theme={theme}
        />
      </div>

      <p style={{
        fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,.22)',
        textAlign: 'center', maxWidth: 300,
      }}>
        Click the sponsored pin to open checkout
      </p>
    </div>
  )
}
