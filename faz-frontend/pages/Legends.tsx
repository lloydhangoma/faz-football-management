import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const eras = [
  {
    title: "Historic Pioneer Team KK 11",
    decade: "1960s–1980s",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771497299/118631293_3237148319674190_6231397125503319875_n_jepj83.jpg",
    families: [
      {
        name: "The Nkole Brothers",
        text: "Edward, Patrick, and Abraham represented Zambia in the 1960s and 1970s, marking the first known trio of brothers to feature at the national level.",
      },
      {
        name: "The Makwaza Legacy",
        text: "Dickson Makwaza captained Zambia to its first AFCON appearance in 1974. Two decades later, his son, Linos Makwaza Jr., carried the family legacy forward at AFCON 1994.",
      },
    ],
  },
  {
    title: "AFCON Era Legends",
    decade: "1990s–2000s",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771497600/485743874_1209995393823497_8332294954445413621_n.jpg_n4pm3e.jpg",
    families: [
      {
        name: "The 1994 Finalists",
        text: "The 1994 AFCON Final squad featured two unprecedented pairs of brothers playing simultaneously: Kalusha and Joel Bwalya, alongside Mordon and Kenneth Malitoli.",
      },
      {
        name: "The Mumamba Lineage",
        text: "Numba Mumamba featured in three AFCON tournaments (2000, 2002, 2006), sharing a professional football legacy with his brothers Numba Mwila and Numba Matthews.",
      },
      {
        name: "The Lota Brothers",
        text: "Dennis and Charles Lota both proudly represented Zambia, notably featuring together in the AFCON 2002 squad.",
      },
    ],
  },
  {
    title: "The Golden Generation",
    decade: "2012 Champions",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771498452/632053908_18556823590011288_32180940195841803_n.jpg_krp5tp.jpg",
    families: [
      {
        name: "The Katongo Brothers",
        text: "Christopher and Felix Katongo hold the national record for the most appearances together (31 matches) as siblings. Both secured their legacy by scoring in the historic 2012 AFCON penalty shootout.",
      },
      {
        name: "The Sunzu Family",
        text: "Stoppila Sunzu scored the tournament-winning penalty in 2012. His elder brother Felix also represented Zambia, while younger brothers Jackson, Boniface, and Ngosa all pursued professional football.",
      },
      {
        name: "The Sinkala Lineage",
        text: "Nathan Sinkala (2012 Champion) followed his older brother Andrew (AFCON 2000, 2002, 2006). This extends to a third generation, as their father, Moffat Mutambo, represented Zambia at the 1980 Olympics.",
      },
    ],
  },
];

const legendaryPlayers = [
  {
    name: "Godfrey Chitalu",
    title: "The Ultimate Goalscorer",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771837032/638051419_1419796046254048_8786414385353645821_n.jpg_a3k8q2.jpg",
    description: "Holds the legendary unofficial record of 107 goals in a single calendar year (1972) and remains Zambia's all-time top scorer."
  },
  {
    name: "Kalusha Bwalya",
    title: "King Kalu",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771837889/491805180_122095360688851227_6874018506357918933_n.jpg_kngnwm.jpg",
    description: "1988 African Footballer of the Year. Famous for his hat-trick against Italy at the '88 Olympics and leading the rebuilt 1994 squad."
  },
  {
    name: "Christopher Katongo",
    title: "The Golden Captain",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771837986/480028365_590358410466914_3320753349364386396_n.jpg_n08xdk.jpg",
    description: "Captained Zambia to the 2012 AFCON triumph and won the BBC African Footballer of the Year award the same year."
  },
  {
    name: "Barbra Banda",
    title: "The Modern Trailblazer",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838601/515992318_713082761545170_5863502301176627390_n.jpg_sw3ows.jpg", // Replace with an image of Barbra
    description: "First player in Olympic history to score back-to-back hat-tricks. A global superstar taking the Copper Queens to unprecedented heights."
  },
  {
    name: "Alex Chola",
    title: "The Master Playmaker",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838135/97994317_2920070888047421_655132647516798976_n.jpg_qddfzr.jpg", // Replace with image
    description: "One of the most gifted dribblers and playmakers in African history, remembered as a true genius of the KK11 era."
  },
  {
    name: "Stoppila Sunzu",
    title: "Hero of Libreville",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838243/518266916_10171978474445054_7917181035867965219_n.jpg_jowi5g.jpg", // Replace with image
    description: "Cemented his eternal legacy by scoring the winning penalty in the 2012 AFCON final shootout against Ivory Coast."
  },
  {
    name: "Dickson Makwaza",
    title: "The Pioneer Captain",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838339/476342917_1137053607861628_5487692093780309495_n.jpg_nbv4kv.jpg", // Replace with image
    description: "An exceptional defender and leader who captained the national team to its first-ever AFCON final appearance in 1974."
  },
  {
    name: "Kennedy Mweene",
    title: "The Wall",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838406/484439837_683167534372655_8736568065280107470_n.jpg_rrnghu.jpg",
    description: "Zambia's most capped player. A penalty-saving hero and a key architect of the 2012 Africa Cup of Nations victory."
  }
];

const stats = [
  { value: "30+", label: "Football Families" },
  { value: "100+", label: "Top-Flight Siblings" },
  { value: "60+", label: "Years of Heritage" },
  { value: "1", label: "World Record" },
];

const FadeIn: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { rootMargin: "-80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Legends: React.FC = () => {
  return (
    <div className="w-full font-sans text-gray-900 bg-white overflow-x-hidden">
      
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
        <img 
          src="https://res.cloudinary.com/dsztrq47q/image/upload/v1771495321/632311964_1507941111338062_3582660004753275685_n_dexvrn.jpg"
          alt="Zambia Football Heritage"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 flex items-end">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full pb-16 md:pb-24">
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-orange-500 uppercase tracking-[0.4em] text-xs md:text-sm mb-5 font-semibold"
            >
              A World Record Heritage
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-sans text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tight leading-[0.9] mb-6 max-w-4xl"
            >
              Zambia's Football Legacy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-xl"
            >
              The most football families to ever represent a single nation. Discover the fathers, sons, and brothers who built our national game.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              href="#timeline"
              className="inline-block px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-sans font-bold uppercase tracking-[0.25em] text-sm transition-all hover:translate-y-[-2px] shadow-lg shadow-orange-600/30"
            >
              Explore the Legends
            </motion.a>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-green-900 py-0 border-b border-green-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className={`text-center py-10 md:py-14 ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}>
                <p className="font-sans text-4xl md:text-5xl font-bold text-orange-500 mb-2">{stat.value}</p>
                <p className="font-sans text-white/60 uppercase tracking-[0.2em] text-xs">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* EXECUTIVE SUMMARY */}
      <section className="py-24 md:py-32 px-6 bg-white border-b border-gray-100">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-[2px] bg-orange-500 mx-auto mb-10" />
            <p className="text-gray-600 text-xl md:text-2xl leading-[1.8] font-light italic">
              Zambian football is built on lineage, community, and generational excellence. Historical records indicate that no other nation has produced as many brothers, fathers, and sons who have represented their national team across multiple eras.
            </p>
            <p className="text-gray-900 text-xl md:text-2xl leading-[1.8] font-semibold mt-6">
              Our football is not just played; it is passed down.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* TIMELINE OF LEGENDS */}
      <section id="timeline" className="py-24 md:py-32 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20 md:mb-28">
              <p className="font-sans text-orange-600 uppercase tracking-[0.3em] text-xs mb-4 font-semibold">Through the Decades</p>
              <h2 className="font-sans text-4xl md:text-6xl font-bold text-green-900 uppercase tracking-tight">
                The Timeline of Legends
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-32 md:space-y-40 relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 -translate-x-1/2" />

            {eras.map((era, index) => (
              <div key={index} className="relative">
                <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-orange-500 border-4 border-gray-50 shadow-lg" />

                <div className={`flex flex-col gap-10 lg:gap-16 items-center ${
                  index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }`}>
                  <FadeIn className="w-full lg:w-[45%]" delay={0.1}>
                    <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                      <img 
                        src={era.imageUrl} 
                        alt={era.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 md:p-8">
                        <span className="font-sans text-orange-400 text-sm uppercase tracking-[0.3em] font-bold">{era.decade}</span>
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn className="w-full lg:w-[45%]" delay={0.3}>
                    <div>
                      <h3 className="font-sans text-3xl md:text-4xl font-bold text-green-900 mb-8 uppercase tracking-tight leading-tight">
                        {era.title}
                      </h3>
                      <div className="space-y-8">
                        {era.families.map((fam, fIndex) => (
                          <div key={fIndex} className="pl-5 border-l-2 border-orange-200 hover:border-orange-500 transition-colors duration-300">
                            <h4 className="font-sans text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">{fam.name}</h4>
                            <p className="text-gray-600 leading-relaxed">{fam.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* INDIVIDUAL LEGENDARY PLAYERS (Hall of Fame Icons) */}
      <section className="py-24 md:py-32 px-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16 md:mb-24">
              <p className="font-sans text-orange-600 uppercase tracking-[0.3em] text-xs mb-4 font-semibold">Individual Brilliance</p>
              <h2 className="font-sans text-4xl md:text-5xl font-bold text-green-900 uppercase tracking-tight">
                Hall of Fame Icons
              </h2>
              <div className="w-16 h-1 bg-orange-500 mx-auto mt-6"></div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {legendaryPlayers.map((player, index) => (
              <FadeIn key={index} delay={(index % 4) * 0.15} className="h-full">
                <div className="group h-full flex flex-col bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
                    <img 
                      src={player.imageUrl} 
                      alt={player.name} 
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0  group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="font-sans text-orange-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">{player.title}</p>
                      <h4 className="font-sans text-2xl font-bold text-white uppercase tracking-wide leading-none">{player.name}</h4>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between bg-white relative">
                    <div className="absolute top-0 left-6 right-6 h-px bg-gray-100 -mt-px"></div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {player.description}
                    </p>
                    <button className="mt-6 text-green-900 font-bold uppercase tracking-widest text-xs hover:text-orange-600 transition-colors flex items-center gap-2 w-fit">
                      Read Profile 
                      <span className="text-orange-500 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={0.4}>
            <div className="mt-16 text-center">
               <button className="px-8 py-3 bg-transparent text-green-900 font-sans font-bold hover:bg-gray-50 transition-all uppercase tracking-[0.2em] text-sm border-2 border-gray-200 rounded-sm">
                  View Full Hall of Fame
                </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CONTEMPORARY ICONS */}
      <section className="py-24 md:py-32 px-6 bg-green-50 border-b border-green-100">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="font-sans text-orange-600 uppercase tracking-[0.3em] text-xs mb-4 font-semibold">Still Going Strong</p>
              <h3 className="font-sans text-3xl md:text-5xl font-bold uppercase tracking-tight text-green-900">
                Contemporary Icons & Domestic Lineages
              </h3>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto text-center">
              <p>
                The legacy continues into the modern era and across domestic leagues. Notable football lineages include the <strong className="text-green-900">Musondas</strong> (Charles and Bilton), the <strong className="text-green-900">Mwepus</strong> (Enock and Francesco), the <strong className="text-green-900">Chamas</strong> (Clatous and Adrian), the <strong className="text-green-900">Kapumbus</strong> (Fackson and Kelvin), the <strong className="text-green-900">Chalwes</strong> (Linos, Sashi, and Songwe), and the <strong className="text-green-900">Yobes</strong> (Donwell and Dominic).
              </p>
              <p>
                Furthermore, the trend extends deeply into local club football with the <strong className="text-green-900">Mutapas</strong> (Oswald, Perry, and their father), the <strong className="text-green-900">Janzas</strong> (Honor and Vesper), the <strong className="text-green-900">Sakalas</strong> (Abuid and Saith), the <strong className="text-green-900">Chellas</strong> (Bobton and Paul), and the <strong className="text-green-900">Chamangas</strong> (James and Luka).
              </p>
              <p>
                Goalkeeping talent also runs in families, highlighted by <strong className="text-green-900">Kennedy Mweene</strong> and his nephew Bradley, alongside the <strong className="text-green-900">Banda brothers</strong> (Phillip and Mangani).
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

{/* THE 1993 ETERNAL LEGENDS (GABON MEMORIAL) */}
      <section className="py-24 md:py-32 px-6 bg-white border-t-4 border-orange-600">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <FadeIn className="w-full md:w-1/2 space-y-8">
            <div>
              <p className="font-sans text-orange-500 uppercase tracking-[0.4em] text-xs mb-4 font-semibold">
                April 28, 1993
              </p>
              <h2 className="font-sans text-4xl md:text-5xl font-bold uppercase tracking-tight text-green-900 mb-6 leading-tight">
                The Eternal <br className="hidden md:block" /> Legends
              </h2>
              <div className="w-16 h-1 bg-orange-500"></div>
            </div>
            
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                No conversation about Zambian football heritage is complete without honoring the heroes of the 1993 national team. The squad that perished off the coast of Gabon represented the very best of our nation's talent, spirit, and ambition.
              </p>
              <p>
                They laid the spiritual foundation for the generations that followed. When Zambia lifted the Africa Cup of Nations in 2012—in the very same city of Libreville—it was the fulfillment of the dream our eternal legends started. 
              </p>
              <p className="text-gray-900 font-medium italic">
                "Their names are woven into the fabric of Zambian history. Gone, but never forgotten."
              </p>
            </div>

            <button className="mt-4 px-8 py-3 bg-transparent text-green-900 font-sans font-bold hover:bg-gray-50 transition-all uppercase tracking-[0.2em] text-sm border border-gray-300 hover:border-green-900 rounded-sm">
              Visit the Memorial
            </button>
          </FadeIn>

          <FadeIn className="w-full md:w-1/2" delay={0.2}>
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-gray-200 shadow-xl grayscale hover:grayscale-0 transition-all duration-1000">
              <img 
                src="https://res.cloudinary.com/dsztrq47q/image/upload/v1771497299/118631293_3237148319674190_6231397125503319875_n_jepj83.jpg" 
                alt="1993 Zambia National Team" 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent pointer-events-none" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* THE RISE OF THE COPPER QUEENS */}
      <section className="bg-white py-24 md:py-32 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <FadeIn className="w-full md:w-1/2 order-2 md:order-1" delay={0.2}>
            <div className="aspect-video bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center p-8 text-center relative overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-green-500/5 transition-all duration-700 opacity-50 group-hover:opacity-100" />
              <div className="relative z-10">
                <span className="text-gray-400 font-sans font-semibold tracking-wide uppercase text-sm group-hover:text-green-800 transition-colors duration-300">
                  [ Image Placeholder: Copper Queens at Olympics/World Cup ]
                </span>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn className="w-full md:w-1/2 space-y-8 order-1 md:order-2">
            <div>
              <p className="font-sans text-orange-600 uppercase tracking-[0.3em] text-xs mb-4 font-semibold">Pioneers of the Women's Game</p>
              <h2 className="font-sans text-3xl md:text-5xl font-bold uppercase tracking-tight text-green-900 mb-4 leading-tight">
                The Rise of the <br/> Copper Queens
              </h2>
              <div className="w-16 h-1 bg-orange-500"></div>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              The story of Zambian football is increasingly defined by the phenomenal rise of the women's game. From the early pioneers who fought for recognition on local pitches to the modern squad commanding the global stage.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Historic milestones, including debut appearances at the Tokyo Olympics and the FIFA Women's World Cup, have firmly established Zambia as a powerhouse in women's football. Today's incredible players are inspiring an entirely new generation of young girls to dream beyond boundaries.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* MULTI-SPORT ECOSYSTEM */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <FadeIn className="w-full md:w-1/2 space-y-8">
            <div>
              <p className="font-sans text-orange-600 uppercase tracking-[0.3em] text-xs mb-4 font-semibold">The Bigger Picture</p>
              <h2 className="font-sans text-3xl md:text-5xl font-bold uppercase tracking-tight text-green-900 mb-4 leading-tight">
                Beyond Football
              </h2>
              <div className="w-16 h-1 bg-orange-500"></div>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Zambia's unparalleled record of sporting families is not a coincidence; it is the result of a unique structural ecosystem. During the 1960s through the 1990s, mine-sponsored clubs and parastatal companies heavily promoted community sports and recreation.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              This corporate backing created localized environments where facilities were central to family life. Fathers mentored sons, and brothers inspired siblings — producing legendary families such as <strong className="text-green-900">Samuel and Mwenya Matete</strong> (athletics and football), <strong className="text-green-900">Boniface, Aaron, and Amon Simutowe</strong> (football and chess), and <strong className="text-green-900">Satwant and Muna Singh</strong> (motor rally).
            </p>
          </FadeIn>
          <FadeIn className="w-full md:w-1/2" delay={0.2}>
            <div className="aspect-square bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center p-8 text-center relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-green-50 group-hover:from-orange-100 group-hover:to-green-100 transition-all duration-700 opacity-50" />
              <div className="relative z-10">
                <p className="font-sans text-6xl md:text-8xl font-bold text-gray-300 mb-4 drop-shadow-sm">⚽</p>
                <span className="text-gray-500 font-sans font-semibold tracking-wide uppercase text-sm">
                  Archival Photo Coming Soon
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

     

      {/* QUOTE & CTA */}
      <section className="py-24 md:py-32 px-6 bg-gray-50 text-center relative overflow-hidden">
        <FadeIn>
          <div className="max-w-4xl mx-auto relative z-10">
            <p className="font-sans text-orange-200 text-6xl md:text-8xl leading-none mb-8 font-serif">"</p>
            <blockquote className="text-2xl md:text-4xl font-light italic text-gray-800 mb-14 leading-relaxed -mt-8">
              Zambia's football story transcends victories and trophies; it is an enduring heritage of generational excellence.
            </blockquote>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-4 bg-orange-600 text-white font-sans font-bold hover:bg-orange-700 transition-all uppercase tracking-[0.2em] text-sm shadow-lg shadow-orange-600/20 hover:-translate-y-1 rounded-sm">
                Explore the Hall of Fame
              </button>
              <button className="px-10 py-4 bg-white text-green-900 font-sans font-bold hover:bg-gray-100 transition-all uppercase tracking-[0.2em] text-sm border border-gray-200 shadow-sm rounded-sm">
                View Historical Squads
              </button>
              <button className="px-10 py-4 bg-white text-green-900 font-sans font-bold hover:bg-gray-100 transition-all uppercase tracking-[0.2em] text-sm border border-gray-200 shadow-sm rounded-sm">
                Nominate a Legend
              </button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default Legends;