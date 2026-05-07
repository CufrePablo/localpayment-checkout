import { useState, useEffect, useRef, CSSProperties } from 'react'
import type { Theme } from './themes'

// ─── Types ───────────────────────────────────────────────────────────────────

export type Product = {
  name: string
  seller: string
  price: number
  currency: string
  originalPrice?: number
  gradient: string
}

type Tab = 'card' | 'virtual' | 'apm'
type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const detectCard = (num: string): CardType => {
  const n = num.replace(/\s/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^5[1-5]|^2[2-7]/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  return 'unknown'
}

const fmt = (n: string) =>
  n.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

const fmtExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
}

const COUNTRIES = [
  { code: 'AR', flag: '🇦🇷', name: 'Argentina', doc: 'CUIT / DNI', banks: ['Banco Nación', 'Galicia', 'Santander', 'BBVA', 'Brubank'] },
  { code: 'BR', flag: '🇧🇷', name: 'Brasil', doc: 'CPF', banks: ['Nubank', 'Itaú', 'Bradesco', 'Caixa', 'Banco do Brasil'] },
  { code: 'MX', flag: '🇲🇽', name: 'México', doc: 'RFC / CURP', banks: ['BBVA', 'Santander', 'Banamex', 'Banorte', 'HSBC'] },
  { code: 'CO', flag: '🇨🇴', name: 'Colombia', doc: 'Cédula', banks: ['Bancolombia', 'Davivienda', 'Nequi', 'Banco de Bogotá'] },
  { code: 'PE', flag: '🇵🇪', name: 'Perú', doc: 'DNI / RUC', banks: ['BCP', 'Interbank', 'BBVA', 'Scotiabank'] },
]

const APMS = [
  { id: 'pix', name: 'Pix', flag: '🇧🇷', color: '#32BCAD', desc: 'Transferencia instantánea' },
  { id: 'breb', name: 'Bre-b', flag: '🇵🇪', color: '#FF6B35', desc: 'Billeteras digitales Perú' },
  { id: 'debin', name: 'Debin', flag: '🇦🇷', color: '#2563EB', desc: 'Débito bancario inmediato' },
  { id: 'spei', name: 'SPEI', flag: '🇲🇽', color: '#059669', desc: 'Transferencia bancaria México' },
  { id: 'pse', name: 'PSE', flag: '🇨🇴', color: '#7C3AED', desc: 'Pagos seguros en línea' },
  { id: 'nequi', name: 'Nequi', flag: '🇨🇴', color: '#6B21A8', desc: 'Billetera digital Bancolombia' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function CardTypeIcon({ type, size = 28 }: { type: CardType; size?: number }) {
  if (type === 'visa') return (
    <svg width={size * 1.6} height={size} viewBox="0 0 50 32">
      <rect width="50" height="32" rx="4" fill="#1A1F71" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">VISA</text>
    </svg>
  )
  if (type === 'mastercard') return (
    <svg width={size * 1.6} height={size} viewBox="0 0 50 32">
      <rect width="50" height="32" rx="4" fill="#252525" />
      <circle cx="20" cy="16" r="10" fill="#EB001B" />
      <circle cx="30" cy="16" r="10" fill="#F79E1B" />
      <path d="M25 8.3a10 10 0 0 1 0 15.4A10 10 0 0 1 25 8.3z" fill="#FF5F00" />
    </svg>
  )
  if (type === 'amex') return (
    <svg width={size * 1.6} height={size} viewBox="0 0 50 32">
      <rect width="50" height="32" rx="4" fill="#007BC1" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">AMEX</text>
    </svg>
  )
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 50 32">
      <rect width="50" height="32" rx="4" fill="#E5E7EB" />
      <rect x="6" y="10" width="8" height="6" rx="1" fill="#9CA3AF" />
      <rect x="6" y="20" width="16" height="3" rx="1.5" fill="#D1D5DB" />
      <rect x="26" y="20" width="10" height="3" rx="1.5" fill="#D1D5DB" />
    </svg>
  )
}

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
  const size = 160
  const cell = size / cells.length
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8 }}>
      <rect width={size} height={size} fill="white" />
      {cells.map((row, r) =>
        row.map((v, c) => v ? (
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell - 0.5} height={cell - 0.5} fill={r < 7 && c < 7 ? accent : r < 7 && c > 13 ? accent : r > 13 && c < 7 ? accent : '#111'} />
        ) : null)
      )}
    </svg>
  )
}

// ─── Card Form ────────────────────────────────────────────────────────────────

function CardForm({ t }: { t: Theme }) {
  const [num, setNum] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [focused, setFocused] = useState<string | null>(null)

  const cardType = detectCard(num)
  const input = fieldStyle(t, focused)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Mini card preview */}
      <div style={{
        background: `linear-gradient(135deg, ${t.accent}22 0%, ${t.accent}08 100%)`,
        border: `1px solid ${t.accent}20`,
        borderRadius: 16,
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: t.textMuted, marginBottom: 4 }}>Número de tarjeta</div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 16, color: t.text, letterSpacing: '0.12em', fontWeight: 500 }}>
            {num ? num.padEnd(19, '·').replace(/\S{4}(?=\S)/g, m => m + ' ').slice(0, 22) : '•••• •••• •••• ••••'}
          </div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: t.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {name || 'NOMBRE TITULAR'}
          </div>
        </div>
        <CardTypeIcon type={cardType} size={24} />
      </div>

      <input
        style={input('cardnum')}
        placeholder="1234 5678 9012 3456"
        value={num}
        maxLength={19}
        inputMode="numeric"
        onChange={e => setNum(fmt(e.target.value))}
        onFocus={() => setFocused('cardnum')}
        onBlur={() => setFocused(null)}
      />
      <input
        style={input('name')}
        placeholder="Nombre en la tarjeta"
        value={name}
        onChange={e => setName(e.target.value.toUpperCase())}
        onFocus={() => setFocused('name')}
        onBlur={() => setFocused(null)}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <input
          style={input('expiry')}
          placeholder="MM/AA"
          value={expiry}
          maxLength={5}
          inputMode="numeric"
          onChange={e => setExpiry(fmtExpiry(e.target.value))}
          onFocus={() => setFocused('expiry')}
          onBlur={() => setFocused(null)}
        />
        <input
          style={input('cvv')}
          placeholder="CVV"
          value={cvv}
          maxLength={4}
          inputMode="numeric"
          type="password"
          onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onFocus={() => setFocused('cvv')}
          onBlur={() => setFocused(null)}
        />
      </div>
    </div>
  )
}

// ─── Virtual Account Form ─────────────────────────────────────────────────────

function VirtualAccountForm({ t }: { t: Theme }) {
  const [country, setCountry] = useState('AR')
  const [bank, setBank] = useState('')
  const [holder, setHolder] = useState('')
  const [doc, setDoc] = useState('')
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState<string | null>(null)

  const sel = COUNTRIES.find(c => c.code === country)!
  const input = fieldStyle(t, focused)
  const sel2 = selectStyle(t)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <select style={sel2} value={country} onChange={e => { setCountry(e.target.value); setBank('') }}>
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
        ))}
      </select>
      <select style={sel2} value={bank} onChange={e => setBank(e.target.value)}>
        <option value="">Seleccionar banco</option>
        {sel.banks.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <input
        style={input('holder')}
        placeholder="Titular de la cuenta"
        value={holder}
        onChange={e => setHolder(e.target.value)}
        onFocus={() => setFocused('holder')}
        onBlur={() => setFocused(null)}
      />
      <input
        style={input('doc')}
        placeholder={sel.doc}
        value={doc}
        onChange={e => setDoc(e.target.value)}
        onFocus={() => setFocused('doc')}
        onBlur={() => setFocused(null)}
      />
      <input
        style={input('email')}
        placeholder="Email para notificación"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onFocus={() => setFocused('email')}
        onBlur={() => setFocused(null)}
      />
      <div style={{
        background: `${t.accent}10`,
        border: `1px solid ${t.accent}25`,
        borderRadius: 12,
        padding: '12px 14px',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: t.textSub, lineHeight: 1.5 }}>
          Se generará una cuenta virtual única. Transfiere el monto exacto en las próximas <strong>48hs</strong>. El pago se confirma automáticamente.
        </p>
      </div>
    </div>
  )
}

// ─── Alternative Methods ──────────────────────────────────────────────────────

function AlternativeMethods({ t, price, currency }: { t: Theme; price: number; currency: string }) {
  const [selected, setSelected] = useState<string | null>(null)
  const apm = APMS.find(a => a.id === selected)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {APMS.map(a => (
          <button
            key={a.id}
            onClick={() => setSelected(selected === a.id ? null : a.id)}
            style={{
              background: selected === a.id ? `${a.color}18` : t.surfaceBg,
              border: `2px solid ${selected === a.id ? a.color : t.border}`,
              borderRadius: 14,
              padding: '12px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 20 }}>{a.flag}</span>
            <span style={{
              fontFamily: 'DM Sans',
              fontSize: 11,
              fontWeight: 600,
              color: selected === a.id ? a.color : t.text,
              letterSpacing: '0.02em',
            }}>{a.name}</span>
          </button>
        ))}
      </div>

      {selected && apm && (
        <div style={{
          background: t.surfaceBg,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          animation: 'fadeUp 0.3s ease',
        }}>
          {apm.id === 'pix' ? (
            <>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: t.textMuted, textAlign: 'center' }}>
                Escanea el código QR con tu app bancaria
              </p>
              <div style={{ padding: 8, background: 'white', borderRadius: 12 }}>
                <QRCode accent={apm.color} />
              </div>
              <div style={{
                background: `${apm.color}15`,
                borderRadius: 10,
                padding: '8px 14px',
                fontFamily: 'DM Sans',
                fontSize: 13,
                color: apm.color,
                fontWeight: 600,
              }}>
                {currency} {price.toFixed(2)}
              </div>
              <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: t.textMuted, textAlign: 'center' }}>
                El código expira en <strong>10 minutos</strong>
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: 36 }}>{apm.flag}</div>
              <div>
                <p style={{ fontFamily: 'DM Sans', fontSize: 15, fontWeight: 600, color: t.text, textAlign: 'center' }}>
                  {apm.name}
                </p>
                <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: t.textMuted, textAlign: 'center', marginTop: 4 }}>
                  {apm.desc}
                </p>
              </div>
              <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: t.textSub, textAlign: 'center', lineHeight: 1.5 }}>
                Serás redirigido a tu banco para autorizar el pago de <strong>{currency} {price.toFixed(2)}</strong>
              </p>
            </>
          )}
        </div>
      )}

      {!selected && (
        <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: t.textMuted, textAlign: 'center' }}>
          Selecciona tu método de pago preferido
        </p>
      )}
    </div>
  )
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function fieldStyle(t: Theme, focused: string | null) {
  return (id: string): CSSProperties => ({
    width: '100%',
    padding: '13px 16px',
    background: t.inputBg,
    border: `1.5px solid ${focused === id ? t.accent : t.inputBorder}`,
    borderRadius: 12,
    fontFamily: 'DM Sans',
    fontSize: 15,
    color: t.text,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === id ? `0 0 0 3px ${t.accent}18` : 'none',
    WebkitAppearance: 'none',
  })
}

function selectStyle(t: Theme): CSSProperties {
  return {
    width: '100%',
    padding: '13px 16px',
    background: t.inputBg,
    border: `1.5px solid ${t.inputBorder}`,
    borderRadius: 12,
    fontFamily: 'DM Sans',
    fontSize: 15,
    color: t.text,
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23767676' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: 40,
  }
}

// ─── Main CheckoutSheet ───────────────────────────────────────────────────────

type Props = {
  open: boolean
  onClose: () => void
  product: Product
  theme: Theme
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'card', label: 'Tarjeta', icon: '💳' },
  { id: 'virtual', label: 'Cuenta virtual', icon: '🏦' },
  { id: 'apm', label: 'Otros', icon: '⚡' },
]

export default function CheckoutSheet({ open, onClose, product, theme: t }: Props) {
  const [tab, setTab] = useState<Tab>('card')
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setSuccess(false)
      setPaying(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => { setPaying(false); setSuccess(true) }, 2000)
  }

  if (!open && !mounted) return null

  const sheetVisible = open

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <>
      {/* Inject animation styles once */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }
        @keyframes popCheck {
          0% { transform: scale(0); }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .pay-btn:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: scale(0.993);
        }
        .pay-btn:active:not(:disabled) {
          transform: scale(0.985);
        }
        .pay-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .tab-btn:hover {
          opacity: 0.85;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 40,
          opacity: sheetVisible ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: sheetVisible ? 'auto' : 'none',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: t.sheetBg,
          borderRadius: '28px 28px 0 0',
          boxShadow: t.shadow,
          zIndex: 50,
          transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.48s cubic-bezier(0.32,0.72,0,1)',
          maxHeight: '90%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onTransitionEnd={() => { if (!open) setMounted(false) }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, background: t.border, borderRadius: 2 }} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            background: t.surfaceBg,
            color: t.textMuted,
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >×</button>

        {/* Scrollable content */}
        <div ref={scrollRef} style={{ overflowY: 'auto', flex: 1, padding: '8px 20px 0' }}>

          {success ? (
            /* ── Success State ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0 24px', gap: 16 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: `linear-gradient(135deg, #22C55E, #16A34A)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32,
                animation: 'popCheck 0.5s cubic-bezier(0.34,1.56,0.64,1)',
              }}>✓</div>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 600, color: t.text }}>
                  ¡Pago confirmado!
                </h2>
                <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: t.textMuted, marginTop: 6 }}>
                  {product.name}
                </p>
                <p style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 600, color: '#22C55E', marginTop: 8 }}>
                  {product.currency} {product.price.toFixed(2)}
                </p>
              </div>
              <div style={{
                background: t.surfaceBg,
                borderRadius: 14,
                padding: '12px 20px',
                width: '100%',
                textAlign: 'center',
              }}>
                <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: t.textMuted }}>Nro. de orden</p>
                <p style={{ fontFamily: 'DM Sans', fontSize: 15, fontWeight: 600, color: t.text, marginTop: 2, letterSpacing: '0.05em' }}>
                  LP-{Math.random().toString(36).toUpperCase().slice(2, 10)}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: t.accent,
                  color: t.accentText,
                  border: 'none',
                  borderRadius: 16,
                  fontFamily: 'DM Sans',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 8,
                }}
              >
                Volver a {t.hostName}
              </button>
            </div>
          ) : (
            <>
              {/* ── Product Preview ── */}
              <div style={{
                background: t.surfaceBg,
                borderRadius: 20,
                padding: 14,
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                marginBottom: 20,
                border: `1px solid ${t.border}`,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Ambient glow */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(ellipse at 30% 50%, ${t.accent}12 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Product image */}
                <div style={{
                  width: 76,
                  height: 76,
                  borderRadius: 14,
                  background: product.gradient,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                }}>🛍️</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{
                      fontFamily: 'DM Sans', fontSize: 11, color: t.accent, fontWeight: 600,
                      background: `${t.accent}15`, borderRadius: 6, padding: '2px 7px',
                    }}>Sponsored</span>
                    {discount && (
                      <span style={{
                        fontFamily: 'DM Sans', fontSize: 11, color: '#16A34A', fontWeight: 600,
                        background: '#16A34A15', borderRadius: 6, padding: '2px 7px',
                      }}>-{discount}%</span>
                    )}
                  </div>
                  <p style={{
                    fontFamily: 'Fraunces',
                    fontSize: 15,
                    fontWeight: 600,
                    color: t.text,
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{product.name}</p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                    por {product.seller}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                    <span style={{
                      fontFamily: 'Fraunces',
                      fontSize: 20,
                      fontWeight: 700,
                      color: t.accent,
                    }}>{product.currency} {product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span style={{
                        fontFamily: 'DM Sans',
                        fontSize: 13,
                        color: t.textMuted,
                        textDecoration: 'line-through',
                      }}>{product.currency} {product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Payment Tabs ── */}
              <div style={{
                background: t.surfaceBg,
                borderRadius: 16,
                padding: 4,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 3,
                marginBottom: 20,
                border: `1px solid ${t.border}`,
              }}>
                {TABS.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    className="tab-btn"
                    onClick={() => setTab(id)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: 12,
                      border: 'none',
                      background: tab === id ? t.tabActiveBg : 'transparent',
                      boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.22s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    <span style={{
                      fontFamily: 'DM Sans',
                      fontSize: 11,
                      fontWeight: tab === id ? 600 : 400,
                      color: tab === id ? t.accent : t.textMuted,
                      transition: 'color 0.22s',
                      lineHeight: 1.2,
                      textAlign: 'center',
                    }}>{label}</span>
                    {tab === id && (
                      <div style={{
                        width: 16, height: 2,
                        background: t.accent,
                        borderRadius: 1,
                      }} />
                    )}
                  </button>
                ))}
              </div>

              {/* ── Form Content ── */}
              <div style={{ animation: 'fadeUp 0.3s ease' }} key={tab}>
                {tab === 'card' && <CardForm t={t} />}
                {tab === 'virtual' && <VirtualAccountForm t={t} />}
                {tab === 'apm' && <AlternativeMethods t={t} price={product.price} currency={product.currency} />}
              </div>
            </>
          )}
        </div>

        {/* ── Footer sticky ── */}
        {!success && (
          <div style={{ padding: '16px 20px 24px', background: t.sheetBg }}>
            {/* Pay button */}
            <button
              className="pay-btn"
              onClick={handlePay}
              disabled={paying}
              style={{
                width: '100%',
                padding: '16px',
                background: paying
                  ? t.accentDark
                  : `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDark} 100%)`,
                color: t.accentText,
                border: 'none',
                borderRadius: 18,
                fontFamily: 'Fraunces',
                fontSize: 17,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'all 0.18s',
                letterSpacing: '0.01em',
              }}
            >
              {paying ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: 'spinRing 0.8s linear infinite' }}>
                    <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M10 2a8 8 0 0 1 8 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Procesando…
                </>
              ) : (
                <>🔒 Pagar {product.currency} {product.price.toFixed(2)}</>
              )}
            </button>

            {/* Security note + LP branding */}
            <div style={{
              marginTop: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}>
              <p style={{ fontFamily: 'DM Sans', fontSize: 11, color: t.textMuted, textAlign: 'center' }}>
                🔒 Pago seguro · Encriptación TLS 256-bit
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: t.textMuted, letterSpacing: '.3px' }}>
                  Powered by
                </span>
                <img
                  src={t.logoVariant === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
                  alt="LocalPayment"
                  style={{ height: 18, opacity: 0.75 }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
