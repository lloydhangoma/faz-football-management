import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
export type NewsCategory = 
  | "All" 
  | "Senior Men" 
  | "Copper Queens" 
  | "Youth Teams" 
  | "FAZ Updates" 
  | "Competitions";

interface NewsArticle {
  id: string;
  category: NewsCategory;
  date: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  isPriority?: boolean;
  link: string;
}

// --- Mock Data ---
const newsArticles: NewsArticle[] = [
  {
    id: "1",
    category: "Copper Queens",
    date: "Feb 22, 2026",
    title: "Copper Queens Secure Qualification for 2026 WAFCON",
    excerpt: "The senior women's team continues their continental dominance with a decisive aggregate victory, securing their spot in the upcoming Women's Africa Cup of Nations.",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838601/515992318_713082761545170_5863502301176627390_n.jpg_sw3ows.jpg",
    isPriority: true,
    link: "/news/copper-queens-wafcon"
  },
  {
    id: "2",
    category: "Senior Men",
    date: "Feb 20, 2026",
    title: "Chipolopolo Set for FIFA World Cup Qualifier in Ndola",
    excerpt: "The Football Association of Zambia (FAZ) confirms the Levy Mwanawasa Stadium as the venue for the crucial upcoming World Cup qualifying fixture.",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838406/484439837_683167534372655_8736568065280107470_n.jpg_rrnghu.jpg",
    link: "/news/chipolopolo-world-cup-ndola"
  },
  {
    id: "3",
    category: "FAZ Updates",
    date: "Feb 18, 2026",
    title: "FAZ Announces Strategic Partnership for Grassroots Development",
    excerpt: "A new multi-year technical partnership aimed at enhancing the youth scouting network across all 10 provinces of Zambia has been formalized.",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838339/476342917_1137053607861628_5487692093780309495_n.jpg_nbv4kv.jpg",
    link: "/news/faz-grassroots-partnership"
  },
  {
    id: "4",
    category: "Youth Teams",
    date: "Feb 15, 2026",
    title: "U-17 Squad Enters Residential Camp Ahead of COSAFA",
    excerpt: "The young Chipolopolo have reported for training camp in Lusaka as preparations intensify for the regional youth championships.",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838243/518266916_10171978474445054_7917181035867965219_n.jpg_jowi5g.jpg",
    link: "/news/u17-cosafa-camp"
  },
{
  id: "7",
  category: "Senior Men",
  date: "Feb 3, 2026",
  title: "Chipolopolo Begin Preparations for AFCON Qualifiers",
  excerpt:
    "Head coach names provisional 28-man squad as Zambia intensifies preparations for the upcoming Africa Cup of Nations qualifiers.",
  imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
  link: "/news/afcon-qualifier-preparations",
},
{
  id: "8",
  category: "Copper Queens",
  date: "Feb 1, 2026",
  title: "Barbra Banda Wins CAF Player of the Month",
  excerpt:
    "Copper Queens captain Barbra Banda has been named CAF Women's Player of the Month following her outstanding performances.",
  imageUrl: "https://images.unsplash.com/photo-1606925797300-0b35e9c8f3f5",
  link: "/news/banda-caf-award",
},
{
  id: "9",
  category: "Youth Teams",
  date: "Jan 29, 2026",
  title: "U-20 Squad Advances to COSAFA Final",
  excerpt:
    "Zambia’s U-20 national team books a place in the COSAFA final after a dramatic penalty shootout victory.",
  imageUrl: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
  link: "/news/u20-cosafa-final",
},
{
  id: "10",
  category: "Competitions",
  date: "Jan 25, 2026",
  title: "2026 Super League Season Fixtures Released",
  excerpt:
    "FAZ officially releases the 2026 MTN Super League fixtures with defending champions set for a tough opening match.",
  imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b",
  link: "/news/super-league-fixtures",
},
{
  id: "11",
  category: "FAZ Updates",
  date: "Jan 22, 2026",
  title: "FAZ Launches Nationwide Coaching Development Program",
  excerpt:
    "Over 200 grassroots coaches will benefit from a newly launched CAF-accredited coaching development initiative.",
  imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b",
  link: "/news/coaching-development",
},
{
  id: "12",
  category: "Copper Queens",
  date: "Jan 18, 2026",
  title: "Copper Queens Friendly Match Announced",
  excerpt:
    "Zambia will face South Africa in an international friendly as part of preparations for WAFCON 2026.",
  imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
  link: "/news/queens-friendly",
},
{
  id: "13",
  category: "Senior Men",
  date: "Jan 15, 2026",
  title: "Fashion Sakala Returns to National Duty",
  excerpt:
    "Forward Fashion Sakala rejoins the Chipolopolo squad ahead of the upcoming international window.",
  imageUrl: "https://images.unsplash.com/photo-1543353071-873f17a7a088",
  link: "/news/sakala-returns",
},
{
  id: "14",
  category: "Youth Teams",
  date: "Jan 10, 2026",
  title: "FAZ Talent Identification Program Expands to Western Province",
  excerpt:
    "The FAZ scouting network continues its expansion with new talent identification centers in Western Province.",
  imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b",
  link: "/news/talent-expansion",
},
{
  id: "15",
  category: "Competitions",
  date: "Jan 8, 2026",
  title: "Women’s Super League Kicks Off in March",
  excerpt:
    "FAZ confirms March kickoff for the 2026 Women’s Super League season with increased sponsorship backing.",
  imageUrl: "https://images.unsplash.com/photo-1494173853739-c21f58b16055",
  link: "/news/womens-super-league",
},
{
  id: "16",
  category: "FAZ Updates",
  date: "Jan 5, 2026",
  title: "FAZ President Addresses Annual General Meeting",
  excerpt:
    "Key reforms and strategic objectives outlined during the 2026 FAZ Annual General Meeting in Lusaka.",
  imageUrl: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
  link: "/news/faz-agm-2026",
},
{
  id: "17",
  category: "Senior Men",
  date: "Dec 28, 2025",
  title: "Chipolopolo Climb FIFA Rankings",
  excerpt:
    "Zambia moves up five places in the latest FIFA World Rankings following impressive international performances.",
  imageUrl: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a",
  link: "/news/fifa-ranking-rise",
},
{
  id: "18",
  category: "Copper Queens",
  date: "Dec 20, 2025",
  title: "Grace Chanda Signs New European Deal",
  excerpt:
    "Copper Queens midfielder Grace Chanda secures a new contract with her European club.",
  imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20",
  link: "/news/grace-chanda-deal",
},
{
  id: "19",
  category: "Youth Teams",
  date: "Dec 15, 2025",
  title: "U-23 Team Announces Olympic Qualifier Squad",
  excerpt:
    "The Zambia U-23 side names a 25-player squad ahead of the Olympic qualifying tournament.",
  imageUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402",
  link: "/news/u23-olympic-qualifiers",
},
{
  id: "20",
  category: "Competitions",
  date: "Dec 10, 2025",
  title: "ABSA Cup Quarterfinal Draw Conducted",
  excerpt:
    "The quarterfinal fixtures for the 2026 ABSA Cup have been officially drawn at Football House.",
  imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b",
  link: "/news/absa-quarterfinal-draw",
},
{
  id: "21",
  category: "FAZ Updates",
  date: "Dec 5, 2025",
  title: "FAZ Introduces VAR Training Workshop",
  excerpt:
    "Match officials undergo intensive Video Assistant Referee (VAR) training ahead of full implementation.",
  imageUrl: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  link: "/news/var-workshop",
},

];

const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("All");

  const filteredNews = activeCategory === "All" 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeCategory);

  const categories: NewsCategory[] = ["All", "Senior Men", "Copper Queens", "Youth Teams", "FAZ Updates"];

  return (
    <div className="w-full bg-white min-h-screen font-sans text-gray-900">
      {/* Header */}
      <section className="bg-green-900 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-4">
            Media Centre
          </h1>
          <p className="text-green-100/80 max-w-2xl text-lg">
            The official source for Zambia National Team news, competition updates, and Football Association announcements.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-6 text-xs uppercase tracking-widest font-bold border-b-2 transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? "border-orange-600 text-orange-600" 
                  : "border-transparent text-gray-400 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredNews.map((article) => (
              <motion.article
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className={`group flex flex-col ${article.isPriority ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100 mb-6">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                    {article.date}
                  </span>
                  <h2 className={`font-bold text-gray-900 group-hover:text-green-800 transition-colors mb-4 uppercase tracking-tight ${
                    article.isPriority ? 'text-3xl' : 'text-xl'
                  }`}>
                    {article.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <a 
                    href={article.link}
                    className="mt-auto text-xs font-bold uppercase tracking-[0.2em] text-green-900 flex items-center gap-2 group-hover:gap-4 transition-all"
                  >
                    Read Article <span className="text-orange-600">→</span>
                  </a>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default News;