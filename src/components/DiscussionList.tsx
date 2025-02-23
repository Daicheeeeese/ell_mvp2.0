import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDiscussion } from '../hooks/useDiscussion';
import { Discussion } from '../types/Discussion';

interface PartnerModalProps {
  partner?: {
    id: string;
    name: string;
    role: 'student' | 'partner';
  };
  discussionPoints?: {
    topic: string;
    points: string[];
  }[];
  onClose: () => void;
}

function PartnerModal({ partner, discussionPoints, onClose }: PartnerModalProps) {
  if (!partner || !discussionPoints) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Discussion Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Partner</h3>
          <p>{partner.name}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Discussion Points</h3>
          {discussionPoints.map((point, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-medium mb-1">{point.topic}</h4>
              <ul className="list-disc list-inside">
                {point.points.map((item, i) => (
                  <li key={i} className="text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          ))}
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