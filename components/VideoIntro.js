'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/VideoIntro.module.css';

const CinematicLayer = dynamic(() => import('./CinematicLayer'), { ssr: false });

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
);
const IconVolumeOn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
);
const IconVolumeMute = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
);

export default function VideoIntro({
  videoSrc = '/portfolio.mp4',
  firstName = 'Chittepu',
  lastName = 'Pallavi',
  tagline = 'Software Developer & AI Enthusiast',
  role = 'Passionate B.Tech Computer Science student focused on building scalable software solutions using Java, AI, Full Stack Development, and Modern Web Technologies.',
  nextSectionRef,
}) {
  const videoRef    = useRef(null);
  const ambientRef  = useRef(null);
  const fadeRef     = useRef(null);
  const contentRef  = useRef(null);
  const scrollRef   = useRef(null);
  const controlsRef = useRef(null);

  const [isPlaying, setIsPlaying]           = useState(true);
  const [isMuted,   setIsMuted]             = useState(true);
  const [soundHintVisible, setHintVisible]  = useState(true);
  const [showUnmutePrompt, setShowPrompt]   = useState(false);

  // GSAP entrance
  useEffect(() => {
    let cancelled = false;
    async function go() {
      const mod  = await import('gsap');
      if (cancelled) return;
      const gsap = mod.gsap || mod.default;

      gsap.to(fadeRef.current, { opacity: 0, duration: 1.6, ease: 'power2.inOut', delay: 0.3 });

      const els = contentRef.current?.querySelectorAll('[data-anim]');
      if (els?.length) {
        gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.14, delay: 0.9 });
      }
      gsap.to(controlsRef.current, { opacity: 1, x: 0, duration: 1, ease: 'power2.out', delay: 1.6 });
      gsap.to(scrollRef.current,   { opacity: 1,       duration: 1, ease: 'power2.out', delay: 2.2 });
    }
    go();
    return () => { cancelled = true; };
  }, []);

  // Auto-hide sound hint — then show unmute prompt after 2s
  useEffect(() => {
    const t1 = setTimeout(() => setHintVisible(false), 4200);
    const t2 = setTimeout(() => setShowPrompt(true),   5500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setIsPlaying(true); }
    else          { v.pause(); setIsPlaying(false); }
  }, []);

  // ── SOUND FIX: unmute + play to satisfy browser autoplay policy ──
  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    const a = ambientRef.current;
    if (!v) return;
    const goMuted = !v.muted;
    v.muted = goMuted;
    if (a) a.muted = true; // ambient stays muted always
    setIsMuted(goMuted);
    setHintVisible(false);
    setShowPrompt(false);
    // If unmuting — ensure video is playing (browsers require play() for audio)
    if (!goMuted && v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  const syncAmbient = useCallback(() => {
    const v = videoRef.current;
    const a = ambientRef.current;
    if (v && a) a.currentTime = v.currentTime;
  }, []);

  const scrollToNext = useCallback(() => {
    if (nextSectionRef?.current) {
      nextSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [nextSectionRef]);

  return (
    <section className={styles.hero} id="home">
      {/* Page-load black fade */}
      <div ref={fadeRef} className={styles.fadeOverlay} />

      {/* Ambient blurred background — always muted */}
      <video ref={ambientRef} className={styles.ambientBg}
        src={videoSrc} autoPlay loop muted playsInline preload="auto"
        onCanPlay={syncAmbient} aria-hidden="true" />

      {/* Main video */}
      <div className={styles.videoWrap}>
        <video ref={videoRef} className={styles.videoMain}
          src={videoSrc} autoPlay loop muted playsInline preload="auto"
          aria-label="Portfolio introduction video"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)} />
      </div>

      {/* Cinematic overlays */}
      <div className={styles.gradientTop} />
      <div className={styles.gradientBottom} />
      <div className={styles.gradientSides} />
      <div className={styles.warmAccent} />

      {/* Three.js particle layer */}
      <CinematicLayer />

      {/* "Tap for sound" initial hint */}
      <div className={`${styles.soundHint} ${!soundHintVisible ? styles.soundHintHidden : ''}`} aria-hidden="true">
        <span className={styles.soundHintDot} />
        Tap 🔈 for sound
      </div>

      {/* Persistent unmute prompt (appears after hint fades) */}
      {showUnmutePrompt && isMuted && (
        <button className={styles.unmutePrompt} onClick={toggleMute} aria-label="Enable sound">
          <span className={styles.unmuteIcon}>
            <IconVolumeMute />
          </span>
          <span>Enable Sound</span>
        </button>
      )}

      {/* Content */}
      <div ref={contentRef} className={styles.content}>
        <span className={styles.tagline} data-anim="true">{tagline}</span>
        <span className={styles.nameFirst} data-anim="true">{firstName}</span>
        <span className={styles.nameLast}  data-anim="true">{lastName}</span>
        <p    className={styles.role}      data-anim="true">{role}</p>
      </div>

      {/* Controls */}
      <div ref={controlsRef} className={styles.controls}>
        <button className={styles.controlBtn} onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>
        <button className={styles.controlBtn} onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'} title={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted ? <IconVolumeMute /> : <IconVolumeOn />}
        </button>
      </div>

      {/* Scroll indicator */}
      <button ref={scrollRef} className={styles.scrollIndicator} onClick={scrollToNext} aria-label="Scroll down">
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLineWrap}><div className={styles.scrollLine} /></div>
      </button>
    </section>
  );
}

