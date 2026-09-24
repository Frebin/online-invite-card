import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import invitationAnimation from '../assets/mp4/invitation-card-envolop-animation.mp4'

export default function Gatefold({ isOpen, onOpen }) {
  const videoRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => () => window.clearTimeout(fadeTimerRef.current), [])

  const playInvitation = () => {
    if (hasStarted || isFading || isOpen) return
    setHasStarted(true)
    videoRef.current?.play().catch(() => setHasStarted(false))
  }

  const finishInvitation = () => {
    setIsFading(true)
    fadeTimerRef.current = window.setTimeout(onOpen, 700)
  }

  return (
    <motion.div
      className={`gatefold ${isOpen ? 'gatefold--open' : ''}`}
      animate={{ opacity: isFading || isOpen ? 0 : 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      aria-hidden={isOpen}
      onClick={playInvitation}
      role="button"
      tabIndex={isOpen ? -1 : 0}
      onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && playInvitation()}
      aria-label={hasStarted ? 'Invitation animation playing' : 'Tap anywhere to play invitation'}
    >
      <video
        ref={videoRef}
        className="gatefold__video"
        src={invitationAnimation}
        muted
        playsInline
        preload="auto"
        onEnded={finishInvitation}
      >
        Your browser does not support invitation video playback.
      </video>
    </motion.div>
  )
}
