/* CFP Study — shared UI primitives. Exposed on window.UI */
(function () {
  const { useState, useEffect } = React;

  const COLORS = {
    paper: '#F4F0E6', paper2: '#FBF8F1', card: '#FFFFFF',
    ink: '#1C2B4A', /* navy used for body text in light mode */
    navy: '#1C2B4A', navy2: '#26395F', cream: '#EDE6D6',
    softNavy: '#3D5B85', /* lighter, less-saturated navy for light-mode cards */
    creamMute: 'rgba(237,230,214,.62)', creamFaint: 'rgba(237,230,214,.42)',
    creamHair: 'rgba(237,230,214,.15)', navyHair: 'rgba(28,43,74,.1)',
    navyFaint: 'rgba(28,43,74,.38)', navyMute: 'rgba(28,43,74,.55)',
    navyFaintLt: 'rgba(28,43,74,.07)'
  };
  const F = {
    serif: "'Spectral', Georgia, serif",
    sans: "'IBM Plex Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace"
  };

  /* theme tokens — all text is navy (#1C2B4A) or cream (#EDE6D6) family only */
  function getTheme(dark) {
    if (dark) return {
      pageBg: COLORS.navy, headerBg: COLORS.navy2, headerText: COLORS.cream,
      headerBorder: COLORS.creamHair,
      text: COLORS.cream, muted: COLORS.creamMute, faint: COLORS.creamFaint,
      hair: COLORS.creamHair,
      listCard: COLORS.navy2, listBorder: 'none', listText: COLORS.cream,
      barFill: COLORS.cream, barTrack: COLORS.creamHair,
      tableBandA: 'transparent', tableBandB: 'rgba(237,230,214,.07)',
      tableHair: 'rgba(237,230,214,.14)',
      sectionBorder: 'rgba(237,230,214,.1)'
    };
    return {
      pageBg: COLORS.paper, headerBg: COLORS.navy, headerText: COLORS.cream,
      headerBorder: COLORS.creamHair,
      text: COLORS.navy, muted: COLORS.navyMute, faint: COLORS.navyFaint,
      hair: 'rgba(28,43,74,.12)',
      listCard: COLORS.card, listBorder: `1px solid rgba(28,43,74,.1)`, listText: COLORS.navy,
      barFill: COLORS.navy, barTrack: COLORS.navyHair,
      tableBandA: COLORS.paper2, tableBandB: COLORS.cream,
      tableHair: 'rgba(28,43,74,.1)',
      sectionBorder: 'rgba(28,43,74,.08)'
    };
  }

  function useLS(key, initial) {
    const [v, setV] = useState(() => {
      try {
        const s = localStorage.getItem(key);
        if (s == null) return initial;
        if (typeof initial === 'string') return s;
        return JSON.parse(s);
      } catch (e) { return initial; }
    });
    useEffect(() => {
      try {
        if (typeof v === 'string') {
          localStorage.setItem(key, v);
        } else {
          localStorage.setItem(key, JSON.stringify(v));
        }
      } catch (e) {}
    }, [key, v]);
    return [v, setV];
  }

  function Icon({ name, size = 22, stroke = COLORS.navy, sw = 1.6, style }) {
    const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', style };
    const P = {
      checklist: <><rect x="4" y="3.5" width="16" height="17" rx="2.5" /><path d="M8 9l2 2 3.5-3.5" /><path d="M8 15.5h7" /></>,
      cards: <><rect x="3.5" y="6.5" width="13" height="11" rx="2" /><path d="M8 4.5h10a2 2 0 0 1 2 2v8" /></>,
      refs: <><path d="M6 4h9a2 2 0 0 1 2 2v14l-5.5-2.8L6 20V4z" /><path d="M9.5 8.5h4" /></>,
      calc: <><rect x="5" y="3.5" width="14" height="17" rx="2.5" /><path d="M8.5 8h7M8.5 12.5h2.5M14 12.5h1.5M8.5 16.5h2.5M14 16.5h1.5" /></>,
      back: <path d="M15 5l-7 7 7 7" />,
      check: <path d="M5 12.5l4.5 4.5L19 6.5" />,
      chevron: <path d="M9 5l7 7-7 7" />,
      flip: <><path d="M4 7a8 8 0 0 1 13.5-2.5M20 4v4h-4" /><path d="M20 17a8 8 0 0 1-13.5 2.5M4 20v-4h4" /></>,
      send: <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />,
      sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>,
      moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    };
    return <svg {...common}>{P[name]}</svg>;
  }

  function Ring({ pct = 0, size = 64, sw = 6, track, bar, label, color }) {
    const r = (size - sw) / 2,c = 2 * Math.PI * r,off = c * (1 - pct / 100);
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={sw} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bar} strokeWidth={sw}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontFamily: F.serif, fontSize: size * 0.27, fontWeight: 500, color }}>
          {label ?? pct + '%'}
        </div>
      </div>);

  }

  function Bar({ pct = 0, track = COLORS.navyHair, fill = COLORS.navy, h = 4 }) {
    return (
      <div style={{ height: h, background: track, borderRadius: h, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: fill,
          transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
      </div>);

  }

  function Eyebrow({ children, color = COLORS.navyMute, style }) {
    return <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '.18em',
      textTransform: 'uppercase', color, ...style }}>{children}</div>;
  }

  /* Interior screen — always contrasting navy header */
  function Screen({ title, eyebrow, onBack, dark, children }) {
    const T = getTheme(dark);
    return (
      <div style={{ position: 'absolute', inset: 0, background: T.pageBg, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: T.headerBg, flexShrink: 0, borderBottom: `1px solid ${T.headerBorder}` }}>
          <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 14px 22px',
            display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <button onClick={onBack} aria-label="Back" style={{
              width: 42, height: 42, borderRadius: 12, border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent', flexShrink: 0, marginBottom: 2 }}>
              <Icon name="back" size={24} stroke={T.headerText} sw={1.8} />
            </button>
            <div style={{ flex: 1 }}>
              {eyebrow && <Eyebrow color={T.faint} style={{ fontSize: 10, marginBottom: 5 }}>{eyebrow}</Eyebrow>}
              <div style={{ fontFamily: F.serif, fontSize: 30, fontWeight: 600, color: T.headerText,
                lineHeight: 1.05, letterSpacing: '-.01em', textWrap: 'pretty' }}>{title}</div>
            </div>
          </div>
        </div>
        <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {children}
          <div style={{ height: 'calc(env(safe-area-inset-bottom) + 32px)' }} />
        </div>
      </div>);

  }

  function TapRow({ children, onClick, style }) {
    return <button onClick={onClick} style={{ width: '100%', textAlign: 'left', border: 'none',
      cursor: 'pointer', padding: 0, font: 'inherit',
      WebkitTapHighlightColor: 'transparent', background: 'transparent', ...style }}>{children}</button>;
  }

  function daysUntil(dateStr) {
    const ms = new Date(dateStr + 'T00:00:00') - new Date();
    return Math.max(0, Math.ceil(ms / 86400000));
  }

  window.UI = { COLORS, F, getTheme, useLS, Icon, Ring, Bar, Eyebrow, Screen, TapRow, daysUntil };
})();