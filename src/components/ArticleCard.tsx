import { Article } from '../types/Article';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Link href={`/articles/${article.id}`}>
        <div className="cursor-pointer">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">{article.level}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{article.readingTime} min read</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600 line-clamp-2">{article.content}</p>
            <div className="mt-4 flex gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 