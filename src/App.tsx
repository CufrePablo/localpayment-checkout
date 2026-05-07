import React, { useState } from 'react'
import StripeCheckout, { Product } from './StripeCheckout'
import { themes } from './themes'

// ─── Product ──────────────────────────────────────────────────────────────────

const PRODUCT: Product = {
  name: 'Macramé Wall Hanging Boho',
  seller: 'CasaBohem',
  price: 49.99,
  currency: 'USD',
  originalPrice: 89.99,
  gradient: 'linear-gradient(135deg, #fddde6 0%, #fce4c8 100%)',
  emoji: '🧶',
}

// ─── Pins data ────────────────────────────────────────────────────────────────

type Pin =
  | { id: number; isAd?: false; h: number; img: string; label: string; author: string; saves: string }
  | { id: number; isAd: true; h: number; img: string; label: string; author: string; saves: string; cta: string }

// 10 pins: 9 normal + 1 ad (index 3)
// Using picsum with seeds → always returns the same photo
const PINS: Pin[] = [
  { id: 1,  h: 190, img: 'https://picsum.photos/seed/casa01/280/190', label: 'Cottagecore living room inspo',    author: 'Homify',       saves: '4.1k' },
  { id: 2,  h: 250, img: 'https://picsum.photos/seed/casa02/280/250', label: 'Plant shelfie — monstera goals',  author: 'The Sill',     saves: '7.2k' },
  { id: 3,  h: 170, img: 'https://picsum.photos/seed/casa03/280/170', label: 'Minimal kitchen redesign',        author: 'Dezeen',       saves: '2.9k' },
  // AD PIN ↓
  {
    id: 4,
    isAd: true,
    h: 210,
    img: 'https://picsum.photos/seed/casaad/280/210',
    label: 'Macramé Wall Hanging Boho · USD $49.99',
    author: 'CasaBohem',
    saves: '—',
    cta: 'Comprar',
  },
  { id: 5,  h: 290, img: 'https://picsum.photos/seed/casa05/280/290', label: 'Nursery inspo — soft pastels',    author: 'Nursery Works', saves: '9.4k' },
  { id: 6,  h: 220, img: 'https://picsum.photos/seed/casa06/280/220', label: 'Rattan & wicker summer vibes',    author: 'CB2',          saves: '1.8k' },
  { id: 7,  h: 180, img: 'https://picsum.photos/seed/casa07/280/180', label: 'Gallery wall · 12 frames',        author: 'West Elm',     saves: '5.5k' },
  { id: 8,  h: 260, img: 'https://picsum.photos/seed/casa08/280/260', label: 'Spring bedroom refresh',          author: 'Anthropologie', saves: '3.3k' },
  { id: 9,  h: 200, img: 'https://picsum.photos/seed/casa09/280/200', label: 'Urban jungle · 30+ plants',       author: 'Bloomscape',   saves: '6.7k' },
  { id: 10, h: 240, img: 'https://picsum.photos/seed/casa10/280/240', label: 'Boho dining — warm textures',     author: 'Pottery Barn', saves: '2.1k' },
]

// ─── Header ───────────────────────────────────────────────────────────────────

function PinterestHeader() {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: '#000',
    }}>
      {/* Status bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '10px 16px 4px',
        fontSize: 12, fontFamily: 'DM Sans', color: '#fff', fontWeight: 600,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
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

      {/* Nav row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 12px 8px', gap: 10 }}>
        {/* Pinterest logo */}
        <svg width="30" height="30" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="12" fill="white" />
          <path
            fillRule="evenodd"
            fill="#E60023"
            d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.218-.176.265-.408.159-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"
          />
        </svg>

        {/* Search bar */}
        <div style={{
          flex: 1, background: '#1c1c1c', borderRadius: 24,
          padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#666" strokeWidth="1.6" />
            <path d="M10.5 10.5L13 13" stroke="#666" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: 'DM Sans', fontSize: 13.5, color: '#666' }}>
            Buscar ideas de decoración
          </span>
        </div>

        {/* Bell */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
      </div>

      {/* Category pills */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 12px 10px',
        overflowX: 'auto', scrollbarWidth: 'none',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        WebkitOverflowScrolling: 'touch',
      }}>
        {['Todo', 'Casa', 'Moda', 'Comida', 'DIY', 'Viajes', 'Arte', 'Plantas'].map((cat, i) => (
          <button key={cat} style={{
            flexShrink: 0, padding: '6px 15px', borderRadius: 20, border: 'none',
            background: i === 0 ? '#fff' : '#1c1c1c',
            color: i === 0 ? '#000' : '#bbb',
            fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{cat}</button>
        ))}
      </div>
    </div>
  )
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

function BottomNav() {
  const items = [
    { label: 'Inicio', active: true, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg> },
    { label: 'Buscar', active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg> },
    { label: 'Crear', active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg> },
    { label: 'Alertas', active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> },
    { label: 'Perfil', active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
  ]

  return (
    <div style={{
      position: 'sticky', bottom: 0, background: '#000',
      borderTop: '1px solid #1a1a1a',
      display: 'flex', padding: '6px 0 22px',
    }}>
      {items.map(({ label, active, icon }) => (
        <button key={label} style={{
          flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0',
          color: active ? '#fff' : 'rgba(255,255,255,0.35)',
        }}>
          <span style={{ opacity: active ? 1 : 0.5 }}>{icon}</span>
          <span style={{
            fontFamily: 'DM Sans', fontSize: 10,
            color: active ? '#fff' : 'rgba(255,255,255,0.35)', fontWeight: active ? 600 : 400,
          }}>{label}</span>
        </button>
      ))}
    </div>
  )
}

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
          {['Siguiendo', 'Para ti', 'LIVE'].map((l, i) => (
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
      {/* Side actions */}
      <div style={{ position: 'absolute', right: 12, bottom: 80, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        {[{ icon: '❤️', c: '234K' }, { icon: '💬', c: '4.2K' }, { icon: '🔁', c: '12K' }, { icon: '↗️', c: 'Share' }].map(({ icon, c }) => (
          <div key={c} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28 }}>{icon}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'white', marginTop: 2 }}>{c}</div>
          </div>
        ))}
      </div>
      {/* Overlay CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 60, padding: '16px 14px 20px',
        background: 'linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#fddde6,#fce4c8)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛍️</div>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'white', fontWeight: 600 }}>CasaBohem</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.6)' }}>Publicidad</div>
          </div>
        </div>
        <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'white', marginBottom: 12 }}>
          ✨ {PRODUCT.name} — handmade con amor 🧶
        </p>
        <button onClick={onBuy} style={{
          padding: '10px 20px', background: '#FE2C55', color: 'white',
          border: 'none', borderRadius: 24, fontFamily: 'DM Sans',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>🛒 Comprar · USD $49.99</button>
      </div>
    </div>
  )
}

// ─── Pin Card ─────────────────────────────────────────────────────────────────

function PinCard({ pin, onBuy }: { pin: Pin; onBuy: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <div
      style={{ breakInside: 'avoid', marginBottom: 10, cursor: 'pointer', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (pin.isAd) onBuy() }}
    >
      {/* Image */}
      <div style={{
        borderRadius: 16, overflow: 'hidden', position: 'relative',
        boxShadow: pin.isAd ? '0 0 0 2px #E60023, 0 4px 20px rgba(230,0,35,.25)' : 'none',
      }}>
        <img
          src={pin.img}
          alt={pin.label}
          style={{
            display: 'block', width: '100%', height: pin.h, objectFit: 'cover',
            borderRadius: 16, transition: 'filter .2s',
            filter: hovered ? 'brightness(.88)' : 'brightness(1)',
          }}
        />

        {/* Hover overlay */}
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
            padding: 10, gap: 6,
          }}>
            {pin.isAd && (
              <button
                onClick={e => { e.stopPropagation(); onBuy() }}
                style={{
                  padding: '7px 15px', borderRadius: 20, border: 'none',
                  background: '#fff', color: '#111', fontFamily: 'DM Sans',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.2)',
                }}>
                {pin.cta}
              </button>
            )}
            <button
              onClick={e => { e.stopPropagation(); setSaved(!saved) }}
              style={{
                padding: '7px 15px', borderRadius: 20, border: 'none',
                background: saved ? '#E60023' : '#E60023',
                color: '#fff', fontFamily: 'DM Sans',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(230,0,35,.4)',
              }}>
              {saved ? '✓ Guardado' : 'Guardar'}
            </button>
            <button
              onClick={e => e.stopPropagation()}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                background: '#fff', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,.15)',
              }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#111">
                <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" />
              </svg>
            </button>
          </div>
        )}

        {/* Sponsored badge + price pill */}
        {pin.isAd && (
          <>
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              borderRadius: 20, padding: '3px 9px',
              border: '1px solid rgba(255,255,255,.12)',
            }}>
              <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.85)', fontWeight: 500, letterSpacing: '.02em' }}>
                Sponsored
              </span>
            </div>
            <div style={{
              position: 'absolute', bottom: 10, left: 10,
              background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              borderRadius: 20, padding: '4px 10px',
              boxShadow: '0 2px 8px rgba(0,0,0,.2)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M3 3h2l.4 2M7 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1-10H5.4L4 9h9l1-6z" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#111', fontWeight: 700 }}>
                USD $49.99
              </span>
            </div>
          </>
        )}
      </div>

      {/* Caption */}
      <div style={{ padding: '6px 4px 8px' }}>
        <p style={{
          fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: pin.isAd ? 600 : 400,
          color: '#fff', lineHeight: 1.35,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{pin.label}</p>
        {pin.isAd && (
          <button
            onClick={onBuy}
            style={{
              marginTop: 7, padding: '6px 16px', borderRadius: 20, border: 'none',
              background: '#E60023', color: '#fff',
              fontFamily: 'DM Sans', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(230,0,35,.35)',
              letterSpacing: '.02em',
            }}>
            {pin.cta}
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: pin.isAd
                ? 'linear-gradient(135deg, #fddde6, #fce4c8)'
                : `hsl(${pin.id * 37 % 360},55%,55%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: pin.isAd ? 9 : 8, fontWeight: 700, color: '#fff',
              flexShrink: 0,
            }}>{pin.isAd ? '🧶' : pin.author[0]}</div>
            <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#888' }}>
              {pin.author}
            </span>
          </div>
          {!pin.isAd && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#666' }}>{pin.saves}</span>
            </div>
          )}
        </div>
      </div>
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
      {/* Label */}
      <div style={{
        textAlign: 'center', color: 'rgba(255,255,255,.45)',
        fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase',
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
        {/* Notch */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 128, height: 34, background: '#000',
          borderRadius: '0 0 20px 20px', zIndex: 100,
        }} />

        {isTikTok ? (
          <>
            <TikTokHeader />
            <TikTokFeed onBuy={() => setCheckoutOpen(true)} />
            {/* TikTok bottom nav */}
            <div style={{ background: '#000', display: 'flex', padding: '8px 0 24px', borderTop: '1px solid #222' }}>
              {[
                { icon: '🏠', label: 'Inicio' },
                { icon: '🔍', label: 'Buscar' },
                { icon: '➕', label: '' },
                { icon: '📩', label: 'Inbox' },
                { icon: '👤', label: 'Perfil' },
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

            {/* Masonry feed — 10 pins */}
            <div style={{
              flex: 1, overflowY: 'auto', overflowX: 'hidden',
              padding: '10px 10px 0',
              columns: 2, columnGap: 10,
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

        {/* Checkout — inside phone frame so it stays within the mobile viewport */}
        <StripeCheckout
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          product={PRODUCT}
          theme={theme}
        />
      </div>

      <p style={{
        fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,.25)',
        textAlign: 'center', maxWidth: 300,
      }}>
        Clickeá el pin patrocinado para abrir el checkout
      </p>
    </div>
  )
}
