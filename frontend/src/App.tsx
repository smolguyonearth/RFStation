import { useEffect, useState, useRef } from 'react'
import './index.css'

type DeviceData = {
  id: string; // Added unique ID for React keys
  device_code: string;
  nearest_device: string;
  rssi: number;
  zone_code: string;
}

export default function App() {
  const [stream, setStream] = useState<DeviceData[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const bufferRef = useRef<DeviceData[]>([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws')
    let counter = 0;

    ws.onmessage = (event) => {
      const rawData = JSON.parse(event.data)
      const newData: DeviceData = { 
        ...rawData, 
        id: `${Date.now()}-${counter++}` // Generate unique ID for React rendering
      }
      
      bufferRef.current = [newData, ...bufferRef.current].slice(0, 100);
    }

    // Throttle React state updates to 10 times per second (100ms)
    // This prevents the browser from freezing if the Pi sends thousands of packets
    const interval = setInterval(() => {
      if (bufferRef.current.length > 0) {
        setStream([...bufferRef.current]);
      }
    }, 100)

    return () => {
      ws.close()
      clearInterval(interval)
    }
  }, [])

  const latest = stream[0];

  return (
    <div style={{ padding: '3rem 1.5rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
          Station <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Monitor</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <span className="status-dot"></span>
          Live Sync
        </div>
      </header>

      {/* Latest Data Hero */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
          Latest Packet
        </h2>
        {latest ? (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', fontWeight: 800, letterSpacing: '-3px', lineHeight: 1, marginBottom: '2.5rem' }}>
              {latest.device_code}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', fontWeight: 600 }}>Nearest</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                  {latest.nearest_device === "X" ? "None" : latest.nearest_device}
                </div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }}></div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', fontWeight: 600 }}>RSSI</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.5px', color: latest.rssi > -60 ? 'var(--success)' : 'var(--text-main)' }}>
                  {latest.rssi} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>dBm</span>
                </div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }}></div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', fontWeight: 600 }}>Zone</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                  {latest.zone_code}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 500 }}>Waiting for data...</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>Ensure Raspberry Pi is sending packets to the backend.</div>
          </div>
        )}
      </section>

      {/* History Section */}
      {stream.length > 0 && (
        <section style={{ textAlign: 'center', paddingBottom: '4rem' }}>
          <button className="btn" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? 'Hide History' : 'Tap to see top 100 history realtime'}
          </button>

          {showHistory && (
            <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <span>Device Path</span>
                <span>Metrics</span>
              </div>
              
              {stream.map((data) => (
                <div key={data.id} className="history-item" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '16px 20px', 
                  background: '#fafafa', 
                  borderRadius: '12px',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{data.device_code}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                    <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {data.nearest_device === "X" ? "None" : data.nearest_device}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '13px' }}>{data.zone_code}</span>
                    <span style={{ 
                      background: data.rssi > -60 ? 'rgba(8, 127, 91, 0.1)' : '#f0f0f0', 
                      color: data.rssi > -60 ? 'var(--success)' : 'var(--text-main)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '13px',
                      minWidth: '50px',
                      textAlign: 'center'
                    }}>
                      {data.rssi}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}