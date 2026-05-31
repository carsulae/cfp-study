/* CFP Study — Calculations (all steps on one page) */
(function () {
  const { COLORS, F, getTheme, Icon, Eyebrow, Screen, TapRow } = window.UI;

  /* ── List ── */
  function Calculations({ nav, dark }) {
    const T = getTheme(dark);
    return (
      <Screen title="Calculations" eyebrow="Step-by-step guides" onBack={nav.back} dark={dark}>
        <div style={{ padding: '18px 22px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {window.DATA.calcs.map(c => {
            const empty = !c.steps || !c.steps.length;
            return (
              <TapRow key={c.id} onClick={() => !empty && nav.go('calcguide', { id: c.id })}
                style={{ background: T.listCard, borderRadius: 16, padding: '16px 17px',
                  border: T.listBorder, opacity: empty ? .6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: dark ? COLORS.creamHair : COLORS.navyFaintLt,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="calc" size={18} stroke={dark ? COLORS.cream : COLORS.navy} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: F.serif, fontSize: 19, fontWeight: 600, color: T.text, lineHeight: 1.1 }}>{c.title}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 12.5, color: T.muted, marginTop: 3 }}>
                      {empty ? 'Placeholder — add content' : `${c.steps.length} steps · ${c.blurb}`}
                    </div>
                  </div>
                  {!empty && <Icon name="chevron" size={16} stroke={T.muted} sw={2} />}
                </div>
              </TapRow>
            );
          })}
        </div>
      </Screen>
    );
  }

  /* ── Full guide: all steps on one scrollable page ── */
  function CalcGuide({ nav, dark, params }) {
    const c = window.DATA.calcs.find(x => x.id === params.id);
    const T = getTheme(dark);
    const numBg   = dark ? COLORS.cream : COLORS.navy;
    const numText = dark ? COLORS.navy  : COLORS.cream;
    return (
      <Screen title={c.title} eyebrow={`${c.steps.length} steps`} onBack={nav.back} dark={dark}>
        <div style={{ padding: '22px 22px 0' }}>
          {/* formula chip */}
          {c.formula && (
            <div style={{ background: COLORS.navy, borderRadius: 16, padding: '18px 20px',
              textAlign: 'center', marginBottom: 28 }}>
              <Eyebrow color={COLORS.creamFaint} style={{ marginBottom: 10 }}>Formula</Eyebrow>
              <div style={{ fontFamily: F.serif, fontSize: 26, color: COLORS.cream,
                fontWeight: 500, letterSpacing: '.01em' }}>{c.formula}</div>
            </div>
          )}
          {/* all steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {c.steps.map((s, idx) => (
              <div key={idx}>
                {idx > 0 && (
                  <div style={{ width: 2, height: 20, background: T.hair,
                    margin: '-10px auto 10px', borderRadius: 2 }} />
                )}
                <div style={{ background: T.listCard, borderRadius: 16,
                  border: T.listBorder, padding: '18px 18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: numBg, color: numText,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: F.mono, fontSize: 14, fontWeight: 600 }}>{idx + 1}</div>
                    <div style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 600, color: T.text,
                      lineHeight: 1.15, paddingTop: 4, textWrap: 'pretty' }}>{s.t}</div>
                  </div>
                  <p style={{ fontFamily: F.sans, fontSize: 15.5, color: T.muted,
                    lineHeight: 1.65, margin: '0 0 0 47px', textWrap: 'pretty' }}>{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Screen>
    );
  }

  window.SCREENS = window.SCREENS || {};
  window.SCREENS.Calculations = Calculations;
  window.SCREENS.CalcGuide = CalcGuide;
})();
