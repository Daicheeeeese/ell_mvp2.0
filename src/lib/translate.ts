const AZURE_TRANSLATE_KEY = process.env.NEXT_PUBLIC_AZURE_TRANSLATE_KEY;
const AZURE_TRANSLATE_REGION = process.env.NEXT_PUBLIC_AZURE_TRANSLATE_REGION;
const AZURE_TRANSLATE_URL = 'https://api.cognitive.microsofttranslator.com/translate';

export async function translateText(text: string): Promise<string> {
  try {
    const response = await fetch(AZURE_TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATE_KEY!,
        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATE_REGION!
      },
      body: JSON.stringify([{ text: text }])
    });

    const data = await response.json();
    
    if (!data || !Array.isArray(data) || !data[0]?.translations?.[0]?.text) {
      console.error('Unexpected translation response format:', data);
      return '';
    }
    
    console.log('Translation API response:', data);
    return data[0].translations[0].text;
  } catch (error) {
    console.error('Translation failed:', error);
    return '';
  }
} 