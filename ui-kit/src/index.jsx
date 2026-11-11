/* Intelligent UI Kit — 대화 요소 (카카오뱅크 AI 홈 톤)
 * React 18 컴포넌트. 스타일은 iuk.css(클래스 iuk-*)와 tokens.css의 CSS 변수를 씁니다. */
const React = window.React;
const { useState, useEffect, useRef, useMemo, Fragment } = React;
const h = React.createElement;
const cx = (...a) => a.filter(Boolean).join(' ');

/* ---------- 강조 텍스트 ---------- */
export function Hl({ children, as = 'span', className, ...rest }) {
  return h(as, { ...rest, className: cx('iuk-hl', className) }, children);
}

/* 메시지 조각: 문자열, {hl:'텍스트'}, '\n'(줄바꿈) */
function renderParts(parts, typed, startRef, step) {
  const out = [];
  parts.forEach((p, i) => {
    if (p === '\n') { out.push(h('br', { key: 'br' + i })); return; }
    const text = typeof p === 'string' ? p : p.hl;
    const chars = typed
      ? Array.from(text).map((ch, j) => h('span', { key: j, className: 'iuk-tc', style: { animationDelay: (startRef.n++ * step) + 'ms' } }, ch))
      : text;
    out.push(typeof p === 'string' ? h(Fragment, { key: i }, chars) : h('span', { key: i, className: 'iuk-hl' }, chars));
  });
  return out;
}
function countChars(parts) { return parts.reduce((n, p) => n + (p === '\n' ? 0 : Array.from(typeof p === 'string' ? p : p.hl).length), 0); }

/* ---------- 브리핑 메시지 (롤링 + 블러 타이핑) ---------- */
export function BriefMessage({ messages, hold = 4200, step = 34, onSelect, className }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState(null);
  const reduce = useMemo(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  useEffect(() => {
    if (!messages || messages.length < 2) return;
    const dur = reduce ? 0 : countChars(messages[i]) * step + 550;
    const t = setTimeout(() => { setPrev(i); setI((i + 1) % messages.length); }, dur + hold);
    return () => clearTimeout(t);
  }, [i, messages, hold, step, reduce]);
  useEffect(() => { if (prev === null) return; const t = setTimeout(() => setPrev(null), 850); return () => clearTimeout(t); }, [prev]);
  if (!messages || !messages.length) return null;
  const counter = { n: 0 };
  const select = () => onSelect && onSelect(i);
  return h('p', {
    className: cx('iuk-brief', onSelect && 'is-action', className),
    role: onSelect ? 'button' : undefined, tabIndex: onSelect ? 0 : undefined,
    onClick: select, onKeyDown: (e) => { if (onSelect && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(); } },
    'aria-live': 'polite',
  },
    h('span', { key: 'm' + i, className: 'iuk-brief-now' }, renderParts(messages[i], !reduce, counter, step)),
    prev !== null && h('span', { key: 'g' + prev, className: 'iuk-brief-ghost', 'aria-hidden': true }, renderParts(messages[prev], false))
  );
}

/* ---------- 대화 말풍선 ---------- */
export function UserBubble({ children, className }) {
  return h('div', { className: cx('iuk-me', className) }, children);
}

export function TypingIndicator({ label = '답변 준비 중' }) {
  return h('span', { className: 'iuk-typing', role: 'status', 'aria-label': label }, h('i'), h('i'), h('i'));
}

export function AIMessage({ children, typing, card, className }) {
  return h('div', { className: cx('iuk-ai', className) },
    typing ? h(TypingIndicator) : children != null && h('div', { className: 'iuk-ai-text' }, children),
    !typing && card);
}

/* ---------- 꼬리 질문 칩 ---------- */
export function SuggestionChips({ items, onSelect, label, className }) {
  if (!items || !items.length) return null;
  return h('div', { className: cx('iuk-chips-wrap', className) },
    label && h('p', { className: 'iuk-kicker' }, label),
    h('div', { className: 'iuk-chips', role: 'group', 'aria-label': label || '추천 질문' },
      items.map((t) => h('button', { key: t, type: 'button', onClick: () => onSelect && onSelect(t) }, t))));
}

/* ---------- 결과 카드 ---------- */
export function ResultCard({ rows = [], action, doneLabel, className, children }) {
  const [done, setDone] = useState(false);
  return h('div', { className: cx('iuk-card', className) },
    children,
    rows.map(([k, v], j) => h('div', { key: j, className: 'iuk-row' }, h('span', null, k), h('b', { className: 'iuk-num' }, v))),
    action && h('button', {
      type: 'button', className: 'iuk-act', disabled: done,
      onClick: () => { if (action.onClick) action.onClick(); if (doneLabel) setDone(true); },
    }, done ? doneLabel : action.label));
}

/* ---------- 통장 카드 ---------- */
export function AccountCard({ logo = { text: 'B', tone: 'yellow' }, name, kind, amount, unit = '원', moves = [], sub, action, id, className }) {
  const tones = { yellow: ['var(--logo-yellow)', 'var(--ink)'] };
  const [bg, fg] = tones[logo.tone] || [logo.color || 'var(--logo-yellow)', logo.ink || '#FFFFFF'];
  return h('div', { id, className: cx('iuk-acct', className) },
    h('span', { className: 'iuk-lg', 'aria-hidden': true, style: { background: bg, color: fg } }, logo.text),
    h('div', { className: 'iuk-acct-name' }, name, kind && h(Fragment, null, h('span', { className: 'iuk-dot', 'aria-hidden': true }, '·'), h('span', { className: 'iuk-kind' }, kind))),
    h('div', { className: 'iuk-acct-amt iuk-num' }, amount, h('small', null, unit)),
    action && h('button', { type: 'button', className: 'iuk-go', onClick: action.onClick }, action.label),
    moves.length > 0 && h('div', { className: 'iuk-acct-moves iuk-num' },
      moves.map((m, j) => h('span', { key: j, className: m.amount >= 0 ? 'is-up' : 'is-down' },
        (m.amount >= 0 ? '+' : '-') + Math.abs(m.amount).toLocaleString('ko-KR') + '원 ', h('span', null, m.label)))),
    sub && h('div', { className: 'iuk-acct-sub iuk-num' }, sub));
}

/* ---------- 입력창 ---------- */
const Icon = {
  browse: h('svg', { width: 22, height: 22, viewBox: '0 0 22 22', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinejoin: 'round', 'aria-hidden': true },
    h('circle', { cx: 11, cy: 11, r: 8.5 }), h('path', { d: 'M14.2 7.8l-1.8 4.6-4.6 1.8 1.8-4.6z', fill: 'currentColor', fillOpacity: 0.15 })),
  send: h('svg', { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }, h('path', { d: 'M9 15V3M4 8l5-5 5 5' })),
  acct: h('svg', { width: 22, height: 22, viewBox: '0 0 22 22', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }, h('rect', { x: 3, y: 5, width: 16, height: 13, rx: 3 }), h('path', { d: 'M3 9h16M7 14h4' })),
};

/* mode: 'idle'(선택 전) | 'chat'(선택 후) | 'typing'(키보드). 지정하지 않으면 포커스에 따라 스스로 바뀝니다. */
export function Composer({ placeholder = '무엇이든 물어보세요', onSubmit, onBrowse, onAccounts, mode, fixed = false, id = 'iuk-q', className }) {
  const [v, setV] = useState('');
  const [auto, setAuto] = useState('idle');
  const m = mode || auto;
  const submit = (e) => { e.preventDefault(); const t = v.trim(); if (!t) return; setV(''); onSubmit && onSubmit(t); };
  return h('div', { className: cx('iuk-composer', fixed && 'is-fixed', 'is-' + m, className) },
    h('form', { onSubmit: submit, autoComplete: 'off' },
      h('div', { className: 'iuk-field' },
        h('button', { type: 'button', className: 'iuk-browse', 'aria-label': '둘러보기', onClick: onBrowse }, Icon.browse),
        h('label', { htmlFor: id, className: 'iuk-sr' }, 'AI에게 묻기'),
        h('input', { id, value: v, placeholder, enterKeyHint: 'send', onChange: (e) => setV(e.target.value),
          onFocus: () => setAuto('typing'), onBlur: () => setAuto('chat') }),
        h('button', { type: 'submit', className: 'iuk-send', 'aria-label': '보내기', disabled: !v.trim() }, Icon.send)),
      h('button', { type: 'button', className: 'iuk-acctbtn', 'aria-label': '통장 리스트 열기', tabIndex: m === 'chat' ? 0 : -1, onClick: onAccounts }, Icon.acct)));
}
