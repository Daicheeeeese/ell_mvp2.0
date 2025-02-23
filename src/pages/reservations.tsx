import { useState } from 'react';
import Link from 'next/link';

interface Reservation {
  id: string;
  date: string;
  time: string;
  articleTitle: string;
  partnerName: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  aiTutorFeedback?: {
    pronunciation: string[];
    grammar: string[];
    expressions: string[];
    overall: string;
  };
  recordingUrl?: string;
}

export default function Reservations() {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      date: '2024-01-20',
      time: '13:00',
      articleTitle: 'AI in Healthcare',
      partnerName: 'John Doe',
      status: 'completed',
      recordingUrl: '/recordings/sample.mp3',
      aiTutorFeedback: {
        pronunciation: [
          '"technology"の発音に注意が必要です',
          '"development"のアクセントの位置を確認しましょう'
        ],
        grammar: [
          '過去形と現在完了形の使い分けを意識しましょう',
          '仮定法の使用が適切でした'
        ],
        expressions: [
          'より自然な表現として "In my opinion" の代わりに "I believe" を使うと良いでしょう',
          'ビジネス用語の使用が適切でした'
        ],
        overall: '全体的に論点が明確で説得力のある議論ができていました。さらなる改善点として、反対意見に対する応答をより具体的にすると良いでしょう。'
      }
    },
    {
      id: '2',
      date: '2024-01-25',
      time: '15:00',
      articleTitle: 'Climate Change Solutions',
      partnerName: 'Jane Smith',
      status: 'confirmed'
    },
    {
      id: '3',
      date: '2024-01-22',
      time: '10:00',
      articleTitle: 'Space Exploration',
      partnerName: 'Mike Johnson',
      status: 'cancelled'
    },
    {
      id: '4',
      date: '2024-01-28',
      time: '17:00',
      articleTitle: 'Future of Education',
      partnerName: '相手を探しています。',
      status: 'pending'
    }
  ]);

  const handlePlayRecording = (recordingUrl: string) => {
    const audio = new Audio(recordingUrl);
    audio.play().catch(error => {
      console.error('Failed to play audio:', error);
      alert('音声の再生に失敗しました。');
    });
  };

  return (
    <div className="min-h-screen bg-[rgb(249,250,251)] mt-0">
      <main style={{ padding: '24px 64px 0 64px' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Reservations</h1>
          
          <div className="bg-white rounded-lg shadow-sm">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="border-b last:border-b-0 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{reservation.articleTitle}</h2>
                    <p className="text-gray-600">
                      Date: {reservation.date} | Time: {reservation.time}
                    </p>
                    <p className="text-gray-600">
                      Partner: {reservation.partnerName}
                    </p>
                  </div>
                  <div>
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                      ${reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                      ${reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  {reservation.status === 'confirmed' && (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Join Discussion
                    </button>
                  )}
                  {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
                    <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50">
                      Cancel
                    </button>
                  )}
                  {reservation.status === 'completed' && reservation.recordingUrl && (
                    <button 
                      onClick={() => handlePlayRecording(reservation.recordingUrl!)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Play Recording
                    </button>
                  )}
                  {reservation.status === 'completed' && reservation.aiTutorFeedback && (
                    <button 
                      onClick={() => setSelectedFeedback(reservation.id)}
                      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      AI Tutor Feedback
                    </button>
                  )}
                </div>

                {selectedFeedback === reservation.id && reservation.aiTutorFeedback && (
                  <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <h3 className="font-bold text-purple-800 mb-2">発音</h3>
                      <ul className="list-disc list-inside text-purple-700">
                        {reservation.aiTutorFeedback.pronunciation.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-bold text-purple-800 mb-2">文法</h3>
                      <ul className="list-disc list-inside text-purple-700">
                        {reservation.aiTutorFeedback.grammar.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-bold text-purple-800 mb-2">表現</h3>
                      <ul className="list-disc list-inside text-purple-700">
                        {reservation.aiTutorFeedback.expressions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-purple-800 mb-2">総評</h3>
                      <p className="text-purple-700">{reservation.aiTutorFeedback.overall}</p>
                    </div>

                    <button 
                      onClick={() => setSelectedFeedback(null)}
                      className="mt-4 text-purple-600 hover:text-purple-800"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 