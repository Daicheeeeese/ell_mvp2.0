import { Article, NewsAPIResponse } from '../types/Article';
import { translateText } from './translate';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export async function fetchNewsArticles(category: string = 'general'): Promise<Article[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
    );
    const data: NewsAPIResponse = await response.json();

    // 記事を非同期で翻訳して変換
    const articles = await Promise.all(
      data.articles.map(async (article): Promise<Article> => {
        const [japaneseTitle, japaneseContent] = await Promise.all([
          translateText(article.title),
          translateText(article.content || article.description),
        ]);

        return {
          id: article.url,
          title: article.title,
          content: article.content || article.description,
          japaneseTitle,
          japaneseContent,
          difficulty: calculateDifficulty(article.content || article.description),
          keywords: extractKeywords(article.content || article.description),
          publishedDate: new Date(article.publishedAt)
        };
      })
    );

    return articles;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

// 記事の難易度を計算する簡単なロジック
function calculateDifficulty(text: string): Article['difficulty'] {
  const words = text.split(' ');
  const complexWords = words.filter(word => word.length > 8).length;
  const ratio = complexWords / words.length;

  if (ratio > 0.1) return 'advanced';
  if (ratio > 0.05) return 'intermediate';
  return 'beginner';
}

// キーワードを抽出する簡単なロジック
function extractKeywords(text: string): string[] {
  // TODO: より高度なキーワード抽出ロジックを実装
  return text
    .split(' ')
    .filter(word => word.length > 5)
    .slice(0, 5);
}

export async function transformArticle(article: any): Promise<Article> {
  const japaneseTitle = await translateText(article.title);
  const japaneseContent = await translateText(article.content || article.description);

  return {
    id: article.id || String(Date.now()),
    title: article.title,
    japaneseTitle,
    content: article.content || article.description,
    japaneseContent,
    imageUrl: article.urlToImage || '/default-image.jpg',
    category: article.category || 'general',
    level: calculateLevel(article.content || article.description),
    publishedAt: article.publishedAt || new Date().toISOString(),
    readingTime: calculateReadingTime(article.content || article.description),
    tags: extractTags(article.content || article.description),
    difficulty: calculateDifficulty(article.content || article.description),
    keywords: extractKeywords(article.content || article.description)
  };
} 