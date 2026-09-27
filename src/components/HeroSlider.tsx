import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_SLIDES, MainCategory } from '../data/products';

interface HeroSliderProps {
  onSelectCTA: (target: MainCategory | 'ALL' | 'OFFERS') => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onSelectCTA }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slideCount = HERO_SLIDES.length;

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isPaused, slideCount]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slideCount);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const currentSlide = HERO_SLIDES[activeIndex];

  return (
    <section
      aria-label="Featured Storefront Campaigns"
      className="relative w-full overflow-hidden rounded-3xl bg-[#FDFBF7] border border-slate-200/80 shadow-sm select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[380px] sm:h-[440px] lg:h-[500px] w-full">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              {/* Background Studio Image in 100% Natural Brightness & Colors (No Overlay) */}
              <img
                src={slide.image}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Foreground Editorial Content with Subtle Text Shadow for Readability */}
              <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center">
                <div className="max-w-xl space-y-4">
                  {/* Unboxed clean text kicker */}
                  <div
                    style={{
                      textShadow:
                        '0 1px 3px rgba(15, 23, 42, 0.9), 0 2px 10px rgba(15, 23, 42, 0.65)',
                    }}
                    className="flex items-center flex-wrap gap-2 text-xs sm:text-sm font-bold tracking-wider text-amber-300"
                  >
                    <span>{slide.kicker}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-white">{slide.badgeText}</span>
                  </div>

                  {/* Display Title */}
                  <h1
                    style={{
                      textShadow:
                        '0 2px 4px rgba(15, 23, 42, 0.85), 0 4px 16px rgba(15, 23, 42, 0.6)',
                    }}
                    className="text-3xl sm:text-5xl lg:text-[54px] font-display font-bold text-white leading-[1.08] tracking-tight"
                  >
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p
                    style={{
                      textShadow:
                        '0 1px 3px rgba(15, 23, 42, 0.9), 0 2px 12px rgba(15, 23, 42, 0.65)',
                    }}
                    className="text-base sm:text-lg font-medium text-white leading-relaxed max-w-lg"
                  >
                    {slide.subtitle}
                  </p>

                  {/* Single Primary Focal CTA */}
                  <div className="pt-2 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onSelectCTA(slide.targetCategory || 'ALL')}
                      style={{ backgroundColor: slide.accentColor }}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white shadow-lg hover:brightness-105 transition-transform active:scale-98 cursor-pointer whitespace-nowrap"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span
                      style={{
                        textShadow:
                          '0 1px 3px rgba(15, 23, 42, 0.9), 0 2px 8px rgba(15, 23, 42, 0.65)',
                      }}
                      className="hidden sm:inline-block text-xs text-white font-semibold"
                    >
                      Ages 0–10 Years · Delivery Across India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Left / Right Navigation Arrows */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-slate-50 text-slate-900 flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-slate-50 text-slate-900 flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              className={`h-2.5 rounded-full shadow-sm transition-all cursor-pointer ${
                idx === activeIndex
                  ? 'w-8 bg-[#FF595E] ring-2 ring-white'
                  : 'w-2.5 bg-white hover:bg-amber-200'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter Indicator (Desktop) */}
        <div
          style={{
            textShadow: '0 1px 3px rgba(15, 23, 42, 0.9), 0 2px 8px rgba(15, 23, 42, 0.65)',
          }}
          className="hidden md:flex absolute bottom-5 right-6 z-20 items-center gap-2 text-xs font-mono font-semibold text-white px-3 py-1.5 tabular-nums"
        >
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <span>/</span>
          <span>{String(slideCount).padStart(2, '0')}</span>
          <span>·</span>
          <span>{currentSlide.ctaText}</span>
        </div>
      </div>
    </section>
  );
};
