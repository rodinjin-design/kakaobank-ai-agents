/* Intelligent UI Kit 데모 페이지. window.IUK(dist/iuk.js)와 tokens.json을 씁니다. */
const React = window.React;
const { useState, useEffect, useRef } = React;
const K = window.IUK;

const BRIEF = [
  ['좋은 아침이에요, 하늘님.', '\n', '오늘 월급 ', { hl: '3,240,000원' }, '이 들어왔어요.', '\n', '카드값 ', { hl: '842,000원' }, '을 빼도 여유가 있어요.', '\n', { hl: '목표적금' }, ' 추가 납입, 해드릴까요?'],
  ['이번 주 해외결제가 예정돼 있어요.', '\n', '달러 잔액이 ', { hl: '24 USD' }, ' 부족해요.', '\n', '오늘 환율로 ', { hl: '외화 충전' }, '을', '\n', '미리 해드릴까요?'],
  ['내일은 26주적금 ', { hl: '4주차' }, ' 납입일이에요.', '\n', '생활비 통장의 ', { hl: '25,000원' }, '으로', '\n', { hl: '26주적금' }, ' 납입을', '\n', '미리 해드릴까요?'],
];
const BRIEF_ASK = ['목표적금 추가 납입해줘', '외화 미리 충전해줘', '26주적금 4주차 납입 미리 해줘'];
const FOLLOW = ['26주적금도 볼래요?', '외화통장 잔액은요?', '카드값 얼마 남았어?'];

function answer(t) {
  if (/26주/.test(t)) return { text: [ '26주적금 4개를 모으고 있어요. 내일 납입 금액은 ', <K.Hl key="h">25,000원</K.Hl>, '이에요.' ], card: <K.ResultCard rows={[['26주적금 합계', '450,000원'], ['4주차 · 목', '30,000원'], ['8주차 · 화 · 브랜드페스타', '108,000원'], ['8주차 · 화', '72,000원'], ['8주차 · 화', '360,000원']]} action={{ label: '26주적금 4주차 미리 납입' }} doneLabel="납입 완료" /> };
  if (/외화|달러|USD|환전/.test(t)) return { text: [ '외화통장에 ', <K.Hl key="h">90.00 USD</K.Hl>, '가 있어요. 세이프박스까지 합치면 200.20 USD예요.' ], card: <K.AccountCard logo={{ text: '$', color: 'var(--logo-gold)', ink: 'var(--ink)' }} name="외화통장" amount="90.00" unit=" USD" sub={<>달러 · 엔화 2종류<br />세이프박스 <b>110.20 USD</b> · 이자 <b>0.01 USD</b></>} action={{ label: '환전' }} /> };
  if (/카드/.test(t)) return { text: [ '이번 달 카드값 ', <K.Hl key="h">842,000원</K.Hl>, '은 오늘 자동출금으로 모두 빠져나갔어요.' ], card: <K.ResultCard rows={[['출금 계좌', '김하늘님의 통장'], ['출금 금액', '842,000원'], ['출금 후 잔액', '43,016,000원']]} /> };
  if (/목표|납입|적금/.test(t)) return { text: [ '여유분으로 ', <K.Hl key="h">목표적금</K.Hl>, '을 채워볼까요?' ], card: <K.ResultCard rows={[['명품목걸이사기 목표적금', '1,000,000원'], ['지금까지', '33% 모았어요']]} action={{ label: '10만원 넣기' }} doneLabel="납입 완료" /> };
  return { text: ['데모 화면이라 그 질문에는 답할 수 없어요. 아래 질문으로 이어가 볼까요?'] };
}

/* ---------- 라이브 데모: 폰 프레임 안의 대화 ---------- */
function PhoneDemo() {
  const [msgs, setMsgs] = useState([]);
  const [asked, setAsked] = useState({});
  const scroller = useRef(null);
  useEffect(() => { const s = scroller.current; if (s) s.scrollTo({ top: s.scrollHeight, behavior: 'smooth' }); }, [msgs]);
  const ask = (t) => {
    setAsked((a) => ({ ...a, [t]: true }));
    setMsgs((m) => [...m, { me: t }, { typing: true }]);
    setTimeout(() => setMsgs((m) => [...m.slice(0, -1), answer(t)]), 650);
  };
  const chips = FOLLOW.filter((t) => !asked[t]);
  return (
    <div className="phone" aria-label="대화 데모">
      <div className="phone-scroll" ref={scroller}>
        <div style={{ minHeight: 152 }}><K.BriefMessage messages={BRIEF} onSelect={(i) => ask(BRIEF_ASK[i])} /></div>
        <h3 className="say">오늘 <em>3곳</em>에서 돈이 움직였어요</h3>
        <K.AccountCard logo={{ text: 'B', tone: 'yellow' }} name="김하늘님의 통장" kind="저금통" amount="43,016,000"
          moves={[{ label: '월급 · 하늘상사', amount: 3240000 }, { label: '카드값 자동출금', amount: -842000 }]}
          sub={<>마이너스 <b>21,041,621원</b><br />세이프박스 <b>100,000,000원</b> · 이자 <b>180,000원</b></>}
          action={{ label: '이체', onClick: () => ask('이체할래요') }} />
        {msgs.map((m, i) => m.me ? <K.UserBubble key={i}>{m.me}</K.UserBubble>
          : <K.AIMessage key={i} typing={m.typing} card={m.card}>{m.text}</K.AIMessage>)}
        <K.SuggestionChips items={chips} onSelect={ask} label={msgs.length ? undefined : '아래 입력창으로 AI에게 이렇게 물어보세요'} />
      </div>
      <K.Composer className="phone-composer" id="demo-q" onSubmit={ask} />
    </div>
  );
}

/* ---------- 컴포넌트 문서 ---------- */
const DOCS = [
  { name: 'BriefMessage', group: '메시지', desc: '화면 맨 위에서 오늘 알아야 할 일을 알려 주는 브리핑. 여러 메시지가 돌아가며 글자마다 블러가 풀리며 나타나요.',
    props: [['messages', 'MessagePart[][]', '메시지 배열. 조각은 문자열, {hl}, \'\\n\''], ['hold', 'number', '다 나온 뒤 머무는 시간(ms), 기본 4200'], ['step', 'number', '글자 간격(ms), 기본 34'], ['onSelect', '(i) => void', '누르면 지금 메시지 번호']],
    code: `<IUK.BriefMessage\n  messages={[['오늘 월급 ', {hl:'3,240,000원'}, '이 들어왔어요.']]}\n  onSelect={(i) => ask(i)} />`,
    demo: () => <K.BriefMessage messages={BRIEF.slice(0, 2)} /> },
  { name: 'Hl', group: '메시지', desc: '문장 속 핵심 숫자와 다음 행동 낱말을 파란 굵은 글자와 밑줄로 짚어요. 한 메시지에 세 개까지.',
    props: [['children', 'ReactNode', '강조할 텍스트'], ['as', "'span' | 'a' | 'button'", '링크나 버튼으로 쓸 때']],
    code: `오늘 월급 <IUK.Hl>3,240,000원</IUK.Hl>이 들어왔어요.`,
    demo: () => <p className="t-brief" style={{ margin: 0 }}>오늘 월급 <K.Hl>3,240,000원</K.Hl>이 들어왔어요.</p> },
  { name: 'UserBubble', group: '메시지', desc: '사용자가 보낸 말이나 누른 칩을 오른쪽 흰 말풍선으로 보여 줘요. 부모는 세로 flex여야 해요.',
    props: [['children', 'ReactNode', '보낸 말']],
    code: `<IUK.UserBubble>26주적금도 볼래요?</IUK.UserBubble>`,
    demo: () => <K.UserBubble>26주적금도 볼래요?</K.UserBubble> },
  { name: 'AIMessage', group: '메시지', desc: '말풍선 없이 화면 폭을 쓰는 AI 답변. 아래에 결과 카드를 붙이고, 준비 중엔 점 세 개만 보여요.',
    props: [['children', 'ReactNode', '답변 문장'], ['card', 'ReactNode', '아래 붙일 카드'], ['typing', 'boolean', '답변 준비 중']],
    code: `<IUK.AIMessage card={<IUK.ResultCard rows={[['합계','450,000원']]} />}>\n  내일 납입 금액은 <IUK.Hl>25,000원</IUK.Hl>이에요.\n</IUK.AIMessage>`,
    demo: () => <><K.AIMessage typing /><K.AIMessage card={<K.ResultCard rows={[['26주적금 합계', '450,000원'], ['4주차 · 목', '30,000원']]} />}>내일 납입 금액은 <K.Hl>25,000원</K.Hl>이에요.</K.AIMessage></> },
  { name: 'SuggestionChips', group: '입력', desc: '다음에 물어볼 만한 말을 버튼으로 보여 줘요. 문구는 사용자가 할 말로 쓰고, 이미 물어본 건 빼요.',
    props: [['items', 'string[]', '문구'], ['onSelect', '(text) => void', '누른 문구'], ['label', 'string', '위 안내문(선택)']],
    code: `<IUK.SuggestionChips\n  items={['26주적금도 볼래요?', '카드값 얼마 남았어?']}\n  onSelect={ask} />`,
    demo: () => <K.SuggestionChips label="아래 입력창으로 AI에게 이렇게 물어보세요" items={['26주적금도 볼래요?', '외화통장 잔액은요?', '카드값 얼마 남았어?', '달러 충전']} /> },
  { name: 'Composer', group: '입력', desc: '한 줄 입력과 둘러보기·보내기·통장 버튼. 선택 전엔 입력창만, 선택 후엔 통장 버튼이 나오고, 키보드가 올라오면 다시 접혀요.',
    props: [['onSubmit', '(text) => void', '보낸 문장'], ['onBrowse', '() => void', '왼쪽 나침반'], ['onAccounts', '() => void', '통장 버튼'], ['mode', "'idle' | 'chat' | 'typing'", '없으면 포커스로 자동'], ['fixed', 'boolean', '화면 하단 고정']],
    code: `<IUK.Composer fixed onSubmit={ask}\n  onBrowse={openBrowse} onAccounts={openAccounts} />`,
    demo: () => <div className="stack"><Label t="선택 전 · idle" /><K.Composer mode="idle" id="c1" /><Label t="선택 후 · chat" /><K.Composer mode="chat" id="c2" /><Label t="입력 중 · typing" /><K.Composer mode="typing" id="c3" /></div> },
  { name: 'ResultCard', group: '카드', desc: '답변을 라벨-값 행으로 정리하고 실행 버튼을 하나 붙여요. 누르면 완료 문구로 바뀌어요.',
    props: [['rows', '[string, string][]', '라벨, 값'], ['action', '{label, onClick}', '실행 버튼'], ['doneLabel', 'string', '실행 뒤 문구']],
    code: `<IUK.ResultCard\n  rows={[['목표적금', '1,000,000원'], ['지금까지', '33% 모았어요']]}\n  action={{ label: '추가 납입하기', onClick: pay }}\n  doneLabel="납입 완료" />`,
    demo: () => <K.ResultCard rows={[['명품목걸이사기 목표적금', '1,000,000원'], ['지금까지', '33% 모았어요']]} action={{ label: '추가 납입하기' }} doneLabel="납입 완료" /> },
  { name: 'AccountCard', group: '카드', desc: '통장 하나의 잔액과 오늘 움직인 금액. 입금은 빨강(+), 출금은 파랑(-)이고 부호가 늘 같이 붙어요.',
    props: [['logo', '{text, tone|color, ink}', '로고 원'], ['name / kind', 'ReactNode / string', '통장 이름, 종류'], ['amount / unit', 'string', "잔액, 단위(기본 '원')"], ['moves', '{label, amount}[]', '오늘 입출금'], ['sub', 'ReactNode', '보조줄'], ['action', '{label, onClick}', '오른쪽 버튼']],
    code: `<IUK.AccountCard logo={{ text: 'B', tone: 'yellow' }}\n  name="김하늘님의 통장" kind="저금통" amount="43,016,000"\n  moves={[{ label: '월급 · 하늘상사', amount: 3240000 }]}\n  action={{ label: '이체' }} />`,
    demo: () => <K.AccountCard logo={{ text: 'B', tone: 'yellow' }} name="김하늘님의 통장" kind="저금통" amount="43,016,000" moves={[{ label: '월급 · 하늘상사', amount: 3240000 }, { label: '카드값 자동출금', amount: -842000 }]} sub={<>마이너스 <b>21,041,621원</b><br />세이프박스 <b>100,000,000원</b> · 이자 <b>180,000원</b></>} action={{ label: '이체' }} /> },
];
const Label = ({ t }) => <span className="demo-label">{t}</span>;

function Copy({ text }) {
  const [ok, setOk] = useState(false);
  const go = () => { try { navigator.clipboard.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1400); }, () => {}); } catch (e) {} };
  return <button type="button" className="copy" onClick={go}>{ok ? '복사했어요' : '복사'}</button>;
}

function ComponentDoc({ d }) {
  return (
    <article className="doc" id={d.name}>
      <header><span className="doc-group">{d.group}</span><h3>{d.name}</h3><p>{d.desc}</p></header>
      <div className="doc-stage">{d.demo()}</div>
      <div className="doc-code"><pre><code>{d.code}</code></pre><Copy text={d.code} /></div>
      <div className="props"><table><thead><tr><th>prop</th><th>타입</th><th>설명</th></tr></thead>
        <tbody>{d.props.map(([a, b, c]) => <tr key={a}><td><code>{a}</code></td><td><code>{b}</code></td><td>{c}</td></tr>)}</tbody></table></div>
    </article>
  );
}

/* ---------- 토큰 ---------- */
function L(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex); if (!m) return null;
  const c = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a, b) => { const x = L(a), y = L(b); if (x == null || y == null) return null; const [hi, lo] = x > y ? [x, y] : [y, x]; return (hi + 0.05) / (lo + 0.05); };

function Tokens({ t }) {
  if (!t) return <p className="muted">토큰을 불러오는 중이에요.</p>;
  return (
    <>
      <h3 className="sub-h">색 <span className="count">{t.color.tokens.length}</span></h3>
      <div className="swatches">
        {t.color.tokens.map((c) => {
          const r = ratio(c.value, '#FFFFFF');
          return (
            <div className="sw" key={c.name}>
              <span className="sw-chip" style={{ background: c.value }} />
              <span className="sw-name">{c.name}</span>
              <span className="sw-val">{c.value}{r && <em className={r < 3 ? 'bad' : r < 4.5 ? 'warn' : ''}> · {r.toFixed(1)}:1</em>}</span>
              <span className="sw-use">{c.usage}</span>
            </div>
          );
        })}
      </div>
      <p className="note">대비는 흰 바탕(surface) 기준이에요. 빨간 숫자는 3:1 미만, 주황은 4.5:1 미만이에요. 원본 값을 그대로 옮긴 거라 고치지 않았어요.</p>

      <h3 className="sub-h">글자</h3>
      <div className="type-list">
        {t.type.groups.flatMap((g) => g.styles.map((s) => (
          <div className="type-row" key={s.name}>
            <span className="type-meta"><code>{s.name}</code><span>{s.fontSize} · {s.fontWeight} · {s.lineHeight}</span></span>
            <span className={'t-' + s.name}>{s.sample}</span>
          </div>
        )))}
      </div>

      <h3 className="sub-h">모서리 · 간격 · 그림자</h3>
      <div className="shapes">
        {t.radius.tokens.map((r) => <div className="shape" key={r.name}><span className="shape-box" style={{ borderRadius: r.value }} /><code>{r.name}</code><span>{r.value}</span></div>)}
      </div>
      <div className="shapes">
        {t.spacing.tokens.map((s) => <div className="shape" key={s.name}><span className="space-bar" style={{ width: s.value }} /><code>{s.name}</code><span>{s.value}</span></div>)}
      </div>
      <div className="shapes">
        {t.shadow.tokens.map((s) => <div className="shape" key={s.name}><span className="shape-box" style={{ boxShadow: s.value, borderRadius: 16, background: '#fff', border: 0 }} /><code>{s.name}</code></div>)}
      </div>
    </>
  );
}

const USAGE = `<link rel="stylesheet" href="https://kakaobank-ai-agents.vercel.app/ui-kit/tokens.css">
<link rel="stylesheet" href="https://kakaobank-ai-agents.vercel.app/ui-kit/dist/iuk.css">
<script src="https://kakaobank-ai-agents.vercel.app/ui-kit/vendor/react.production.min.js"></script>
<script src="https://kakaobank-ai-agents.vercel.app/ui-kit/vendor/react-dom.production.min.js"></script>
<script src="https://kakaobank-ai-agents.vercel.app/ui-kit/dist/iuk.js"></script>
<script>
  const h = React.createElement;
  ReactDOM.createRoot(document.getElementById('app')).render(
    h(IUK.Composer, { fixed: true, onSubmit: (t) => console.log(t) })
  );
</script>`;

function App() {
  const [tokens, setTokens] = useState(null);
  useEffect(() => { fetch('tokens.json').then((r) => r.json()).then(setTokens).catch(() => {}); }, []);
  return (
    <>
      <header className="top">
        <div className="wrap top-in">
          <span className="brand">Intelligent UI Kit</span>
          <nav aria-label="목차"><a href="#demo">데모</a><a href="#components">컴포넌트</a><a href="#tokens">토큰</a><a href="#usage">사용법</a></nav>
        </div>
      </header>
      <main className="wrap">
        <section className="hero">
          <p className="eyebrow">v0.1 · 대화 요소 9개</p>
          <h1>대화로 금융을 다루는<br />화면을 위한 키트</h1>
          <p className="lead">카카오뱅크 AI 홈의 대화 화면에서 뽑은 브리핑, 말풍선, 꼬리 질문, 입력창, 결과 카드를 React 컴포넌트로 묶었어요. 값은 모두 원본 화면에서 그대로 가져왔어요.</p>
        </section>

        <section id="demo" className="sec demo-sec">
          <div className="demo-copy">
            <h2>라이브 데모</h2>
            <p>컴포넌트만으로 만든 대화 화면이에요. 브리핑 문장을 누르거나, 꼬리 질문을 누르거나, 직접 물어보세요.</p>
            <ul className="hint">
              <li>브리핑은 세 문장이 돌아가며 블러 타이핑으로 바뀌어요.</li>
              <li>입력창을 한 번 누르면 통장 버튼이 나오고, 입력 중엔 다시 접혀요.</li>
              <li>'26주', '달러', '카드', '적금'이 들어간 질문에 답해요.</li>
            </ul>
          </div>
          <PhoneDemo />
        </section>

        <section id="components" className="sec">
          <h2>컴포넌트</h2>
          <nav className="toc" aria-label="컴포넌트 목록">{DOCS.map((d) => <a key={d.name} href={'#' + d.name}>{d.name}</a>)}</nav>
          {DOCS.map((d) => <ComponentDoc key={d.name} d={d} />)}
        </section>

        <section id="tokens" className="sec"><h2>토큰</h2><Tokens t={tokens} /></section>

        <section id="usage" className="sec">
          <h2>사용법</h2>
          <p>React 18을 전역(window.React)으로 먼저 불러온 뒤 번들을 넣으면 <code>window.IUK</code>에 컴포넌트가 생겨요.</p>
          <div className="doc-code"><pre><code>{USAGE}</code></pre><Copy text={USAGE} /></div>
          <p className="note">소스는 저장소의 <code>ui-kit/src</code>, 타입은 <code>ui-kit/dist/iuk.d.ts</code>, 토큰 원본은 <code>ui-kit/tokens.json</code>이에요. 빌드 방법은 <code>ui-kit/README.md</code>에 있어요.</p>
        </section>
      </main>
      <footer className="wrap foot">화면 확인용 가상 정보로 만든 데모예요.</footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
