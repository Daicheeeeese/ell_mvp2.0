import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Participant {
  username: string;
  description?: string;
}

interface Discussion {
  id: string;
  articleId: string;
  articleTitle: string;
  date: string;
  time: string;
  status: 'matching' | 'matched';
  participants: Participant[];
  discussionPoints?: string[];
}

interface DiscussionContextType {
  discussions: Discussion[];
  registerDiscussion: (articleId: string, articleTitle: string, time: string) => void;
  cancelDiscussion: (id: string) => void;
  getDiscussionsByUser: (username: string) => Discussion[];
}

const DiscussionContext = createContext<DiscussionContextType | null>(null);

const getStoredDiscussions = () => {
  if (typeof window === 'undefined') return [];
  
  // 既存のデータを完全にクリア
  window.localStorage.clear();
  return [];
};

export function DiscussionProvider({ children }: { children: ReactNode }) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  useEffect(() => {
    setDiscussions(getStoredDiscussions());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('discussions', JSON.stringify(discussions));
      } catch (error) {
        console.error('Failed to save discussions:', error);
      }
    }
  }, [discussions]);

  const registerDiscussion = (articleId: string, articleTitle: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    const isAutoMatch = time === '20:00';

    const sampleDiscussionPoints = [
      "What are the potential impacts of Apple's M3 chip on the laptop market?",
      "How does the performance improvement affect professional workflows?",
      "Is the price point justified for the new features and improvements?"
    ];

    const newDiscussion: Discussion = {
      id: Date.now().toString(),
      articleId,
      articleTitle,
      date: today,
      time,
      status: isAutoMatch ? 'matched' : 'matching',
      participants: [
        { username: 'test' },
        ...(isAutoMatch ? [{
          username: 'Emma Kim',
          description: 'English Conversation Enthusiast / TOEIC 960 / 20 years old / Female / from Korea🇰🇷'
        }] : [])
      ],
      discussionPoints: isAutoMatch ? sampleDiscussionPoints : undefined
    };

    setDiscussions(prev => [...prev, newDiscussion]);
  };

  const cancelDiscussion = (id: string) => {
    setDiscussions(prev => prev.filter(d => d.id !== id));
  };

  const getDiscussionsByUser = (username: string) => {
    return discussions.filter(d => 
      d.participants.some(p => p.username === username)
    );
  };

  return (
    <DiscussionContext.Provider
      value={{
        discussions,
        registerDiscussion,
        cancelDiscussion,
        getDiscussionsByUser
      }}
    >
      {children}
    </DiscussionContext.Provider>
  );
}

export function useDiscussion() {
  const context = useContext(DiscussionContext);
  if (!context) {
    throw new Error('useDiscussion must be used within a DiscussionProvider');
  }
  return context;
} 