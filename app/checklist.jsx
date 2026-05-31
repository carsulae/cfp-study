/* CFP Study — Checklist */
(function () {
  const { COLORS, F, getTheme, Icon, Bar, Eyebrow, Screen, TapRow } = window.UI;

  function Checkbox({ on, dark }) {
    const border = dark ? COLORS.creamHair : 'rgba(28,43,74,.2)';
    const bg     = on ? (dark ? COLORS.cream : COLORS.navy) : 'transparent';
    const icon   = dark ? COLORS.navy : COLORS.cream;
    return (
      <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0,
        border: on ? 'none' : `1.6px solid ${border}`, background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background .15s' }}>
        {on && <Icon name="check" size={15} stroke={icon} sw={2.4} />}
      </div>
    );
  }

  function Checklist({ nav, dark, done, toggle }) {
    const T = getTheme(dark);
    const groups = window.DATA.checklist;
    const all = groups.flatMap(g => g.items);
    const doneCount = all.filter(i => done[i.id]).length;
    const pct = Math.round((doneCount / all.length) * 100);

    return (
      <Screen title="Checklist" eyebrow="Content to build" onBack={nav.back} dark={dark}>
        {/* overall progress */}
        <div style={{ padding: '20px 22px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
            <div style={{ fontFamily: F.serif, fontSize: 17, color: T.text }}>
              {doneCount} of {all.length} complete
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 13, color: T.faint }}>{pct}%</div>
          </div>
          <Bar pct={pct} track={T.barTrack} fill={T.barFill} h={5} />
        </div>

        {groups.map(g => {
          const gDone = g.items.filter(i => done[i.id]).length;
          return (
            <div key={g.id} style={{ padding: '20px 22px 0', borderTop: `1px solid ${T.hair}`, paddingTop: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Eyebrow color={T.faint}>{g.title}</Eyebrow>
                <span style={{ fontFamily: F.mono, fontSize: 10.5, color: T.faint }}>{gDone}/{g.items.length}</span>
              </div>
              <div style={{ background: T.listCard, borderRadius: 16, overflow: 'hidden', border: T.listBorder }}>
                {g.items.map((it, idx) => {
                  const on = !!done[it.id];
                  return (
                    <TapRow key={it.id} onClick={() => toggle(it.id)} style={{ display: 'block' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px',
                        borderTop: idx ? `1px solid ${T.hair}` : 'none' }}>
                        <Checkbox on={on} dark={dark} />
                        <span style={{ flex: 1, fontFamily: F.sans, fontSize: 14.5,
                          color: on ? T.faint : T.text,
                          textDecoration: on ? 'line-through' : 'none',
                          textDecorationColor: T.faint }}>{it.label}</span>
                      </div>
                    </TapRow>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Screen>
    );
  }

  window.SCREENS = window.SCREENS || {};
  window.SCREENS.Checklist = Checklist;
})();
