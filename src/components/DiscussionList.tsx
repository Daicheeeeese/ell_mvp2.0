import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDiscussion } from '../hooks/useDiscussion';
import { Discussion } from '../types/Discussion';

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
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscussions = async () => {
      if (user) {
        try {
          const fetchedDiscussions = await getDiscussionsByUser(user.id);
          setDiscussions(fetchedDiscussions);
        } catch (error) {
          console.error('Failed to fetch discussions:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDiscussions();
  }, [user, getDiscussionsByUser]);

  if (!user) return null;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Discussions</h1>
      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">登録済みディスカッション</h3>
        {discussions.length === 0 ? (
          <p className="text-gray-500">登録済みのディスカッションはありません</p>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {discussion.articleTitle}
                    </h2>
                    <p className="text-gray-600">
                      Date: {discussion.date} | Time: {discussion.time}
                    </p>
                    <p className="text-gray-600">
                      Partner: {discussion.partnerName || 'Not assigned'}
                    </p>
                    <p className="text-gray-600">
                      Status: {discussion.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {discussion.status === 'pending' && (
                      <button
                        onClick={() => cancelDiscussion(discussion.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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