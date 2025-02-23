import { NextApiRequest, NextApiResponse } from 'next';

interface Article {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  content: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: "Apple's M3 MacBook and iMac: 'Groundbreaking' or 'marginal gains'?",
    description: "The new computers are the first to feature a 3-nanometer chip, which Apple says will bring significant performance gains.",
    date: '2023-10-31',
    category: 'Technology',
    content: `Apple has unveiled its latest generation of Mac computers featuring the new M3 family of chips. The company claims these are the first personal computers to be built using 3-nanometer technology, promising significant performance gains.

The new lineup includes:
- MacBook Pro 14-inch and 16-inch with M3 Pro or M3 Max
- iMac 24-inch with M3
- MacBook Pro 14-inch with M3

The base M3 chip offers up to 35% faster CPU performance than M1, while the high-end M3 Max promises up to 80% faster performance than M1 Max.`,
  },
  {
    id: '2',
    title: 'OpenAI announces GPT-4 Turbo with 128K context window',
    description: 'The latest model supports a much larger context window and is significantly cheaper for developers to use.',
    date: '2023-11-06',
    category: 'AI',
    content: `OpenAI has announced GPT-4 Turbo, featuring a significantly larger context window of 128,000 tokens, allowing it to process about 300 pages of text in a single prompt. The model is also more capable and cheaper for developers to use.

Key improvements include:
- 128K context window (4x larger than GPT-4)
- Knowledge cutoff of April 2023
- Lower pricing for API usage
- Improved accuracy and capabilities`,
  },
  {
    id: '3',
    title: 'Microsoft completes Activision Blizzard acquisition',
    description: 'The $69 billion deal marks the biggest gaming acquisition in history.',
    date: '2023-10-13',
    category: 'Business',
    content: `Microsoft has completed its $69 billion acquisition of Activision Blizzard, marking the largest gaming industry deal in history. The acquisition brings popular franchises like Call of Duty, World of Warcraft, and Candy Crush under Microsoft's umbrella.

Key points of the deal:
- $69 billion acquisition price
- Access to major gaming franchises
- Cloud gaming opportunities
- Mobile gaming expansion`,
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const article = articles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  res.status(200).json(article);
} 