
export interface Match {
  id: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  score?: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
  isLive?: boolean;
  category: 'MEN' | 'WOMEN' | 'U20' | 'U17';
  status: 'UPCOMING' | 'RESULT';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  imageUrl: string;
}

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  link: string;
}

export interface Team {
  id: number;
  name: string;
  category?: string;
  image: string;
  color?: string; // tailwind gradient classes, e.g. 'from-yellow-300 to-green-800'
  stats?: {
    rank?: string | number;
    lastResult?: string;
  };
}
