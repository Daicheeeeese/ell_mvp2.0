import { Article } from '../types/Article';

// ヘルパー関数
const calculateDifficulty = (text: string): number => {
  return 1;
};

const extractKeywords = (text: string): string[] => {
  return ['keyword1', 'keyword2'];
};

const calculateLevel = (text: string): 'beginner' | 'intermediate' | 'advanced' => {
  return 'intermediate';
};

const calculateReadingTime = (text: string): number => {
  return 5;
};

const extractTags = (text: string): string[] => {
  return ['tag1', 'tag2'];
};

const translateText = async (text: string): Promise<string> => {
  return text;
};

export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch('YOUR_API_ENDPOINT');
    const data = await response.json();
    const currentDate = new Date().toISOString();
    
    return data.articles.map((article: any): Article => ({
      id: String(Date.now()),
      title: article.title || '',
      content: article.content || article.description || '',
      imageUrl: article.urlToImage || '/default-image.jpg',
      category: 'general',
      level: calculateLevel(article.content || article.description || ''),
      publishedAt: currentDate,
      readingTime: calculateReadingTime(article.content || article.description || ''),
      tags: extractTags(article.content || article.description || ''),
      difficulty: calculateDifficulty(article.content || article.description || ''),
      keywords: extractKeywords(article.content || article.description || ''),
      japaneseTitle: '',
      japaneseContent: ''
    }));
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}

export async function transformArticle(article: any): Promise<Article> {
  const japaneseTitle = await translateText(article.title || '');
  const japaneseContent = await translateText(article.content || article.description || '');
  const currentDate = new Date().toISOString();

  return {
    id: article.id || String(Date.now()),
    title: article.title || '',
    japaneseTitle,
    content: article.content || article.description || '',
    japaneseContent,
    imageUrl: article.urlToImage || '/default-image.jpg',
    category: article.category || 'general',
    level: calculateLevel(article.content || article.description || ''),
    publishedAt: currentDate,
    readingTime: calculateReadingTime(article.content || article.description || ''),
    tags: extractTags(article.content || article.description || ''),
    difficulty: calculateDifficulty(article.content || article.description || ''),
    keywords: extractKeywords(article.content || article.description || '')
  };
} 