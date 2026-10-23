const TOPICS = {
  tax: '세금 계산(금융소득·양도·배당 세금 예측과 납부)',
  salary: '월급 나눠 담기(월급을 저축·투자로 나누기)',
  home: '내 집 마련(취득세·대출·자금 계획)',
  ipo: '공모주 청약(증거금 확인, 청약, 배정, 매도·세이프박스 이동)',
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { app, text } = body;
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'bad request' });
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(500).json({ error: 'no key' });
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const system =
      '당신은 카카오뱅크 AI 에이전트 시연 앱의 도우미입니다. 지금 화면의 주제는 ' + (TOPICS[app] || '카카오뱅크 금융 업무') + '입니다. ' +
      '한국어로 1~2문장, 친근하고 담백한 존댓말로 답하세요. 마크다운과 이모지는 쓰지 마세요. ' +
      '실제 계좌·잔액·수익률은 모릅니다. 확정적인 투자·세금 조언은 하지 말고 일반 정보만 말하세요. ' +
      '주제와 무관한 질문에는 짧게 답한 뒤, 화면의 노란 화살표 버튼으로 시연을 이어가자고 안내하세요.';
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: text.slice(0, 300) }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.5 },
        }),
      }
    );
    if (!r.ok) return res.status(502).json({ error: 'upstream' });
    const j = await r.json();
    const out = j.candidates && j.candidates[0] && j.candidates[0].content.parts.map((p) => p.text).join('');
    if (!out) return res.status(502).json({ error: 'empty' });
    res.status(200).json({ text: out.trim() });
  } catch (e) {
    res.status(502).json({ error: 'upstream' });
  }
};
