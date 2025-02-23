export interface Article {
  id: string;
  title: string;
  japaneseTitle: string;
  content: string;
  japaneseContent: string;
  imageUrl: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  publishedAt: string;
  readingTime: number;
  tags: string[];
  difficulty?: number;
  keywords?: string[];
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
} 