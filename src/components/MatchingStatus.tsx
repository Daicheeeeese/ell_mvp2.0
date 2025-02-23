import { useEffect, useState } from 'react';

interface MatchingRequest {
  articleId: string;
  time: string;
  status: 'waiting' | 'matched';
  articleTitle?: string;
  matchedWith?: {
    name: string;
    description: string;
  };
}

interface MatchingStatusProps {
  articleId: string;
  requests: MatchingRequest[];
  setRequests: (requests: MatchingRequest[]) => void;
  articleTitle: string;
}

export default function MatchingStatus({ articleId, requests, setRequests, articleTitle }: MatchingStatusProps) {
  const [showMatch, setShowMatch] = useState(true);

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/discussion-matching?articleId=${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('キャンセルに失敗しました');
      
      setRequests([]); // マッチングリストをクリア
      setShowMatch(false); // 予定を非表示に
      alert('ディスカッションをキャンセルしました');
    } catch (error) {
      console.error('Error:', error);
      alert('キャンセルに失敗しました');
    }
  };

  useEffect(() => {
    const fetchMatchingStatus = async () => {
      try {
        const response = await fetch(`/api/matching-status?articleId=${articleId}`);
        if (!response.ok) throw new Error('Failed to fetch matching status');
        const data = await response.json();
        const requestsWithTitle = data.requests.map(request => ({
          ...request,
          articleTitle
        }));
        setRequests(requestsWithTitle);
        setShowMatch(requestsWithTitle.length > 0); // マッチングがある場合のみ表示
      } catch (error) {
        console.error('Error fetching matching status:', error);
      }
    };

    fetchMatchingStatus();
    const interval = setInterval(fetchMatchingStatus, 30000);
    return () => clearInterval(interval);
  }, [articleId, setRequests, articleTitle]);

  if (!showMatch) {
    return null; // 何も表示しない
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">本日のディスカッション予定</h3>
      
      <div className="space-y-2">
        {requests.map((request, index) => (
          <div 
            key={index}
            className="bg-blue-50 p-4 rounded-lg"
          >
            <div className="space-y-2">
              <div className="font-medium">記事：{request.articleTitle}</div>
              <div className="font-medium">実施時間：{request.time}</div>
              <div className="font-medium">相手のユーザーネーム：{request.matchedWith?.name}</div>
              <div className="text-gray-600">自己紹介：{request.matchedWith?.description}</div>
              <button
                onClick={handleCancel}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                キャンセルする
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && showMatch && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="font-medium">記事：{articleTitle}</div>
              <div className="font-medium">実施時間：19:00</div>
              <div className="font-medium">相手のユーザーネーム：Emma Kim</div>
              <div className="text-gray-600">自己紹介：English Conversation Enthusiast / TOEIC 960 / 20 years old / Female / from Korea🇰🇷</div>
              <button
                onClick={handleCancel}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                キャンセルする
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 