type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export function classifyArticle(article: any): Difficulty {
  // 記事の内容から難易度を判定
  const text = `${article.title} ${article.description}`.toLowerCase();
  
  // 簡単な記事の特徴
  const beginnerKeywords = ['basic', 'simple', 'guide', 'introduction', 'announced', 'launches', 'released'];
  
  // 中級の記事の特徴
  const intermediateKeywords = ['update', 'feature', 'improve', 'development', 'analysis', 'performance'];
  
  // 上級の記事の特徴
  const advancedKeywords = ['technical', 'complex', 'architecture', 'implementation', 'security', 'optimization'];
  
  let beginnerScore = beginnerKeywords.filter(word => text.includes(word)).length;
  let intermediateScore = intermediateKeywords.filter(word => text.includes(word)).length;
  let advancedScore = advancedKeywords.filter(word => text.includes(word)).length;
  
  // 最も高いスコアの難易度を返す
  if (advancedScore >= intermediateScore && advancedScore >= beginnerScore) {
    return 'advanced';
  } else if (intermediateScore >= beginnerScore) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
} 