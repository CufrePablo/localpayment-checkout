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

function TikTokAnimations() {
  return (
    <style>{`
      @keyframes kenBurns {
        0%   { transform: scale(1.00) translate(0%,   0%); }
        100% { transform: scale(1.14) translate(-3%, -2%); }
      }
      @keyframes ttSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes ttTicker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes ttTagPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(254,44,85,.55); }
        50%       { box-shadow: 0 0 0 6px rgba(254,44,85,.0); }
      }
      @keyframes ttTagDot {
        0%, 100% { transform: scale(1); }
        50%       { transform: scale(1.35); }
      }
    `}</style>
  )
}

function TikTokView({ onBuy }: { onBuy: () => void }) {
  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
      <TikTokAnimations />

      {/* Full-bleed Nike sneaker "video" */}
      <img
        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1400&fit=crop&q=90"
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', transformOrigin: 'center',
          animation: 'kenBurns 10s ease-out infinite alternate',
        }}
      />

      {/* Top-to-bottom gradient: dark top overlay + dark bottom scrim */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,.58) 0%, transparent 22%, transparent 50%, rgba(0,0,0,.72) 78%, rgba(0,0,0,.92) 100%)',
      }} />

      {/* ── FLOATING PRODUCT TAG (TikTok Shop pin) ── */}
      <div onClick={onBuy} style={{
        position: 'absolute', top: '38%', left: 18, zIndex: 20, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 0,
      }}>
        {/* pulsing dot anchor */}
        <div style={{
          width: 10, height: 10, borderRadius: '50%', background: '#FE2C55', flexShrink: 0,
          animation: 'ttTagDot 1.8s ease-in-out infinite',
          boxShadow: '0 0 0 3px rgba(254,44,85,.25)',
        }} />
        {/* connecting line */}
        <div style={{ width: 14, height: 1.5, background: 'rgba(255,255,255,.7)' }} />
        {/* tag bubble */}
        <div style={{
          background: 'rgba(10,10,10,.82)', backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: 10, padding: '7px 10px',
          border: '1px solid rgba(255,255,255,.14)',
          animation: 'ttTagPulse 2s ease-in-out infinite',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6, overflow: 'hidden',
            background: '#000', border: '1px solid rgba(255,255,255,.1)', flexShrink: 0,
          }}>
            <img src={`${import.meta.env.BASE_URL}nike-logo.png`} alt="Nike"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              Air Max TN Plus
            </div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#FE2C55', fontWeight: 700, marginTop: 1 }}>
              $129.99
            </div>
          </div>
          <div style={{
            background: '#FE2C55', borderRadius: 5, padding: '3px 8px', flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'DM Sans', fontSize: 9.5, fontWeight: 700, color: '#fff' }}>BUY</span>
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{
        position: 'absolute', top: 10, left: 18, right: 18, zIndex: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'DM Sans', fontSize: 12, color: '#fff', fontWeight: 600,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="white"><rect x="0" y="4" width="3" height="7" rx="1"/><rect x="4" y="2.5" width="3" height="8.5" rx="1"/><rect x="8" y="1" width="3" height="10" rx="1"/><rect x="12" y="0" width="3" height="11" rx="1"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 3C10.5 3 12.7 4.1 14.2 5.9L15.5 4.5C13.6 2.3 11 1 8 1C5 1 2.4 2.3.5 4.5L1.8 5.9C3.3 4.1 5.5 3 8 3Z" fill="white"/><path d="M8 6C9.7 6 11.2 6.7 12.3 7.8L13.6 6.4C12.2 5 10.2 4 8 4C5.8 4 3.8 5 2.4 6.4L3.7 7.8C4.8 6.7 6.3 6 8 6Z" fill="white"/><path d="M8 9C9 9 9.8 9.4 10.4 10L8 12.5L5.6 10C6.2 9.4 7 9 8 9Z" fill="white"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0" y="1" width="22" height="10" rx="3" stroke="white" strokeWidth="1.2"/><rect x="1.5" y="2.5" width="14" height="7" rx="1.5" fill="white"/><path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6C24.5 5.5 23.8 4.8 23 4.5Z" fill="white"/></svg>
        </div>
      </div>

      {/* ── HEADER TABS ── */}
      <div style={{
        position: 'absolute', top: 36, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 52px',
      }}>
        <div style={{
          position: 'absolute', left: 14,
          background: '#FE2C55', borderRadius: 4, padding: '3px 7px',
          fontFamily: 'DM Sans', fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '.06em',
        }}>LIVE</div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
          {(['Explore', 'Following', 'For You'] as const).map(label => {
            const active = label === 'For You'
            return (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{
                  fontFamily: 'DM Sans', fontSize: active ? 16 : 14,
                  fontWeight: active ? 700 : 400,
                  color: active ? '#fff' : 'rgba(255,255,255,.48)',
                  textShadow: '0 1px 6px rgba(0,0,0,.6)',
                }}>{label}</span>
                {active && <div style={{ height: 2, width: 34, background: '#fff', borderRadius: 1 }} />}
              </div>
            )
          })}
        </div>

        <button style={{ position: 'absolute', right: 14, background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div style={{
        position: 'absolute', right: 10, bottom: 154, zIndex: 20,
        display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center',
      }}>
        {/* Avatar + follow */}
        <div style={{ position: 'relative', paddingBottom: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,.9)',
            overflow: 'hidden', background: '#000',
          }}>
            <img
              src={`${import.meta.env.BASE_URL}nike-logo.png`}
              alt="Nike"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: 18, height: 18, borderRadius: '50%', background: '#FE2C55',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid #000',
          }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 1v6M1 4h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
        </div>

        {/* Heart */}
        <div style={{ textAlign: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#fff', marginTop: 2, fontWeight: 600 }}>284.5K</div>
        </div>

        {/* Comment */}
        <div style={{ textAlign: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#fff', marginTop: 2, fontWeight: 600 }}>12.8K</div>
        </div>

        {/* Bookmark */}
        <div style={{ textAlign: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#fff', marginTop: 2, fontWeight: 600 }}>45.3K</div>
        </div>

        {/* Share */}
        <div style={{ textAlign: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#fff', marginTop: 2, fontWeight: 600 }}>8.2K</div>
        </div>

        {/* Spinning vinyl disc */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #555, #111)',
          border: '3px solid rgba(255,255,255,.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'ttSpin 4s linear infinite',
        }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#111', border: '1px solid rgba(255,255,255,.18)' }} />
        </div>
      </div>

      {/* ── BOTTOM LEFT INFO ── */}
      <div style={{ position: 'absolute', bottom: 154, left: 12, right: 60, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: 14, fontWeight: 700, color: '#fff' }}>@nikeofficial</span>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#20D5EC"/>
            <path d="M9 12l2 2 4-4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ background: 'rgba(255,255,255,.14)', borderRadius: 4, padding: '1px 7px', border: '1px solid rgba(255,255,255,.16)' }}>
            <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.82)', fontWeight: 500 }}>Ad</span>
          </div>
        </div>

        <p style={{
          fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(255,255,255,.9)',
          lineHeight: 1.4, marginBottom: 7,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          🔥 Nike Air Max TN Plus — limited restock. Feel the future on every step 👟
        </p>

        {/* Music ticker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,.72)" style={{ flexShrink: 0 }}>
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ animation: 'ttTicker 12s linear infinite', display: 'inline-block', whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,.62)' }}>
                Nike × DJ Khaled – Just Do It (Remix) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Nike × DJ Khaled – Just Do It (Remix) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SHOPPING CTA STRIP ── */}
      <div style={{
        position: 'absolute', bottom: 74, left: 0, right: 0, zIndex: 20,
        background: 'rgba(14,14,14,.97)',
        borderTop: '1px solid rgba(255,255,255,.07)',
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          background: '#000', border: '1px solid rgba(255,255,255,.1)',
          overflow: 'hidden',
        }}>
          <img
            src={`${import.meta.env.BASE_URL}nike-logo.png`}
            alt="Nike"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Nike Air Max TN Plus</div>
          {/* Stars + sold */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="9" height="9" viewBox="0 0 24 24"
                  fill={i <= 4 ? '#FE2C55' : 'rgba(255,255,255,.2)'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.45)' }}>4.8 · 2.3K sold</span>
          </div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,.38)', marginTop: 1 }}>USD $129.99</div>
        </div>
        <button onClick={onBuy} style={{
          padding: '9px 18px', background: '#FE2C55', border: 'none', borderRadius: 6,
          fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
          boxShadow: '0 2px 14px rgba(254,44,85,.4)', letterSpacing: '.01em', flexShrink: 0,
        }}>Buy Now</button>
      </div>

      {/* Progress bar — thin line between video and CTA strip */}
      <div style={{
        position: 'absolute', bottom: 138, left: 0, right: 0, height: 2, zIndex: 21,
        background: 'rgba(255,255,255,.12)',
      }}>
        <div style={{ height: '100%', width: '38%', background: 'rgba(255,255,255,.72)', borderRadius: 1 }} />
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 74, zIndex: 20,
        background: 'rgba(8,8,8,.99)',
        borderTop: '1px solid rgba(255,255,255,.06)',
        display: 'flex', alignItems: 'center',
        padding: '8px 6px 18px',
      }}>
        {/* Home — active */}
        <button style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '2px 0' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9" fill="rgba(8,8,8,.99)"/></svg>
          <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#fff', fontWeight: 600 }}>Home</span>
        </button>

        {/* Friends */}
        <button style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '2px 0' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.38)', fontWeight: 400 }}>Friends</span>
        </button>

        {/* Create — TikTok gradient pill */}
        <button style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 0' }}>
          <div style={{
            width: 44, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #69C9D0 0%, #EE1D52 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 2px rgba(8,8,8,.99), 0 0 0 3.5px rgba(105,201,208,.45)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </div>
        </button>

        {/* Inbox with badge */}
        <button style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '2px 0' }}>
          <div style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <div style={{
              position: 'absolute', top: -4, right: -5,
              width: 14, height: 14, borderRadius: '50%', background: '#FE2C55',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid rgba(8,8,8,.99)',
              fontFamily: 'DM Sans', fontSize: 8, fontWeight: 700, color: '#fff',
            }}>3</div>
          </div>
          <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.38)', fontWeight: 400 }}>Inbox</span>
        </button>

        {/* Profile */}
        <button style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '2px 0' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'rgba(255,255,255,.38)', fontWeight: 400 }}>Profile</span>
        </button>
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
          <TikTokView onBuy={() => setCheckoutOpen(true)} />
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
