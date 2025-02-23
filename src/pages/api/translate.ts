import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, from, to } = req.body;
  
  // リクエストの内容をログ出力
  console.log('Translation request:', { text, from, to });
  console.log('API Key:', process.env.AZURE_TRANSLATOR_KEY ? 'Set' : 'Not set');
  console.log('Region:', process.env.AZURE_TRANSLATOR_REGION ? 'Set' : 'Not set');

  try {
    const url = new URL('https://api.cognitive.microsofttranslator.com/translate');
    url.searchParams.append('api-version', '3.0');
    url.searchParams.append('from', from);
    url.searchParams.append('to', to);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_TRANSLATOR_KEY!,
        'Ocp-Apim-Subscription-Region': process.env.AZURE_TRANSLATOR_REGION!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          text,
        },
      ]),
    });

    // レスポンスの詳細をログ出力
    console.log('API Response status:', response.status);
    const responseData = await response.json();
    console.log('API Response data:', responseData);

    if (!response.ok) {
      return res.status(response.status).json({ 
        message: 'Translation failed',
        error: responseData
      });
    }

    res.status(200).json({ translation: responseData[0].translations[0].text });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      message: 'Translation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 