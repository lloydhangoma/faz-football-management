import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsSlide {
  id: number;
  image: string;
  category: string;
  title: string;
  date: string;
  link: string;
}

const SLIDES: NewsSlide[] = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149065/Chipolopolo_dtapv7.jpg',
    category: 'SENIOR MEN',
    title: 'CHIPOLOPOLO KICK OFF INTENSIVE PREPARATIONS FOR WORLD CUP QUALIFIERS',
    date: '12 June 2024',
    link: '#'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149064/copperQueens_izzthq.jpg',
    category: 'WOMEN SELECTION',
    title: 'COPPER QUEENS ROSTER ANNOUNCED FOR UPCOMING PARIS OLYMPICS',
    date: '15 May 2024',
    link: '#'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149064/under_17_hnyht0.jpg',
    category: 'YOUTH DEVELOPMENT',
    title: 'UNDER-17 SQUAD CAMPING COMMENCES AHEAD OF COSAFA CHAMPIONSHIP',
    date: '20 May 2024',
    link: '#'
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149065/Futsal_team._wthik0.jpg',
    category: 'FUTSAL',
    title: 'ZAMBIA FUTSAL NATIONAL TEAM EYES VICTORY IN AFCON FINALS',
    date: '28 May 2024',
    link: '#'
  }
];

const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[60vh] w-full overflow-hidden bg-black">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-linear"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === current ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
          </div>

          {/* News Content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-24 md:pb-32">
            <div className={`max-w-4xl transform transition-all duration-700 delay-200 ${
              index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {/* Category Tag */}
              <div className="mb-4">
                <span className="text-[#f97316] font-bold text-sm md:text-base uppercase tracking-widest drop-shadow-lg">
                  {slide.category}
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-7xl font-bold text-white leading-[1.1] mb-6 drop-shadow-2xl uppercase">
                {slide.title}
              </h2>

              {/* Date */}
              <p className="text-white/80 text-sm md:text-lg font-medium tracking-wide">
                {slide.date}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1 transition-all duration-300 rounded-full ${
              idx === current ? 'w-10 bg-white' : 'w-4 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-10 right-10 z-20 flex gap-4">
        <button
          onClick={prevSlide}
          className="p-3 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

// Ensure this default export is here!
export default HeroSlider;