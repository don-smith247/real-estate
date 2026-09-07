import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ImageGallery({ images = [], title = '' }) {
  const [lightbox, setLightbox] = useState(false);
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent(c => (c === 0 ? images.length - 1 : c - 1)), [images.length]);
  const next = useCallback(() => setCurrent(c => (c === images.length - 1 ? 0 : c + 1)), [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next]);

  if (!images.length) return null;

  const primary = images[0];
  const secondary = images.slice(1, 5);

  return (
    <>
      {/* Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: secondary.length >= 2 ? '2fr 1fr' : '1fr',
        gridTemplateRows: secondary.length >= 4 ? '50% 50%' : 'auto',
        gap: 4,
        borderRadius: 'var(--r-2xl)',
        overflow: 'hidden',
        aspectRatio: secondary.length >= 2 ? '16/7' : '16/9',
        position: 'relative',
      }}>
        {/* Primary Image */}
        <div
          style={{ position: 'relative', gridRow: secondary.length >= 2 ? 'span 2' : 'auto', cursor: 'pointer' }}
          className="img-hover-zoom"
          onClick={() => { setCurrent(0); setLightbox(true); }}
        >
          <img
            src={primary.url}
            alt={primary.caption || title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Secondary Images */}
        {secondary.map((img, i) => (
          <div
            key={i}
            style={{ position: 'relative', cursor: 'pointer' }}
            className="img-hover-zoom"
            onClick={() => { setCurrent(i + 1); setLightbox(true); }}
          >
            <img src={img.url} alt={img.caption || `${title} ${i + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}

        {/* Show All Button */}
        <button
          onClick={() => { setCurrent(0); setLightbox(true); }}
          style={{
            position: 'absolute', bottom: 'var(--s-4)', right: 'var(--s-4)',
            display: 'flex', alignItems: 'center', gap: 'var(--s-2)',
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: 'var(--r-lg)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--midnight)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            transition: 'all var(--t-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.transform = ''; }}
        >
          <Maximize2 size={13} />
          View All {images.length} Photos
        </button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9000,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex', flexDirection: 'column',
            }}
            onClick={() => setLightbox(false)}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--s-4) var(--s-6)', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontSize: '1.125rem', fontWeight: 500 }}>
                {title} — Photo {current + 1} of {images.length}
              </div>
              <button
                onClick={() => setLightbox(false)}
                style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 'var(--r-md)', color: 'var(--white)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Image */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 var(--s-16)', overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={images[current]?.url}
                  alt={images[current]?.caption || title}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 'var(--r-lg)' }}
                />
              </AnimatePresence>

              {/* Nav Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    style={{
                      position: 'absolute', left: 'var(--s-4)',
                      width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 'var(--r-full)', color: 'var(--white)', cursor: 'pointer',
                      transition: 'background var(--t-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={next}
                    style={{
                      position: 'absolute', right: 'var(--s-4)',
                      width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 'var(--r-full)', color: 'var(--white)', cursor: 'pointer',
                      transition: 'background var(--t-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 'var(--s-2)', padding: 'var(--s-4) var(--s-6)', overflowX: 'auto', flexShrink: 0 }}
              onClick={e => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: 72, height: 52, flexShrink: 0,
                    borderRadius: 'var(--r-md)',
                    overflow: 'hidden',
                    border: `2px solid ${i === current ? 'var(--gold)' : 'transparent'}`,
                    cursor: 'pointer',
                    opacity: i === current ? 1 : 0.55,
                    transition: 'all var(--t-fast)',
                    padding: 0,
                    background: 'none',
                  }}
                >
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
