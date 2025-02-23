import { useState, useCallback } from 'react';
import { Discussion } from '../types/Discussion';

export function useDiscussion() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  const getDiscussionsByUser = useCallback(async (userId: string) => {
    // 仮のデータを返す
    return [
      {
        id: '1',
        articleId: '1',
        articleTitle: 'AI in Healthcare',
        date: '2024-01-20',
        time: '13:00',
        status: 'completed',
        partnerName: 'John Doe',
        userId: userId,
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
          overall: '全体的に論点が明確で説得力のある議論ができていました。'
        }
      }
    ] as Discussion[];
  }, []);

  const registerDiscussion = useCallback(async (articleId: string, time: string) => {
    try {
      // 仮の実装
      console.log('Discussion registered:', { articleId, time });
      return true;
    } catch (error) {
      console.error('Failed to register discussion:', error);
      return false;
    }
  }, []);

  const cancelDiscussion = useCallback(async (discussionId: string) => {
    try {
      // 仮の実装
      console.log('Discussion cancelled:', discussionId);
      return true;
    } catch (error) {
      console.error('Failed to cancel discussion:', error);
      return false;
    }
  }, []);

  return {
    discussions,
    getDiscussionsByUser,
    registerDiscussion,
    cancelDiscussion
  };
} 