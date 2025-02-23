import { useState, useEffect } from 'react';
import { dictionary } from '../lib/dictionary';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useDiscussion } from '../contexts/DiscussionContext';
import DiscussionList from './DiscussionList';

interface Article {
  id: string;
  title: string;
  content: string;
  urlToImage?: string;
}

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
}

// 当日の時間候補を生成
const generateTimeOptions = () => {
  return [
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '19:00',
    '20:00',
  ];
};

export default function ArticleDetail({ article, onClose }: ArticleDetailProps) {
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const { registerDiscussion } = useDiscussion();

  // 記事のコンテンツが存在しない場合の処理を追加
  if (!article?.content) {
    return <div>記事の内容を読み込めませんでした。</div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const timeOptions = generateTimeOptions();

  const renderContent = () => {
    const words = article.content.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?]$/, '');
      const meaning = dictionary[cleanWord];
      const hasDefinition = !!meaning;

      return (
        <span
          key={index}
          style={{
            display: 'inline-block',
            padding: '0 1px',
            cursor: hasDefinition ? 'help' : 'default',
            backgroundColor: hoveredWordIndex === index 
              ? (hasDefinition ? '#fef9c3' : '#f3f4f6')
              : 'transparent',
            transition: 'background-color 0.2s',
            borderBottom: hasDefinition ? '1px dotted #666' : 'none'
          }}
          onMouseEnter={(e) => {
            setHoveredWordIndex(index);
            if (hasDefinition) {
              const rect = e.currentTarget.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              
              setTooltipPosition({
                x: rect.left,  // 左端を基準に
                y: rect.bottom + scrollTop // スクロール位置を考慮
              });
              setShowTooltip(true);
            }
          }}
          onMouseLeave={() => {
            setHoveredWordIndex(null);
            setShowTooltip(false);
          }}
        >
          {word}{' '}
        </span>
      );
    });
  };

  const getCurrentWordAndMeaning = () => {
    if (hoveredWordIndex === null) return null;
    const words = article.content.split(' ');
    const word = words[hoveredWordIndex];
    const cleanWord = word?.toLowerCase().replace(/[.,!?]$/, '');
    return cleanWord ? { word: cleanWord, meaning: dictionary[cleanWord] } : null;
  };

  const currentWord = getCurrentWordAndMeaning();

  // ツールチップの表示条件をデバッグ
  useEffect(() => {
    console.log('State Update:', {
      showTooltip,
      hoveredWordIndex,
      tooltipPosition,
      shouldShow: showTooltip && hoveredWordIndex !== null,
      currentWord: hoveredWordIndex !== null ? article.content.split(' ')[hoveredWordIndex] : null,
      meaning: hoveredWordIndex !== null ? dictionary[article.content.split(' ')[hoveredWordIndex].toLowerCase().replace(/[.,!?]$/, '')] : null
    });
  }, [showTooltip, hoveredWordIndex, tooltipPosition]);

  const handleDiscussionClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setShowDiscussionModal(true);
  };

  const handleRegister = () => {
    if (selectedTime && article.id && article.title) {
      registerDiscussion(
        article.id,
        article.title,
        selectedTime
      );
      
      setIsRegistered(true);
      setTimeout(() => {
        setShowDiscussionModal(false);
        setIsRegistered(false);
        setSelectedTime(null);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{article.title}</h2>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {user?.name}としてログイン中
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ログアウト
                </button>
              </div>
            )}
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
        {article.urlToImage && (
          <img 
            src={article.urlToImage} 
            alt={article.title}
            className="w-full h-64 object-cover mb-4 rounded"
          />
        )}
        <div className="prose relative">
          {renderContent()}

          {showTooltip && hoveredWordIndex !== null && (
            <div
              style={{
                position: 'absolute',
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '150px',
                transform: 'translateY(8px)'
              }}
            >
              {(() => {
                const word = article.content.split(' ')[hoveredWordIndex];
                const cleanWord = word.toLowerCase().replace(/[.,!?]$/, '');
                return (
                  <div className="text-sm">
                    <span className="font-bold">{cleanWord}</span>
                    <br />
                    {dictionary[cleanWord]}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleDiscussionClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            この記事についてディスカッションする
          </button>

          {isAuthenticated && <DiscussionList />}
        </div>

        {showDiscussionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">
                ディスカッション時間の選択
              </h3>
              
              {!isRegistered ? (
                <>
                  <p className="text-gray-600 mb-4">
                    本日（{today}）の希望時間を選択してください
                  </p>
                  <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded ${
                          selectedTime === time
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDiscussionModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleRegister}
                      disabled={!selectedTime}
                      className={`px-4 py-2 rounded ${
                        selectedTime
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      登録する
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-green-600 font-medium mb-2">
                    登録が完了しました！
                  </p>
                  <p className="text-gray-600">
                    選択された日時: {today} {selectedTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 