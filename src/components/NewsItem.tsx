import React from 'react';
import ArticleDetail from './ArticleDetail';
import { useRouter } from 'next/router';

export default function NewsItem({ article }: NewsItemProps) {
  const router = useRouter();
  
  const handleClick = () => {
    localStorage.setItem('selectedArticle', JSON.stringify(article));
    
    // 記事のタイトルと日時のみを使用してIDを生成
    const articleId = Buffer.from(article.title).toString('base64')
      .replace(/[+/=]/g, '')  // base64の特殊文字を除去
      .slice(0, 100);         // 長さを制限
    
    router.push(`/articles/${articleId}`);
  };
  
  return (
    <div 
      className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
      onClick={handleClick}
    >
      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title}
          className="w-full h-48 object-cover mb-4 rounded"
        />
      )}
      <h2 className="text-xl font-bold mb-2">{article.title}</h2>
      <p className="text-gray-600">{article.description}</p>
    </div>
  );
} 