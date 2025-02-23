import { useState } from 'react';
import { useDiscussion } from '../contexts/DiscussionContext';
import { useAuth } from '../contexts/AuthContext';

interface PartnerModalProps {
  partner: {
    username: string;
    description?: string;
    nationality?: string;
  };
  discussionPoints?: string[];
  onClose: () => void;
}

function PartnerModal({ partner, discussionPoints, onClose }: PartnerModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">ディスカッション詳細</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium mb-3">マッチング相手</h4>
            <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-blue-600">
                  {partner.username.charAt(0)}
                </span>
              </div>
              <div>
                <h5 className="font-medium">{partner.username}</h5>
                {partner.nationality && (
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm mb-1">
                    🌏 {partner.nationality}
                  </span>
                )}
                {partner.description && (
                  <p className="text-gray-600 text-sm">{partner.description}</p>
                )}
              </div>
            </div>
          </div>

          {discussionPoints && (
            <div>
              <h4 className="text-lg font-medium mb-3">ディスカッションの論点</h4>
              <div className="space-y-3">
                {discussionPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="bg-green-50 p-4 rounded-lg"
                  >
                    <div className="flex items-start">
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm mr-3">
                        Point {index + 1}
                      </span>
                      <p className="text-green-800">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-md mt-4">
            <p className="text-yellow-700 text-sm">
              💡 これらの論点を参考に、ディスカッションの準備を進めましょう。
              質問や追加したい論点があれば、ディスカッション時に共有してください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiscussionList() {
  const { user } = useAuth();
  const { getDiscussionsByUser, cancelDiscussion } = useDiscussion();
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);

  if (!user) return null;

  const userDiscussions = getDiscussionsByUser(user.username);

  // デバッグ用のログを追加
  console.log('Current discussions:', userDiscussions);

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">登録済みディスカッション</h3>
      {userDiscussions.length === 0 ? (
        <p className="text-gray-500">登録済みのディスカッションはありません</p>
      ) : (
        <div className="space-y-4">
          {userDiscussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{discussion.articleTitle}</h4>
                  <p className="text-sm text-gray-600">
                    {discussion.date} {discussion.time}
                  </p>
                </div>
                <button
                  onClick={() => cancelDiscussion(discussion.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  キャンセル
                </button>
              </div>

              {discussion.status === 'matched' ? (
                <div 
                  className="bg-green-50 p-3 rounded-md cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => setSelectedDiscussion(discussion)}
                >
                  <p className="text-green-700 font-medium mb-2">
                    マッチング成立！
                  </p>
                  <div className="text-sm text-green-600">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        {discussion.participants[1].username}
                        {discussion.participants[1].nationality && (
                          <span className="text-gray-600">
                            {" "}({discussion.participants[1].nationality})
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="text-sm">
                      {discussion.participants[1].description}
                    </p>
                  </div>
                  <p className="text-green-600 text-sm mt-2 italic">
                    クリックして詳細を表示
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded-md">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700 mr-2"></div>
                    <p className="text-yellow-700">相手を探しています...</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedDiscussion && (
        <PartnerModal
          partner={selectedDiscussion.participants[1]}
          discussionPoints={selectedDiscussion.discussionPoints}
          onClose={() => setSelectedDiscussion(null)}
        />
      )}
    </div>
  );
} 