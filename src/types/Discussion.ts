export interface Discussion {
  id: string;
  articleId: string;
  articleTitle: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  partnerName?: string;
  userId: string;
  aiTutorFeedback?: {
    pronunciation: string[];
    grammar: string[];
    expressions: string[];
    overall: string;
  };
} 