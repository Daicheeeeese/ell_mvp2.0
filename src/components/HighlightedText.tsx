import { useState } from 'react';
import styles from './HighlightedText.module.css';

interface Props {
  text: string;
}

interface WordDefinition {
  word: string;
  meaning: string;
}

const sampleDefinitions: WordDefinition[] = [
  { word: 'apple', meaning: 'アップル社' },
  { word: 'macbook', meaning: 'アップル社のノートパソコン' },
  { word: 'chip', meaning: '半導体チップ' },
  { word: 'performance', meaning: '性能、実行性能' },
  { word: 'feature', meaning: '特徴、機能' },
  { word: 'technology', meaning: '技術' },
  { word: 'announced', meaning: '発表された' },
  { word: 'unveiled', meaning: '発表された、明らかにされた' },
  { word: 'significant', meaning: '重要な、顕著な' },
  { word: 'improvement', meaning: '改善、向上' }
];

export default function HighlightedText({ text }: Props) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const words = text.split(' ');

  const getWordMeaning = (word: string): string | null => {
    const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
    const definition = sampleDefinitions.find(d => d.word === cleanWord);
    return definition?.meaning || null;
  };

  const translateWord = async (word: string) => {
    const predefinedMeaning = getWordMeaning(word);
    if (predefinedMeaning) {
      setTranslation(predefinedMeaning);
      return;
    }

    const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
    try {
      console.log('Translating word:', cleanWord); // デバッグログ
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanWord,
          from: 'en',
          to: 'ja'
        })
      });
      
      const data = await response.json();
      console.log('Translation response:', data); // デバッグログ
      
      if (!response.ok) {
        console.error('Translation error:', data);
        setTranslation('翻訳エラー');
        return;
      }
      
      setTranslation(data.translation);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslation('翻訳エラー');
    }
  };

  return (
    <div className="inline relative">
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            cursor: 'pointer',
            padding: '2px',
            margin: '0 2px',
            display: 'inline-block'
          }}
          className="hover:!bg-yellow-200"
          onMouseEnter={async (e) => {
            e.currentTarget.style.backgroundColor = '#fef9c3';
            setHoveredWord(word);
            setHoveredPosition({
              x: e.clientX,
              y: e.clientY + 20
            });
            await translateWord(word);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            setHoveredWord(null);
            setHoveredPosition(null);
            setTranslation(null);
          }}
        >
          {word}
        </span>
      ))}
      {hoveredWord && hoveredPosition && translation && (
        <div
          style={{
            position: 'fixed',
            left: hoveredPosition.x,
            top: hoveredPosition.y,
            transform: 'translateX(-50%)',
            backgroundColor: 'black',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            zIndex: 1000,
          }}
        >
          {translation}
        </div>
      )}
    </div>
  );
} 