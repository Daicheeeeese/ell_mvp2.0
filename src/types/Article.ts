interface Article {
  id: string;
  title: string;
  content: string;
  japaneseTitle: string;
  japaneseContent: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keywords: string[];
  publishedDate: Date;
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