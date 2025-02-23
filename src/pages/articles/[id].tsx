import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import HighlightedText from '../../components/HighlightedText';
import DiscussionMatchingModal from '../../components/DiscussionMatchingModal';
import MatchingStatus from '../../components/MatchingStatus';

interface Article {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  content: string;
  comments: Comment[];
  vocabulary?: Vocabulary[];
  discussion?: Discussion;
}

interface Comment {
  id: string;
  text: string;
  timestamp: string;
}

interface MatchingRequest {
  articleId: string;
  time: string;
  status: 'waiting' | 'matched';
  matchedWith?: {
    name: string;
    description: string;
  };
  articleTitle: string | undefined;
}

interface Vocabulary {
  term: string;
  definition: string;
}

interface Discussion {
  question: string;
  answers: string[];
}

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [matchingRequests, setMatchingRequests] = useState<MatchingRequest[]>([]);
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/articles/${id}`)
        .then(res => res.json())
        .then(data => {
          setArticle(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching article:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleMatchingSubmit = async (selectedTime: string) => {
    try {
      const response = await fetch('/api/discussion-matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: id,
          time: selectedTime
        }),
      });

      if (!response.ok) throw new Error('マッチングの申し込みに失敗しました');

      const data = await response.json();
      
      // APIからのレスポンスに含まれるマッチしたユーザー情報を使用
      setMatchingRequests([{
        articleId: id as string,
        time: selectedTime,
        status: 'matched',
        articleTitle: article?.title,
        matchedWith: data.request.matchedWith
      }]);

      alert('マッチングを申し込みました。マッチングが成立したらお知らせします。');
      setIsMatchingModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました。');
    }
  };

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return {
      value: `${hour.toString().padStart(2, '0')}:00`,
      label: `${hour.toString().padStart(2, '0')}:00`
    };
  });

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!article) {
    return <div className="container mx-auto p-4">Article not found</div>;
  }

  const paragraphs = article.content ? article.content.split('\n\n') : [];

  return (
    <div className="min-h-screen bg-[rgb(249,250,251)] mt-0">


      <main style={{ padding: '24px 64px 0 64px' }}>
        <div className="container mx-auto p-4">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to articles
          </Link>
          <article className="bg-white rounded-lg shadow-md p-6">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
              {article.category}
            </span>
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <p className="text-gray-500 mb-4">{article.date}</p>
            <p className="text-gray-700 mb-6">{article.description}</p>
            <div className="prose max-w-none">
              {paragraphs.map((paragraph, index) => (
                <div key={index} className="mb-4">
                  <HighlightedText text={paragraph} />
                </div>
              ))}
            </div>
            <div className="mt-8 border-t pt-6">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setIsMatchingModalOpen(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  この記事についてディスカッションする
                </button>
                
                <MatchingStatus 
                  articleId={id as string}
                  requests={matchingRequests}
                  setRequests={setMatchingRequests}
                  articleTitle={article.title}
                />
              </div>
            </div>
          </article>

          <DiscussionMatchingModal
            isOpen={isMatchingModalOpen}
            onClose={() => setIsMatchingModalOpen(false)}
            onSubmit={handleMatchingSubmit}
            articleTitle={article.title}
          />
        </div>
      </main>
    </div>
  );
} 