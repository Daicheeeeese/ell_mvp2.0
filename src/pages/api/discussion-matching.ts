import { NextApiRequest, NextApiResponse } from 'next';

export interface MatchingRequest {
  articleId: string;
  time: string;
  status: 'waiting' | 'matched';
  matchedWith?: {
    name: string;
    description: string;
  };
}

// マッチングリクエストを保存する配列をexport
export const matchingRequests: MatchingRequest[] = [];

const DEMO_USERS = [
  {
    name: 'Emma Kim',
    description: 'English Conversation Enthusiast / TOEIC 960 / 20 years old / Female / from Korea🇰🇷'
  },
  {
    name: 'Michael Chen',
    description: 'Software Engineer / English & Japanese Speaker / 25 years old / Male / from Taiwan🇹🇼'
  },
  {
    name: 'Sophie Garcia',
    description: 'Medical Student / Cambridge C2 Proficient / 23 years old / Female / from Spain🇪🇸'
  },
  {
    name: 'Taro Yamamoto',
    description: 'Workaholic / MD at Accenture Japan/ 43 years old / Male / from Japan🇯🇵'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // DELETE メソッドの処理
  if (req.method === 'DELETE') {
    try {
      const { articleId } = req.query;

      if (!articleId) {
        return res.status(400).json({ message: 'Article ID is required' });
      }

      // 文字列として比較するように修正
      const index = matchingRequests.findIndex(
        request => request.articleId === String(articleId)
      );

      // デバッグ用ログ
      console.log('Trying to delete matching for article:', articleId);
      console.log('Current matchingRequests:', matchingRequests);
      console.log('Found index:', index);

      if (index === -1) {
        // マッチングが見つからない場合でも成功として扱う
        return res.status(200).json({ message: 'No matching found to cancel' });
      }

      matchingRequests.splice(index, 1);
      console.log('Updated matchingRequests:', matchingRequests);
      
      return res.status(200).json({ message: 'Matching cancelled successfully' });
    } catch (error) {
      console.error('Error in discussion-matching API:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // POST メソッドの処理
  if (req.method === 'POST') {
    try {
      const { articleId, time } = req.body;

      if (!articleId || !time) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // 同じ記事の既存のマッチングを確認
      const existingMatch = matchingRequests.find(
        request => request.articleId === articleId
      );

      if (existingMatch) {
        return res.status(400).json({ 
          message: 'この記事については既にマッチングが存在します'
        });
      }

      // ランダムにユーザーを選択
      const randomUser = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];

      const newRequest: MatchingRequest = {
        articleId,
        time,
        status: 'matched',
        matchedWith: randomUser
      };
      
      matchingRequests.push(newRequest);
      console.log('New matching request added:', newRequest);

      res.status(200).json({ 
        message: 'Matching request received',
        request: newRequest 
      });
    } catch (error) {
      console.error('Error in discussion-matching API:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (!['DELETE', 'POST'].includes(req.method || '')) {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 