export type Theme = {
  id: string
  name: string
  accent: string
  accentDark: string
  accentText: string
  sheetBg: string
  surfaceBg: string
  inputBg: string
  inputBorder: string
  text: string
  textSub: string
  textMuted: string
  border: string
  shadow: string
  tabActiveBg: string
  tabActiveText: string
  logoVariant: 'dark' | 'light'
  hostAccent: string
  hostName: string
}

export const themes: Record<string, Theme> = {
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    accent: '#E60023',
    accentDark: '#AD081B',
    accentText: '#FFFFFF',
    sheetBg: '#FFFFFF',
    surfaceBg: '#F8F8F8',
    inputBg: '#FFFFFF',
    inputBorder: '#E0E0E0',
    text: '#111111',
    textSub: '#444444',
    textMuted: '#767676',
    border: '#EBEBEB',
    shadow: '0 -4px 32px rgba(0,0,0,0.12), 0 -1px 0 rgba(0,0,0,0.04)',
    tabActiveBg: '#FFFFFF',
    tabActiveText: '#111111',
    logoVariant: 'dark',
    hostAccent: '#E60023',
    hostName: 'Pinterest',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    accent: '#FE2C55',
    accentDark: '#CC1535',
    accentText: '#FFFFFF',
    sheetBg: '#1C1C1E',
    surfaceBg: '#2C2C2E',
    inputBg: '#3A3A3C',
    inputBorder: '#48484A',
    text: '#FFFFFF',
    textSub: '#EBEBF5CC',
    textMuted: '#8E8E93',
    border: '#38383A',
    shadow: '0 -4px 32px rgba(0,0,0,0.50)',
    tabActiveBg: '#3A3A3C',
    tabActiveText: '#FFFFFF',
    logoVariant: 'light',
    hostAccent: '#FE2C55',
    hostName: 'TikTok',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    accent: '#E1306C',
    accentDark: '#C13584',
    accentText: '#FFFFFF',
    sheetBg: '#FFFFFF',
    surfaceBg: '#FAFAFA',
    inputBg: '#FFFFFF',
    inputBorder: '#DBDBDB',
    text: '#262626',
    textSub: '#555555',
    textMuted: '#8E8E8E',
    border: '#DBDBDB',
    shadow: '0 -4px 32px rgba(0,0,0,0.10)',
    tabActiveBg: '#FFFFFF',
    tabActiveText: '#262626',
    logoVariant: 'dark',
    hostAccent: '#E1306C',
    hostName: 'Instagram',
  },
}
