import { useEffect, useState } from 'react'

function getRemaining(target) {
  const difference = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export default function Countdown({ target = '2027-01-31T12:00:00' }) {
  const [remaining, setRemaining] = useState(() => getRemaining(target))

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(target)), 1000)
    return () => window.clearInterval(timer)
  }, [target])

  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {Object.entries(remaining).map(([label, value]) => (
        <div className="countdown__unit" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
