import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

interface NewsListProps {
  articles: Article[];
}

export default function NewsList({ articles }: NewsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
              {article.category}
            </span>
            <Link 
              href={`/articles/${article.id}`}
              className="block hover:text-blue-600 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            </Link>
            <p className="text-gray-600 mb-4">{article.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">{article.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 