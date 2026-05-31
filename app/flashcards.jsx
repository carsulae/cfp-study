/* CFP Study — Flashcards (deck list + study session) */
(function () {
  const { useState } = React;
  const { COLORS, F, getTheme, Icon, Bar, Eyebrow, Screen, TapRow } = window.UI;

  /* ── Deck list ── */
  function Flashcards({ nav, dark, mastery }) {
    const T = getTheme(dark);
    return (
      <Screen title="Flashcards" eyebrow="Spaced-repetition review" onBack={nav.back} dark={dark}>
        <div style={{ padding: '18px 22px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {window.DATA.decks.map((d) => {
            const got = d.cards.reduce((n, _, i) => n + (mastery[`${d.id}:${i}`] === 'got' ? 1 : 0), 0);
            const empty = d.cards.length === 0;
            const pct = empty ? 0 : Math.round(got / d.cards.length * 100);
            return (
              <TapRow key={d.id} onClick={() => !empty && nav.go('deck', { id: d.id })}
              style={{ background: T.listCard, borderRadius: 16, padding: '16px 17px',
                border: T.listBorder, opacity: empty ? .62 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: F.serif, fontSize: 20, fontWeight: 600, color: T.text }}>{d.title}</div>
                  {!empty && <Icon name="chevron" size={16} stroke={T.faint} sw={2} />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 10.5, color: T.muted, letterSpacing: '.02em' }}>
                    {empty ? 'No cards yet — add content' : `${d.cards.length} ready · ${got} mastered`}
                  </span>
                  {!empty && <span style={{ fontFamily: F.mono, fontSize: 10.5, color: T.faint }}>{pct}%</span>}
                </div>
                {!empty && <div style={{ marginTop: 9 }}>
                  <Bar pct={pct} track={T.barTrack} fill={T.barFill} />
                </div>}
              </TapRow>);

          })}
        </div>
      </Screen>);

  }

  /* ── Study session ── */
  function Deck({ nav, dark, params, mastery, setMastery }) {
    const T = getTheme(dark);
    const deck = window.DATA.decks.find((d) => d.id === params.id);
    const [i, setI] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const total = deck.cards.length;

    function answer(kind) {
      setMastery((m) => ({ ...m, [`${deck.id}:${i}`]: kind }));
      setFlipped(false);
      setTimeout(() => setI((x) => x + 1), 120);
    }
    function restart() {setI(0);setFlipped(false);}

    /* completion screen */
    if (i >= total) {
      const got = deck.cards.reduce((n, _, idx) => n + (mastery[`${deck.id}:${idx}`] === 'got' ? 1 : 0), 0);
      return (
        <Screen title={deck.title} eyebrow="Session complete" onBack={nav.back} dark={dark}>
          <div style={{ padding: '60px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: F.serif, fontSize: 64, fontWeight: 400, color: T.text, lineHeight: 1 }}>
              {got}<span style={{ color: T.faint, fontSize: 34 }}>/{total}</span>
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 15, color: T.muted, marginTop: 12, marginBottom: 34 }}>
              cards marked "Got it" this round.
            </div>
            <button onClick={restart} style={btn(dark, true)}>Study again</button>
            <button onClick={nav.back} style={{ ...btn(dark, false), marginTop: 12 }}>Back to decks</button>
          </div>
        </Screen>);

    }

    const card = deck.cards[i];
    return (
      <Screen title={deck.title} eyebrow={`Card ${i + 1} of ${total}`} onBack={nav.back} dark={dark}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100% - 1px)', padding: '14px 22px 0' }}>
          <Bar pct={i / total * 100} track={T.barTrack} fill={T.barFill} />

          {/* card — single bg per theme, both faces match */}
          <div onClick={() => setFlipped((f) => !f)}
          style={{ flex: 1, position: 'relative', margin: '22px 0', cursor: 'pointer', perspective: 1400,
            minHeight: 360, WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ position: 'absolute', inset: 0,
              transition: 'transform .5s cubic-bezier(.4,0,.2,1)',
              transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg) translateZ(0)' : 'rotateY(0deg) translateZ(0)' }}>
              <Face side="front" dark={dark} label="Question" body={card.f} visible={!flipped} />
              <Face side="back" dark={dark} label="Answer" body={card.b} visible={flipped} />
            </div>
          </div>

          <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
            color: T.faint, textAlign: 'center', marginBottom: 14, whiteSpace: 'nowrap',
            display: 'flex', gap: 7, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="flip" size={13} stroke={T.faint} sw={1.8} /> tap card to flip
          </div>

          <div style={{ display: 'flex', gap: 12, paddingBottom: 'calc(env(safe-area-inset-bottom) + 22px)' }}>
            <button onClick={() => answer('review')} style={btn(dark, false)}>Review again</button>
            <button onClick={() => answer('got')} style={btn(dark, true)}>Got it</button>
          </div>
        </div>
      </Screen>);

  }

  /* Single-color card face — same bg for question & answer, differ only by label + typography */
  function Face({ side, dark, label, body, visible }) {
    const isBack = side === 'back';
    /* ONE bg color per theme; both faces identical background */
    const bg = dark ? COLORS.cream : COLORS.softNavy;
    const text = dark ? COLORS.navy : COLORS.cream;
    const lab = dark ? COLORS.navyMute : COLORS.creamFaint;
    const shadow = dark ? '0 10px 30px rgba(0,0,0,.14)' : '0 8px 28px rgba(61,91,133,.22)';
    return (
      <div style={{ ...{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: isBack ? 'rotateY(180deg)' : 'none',
          opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity .12s linear', transitionDelay: visible ? '.22s' : '0s',
          background: bg, borderRadius: 22, padding: '30px 26px', boxShadow: shadow,
          display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: 10.5, letterSpacing: '.18em',
          textTransform: 'uppercase', color: lab, marginBottom: 18 }}>{label}</div>
        <div style={{ fontFamily: isBack ? F.sans : F.serif,
          fontSize: isBack ? 17 : 25, fontWeight: isBack ? 400 : 500,
          color: text, lineHeight: isBack ? 1.55 : 1.2, textWrap: 'pretty' }}>{body}</div>
      </div>);

  }

  function btn(dark, primary) {
    const base = { flex: 1, height: 52, borderRadius: 13, fontFamily: F.sans,
      fontSize: 15, fontWeight: 600, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' };
    if (primary) return { ...base, border: 'none',
      background: dark ? COLORS.cream : COLORS.navy, color: dark ? COLORS.navy : COLORS.cream };
    return { ...base, background: 'transparent',
      border: `1.5px solid ${dark ? COLORS.creamHair : 'rgba(28,43,74,.18)'}`,
      color: dark ? COLORS.cream : COLORS.navy };
  }

  window.SCREENS = window.SCREENS || {};
  window.SCREENS.Flashcards = Flashcards;
  window.SCREENS.Deck = Deck;
})();