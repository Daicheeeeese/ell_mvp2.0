import { NextApiRequest, NextApiResponse } from 'next';

// 仮のマッチングデータストアを共有（実際はデータベースを使用）
import { matchingRequests } from './discussion-matching';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { articleId } = req.query;

    if (!articleId) {
      return res.status(400).json({ message: 'Article ID is required' });
    }

    // 指定された記事のマッチングリクエストのみを取得
    const requests = matchingRequests.filter(
      request => request.articleId === articleId
    );

    // デバッグ用
    console.log('Article ID:', articleId);
    console.log('All requests:', matchingRequests);
    console.log('Filtered requests:', requests);

    res.status(200).json({ requests });
  } catch (error) {
    console.error('Error in matching-status API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 