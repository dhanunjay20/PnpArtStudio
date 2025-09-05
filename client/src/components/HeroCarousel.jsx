// src/components/HeroCarousel.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Local hero images (replace with your own)
import img1 from '../assets/heroimg1.jpg';
import img2 from '../assets/heroimg2.jpg';
import img3 from '../assets/heroimg3.jpg';
import img4 from '../assets/heroimg4.jpg';

const PAINTING_SLIDES = [
  { id: 'p1', image: img1, alt: 'Abstract canvas with rich colors' },
  { id: 'p2', image: img4, alt: 'Oil painting materials and palette' },
  { id: 'p3', image: img3, alt: 'Paintings displayed in an interior' }
];

const HeroCarousel = ({
  slides = PAINTING_SLIDES,
  autoPlay = true,
  interval = 3000,
  showArrows = true,
  showIndicators = true,
  onSlideChange
}) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = slides.length;

  const goTo = (i) => {
    const next = (i + total) % total;
    setIndex(next);
    if (typeof onSlideChange === 'function') onSlideChange(next);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Autoplay handling
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    clearInterval(timerRef.current);
    if (!pausedRef.current) {
      timerRef.current = setInterval(next, Math.max(1500, interval));
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, autoPlay, interval, total]);

  // Pause on hover
  const onMouseEnter = () => {
    pausedRef.current = true;
    clearInterval(timerRef.current);
  };
  const onMouseLeave = () => {
    pausedRef.current = false;
    if (autoPlay) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(next, Math.max(1500, interval));
    }
  };

  // Touch swipe
  const onTouchStart = (e) => {
    if (e.changedTouches && e.changedTouches) {
      touchStartX.current = e.changedTouches.clientX;
    }
  };
  const onTouchMove = (e) => {
    if (e.changedTouches && e.changedTouches) {
      touchEndX.current = e.changedTouches.clientX;
    }
  };
  const onTouchEnd = () => {
    const dx = touchEndX.current - touchStartX.current;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const currentSlide = useMemo(() => slides[index], [slides, index]);

  return (
    <div
      className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Slide image (crossfade + slight zoom) */}
      <div className="w-100 h-100 position-relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.alt || ''}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.3, scale: 1.02 }}
            transition={{ duration: 0, ease: 'easeOut' }}
            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          />
        </AnimatePresence>
      </div>

      {/* Circular arrow controls */}
      {showArrows && total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="btn position-absolute z-3 p-0 d-flex align-items-center justify-content-center"
            style={{
              top: '50%',
              left: 16,
              transform: 'translateY(-50%)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.9)',
              boxShadow: '0 2px 10px rgba(0,0,0,.15)'
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="btn position-absolute z-3 p-0 d-flex align-items-center justify-content-center"
            style={{
              top: '50%',
              right: 16,
              transform: 'translateY(-50%)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.9)',
              boxShadow: '0 2px 10px rgba(0,0,0,.15)'
            }}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && total > 1 && (
        <div
          className="position-absolute start-50 translate-middle-x d-flex gap-2 z-3"
          style={{ bottom: 16 }}
        >
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="p-0 border-0"
                style={{
                  width: active ? 22 : 10,
                  height: 10,
                  borderRadius: 999,
                  background: active ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.6)',
                  transition: 'all .25s ease'
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
