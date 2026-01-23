
import React from 'react';
import { ArrowRight, Clock, Play, Youtube, Facebook, Instagram, Twitter } from 'lucide-react';
import { NewsItem } from '../types';

const FEATURED_NEWS: NewsItem = {
  id: 'feat-1',
  title: 'Chipolopolo secure historic friendly victory against Morocco in Agadir',
  summary: 'In a match that captivated the continent, the Zambian senior men\'s national team displayed exceptional resilience to edge out the Atlas Lions...',
  category: 'Match Report',
  date: '24 May 2024',
  imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200'
};

const SECONDARY_NEWS: NewsItem[] = [
  {
    id: 's1',
    title: 'Women\'s Team: Copper queens kick start Wafcon Preparations',
    summary: 'The Copper Queens have officially begun their preparations for the upcoming Wafcon tournament.',
    category: 'Women\'s Football',
    date: '1 Day Ago',
    imageUrl: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1769091744/copperQueenTraining_g5ypme.jpg'
  },
  {
    id: 's2',
    title: 'FAZ announces new Coaching Education program for 2024',
    summary: 'The technical directorate has unveiled a revamped curriculum for CAF C and D licenses across all provinces.',
    category: 'Development',
    date: '2 Days Ago',
    imageUrl: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg'
  },
  {
    id: 's3',
    title: 'Futsal National team: Zambia clinches victory in COSAFA Futsal Championship opener',
    summary: 'The Zambian futsal national team has secured a hard-fought victory in their opening match of the COSAFA Futsal Championship.',
    category: 'Futsal',
    date: '3 Days Ago',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's4',
    title: 'U17 Copper Queens enter residential camp for World Cup qualifiers',
    summary: 'The young squad has gathered in Lusaka to begin preparations for the final qualifying round.',
    category: 'Youth Football',
    date: '4 Days Ago',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6eda1eed2d?auto=format&fit=crop&q=80&w=800'
  }
];

const NewsSection: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Section Header with Fading Orange Line */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-4xl md:text-5xl font-condensed font-black text-slate-900 uppercase tracking-tighter leading-none">
              News
            </h2>
            <button className="flex items-center gap-1 text-faz-orange font-bold text-sm md:text-base uppercase group transition-colors hover:text-faz-green">
              All News <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
          {/* Custom Fading Divider */}
          <div className="h-[4px] w-full bg-gradient-to-r from-faz-orange via-faz-orange/60 to-transparent" />
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* LEFT CONTENT AREA: Main News Grid */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Featured Horizontal Card */}
            <div className="flex flex-col md:flex-row bg-white border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="md:w-3/5 h-[300px] md:h-[400px] overflow-hidden relative">
                <img 
                  src={FEATURED_NEWS.imageUrl} 
                  alt={FEATURED_NEWS.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="md:w-2/5 p-8 bg-[#1e2a5a] text-white flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-faz-orange mb-4 block">
                  {FEATURED_NEWS.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-black leading-tight mb-4 group-hover:text-faz-orange transition">
                  {FEATURED_NEWS.title}
                </h3>
                <p className="text-sm text-gray-300 mb-6 line-clamp-3">
                  {FEATURED_NEWS.summary}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{FEATURED_NEWS.date}</span>
                </div>
              </div>
            </div>

            {/* Secondary Grid (2x2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SECONDARY_NEWS.map((news) => (
                <article key={news.id} className="bg-white group cursor-pointer">
                  <div className="relative h-48 overflow-hidden mb-4 border border-gray-100">
                    <img 
                      src={news.imageUrl} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-faz-orange mb-2 block">
                    {news.category}
                  </span>
                  <h4 className="text-lg font-black text-slate-800 leading-snug group-hover:text-faz-green transition mb-2">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <Clock className="w-3 h-3" />
                    <span>{news.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT AREA: Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* Social Media Section */}
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">FAZ on Social Media</h3>
              </div>

              {/* Video Highlight Card */}
              <div className="relative aspect-video bg-black overflow-hidden group cursor-pointer mb-6 border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800" 
                  alt="Video Highlight"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    <Youtube className="w-4 h-4 text-red-600" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">YouTube Highlight</span>
                  </div>
                  <h5 className="text-sm font-bold text-white leading-tight">Zambia vs Morocco: All Goals and Highlights | International Friendly</h5>
                </div>
              </div>

              {/* Social Link List */}
              <div className="space-y-4">
                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-faz-green hover:text-white transition group border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-[#1877F2] group-hover:text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest">Follow us on Facebook</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-faz-green hover:text-white transition group border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Twitter className="w-5 h-5 text-[#1DA1F2] group-hover:text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest">Latest updates on X</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-faz-green hover:text-white transition group border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-[#E4405F] group-hover:text-white" />
                    <span className="text-xs font-bold uppercase tracking-widest">Gallery on Instagram</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Vision Banner Card */}
            <div className="relative h-[450px] overflow-hidden shadow-sm group">
              <img 
                src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800" 
                alt="Vision 2030"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-faz-green via-faz-green/40 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-4xl font-condensed font-black uppercase tracking-tighter leading-none mb-2">
                  FAZ VISION 2030
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-faz-orange mb-6">Building a Football Nation</p>
                <p className="text-xs font-medium text-white/80 mb-6 leading-relaxed">
                  Our comprehensive roadmap to elevate Zambian football through infrastructure, technical excellence, and sustainable governance.
                </p>
                <button className="w-full border-2 border-white py-3 text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-faz-green transition">
                  Download Roadmap
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
