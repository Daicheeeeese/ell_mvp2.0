import { NextApiRequest, NextApiResponse } from 'next';

interface Article {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: "Apple's M3 MacBook and iMac: 'Groundbreaking' or 'marginal'?",
    description: "Apple's latest product launch has sparked debate among tech enthusiasts. While some praise the M3 chip's capabilities, others question whether the improvements justify an upgrade.",
    date: '2023-11-01',
    category: 'Technology',
    image: '/images/articles/apple-m3.jpg'
  },
  {
    id: '2',
    title: 'The Rise of AI in Healthcare: Opportunities and Challenges',
    description: 'Artificial Intelligence is transforming healthcare delivery, from diagnosis to treatment planning. But what are the implications for patients and healthcare providers?',
    date: '2023-11-02',
    category: 'Healthcare',
    image: '/images/articles/ai-healthcare.jpg'
  },
  {
    id: '3',
    title: 'Global Climate Summit 2023: Key Takeaways',
    description: 'World leaders gathered to discuss climate action. New commitments were made, but are they enough to address the growing environmental crisis?',
    date: '2023-11-03',
    category: 'Environment',
    image: '/images/articles/climate-summit.jpg'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.status(200).json(articles);
} 