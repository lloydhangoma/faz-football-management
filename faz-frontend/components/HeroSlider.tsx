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
    category: 'GENERAL NEWS',
    title: 'Chipolopolo kick off intensive preparations for World Cup Qualifiers',
    date: '12 June 2024',
    link: '#'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149064/copperQueens_izzthq.jpg',
    category: 'GENERAL NEWS',
    title: 'Copper Queens roster announced for upcoming Paris Olympics',
    date: '15 May 2024',
    link: '#'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dsztrq47q/image/upload/v1769156646/Gemini_Generated_Image_n12epin12epin12e_zhrgrw.png',
    category: 'YOUTH DEVELOPMENT',
    title: 'Under-17 squad camping commences ahead of COSAFA Championship',
    date: '20 May 2024',
    link: '#'
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/dsztrq47q/image/upload/v1769157171/Gemini_Generated_Image_pvqxy2pvqxy2pvqx_qnmcgl.png',
    category: 'FUTSAL',
    title: 'Zambia Futsal National Team eyes victory in AFCON Finals',
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
    <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden bg-black font-sans">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image - Full view logic */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Soft gradient overlay exactly like the SAFA screenshots */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          </div>

          {/* Content Wrapper */}
          <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-16 md:pb-24">
            <div className={`max-w-4xl transform transition-all duration-700 ${
              index === current ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              
              {/* Category Tag - Fixed Font Style */}
              <span className="text-[#f97316] font-semibold text-sm md:text-base uppercase tracking-wider mb-2 block">
                {slide.category}
              </span>

              {/* Headline - Clean Sans Font, Proportional Size */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-4 drop-shadow-sm">
                {slide.title}
              </h2>

              {/* Date - Simple and Clean */}
              <p className="text-white/90 text-sm md:text-lg font-normal">
                {slide.date}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Indicators - Minimalist lines at bottom left */}
      <div className="absolute bottom-8 left-6 md:left-12 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-[2px] transition-all duration-500 ${
              idx === current ? 'w-8 bg-white' : 'w-4 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows - Minimalist Bottom Right */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 flex gap-4">
        <button onClick={prevSlide} className="text-white/70 hover:text-white transition-colors">
          <ChevronLeft size={28} strokeWidth={1.5} />
        </button>
        <button onClick={nextSlide} className="text-white/70 hover:text-white transition-colors">
          <ChevronRight size={28} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;