import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import type { Theme } from './themes'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Product = {
  name: string
  seller: string
  price: number
  currency: string
  originalPrice?: number
  gradient: string
  emoji?: string
}

type Tab = 'card' | 'virtual' | 'apm'
type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown'
type Step = 'form' | 'processing' | 'success'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const detectCard = (n: string): CardType => {
  const v = n.replace(/\s/g, '')
  if (/^4/.test(v)) return 'visa'
  if (/^5[1-5]|^2[2-7]/.test(v)) return 'mastercard'
  if (/^3[47]/.test(v)) return 'amex'
  return 'unknown'
}

const fmtCard = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

const fmtExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? d.slice(0, 2) + ' / ' + d.slice(2) : d
}

const COUNTRIES = [
  {
    code: 'AR', flag: '🇦🇷', name: 'Argentina', doc: 'DNI / CUIT',
    banks: ['Banco Nación', 'Galicia', 'Santander', 'BBVA', 'HSBC', 'Brubank', 'Uala', 'Naranja X'],
    accountField: 'CVU / CBU', accountPh: '22-digit CVU, CBU or alias',
    accountHint: 'Digital banks (Brubank, Uala) use CVU · Traditional banks use CBU',
    localCurrency: 'ARS', fxRate: 1000,
  },
  {
    code: 'BR', flag: '🇧🇷', name: 'Brazil', doc: 'CPF',
    banks: ['Nubank', 'Itaú', 'Bradesco', 'Caixa', 'Banco do Brasil'],
    accountField: 'PIX Key', accountPh: 'CPF, phone, e-mail or random key',
    accountHint: 'Any registered PIX key linked to your account',
    localCurrency: 'BRL', fxRate: 5.1,
  },
  {
    code: 'MX', flag: '🇲🇽', name: 'Mexico', doc: 'RFC / CURP',
    banks: ['BBVA', 'Santander', 'Banamex', 'Banorte', 'HSBC'],
    accountField: 'CLABE', accountPh: '18-digit CLABE number',
    accountHint: 'CLABE is required for all bank transfers in Mexico',
    localCurrency: 'MXN', fxRate: 17.2,
  },
  {
    code: 'CO', flag: '🇨🇴', name: 'Colombia', doc: 'Cédula / NIT',
    banks: ['Bancolombia', 'Davivienda', 'Nequi', 'Banco de Bogotá', 'BBVA'],
    accountField: 'Account number', accountPh: 'Savings or checking account number',
    accountHint: undefined,
    localCurrency: 'COP', fxRate: 3900,
  },
  {
    code: 'PE', flag: '🇵🇪', name: 'Peru', doc: 'DNI / RUC',
    banks: ['BCP', 'Interbank', 'BBVA', 'Scotiabank', 'Banbif'],
    accountField: 'CCI', accountPh: '20-digit interbank code (CCI)',
    accountHint: 'Find your CCI in your banking app under "My accounts"',
    localCurrency: 'PEN', fxRate: 3.8,
  },
]

const APMS = [
  { id: 'pix',   name: 'Pix',   flag: '🇧🇷', color: '#32BCAD', desc: 'Instant transfer' },
  { id: 'breb',  name: 'Bre-b', flag: '🇵🇪', color: '#FF6B35', desc: 'Digital wallets Peru' },
  { id: 'debin', name: 'Debin', flag: '🇦🇷', color: '#2563EB', desc: 'Instant bank debit' },
  { id: 'spei',  name: 'SPEI',  flag: '🇲🇽', color: '#059669', desc: 'Bank transfer Mexico' },
  { id: 'pse',   name: 'PSE',   flag: '🇨🇴', color: '#7C3AED', desc: 'Secure online payments' },
]

// ─── Card network icons ────────────────────────────────────────────────────────

function VisaIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 58 36">
      <rect width="58" height="36" rx="4" fill="#1A1F71" />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">VISA</text>
    </svg>
  )
}

function McIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 58 36">
      <rect width="58" height="36" rx="4" fill="#252525" />
      <circle cx="23" cy="18" r="11" fill="#EB001B" />
      <circle cx="35" cy="18" r="11" fill="#F79E1B" />
      <path d="M29 9.4a11 11 0 0 1 0 17.2A11 11 0 0 1 29 9.4z" fill="#FF5F00" />
    </svg>
  )
}

function AmexIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 58 36">
      <rect width="58" height="36" rx="4" fill="#007BC1" />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial, sans-serif">AMEX</text>
    </svg>
  )
}

function BlankCardIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 58 36">
      <rect width="58" height="36" rx="4" fill="#E8EAED" />
      <rect x="7" y="11" width="10" height="8" rx="1.5" fill="#B0B8C4" />
      <rect x="7" y="23" width="20" height="3" rx="1.5" fill="#D5DBE3" />
      <rect x="31" y="23" width="12" height="3" rx="1.5" fill="#D5DBE3" />
    </svg>
  )
}

function CardIcon({ type, size = 22 }: { type: CardType; size?: number }) {
  if (type === 'visa')       return <VisaIcon size={size} />
  if (type === 'mastercard') return <McIcon size={size} />
  if (type === 'amex')       return <AmexIcon size={size} />
  return <BlankCardIcon size={size} />
}

// ─── Platform badge icon ───────────────────────────────────────────────────────

function PlatformIcon({ id, size = 18 }: { id: string; size?: number }) {
  if (id === 'pinterest') return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', borderRadius: '50%' }}>
      <circle cx="12" cy="12" r="12" fill="#E60023" />
      <text x="12" y="17.5" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" fontFamily="Georgia, serif">P</text>
    </svg>
  )
  if (id === 'tiktok') return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', borderRadius: 5 }}>
      <rect width="24" height="24" fill="#000" />
      <path d="M16 6.3c-.4-1.5-1.6-2.7-3.1-2.9V10c-.1 2-1.8 3.5-3.8 3.5S5.3 11.9 5.3 9.9s1.7-3.6 3.8-3.6c.3 0 .6 0 .9.1V4c-.3 0-.6-.1-.9-.1C5.5 3.9 3 6.6 3 9.9s2.5 6 5.9 6 5.9-2.7 5.9-6V8.2c.9.6 1.9 1 3.1 1V6.9c-.8 0-1.5-.3-1.9-.6z" fill="white" />
    </svg>
  )
  if (id === 'instagram') return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', borderRadius: 5 }}>
      <defs>
        <linearGradient id="igG" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="50%" stopColor="#e1306c" />
          <stop offset="100%" stopColor="#833ab4" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#igG)" />
      <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="white" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="1.4" />
      <circle cx="16.2" cy="7.8" r=".9" fill="white" />
    </svg>
  )
  return null
}

// ─── QR Code ──────────────────────────────────────────────────────────────────

function QRCode({ accent }: { accent: string }) {
  const cells = [
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,1,0,1,1,0,1,0],
    [0,1,0,1,0,0,0,0,1,1,0,0,0,1,0,1,0,0,1,1,1],
    [1,0,1,0,1,1,1,0,0,1,1,0,1,0,1,0,1,0,0,1,0],
    [0,0,0,1,0,0,0,1,1,0,0,1,0,1,0,1,0,1,1,0,1],
    [1,1,0,0,1,0,1,0,0,1,1,0,1,0,0,1,1,0,0,1,0],
    [0,0,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,1,0,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,0,0,1,0,1,1,0,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,0,1,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,0,1,0,0,1,0,1,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,0,1,0,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,1,1,1,0,0,1],
  ]
  const size = 128, cell = size / cells.length
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8 }}>
      <rect width={size} height={size} fill="white" rx="8" />
      {cells.map((row, r) =>
        row.map((v, c) => v ? (
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell - 0.5} height={cell - 0.5}
            fill={(r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7) ? accent : '#111'} />
        ) : null)
      )}
    </svg>
  )
}

// ─── Style factories ──────────────────────────────────────────────────────────

const inp = (t: Theme, focused: string | null, id: string): CSSProperties => ({
  width: '100%',
  height: 46,
  padding: '0 14px',
  background: t.inputBg,
  border: `1.5px solid ${focused === id ? t.accent : t.inputBorder}`,
  borderRadius: 8,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 15,
  color: t.text,
  outline: 'none',
  transition: 'border-color .15s, box-shadow .15s',
  boxShadow: focused === id ? `0 0 0 3px ${t.accent}20` : 'none',
  WebkitAppearance: 'none',
  boxSizing: 'border-box' as const,
})

const sel = (t: Theme): CSSProperties => {
  const arrowColor = t.logoVariant === 'light' ? '%23888' : '%239CA3AF'
  return {
    width: '100%',
    height: 46,
    padding: '0 36px 0 14px',
    background: t.inputBg,
    border: `1.5px solid ${t.inputBorder}`,
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 15,
    color: t.text,
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='${arrowColor}' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    boxSizing: 'border-box' as const,
  }
}

// ─── Card Form ────────────────────────────────────────────────────────────────

function CardForm({ t }: { t: Theme }) {
  const [num, setNum]       = useState('')
  const [name, setName]     = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv]       = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const type = detectCard(num)
  const f = (id: string) => inp(t, focused, id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative' }}>
        <input
          style={{ ...f('num'), paddingRight: 56 }}
          placeholder="1234 5678 9012 3456"
          value={num} maxLength={19} inputMode="numeric"
          onChange={e => setNum(fmtCard(e.target.value))}
          onFocus={() => setFocused('num')} onBlur={() => setFocused(null)}
        />
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
          <CardIcon type={type} size={18} />
        </span>
      </div>
      <input
        style={f('name')} placeholder="Name on card"
        value={name} onChange={e => setName(e.target.value.toUpperCase())}
        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <input
          style={f('exp')} placeholder="MM / YY" value={expiry} maxLength={7}
          inputMode="numeric" onChange={e => setExpiry(fmtExpiry(e.target.value))}
          onFocus={() => setFocused('exp')} onBlur={() => setFocused(null)}
        />
        <input
          style={f('cvv')} placeholder="CVV" value={cvv} maxLength={4}
          inputMode="numeric" type="password"
          onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onFocus={() => setFocused('cvv')} onBlur={() => setFocused(null)}
        />
      </div>
    </div>
  )
}

// ─── Virtual Account Form ─────────────────────────────────────────────────────

function VirtualForm({ t, price, currency }: { t: Theme; price: number; currency: string }) {
  const [country, setCountry]   = useState('AR')
  const [bank, setBank]         = useState('')
  const [holder, setHolder]     = useState('')
  const [doc, setDoc]           = useState('')
  const [accountNum, setAccNum] = useState('')
  const [focused, setFocused]   = useState<string | null>(null)

  const c = COUNTRIES.find(x => x.code === country)!
  const f = (id: string) => inp(t, focused, id)
  const localAmt = (price * c.fxRate).toLocaleString('en-US', { maximumFractionDigits: 0 })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* FX conversion banner */}
      <div style={{
        background: `${t.accent}0e`, border: `1px solid ${t.accent}25`,
        borderRadius: 10, padding: '10px 13px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 15 }}>💱</span>
          <div>
            <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 11, color: t.textMuted, lineHeight: 1 }}>
              You pay
            </p>
            <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 13.5, fontWeight: 700, color: t.text }}>
              {currency} {price.toFixed(2)}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 11, color: t.textMuted, lineHeight: 1 }}>
            Transfer amount
          </p>
          <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 13.5, fontWeight: 700, color: t.accent }}>
            {c.localCurrency} {localAmt}
          </p>
        </div>
      </div>

      {/* Country */}
      <select style={sel(t)} value={country}
        onChange={e => { setCountry(e.target.value); setBank(''); setAccNum('') }}>
        {COUNTRIES.map(x => <option key={x.code} value={x.code}>{x.flag} {x.name}</option>)}
      </select>

      {/* Bank */}
      <select style={sel(t)} value={bank} onChange={e => setBank(e.target.value)}>
        <option value="">Select bank</option>
        {c.banks.map(b => <option key={b} value={b}>{b}</option>)}
      </select>

      {/* Account number — CVU/CBU for AR, CLABE for MX, etc. */}
      <div>
        <input
          style={{ ...f('acct'), borderRadius: accountNum ? 8 : 8 }}
          placeholder={`${c.accountField} — ${c.accountPh}`}
          value={accountNum}
          onChange={e => setAccNum(e.target.value)}
          onFocus={() => setFocused('acct')}
          onBlur={() => setFocused(null)}
        />
        {c.accountHint && (
          <p style={{
            fontFamily: '-apple-system, sans-serif', fontSize: 11,
            color: t.textMuted, marginTop: 5, paddingLeft: 2, lineHeight: 1.4,
          }}>
            {c.accountHint}
          </p>
        )}
      </div>

      {/* Account holder */}
      <input style={f('holder')} placeholder="Account holder name" value={holder}
        onChange={e => setHolder(e.target.value)}
        onFocus={() => setFocused('holder')} onBlur={() => setFocused(null)} />

      {/* Document number */}
      <input style={f('doc')} placeholder={c.doc} value={doc}
        onChange={e => setDoc(e.target.value)}
        onFocus={() => setFocused('doc')} onBlur={() => setFocused(null)} />

      {/* Instructions */}
      <div style={{
        background: t.surfaceBg, border: `1px solid ${t.border}`,
        borderRadius: 10, overflow: 'hidden',
      }}>
        {[
          { n: '1', text: `Transfer exactly ${c.localCurrency} ${localAmt} to the ${c.accountField} above` },
          { n: '2', text: 'Use "Nike Air Max TN Plus" as the transfer reference' },
          { n: '3', text: 'Your order is confirmed automatically — no manual approval needed' },
        ].map(({ n, text }) => (
          <div key={n} style={{
            display: 'flex', gap: 10, padding: '10px 13px',
            borderBottom: n !== '3' ? `1px solid ${t.border}` : 'none',
            alignItems: 'flex-start',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '-apple-system, sans-serif', fontSize: 10.5, fontWeight: 700, color: '#fff',
            }}>{n}</div>
            <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: t.textSub, lineHeight: 1.5 }}>
              {text}
            </p>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 11, color: t.textMuted, textAlign: 'center' }}>
        ⏱ Transfer window: <strong style={{ color: t.textSub }}>48 hours</strong>
      </p>
    </div>
  )
}

// ─── APM Form ─────────────────────────────────────────────────────────────────

type DebinStep = 'input' | 'pending' | 'approved'

function DebinFlow({ t, price, currency }: { t: Theme; price: number; currency: string }) {
  const [cvu, setCvu]   = useState('')
  const [step, setStep] = useState<DebinStep>('input')
  const [secs, setSecs] = useState(18)
  const focused_ref = React.useRef(false)

  React.useEffect(() => {
    if (step !== 'pending') return
    if (secs <= 0) { setStep('approved'); return }
    const id = setTimeout(() => setSecs(s => s - 1), 1000)
    return () => clearTimeout(id)
  }, [step, secs])

  const accent = '#2563EB'

  if (step === 'input') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'lpFadeUp .25s ease' }}>
      <div style={{
        background: `${accent}0e`, border: `1px solid ${accent}25`,
        borderRadius: 10, padding: '12px 14px',
      }}>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12.5, fontWeight: 600, color: accent, marginBottom: 3 }}>
          Debin — Instant bank debit 🇦🇷
        </p>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: t.textSub, lineHeight: 1.5 }}>
          We'll send a debit request directly to your bank. You approve it in your banking app and the payment is instant.
        </p>
      </div>
      <input
        style={{
          width: '100%', height: 46, padding: '0 14px',
          background: t.inputBg, border: `1.5px solid ${focused_ref.current ? accent : t.inputBorder}`,
          borderRadius: 8, fontFamily: '-apple-system, sans-serif', fontSize: 15,
          color: t.text, outline: 'none', boxSizing: 'border-box' as const,
          WebkitAppearance: 'none',
        }}
        placeholder="Your CVU / CBU (22 digits)"
        value={cvu}
        onChange={e => setCvu(e.target.value.replace(/\D/g, '').slice(0, 22))}
        inputMode="numeric"
      />
      <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 11, color: t.textMuted, marginTop: -4 }}>
        Find your CVU in Brubank, Uala or Naranja X · CBU in traditional banks
      </p>
      <button
        onClick={() => { if (cvu.length >= 6) { setStep('pending'); setSecs(18) } }}
        style={{
          width: '100%', height: 44, background: cvu.length >= 6 ? accent : t.border,
          color: '#fff', border: 'none', borderRadius: 10,
          fontFamily: '-apple-system, sans-serif', fontSize: 14, fontWeight: 700,
          cursor: cvu.length >= 6 ? 'pointer' : 'not-allowed',
          transition: 'background .2s',
        }}>
        Send debit request · {currency} {price.toFixed(2)}
      </button>
    </div>
  )

  if (step === 'pending') return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '8px 0', animation: 'lpFadeUp .25s ease' }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        border: `3px solid ${accent}30`, borderTopColor: accent,
        animation: 'lpSpin .8s linear infinite',
      }} />
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 16, fontWeight: 700, color: t.text }}>
          Awaiting approval
        </p>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12.5, color: t.textMuted, marginTop: 4 }}>
          Open your banking app and approve the request
        </p>
      </div>
      <div style={{
        width: '100%', background: t.surfaceBg, border: `1px solid ${t.border}`,
        borderRadius: 12, overflow: 'hidden',
      }}>
        {[
          ['Requesting entity', 'Nike via LocalPayment'],
          ['Amount', `${currency} ${price.toFixed(2)}`],
          ['Your CVU', `****${cvu.slice(-4)}`],
          ['Reference', 'Nike Air Max TN Plus'],
        ].map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between', padding: '10px 13px',
            borderBottom: `1px solid ${t.border}`, fontFamily: '-apple-system, sans-serif', fontSize: 12.5,
          }}>
            <span style={{ color: t.textMuted }}>{k}</span>
            <span style={{ color: t.text, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between', padding: '10px 13px',
          fontFamily: '-apple-system, sans-serif', fontSize: 12.5,
        }}>
          <span style={{ color: t.textMuted }}>Expires in</span>
          <span style={{ color: accent, fontWeight: 700 }}>{secs}s</span>
        </div>
      </div>
      <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 11, color: t.textMuted, textAlign: 'center' }}>
        The request will expire if not approved within {secs} seconds
      </p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0', animation: 'lpFadeUp .25s ease' }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, animation: 'lpPop .4s cubic-bezier(.34,1.56,.64,1)',
      }}>✓</div>
      <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 16, fontWeight: 700, color: t.text }}>
        Debit approved!
      </p>
      <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12.5, color: t.textMuted, textAlign: 'center' }}>
        {currency} {price.toFixed(2)} was debited from CVU ****{cvu.slice(-4)}
      </p>
    </div>
  )
}

function ApmForm({ t, price, currency }: { t: Theme; price: number; currency: string }) {
  const [selected, setSelected] = useState<string | null>(null)
  const apm = APMS.find(a => a.id === selected)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
        {APMS.map(a => (
          <button key={a.id} onClick={() => setSelected(selected === a.id ? null : a.id)}
            style={{
              background: selected === a.id ? `${a.color}15` : t.surfaceBg,
              border: `2px solid ${selected === a.id ? a.color : t.border}`,
              borderRadius: 11, padding: '9px 4px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'all .2s',
            }}>
            <span style={{ fontSize: 16 }}>{a.flag}</span>
            <span style={{
              fontFamily: '-apple-system, sans-serif', fontSize: 9.5, fontWeight: 600,
              color: selected === a.id ? a.color : t.textMuted,
            }}>{a.name}</span>
          </button>
        ))}
      </div>

      {selected && apm && (
        <div style={{
          background: t.surfaceBg, border: `1px solid ${t.border}`, borderRadius: 12,
          padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          animation: 'lpFadeUp .25s ease',
        }}>
          {apm.id === 'pix' ? (
            <>
              <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12.5, color: t.textMuted, textAlign: 'center' }}>
                Scan with your banking app
              </p>
              <div style={{ padding: 6, background: 'white', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
                <QRCode accent={apm.color} />
              </div>
              <div style={{
                background: `${apm.color}15`, borderRadius: 8,
                padding: '7px 16px', fontFamily: '-apple-system, sans-serif',
                fontSize: 14, color: apm.color, fontWeight: 700,
              }}>{currency} {price.toFixed(2)}</div>
              <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 11, color: t.textMuted, textAlign: 'center' }}>
                Code valid for <strong style={{ color: t.textSub }}>10 minutes</strong>
              </p>
            </>
          ) : apm.id === 'debin' ? (
            <div style={{ width: '100%' }}>
              <DebinFlow t={t} price={price} currency={currency} />
            </div>
          ) : (
            <>
              <div style={{ fontSize: 30 }}>{apm.flag}</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 15, fontWeight: 600, color: t.text }}>{apm.name}</p>
                <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12.5, color: t.textMuted, marginTop: 3 }}>{apm.desc}</p>
              </div>
              <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 13, color: t.textMuted, textAlign: 'center', lineHeight: 1.5 }}>
                You'll be redirected to authorize the payment of{' '}
                <strong style={{ color: t.text }}>{currency} {price.toFixed(2)}</strong>
              </p>
            </>
          )}
        </div>
      )}

      {!selected && (
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 12, color: t.textMuted, textAlign: 'center' }}>
          Select your preferred method
        </p>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean
  onClose: () => void
  product: Product
  theme: Theme
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'card',    label: 'Card',           icon: '💳' },
  { id: 'virtual', label: 'Bank transfer',  icon: '🏦' },
  { id: 'apm',     label: 'Other',          icon: '⚡' },
]

export default function StripeCheckout({ open, onClose, product, theme: t }: Props) {
  const [tab,     setTab]     = useState<Tab>('card')
  const [step,    setStep]    = useState<Step>('form')
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setStep('form')
      setMounted(true)
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    } else {
      setVisible(false)
      const timer = setTimeout(() => setMounted(false), 440)
      return () => clearTimeout(timer)
    }
  }, [open])

  if (!mounted) return null

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handlePay = () => {
    setStep('processing')
    setTimeout(() => setStep('success'), 2000)
  }

  const logoSrc = t.logoVariant === 'dark' ? '/logo-dark.png' : '/logo-light.png'

  return (
    <>
      <style>{`
        @keyframes lpFadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes lpSpin   { to { transform: rotate(360deg) } }
        @keyframes lpPop    { 0%{transform:scale(0)} 70%{transform:scale(1.12)} 100%{transform:scale(1)} }
        .lp-pay:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
        .lp-pay:active:not(:disabled) { transform: translateY(0); }
        .lp-pay:disabled { opacity: .6; cursor: not-allowed; }
        .lp-tab:hover  { opacity: .8; }
        .lp-close:hover { opacity: .6; }
      `}</style>

      {/* Backdrop — position:absolute stays inside phone frame */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,.55)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          zIndex: 200,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: t.sheetBg,
        borderRadius: '24px 24px 0 0',
        zIndex: 201,
        maxHeight: '92%',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.44s cubic-bezier(0.32, 0.72, 0, 1)',
        boxShadow: '0 -8px 48px rgba(0,0,0,.28)',
      }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, background: t.border, borderRadius: 2 }} />
        </div>

        {/* Header — platform badge + close */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 18px 14px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${t.hostAccent}12`,
            border: `1px solid ${t.hostAccent}28`,
            borderRadius: 20, padding: '4px 11px 4px 5px',
          }}>
            <PlatformIcon id={t.id} size={18} />
            <span style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: 12.5, fontWeight: 600, color: t.hostAccent, letterSpacing: '.15px',
            }}>{t.hostName}</span>
          </div>

          <button className="lp-close" onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%',
            border: 'none', background: t.surfaceBg,
            color: t.textMuted, fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity .15s', flexShrink: 0,
          }}>×</button>
        </div>

        {/* Scrollable body */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '0 18px' }}>

          {/* ── Form step ── */}
          {step === 'form' && (
            <>
              {/* Product row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: t.surfaceBg, border: `1px solid ${t.border}`,
                borderRadius: 14, padding: '12px 14px', marginBottom: 16,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                  background: product.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>{product.emoji || '🛍️'}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: 13.5, fontWeight: 600, color: t.text,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{product.name}</p>
                  <p style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: 11.5, color: t.textMuted, marginTop: 2,
                  }}>by {product.seller}</p>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {discount && (
                    <div style={{
                      background: '#22c55e18', color: '#16a34a', borderRadius: 5,
                      padding: '1px 7px', fontSize: 10.5, fontWeight: 700,
                      fontFamily: '-apple-system, sans-serif', marginBottom: 3,
                    }}>−{discount}%</div>
                  )}
                  <div style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: 17, fontWeight: 800, color: t.text, letterSpacing: '-.5px',
                  }}>{product.currency} {product.price.toFixed(2)}</div>
                  {product.originalPrice && (
                    <div style={{
                      fontFamily: '-apple-system, sans-serif',
                      fontSize: 11, color: t.textMuted, textDecoration: 'line-through',
                    }}>{product.currency} {product.originalPrice.toFixed(2)}</div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div style={{
                background: t.surfaceBg, border: `1px solid ${t.border}`,
                borderRadius: 12, padding: 3,
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: 2, marginBottom: 16,
              }}>
                {TABS.map(({ id, label, icon }) => (
                  <button key={id} className="lp-tab"
                    onClick={() => setTab(id)}
                    style={{
                      padding: '8px 4px', borderRadius: 9, border: 'none',
                      background: tab === id ? t.tabActiveBg : 'transparent',
                      boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
                      cursor: 'pointer', transition: 'all .2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{
                      fontFamily: '-apple-system, sans-serif',
                      fontSize: 10.5, fontWeight: tab === id ? 600 : 400,
                      color: tab === id ? t.accent : t.textMuted,
                      lineHeight: 1.2, textAlign: 'center',
                    }}>{label}</span>
                  </button>
                ))}
              </div>

              {/* Form */}
              <div style={{ animation: 'lpFadeUp .25s ease', paddingBottom: 6 }} key={tab}>
                {tab === 'card'    && <CardForm t={t} />}
                {tab === 'virtual' && <VirtualForm t={t} price={product.price} currency={product.currency} />}
                {tab === 'apm'     && <ApmForm t={t} price={product.price} currency={product.currency} />}
              </div>
            </>
          )}

          {/* ── Processing step ── */}
          {step === 'processing' && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              minHeight: 280, gap: 18,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: `3px solid ${t.border}`, borderTopColor: t.accent,
                animation: 'lpSpin .75s linear infinite',
              }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: '-apple-system, sans-serif',
                  fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 5,
                }}>Processing payment…</p>
                <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 13, color: t.textMuted }}>
                  Don't close this window
                </p>
              </div>
            </div>
          )}

          {/* ── Success step ── */}
          {step === 'success' && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', padding: '20px 0 8px', gap: 16,
              animation: 'lpFadeUp .3s ease',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, color: '#fff',
                animation: 'lpPop .5s cubic-bezier(.34,1.56,.64,1)',
              }}>✓</div>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: '-apple-system, sans-serif',
                  fontSize: 21, fontWeight: 800, color: t.text, marginBottom: 6,
                }}>Payment successful!</h2>
                <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: 13.5, color: t.textMuted }}>
                  Your purchase was processed successfully.
                </p>
              </div>
              <div style={{
                width: '100%', background: t.surfaceBg, border: `1px solid ${t.border}`,
                borderRadius: 12, overflow: 'hidden',
              }}>
                {([
                  ['Product', product.name],
                  ['Amount',  `${product.currency} ${product.price.toFixed(2)}`],
                  ['Status',  '✅ Confirmed'],
                  ['Order',   `LP-${Math.random().toString(36).toUpperCase().slice(2, 9)}`],
                ] as [string, string][]).map(([k, v], i, arr) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
                    fontFamily: '-apple-system, sans-serif', fontSize: 13,
                  }}>
                    <span style={{ color: t.textMuted }}>{k}</span>
                    <span style={{ color: t.text, fontWeight: 600, maxWidth: 160, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={onClose} style={{
                width: '100%', padding: '14px',
                background: t.accent, color: t.accentText,
                border: 'none', borderRadius: 12,
                fontFamily: '-apple-system, sans-serif',
                fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 4,
              }}>Back to {t.hostName}</button>
            </div>
          )}
        </div>

        {/* Sticky footer — pay button + single LP branding */}
        {step === 'form' && (
          <div style={{ padding: '14px 18px 28px', background: t.sheetBg, borderTop: `1px solid ${t.border}` }}>
            <button
              className="lp-pay"
              onClick={handlePay}
              style={{
                width: '100%', height: 52,
                background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDark} 100%)`,
                color: t.accentText, border: 'none', borderRadius: 14,
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'filter .15s, transform .1s',
                boxShadow: `0 4px 18px ${t.accent}42`,
                letterSpacing: '.2px',
              }}
            >
              🔒 Pay {product.currency} {product.price.toFixed(2)}
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 11,
            }}>
              <span style={{
                fontFamily: '-apple-system, sans-serif', fontSize: 11,
                color: t.textMuted, letterSpacing: '.3px',
              }}>Powered by</span>
              <img src={logoSrc} alt="LocalPayment" style={{ height: 15, opacity: 0.6 }} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
