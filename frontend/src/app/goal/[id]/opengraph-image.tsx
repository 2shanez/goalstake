import { ImageResponse } from 'next/og'

export const alt = 'Vaada Goal'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const GOALS: Record<string, { emoji: string; title: string; desc: string; miles: number; min: number; max: number }> = {
  '10': { emoji: '🌅', title: 'Daily Mile', desc: 'Run 1 mile today', miles: 1, min: 5, max: 50 },
  '1': { emoji: '🌅', title: 'Daily Mile', desc: 'Run 1 mile today', miles: 1, min: 5, max: 50 },
  '2': { emoji: '☀️', title: 'Daily 3', desc: 'Run 3 miles today', miles: 3, min: 5, max: 50 },
  '3': { emoji: '💪', title: 'Weekend Warrior', desc: 'Run 10 miles', miles: 10, min: 10, max: 100 },
}

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const g = GOALS[id] || GOALS['1']
  
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#111' }}>
        <div style={{ fontSize: 80 }}>{g.emoji}</div>
        <div style={{ fontSize: 48, fontWeight: 700, color: 'white', marginTop: 16 }}>{g.title}</div>
        <div style={{ fontSize: 24, color: '#888', marginTop: 8 }}>{g.desc}</div>
        <div style={{ display: 'flex', gap: 32, marginTop: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#2EE59D' }}>{g.miles} mi</div>
            <div style={{ fontSize: 14, color: '#666' }}>Target</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#2EE59D' }}>${g.min}-${g.max}</div>
            <div style={{ fontSize: 14, color: '#666' }}>Stake</div>
          </div>
        </div>
        <div style={{ marginTop: 24, padding: '12px 24px', backgroundColor: '#2EE59D', borderRadius: 12, color: 'white', fontSize: 20, fontWeight: 600 }}>
          vaada.io
        </div>
      </div>
    ),
    { ...size }
  )
}
