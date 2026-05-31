/* CFP Study — Home */
(function () {
  const { COLORS, F, Icon, Ring, Bar, Eyebrow, TapRow, daysUntil } = window.UI;

  function ThemeToggle({ dark, onToggle }) {
    return (
      <TapRow onClick={onToggle} style={{ width: 38, height: 38, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', flexShrink: 0 }}>
        <Icon name={dark ? 'sun' : 'moon'} size={20}
          stroke={dark ? COLORS.creamMute : COLORS.navyMute} sw={1.6} />
      </TapRow>
    );
  }

  function HomeCard({ icon, title, foot, pct, dark, onClick }) {
    const cardBg   = dark ? COLORS.softNavy      : COLORS.cream;
    const titleCol = dark ? COLORS.cream         : COLORS.navy;
    const metaCol  = dark ? COLORS.creamFaint    : 'rgba(28,43,74,.5)';
    const iconBg   = dark ? 'rgba(237,230,214,.14)' : 'rgba(28,43,74,.08)';
    const barFill  = dark ? COLORS.cream         : COLORS.navy;
    const barTrack = dark ? 'rgba(237,230,214,.22)' : 'rgba(28,43,74,.12)';
    const containerStyle = {
      background: cardBg,
      borderRadius: 18,
      padding: '15px 15px 16px',
      minHeight: 132,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent'
    };
    return (
      <button onClick={onClick} style={containerStyle}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={20} stroke={dark ? COLORS.cream : COLORS.navy} />
        </div>
        <div style={{ fontFamily: F.serif, fontSize: 21, color: titleCol, fontWeight: 600,
          marginTop: 'auto', paddingTop: 14, lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: metaCol, marginTop: 5 }}>{foot}</div>
        {pct != null && <div style={{ marginTop: 9 }}><Bar pct={pct} fill={barFill} track={barTrack} /></div>}
      </button>
    );
  }

  function Home({ nav, stats, onToggle, dark }) {
    const days = daysUntil(window.DATA.exam.date);
    const ringTrack = dark ? COLORS.creamHair  : COLORS.navyHair;
    const ringBar   = dark ? COLORS.cream      : COLORS.navy;
    const ringColor = dark ? COLORS.cream      : COLORS.navy;
    const heroText  = dark ? COLORS.cream      : COLORS.navy;
    const heroMuted = dark ? COLORS.creamMute  : COLORS.navyMute;
    const eyeColor  = dark ? COLORS.creamFaint : COLORS.navyFaint;
    const pageBg    = dark ? COLORS.navy       : COLORS.paper;

    const cards = [
      { key: 'checklist',    icon: 'checklist', title: 'Checklist',    foot: `${stats.cl.done} / ${stats.cl.total} tasks`,         pct: stats.cl.pct },
      { key: 'flashcards',   icon: 'cards',     title: 'Flashcards',   foot: `${stats.cards.mastered} / ${stats.cards.total} mastered`, pct: stats.cards.pct },
      { key: 'references',   icon: 'refs',      title: 'References',   foot: `${stats.refs.built} / ${stats.refs.total} sets`,     pct: stats.refs.pct },
      { key: 'calculations', icon: 'calc',      title: 'Calculations', foot: `${stats.calc.built} / ${stats.calc.total} guides`,   pct: stats.calc.pct },
    ];

    return (
      <div style={{ position: 'absolute', inset: 0, background: pageBg, display: 'flex', flexDirection: 'column',
        overflowY: 'auto', WebkitOverflowScrolling: 'touch' }} className="screen-scroll">

        {/* ── hero ── */}
        <div style={{ padding: 'calc(env(safe-area-inset-top) + 28px) 26px 28px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Eyebrow color={eyeColor}>CFP Candidate · Nov 2026</Eyebrow>
            <ThemeToggle dark={dark} onToggle={onToggle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 24 }}>
            <div>
              <div style={{ fontFamily: F.serif, fontSize: 82, lineHeight: .82,
                color: heroText, fontWeight: 400 }}>{days}</div>
              <div style={{ fontFamily: F.sans, fontSize: 13, color: heroMuted, marginTop: 10 }}>
                days until your exam
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Ring pct={stats.overall} size={78} track={ringTrack} bar={ringBar} color={ringColor} />
              <Eyebrow color={eyeColor} style={{ fontSize: 8.5, marginTop: 8 }}>Readiness</Eyebrow>
            </div>
          </div>
        </div>

        {/* ── study areas ── */}
        <div style={{ padding: '0 22px', flexShrink: 0 }}>
          <Eyebrow color={eyeColor} style={{ marginBottom: 14 }}>Study Areas</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
            {cards.map(c => <HomeCard key={c.key} {...c} dark={dark} onClick={() => nav.go(c.key)} />)}
          </div>
        </div>

        <div style={{ height: 'calc(env(safe-area-inset-bottom) + 28px)', flexShrink: 0 }} />
      </div>
    );
  }

  window.SCREENS = window.SCREENS || {};
  window.SCREENS.Home = Home;
})();
