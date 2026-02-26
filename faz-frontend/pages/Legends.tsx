import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Family {
  name: string;
  text: string;
}

interface Era {
  title: string;
  decade: string;
  imageUrl: string;
  families: Family[];
}

interface Player {
  name: string;
  title: string;
  imageUrl: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

const eras: Era[] = [
  {
    title: "Historic Pioneer Team KK 11",
    decade: "1960s-1980s",
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
    decade: "1990s-2000s",
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

const legendaryPlayers: Player[] = [
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
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838601/515992318_713082761545170_5863502301176627390_n.jpg_sw3ows.jpg",
    description: "First player in Olympic history to score back-to-back hat-tricks. A global superstar taking the Copper Queens to unprecedented heights."
  },
  {
    name: "Alex Chola",
    title: "The Master Playmaker",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838135/97994317_2920070888047421_655132647516798976_n.jpg_qddfzr.jpg",
    description: "One of the most gifted dribblers and playmakers in African history, remembered as a true genius of the KK11 era."
  },
  {
    name: "Stoppila Sunzu",
    title: "Hero of Libreville",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838243/518266916_10171978474445054_7917181035867965219_n.jpg_jowi5g.jpg",
    description: "Cemented his eternal legacy by scoring the winning penalty in the 2012 AFCON final shootout against Ivory Coast."
  },
  {
    name: "Dickson Makwaza",
    title: "The Pioneer Captain",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838339/476342917_1137053607861628_5487692093780309495_n.jpg_nbv4kv.jpg",
    description: "An exceptional defender and leader who captained the national team to its first-ever AFCON final appearance in 1974."
  },
  {
    name: "Kennedy Mweene",
    title: "The Wall",
    imageUrl: "https://res.cloudinary.com/dsztrq47q/image/upload/v1771838406/484439837_683167534372655_8736568065280107470_n.jpg_rrnghu.jpg",
    description: "Zambia's most capped player. A penalty-saving hero and a key architect of the 2012 Africa Cup of Nations victory."
  }
];

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
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
  const stats: Stat[] = [
    { value: "30+", label: "Football Families" },
    { value: "100+", label: "Top-Flight Siblings" },
    { value: "60+", label: "Years of Heritage" },
    { value: "1", label: "World Record" },
  ];

  return (
    <div className="w-full font-sans text-gray-900 bg-white overflow-x-hidden">
      
      {/* HERO */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img 
          src="https://res.cloudinary.com/dsztrq47q/image/upload/v1771495321/632311964_1507941111338062_3582660004753275685_n_dexvrn.jpg"
          alt="Zambia Football Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
          <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
            <div className="max-w-2xl">
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
              className="text-5xl md:text-6xl font-condensed font-black text-white uppercase tracking-tighter leading-none mb-6"
            >
              Zambia's Football Legacy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-xl"
            >
              The most football families to ever represent a single nation. Discover the fathers, sons, and brothers who built our national game.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              href="#timeline"
              className="inline-block px-8 py-4 bg-faz-orange hover:bg-faz-orange/90 text-white font-black uppercase tracking-widest text-sm transition-all transform hover:scale-105 shadow-lg"
            >
              Explore the Legends
            </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* EXECUTIVE SUMMARY & INTEGRATED METRICS */}
      <section className="relative py-24 md:py-32 px-6 bg-gradient-to-b from-white via-orange-50/40 to-white border-b border-orange-100/60 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-orange-200/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-green-200/30 blur-3xl" />
        <div className="max-w-6xl mx-auto relative">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-20">
              <div className="w-12 h-[2px] bg-orange-500 mx-auto mb-10" />
              <p className="text-gray-600 text-xl md:text-2xl leading-[1.8] font-light italic">
                Zambian football is built on lineage, community, and generational excellence. Historical records indicate that no other nation has produced as many brothers, fathers, and sons who have represented their national team across multiple eras.
              </p>
              <p className="text-gray-900 text-xl md:text-2xl leading-[1.8] font-semibold mt-6 uppercase tracking-tight">
                Our football is not just played; it is passed down.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <FadeIn key={i} delay={0.2 + i * 0.1} className="text-center">
                <div className="space-y-2 rounded-2xl border border-orange-100/80 bg-white/90 backdrop-blur-sm px-4 py-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <p className="font-sans text-5xl md:text-6xl font-bold text-green-900 leading-none">
                    {stat.value}
                  </p>
                  <div className="w-10 h-1 bg-orange-500 mx-auto mb-4 rounded-full" />
                  <p className="font-sans text-gray-500 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold leading-tight">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE OF LEGENDS */}
      <section id="timeline" className="relative py-24 md:py-32 px-6 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-b border-gray-200 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-green-100/30 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <FadeIn>
            <div className="text-center mb-20 md:mb-28">
              <p className="font-sans text-orange-600 uppercase tracking-[0.3em] text-xs mb-4 font-semibold">Through the Decades</p>
              <h2 className="font-sans text-4xl md:text-6xl font-bold text-green-900 uppercase tracking-tight">
                The Timeline of Legends
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-28 md:space-y-36 relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-300 to-transparent -translate-x-1/2" />

            {eras.map((era, index) => (
              <div key={index} className="relative">
                <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-orange-500 border-4 border-white shadow-lg shadow-orange-300/50" />

                <div className={`flex flex-col gap-10 lg:gap-16 items-center ${
                  index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }`}>
                  <FadeIn className="w-full lg:w-[45%]" delay={0.1}>
                    <div className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-white ring-1 ring-black/5">
                      <img 
                        src={era.imageUrl} 
                        alt={era.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 md:p-8">
                        <span className="font-sans text-orange-300 text-xs md:text-sm uppercase tracking-[0.35em] font-bold">{era.decade}</span>
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn className="w-full lg:w-[45%]" delay={0.3}>
                    <div className="rounded-3xl border border-gray-200/80 bg-white/90 backdrop-blur-sm p-8 md:p-10 shadow-lg">
                      <h3 className="font-sans text-3xl md:text-4xl font-bold text-green-900 mb-8 uppercase tracking-tight leading-tight">
                        {era.title}
                      </h3>
                      <div className="space-y-4">
                        {era.families.map((fam, fIndex) => (
                          <div key={fIndex} className="pl-5 py-4 pr-4 border-l-4 border-orange-200 rounded-r-xl bg-white hover:border-orange-500 hover:shadow-sm transition-all duration-300">
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

      {/* INDIVIDUAL LEGENDARY PLAYERS */}
      <section className="relative py-24 md:py-32 px-6 bg-white border-b border-gray-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <FadeIn>
            <div className="text-center mb-16 md:mb-24">
              <p className="font-sans text-orange-600 uppercase tracking-[0.3em] text-xs mb-4 font-semibold">Individual Brilliance</p>
              <h2 className="font-sans text-4xl md:text-5xl font-bold text-green-900 uppercase tracking-tight">
                Hall of Fame Icons
              </h2>
              <div className="w-16 h-1 bg-orange-500 mx-auto mt-6"></div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {legendaryPlayers.map((player, index) => (
              <FadeIn key={index} delay={(index % 4) * 0.15} className="h-full">
                <div className="group h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
                    <img 
                      src={player.imageUrl} 
                      alt={player.name} 
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
                      <p className="font-sans text-orange-300 text-xs uppercase tracking-[0.25em] font-bold mb-1">{player.title}</p>
                      <h4 className="font-sans text-2xl font-bold text-white uppercase tracking-wide leading-none">{player.name}</h4>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-white to-gray-50">
                    <p className="text-gray-600 leading-relaxed text-sm md:text-[15px]">
                      {player.description}
                    </p>
                    <button className="mt-6 text-green-900 font-bold uppercase tracking-[0.2em] text-xs hover:text-orange-600 transition-colors flex items-center gap-2 w-fit">
                      Read Profile
                      <span className="text-orange-500 ">-&gt;</span>
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={0.4}>
            <div className="mt-16 text-center">
                 <button className="px-8 py-3 bg-white text-green-900 font-sans font-bold hover:bg-gray-100 transition-all uppercase tracking-[0.2em] text-sm border-2 border-gray-200 rounded-full ">
                  View Full Hall of Fame
                </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CONTEMPORARY ICONS */}
      <section className="relative py-24 md:py-32 px-6 bg-gradient-to-br from-green-50 via-white to-green-100/50 border-b border-green-100 overflow-hidden">
        <div className="absolute -top-16 right-0 w-72 h-72 rounded-full bg-green-200/40 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="font-sans text-orange-600 uppercase tracking-[0.3em] text-xs mb-4 font-semibold">Still Going Strong</p>
              <h3 className="font-sans text-3xl md:text-5xl font-bold uppercase tracking-tight text-green-900">
                Contemporary Icons & Domestic Lineages
              </h3>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto text-center rounded-3xl border border-green-100 bg-white/90 shadow-lg p-8 md:p-12">
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
      <section className="py-24 md:py-32 px-6 bg-gradient-to-r from-white via-orange-50/40 to-white border-t-4 border-orange-600">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <FadeIn className="w-full md:w-1/2 space-y-8 rounded-3xl border border-orange-100 bg-white p-8 md:p-10 shadow-lg">
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
                They laid the spiritual foundation for the generations that followed. When Zambia lifted the Africa Cup of Nations in 2012 - in the very same city of Libreville - it was the fulfillment of the dream our eternal legends started.
              </p>
              <p className="text-gray-900 font-medium italic">
                "Their names are woven into the fabric of Zambian history. Gone, but never forgotten."
              </p>
            </div>

              <button className="mt-4 px-8 py-3 bg-white text-green-900 font-sans font-bold hover:bg-gray-100 transition-all uppercase tracking-[0.2em] text-sm border border-gray-300 hover:border-green-900 rounded-full shadow-sm hover:shadow-md">
                Visit the Memorial
              </button>
          </FadeIn>

          <FadeIn className="w-full md:w-1/2" delay={0.2}>
              <div className="aspect-[4/3] relative rounded-3xl overflow-hidden border border-white shadow-2xl ring-1 ring-black/5 grayscale hover:grayscale-0 transition-all duration-1000">
              <img 
                src="https://res.cloudinary.com/dsztrq47q/image/upload/v1771497299/118631293_3237148319674190_6231397125503319875_n_jepj83.jpg" 
                alt="1993 Zambia National Team" 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-1000"
              />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* THE RISE OF THE COPPER QUEENS */}
      <section className="bg-gradient-to-b from-white via-orange-50/20 to-white py-24 md:py-32 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <FadeIn className="w-full md:w-1/2 order-2 md:order-1" delay={0.2}>
            <div className="aspect-video rounded-3xl border border-white shadow-2xl ring-1 ring-black/5 relative overflow-hidden group">
              <img
                src="https://res.cloudinary.com/dsztrq47q/image/upload/v1771838601/515992318_713082761545170_5863502301176627390_n.jpg_sw3ows.jpg"
                alt="Copper Queens in action"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute left-6 bottom-6 text-white text-xs md:text-sm uppercase tracking-[0.25em] font-bold">
                Zambia Copper Queens
              </span>
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
      <section className="bg-gradient-to-b from-white to-gray-50 py-24 md:py-32 px-6 border-t border-gray-100">
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
              This corporate backing created localized environments where facilities were central to family life. Fathers mentored sons, and brothers inspired siblings - producing legendary families such as <strong className="text-green-900">Samuel and Mwenya Matete</strong> (athletics and football), <strong className="text-green-900">Boniface, Aaron, and Amon Simutowe</strong> (football and chess), and <strong className="text-green-900">Satwant and Muna Singh</strong> (motor rally).
            </p>
          </FadeIn>
          <FadeIn className="w-full md:w-1/2" delay={0.2}>
              <div className="aspect-square bg-white rounded-3xl border border-gray-200 flex items-center justify-center p-8 text-center relative overflow-hidden group shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-green-50 group-hover:from-orange-100 group-hover:to-green-100 transition-all duration-700 opacity-60" />
              <div className="relative z-10">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-dashed border-orange-300/80 mx-auto mb-6 flex items-center justify-center">
                  <p className="font-sans text-2xl md:text-3xl font-black text-green-900 tracking-[0.2em]">FAZ</p>
                </div>
                <span className="text-gray-500 font-sans font-semibold tracking-wide uppercase text-xs md:text-sm">
                  Archival Photo Coming Soon
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* QUOTE & CTA */}
      <section className="py-24 md:py-32 px-6 bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-center relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-orange-400/15 blur-3xl pointer-events-none" />
        <FadeIn>
          <div className="max-w-4xl mx-auto relative z-10">
            <p className="font-sans text-orange-200 text-6xl md:text-8xl leading-none mb-8 font-serif">"</p>
            <blockquote className="text-2xl md:text-4xl font-light italic text-white mb-14 leading-relaxed -mt-8">
              Zambia's football story transcends victories and trophies; it is an enduring heritage of generational excellence.
            </blockquote>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-4 bg-orange-500 text-white font-sans font-bold hover:bg-orange-400 transition-all uppercase tracking-[0.2em] text-sm shadow-lg shadow-orange-900/30 hover:-translate-y-1 rounded-full">
                Explore the Hall of Fame
              </button>
              <button className="px-10 py-4 bg-white/95 text-green-900 font-sans font-bold hover:bg-white transition-all uppercase tracking-[0.2em] text-sm border border-white/40 shadow-sm hover:-translate-y-1 rounded-full">
                View Historical Squads
              </button>
              <button className="px-10 py-4 bg-white/95 text-green-900 font-sans font-bold hover:bg-white transition-all uppercase tracking-[0.2em] text-sm border border-white/40 shadow-sm hover:-translate-y-1 rounded-full">
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
