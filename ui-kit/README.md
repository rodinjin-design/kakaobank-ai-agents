# Intelligent UI Kit

대화로 금융을 다루는 화면을 위한 React 컴포넌트 키트예요. 카카오뱅크 AI 홈의 대화 화면(`../ai-chat/`)에서 쓰는 요소를 뽑았고, 색·글자·간격 값은 원본 화면에서 그대로 가져왔어요.

- 데모와 문서: https://kakaobank-ai-agents.vercel.app/ui-kit/
- 범위(v0.1): 대화 요소 9개 — `BriefMessage`, `Hl`, `UserBubble`, `AIMessage`, `TypingIndicator`, `SuggestionChips`, `Composer`, `ResultCard`, `AccountCard`

## 폴더

| 경로 | 내용 |
| --- | --- |
| `src/index.jsx` | 컴포넌트 소스 |
| `src/iuk.css` | 컴포넌트 스타일 (클래스 `iuk-*`) |
| `src/demo.jsx` | 데모 페이지 소스 |
| `tokens.json` | 토큰 원본 (색 37, 글자 9, 간격 4, 모서리 6, 그림자 3) |
| `tokens.css` | `tokens.json`에서 만든 CSS 변수 + Pretendard `@font-face` |
| `dist/iuk.js` | 빌드된 번들. `window.React`를 쓰고 `window.IUK`에 컴포넌트를 붙여요 |
| `dist/iuk.css` | 빌드된 스타일 |
| `dist/iuk.d.ts` | props 타입 |
| `vendor/` | React 18.3.1 UMD |
| `fonts/` | Pretendard 가변 폰트 |

## 쓰는 법

```html
<link rel="stylesheet" href="/ui-kit/tokens.css">
<link rel="stylesheet" href="/ui-kit/dist/iuk.css">
<script src="/ui-kit/vendor/react.production.min.js"></script>
<script src="/ui-kit/vendor/react-dom.production.min.js"></script>
<script src="/ui-kit/dist/iuk.js"></script>
<script>
  const h = React.createElement;
  ReactDOM.createRoot(document.getElementById('app')).render(
    h(IUK.Composer, { fixed: true, onSubmit: (t) => console.log(t) })
  );
</script>
```

## 빌드

저장소 루트에 `package.json`을 두지 않아서 Vercel은 파일을 그대로 서빙해요. 소스를 고친 뒤 `ui-kit/`에서 아래를 실행하고 `dist/`까지 커밋하세요.

```sh
npx esbuild@0.23.1 src/entry.js --bundle --minify --format=iife --loader:.jsx=jsx --outfile=dist/iuk.js
npx esbuild@0.23.1 src/demo.jsx --bundle --minify --format=iife --loader:.jsx=jsx --outfile=dist/demo.js
cp src/iuk.css dist/iuk.css
```

`tokens.css`는 `tokens.json`을 고친 뒤 다시 만들어요. 변수 이름은 토큰 이름 그대로예요(`--brand`, `--radius-card`).

## 알려진 점

- 라이트 테마만 있어요.
- `ink-mute`(3.3:1), `ink-faint`(2.6:1), `chip-line`(1.8:1), `rise`(4.4:1)는 원본 값 그대로라 WCAG 대비 기준에 못 미쳐요. 본문 크기 글자에는 `ink-sub`를 쓰세요.
- 브랜드 로고 파일은 들어 있지 않아요.
