export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  publishedAt: string;
  readingTime: number;
  tags: string[];
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