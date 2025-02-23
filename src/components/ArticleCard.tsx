import { Article } from '../types/Article';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <p className="text-gray-600 mb-2">{article.japaneseTitle}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {article.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(article.publishedDate).toLocaleDateString('ja-JP')}
          </span>
        </div>
      </div>
    </Link>
  );
} 