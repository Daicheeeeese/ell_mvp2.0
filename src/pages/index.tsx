import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';

interface Article {
  id: string;
  title: string;
  description: string;
}

// 画像マッピング関数を追加
const getImagePath = (articleId: string) => {
  const imageMap: { [key: string]: string } = {
    '1': '/images/ai-healthcare.jpg',
    '2': '/images/apple-m3.jpg',
    '3': '/images/climate-summit.jpg'
  };
  const path = imageMap[articleId] || '/images/ai-healthcare.jpg';
  console.log('Image path:', path);
  return path;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState('');

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return {
      value: `${hour.toString().padStart(2, '0')}:00`,
      label: `${hour.toString().padStart(2, '0')}:00`
    };
  });

  console.log('Available times:', times);
  console.log('Selected time:', selectedTime);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(249,250,251)] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(249,250,251)] mt-0">

      <main style={{ padding: '24px 64px 0 64px' }}>



        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))',
          gap: '1.5rem',
          gridAutoRows: '1fr',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {articles.map(article => (
            <Link 
              href={`/articles/${article.id}`}
              key={article.id}
              className="block h-full"
            >
              <div 
                style={{ 
                  position: 'relative',
                  height: '100%',
                  overflow: 'hidden'
                }}
                className="rounded-lg cursor-pointer shadow-sm"
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${getImagePath(article.id)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.3s ease',
                    transform: 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                <article className="p-8 h-full relative">
                  <div style={{ 
                    padding: '16px',
                    borderRadius: '8px',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(1px)'
                  }}>
                    <h2 style={{ 
                      color: '#FFFFFF',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem'
                    }} className="leading-tight drop-shadow-lg">
                      {article.title}
                    </h2>
                    
                    <p style={{ 
                      color: '#FFFFFF'
                    }} className="leading-relaxed line-clamp-2 drop-shadow-lg">
                      {article.description}
                    </p>
                  </div>
                </article>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 