import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HERO_POSTER } from '../data/eventImages';

// Cinematic event/concert stock videos (Pexels — free license)
const VIDEO_SOURCES = [
  'https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_24fps.mp4',
  'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4',
];

const POSTER = HERO_POSTER;

const HeroVideoBackground = ({ children, className = '' }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  return (
    <section className={`relative min-h-[100vh] flex flex-col overflow-hidden ${className}`}>
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={POSTER}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          {VIDEO_SOURCES.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>

        {/* Gradient overlays */}
        <div className="absolute inset-0 hero-video-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/30" />

        {/* Animated pastel orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-400/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-accent-400/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-300/10 rounded-full blur-[130px]"
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>

      {/* Bottom wave transition */}
      <div className="relative z-10 w-full leading-[0]">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80L60 70C120 60 240 40 360 33.3C480 26.7 600 33.3 720 40C840 46.7 960 53.3 1080 50C1200 46.7 1320 33.3 1380 26.7L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            className="fill-neutral-50 dark:fill-neutral-900"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroVideoBackground;
