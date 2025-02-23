import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const { text } = req.body;

  // ここでコメントをデータベースに保存する処理を実装
  // 現在はメモリ内で保持

  const newComment = {
    id: Date.now().toString(),
    text,
    timestamp: new Date().toISOString()
  };

  res.status(200).json(newComment);
} 