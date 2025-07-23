export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // 从请求中获取数据
    const { model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty } = req.body;

    // 构建发送到Moonshot API的请求
    const moonshotResponse = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || `Bearer ${process.env.MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty
      })
    });

    if (!moonshotResponse.ok) {
      const errorText = await moonshotResponse.text();
      console.error('Moonshot API Error:', moonshotResponse.status, errorText);
      res.status(moonshotResponse.status).json({ 
        error: `Moonshot API Error: ${moonshotResponse.status}`,
        details: errorText
      });
      return;
    }

    const data = await moonshotResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}