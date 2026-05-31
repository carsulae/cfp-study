/* CFP Study — Checklist */
(function () {
  const { useState } = React;
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

  function FilterChip({ label, active, onClick, dark }) {
    const T = getTheme(dark);
    return (
      <button onClick={onClick} style={{
        padding: '8px 14px', borderRadius: 10, fontFamily: F.mono, fontSize: 10.5,
        letterSpacing: '.05em', textTransform: 'uppercase', fontWeight: 600,
        border: `1.5px solid ${active ? T.barFill : T.hair}`,
        background: active ? T.barFill : 'transparent',
        color: active ? (dark ? COLORS.navy : COLORS.cream) : T.text,
        cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        transition: 'all .2s' }}>
        {label}
      </button>
    );
  }

  function Checklist({ nav, dark, done, toggle }) {
    const T = getTheme(dark);
    const [filterBucket, setFilterBucket]   = useState(null);
    const [filterPriority, setFilterPriority] = useState(null);
    const [filterStatus, setFilterStatus]   = useState(null);
    const [filterDomain, setFilterDomain]   = useState(null);
    const [expanded, setExpanded]           = useState({});

    const groups = window.DATA.checklist;
    const all    = groups.flatMap(g => g.items.map(i => ({ ...i, domain: g.title, domainId: g.id })));

    const filtered = all.filter(item => {
      if (filterBucket   && item.bucket.toLowerCase()   !== filterBucket)   return false;
      if (filterPriority && item.priority               !== filterPriority) return false;
      if (filterStatus   === 'done' && !done[item.id])  return false;
      if (filterStatus   === 'todo' && done[item.id])   return false;
      if (filterDomain   && item.domainId               !== filterDomain)   return false;
      return true;
    });

    const doneCount = filtered.filter(i => done[i.id]).length;
    const pct = filtered.length ? Math.round((doneCount / filtered.length) * 100) : 0;

    const bucketOptions   = ['Flashcard', 'Calculation', 'Reference', 'Combo'];
    const priorityOptions = [{ val: 'high', label: 'High' }, { val: 'medium', label: 'Med' }, { val: 'low', label: 'Low' }];
    const statusOptions   = [{ val: 'todo', label: 'To Do' }, { val: 'done', label: 'Done' }];
    const domainOptions   = groups.map(g => ({ val: g.id, label: g.title.split(' ').slice(-1)[0] }));

    const bucketColor = {
      Flashcard:   dark ? '#7BB8F5' : '#1A4F8A',
      Calculation: dark ? '#6DC98A' : '#1A5C2E',
      Reference:   dark ? '#F0A94A' : '#7A4A0A',
      Combo:       dark ? '#B49EEA' : '#4A2E8A',
    };

    const toggleNote = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

    return (
      <Screen title="Checklist" eyebrow="All 166 topics" onBack={nav.back} dark={dark}>

        {/* progress */}
        <div style={{ padding: '20px 22px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
            <div style={{ fontFamily: F.serif, fontSize: 17, color: T.text }}>
              {doneCount} of {filtered.length} complete
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 13, color: T.faint }}>{pct}%</div>
          </div>
          <Bar pct={pct} track={T.barTrack} fill={T.barFill} h={5} />
        </div>

        {/* filters */}
        <div style={{ padding: '0 22px 20px', borderBottom: `1px solid ${T.hair}` }}>
          <Eyebrow color={T.faint} style={{ marginBottom: 9 }}>Bucket</Eyebrow>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <FilterChip label="All" active={!filterBucket} onClick={() => setFilterBucket(null)} dark={dark} />
            {bucketOptions.map(b => (
              <FilterChip key={b} label={b} active={filterBucket === b.toLowerCase()}
                onClick={() => setFilterBucket(filterBucket === b.toLowerCase() ? null : b.toLowerCase())} dark={dark} />
            ))}
          </div>

          <Eyebrow color={T.faint} style={{ marginBottom: 9 }}>Priority</Eyebrow>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <FilterChip label="All" active={!filterPriority} onClick={() => setFilterPriority(null)} dark={dark} />
            {priorityOptions.map(opt => (
              <FilterChip key={opt.val} label={opt.label} active={filterPriority === opt.val}
                onClick={() => setFilterPriority(filterPriority === opt.val ? null : opt.val)} dark={dark} />
            ))}
          </div>

          <Eyebrow color={T.faint} style={{ marginBottom: 9 }}>Domain</Eyebrow>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <FilterChip label="All" active={!filterDomain} onClick={() => setFilterDomain(null)} dark={dark} />
            {domainOptions.map(opt => (
              <FilterChip key={opt.val} label={opt.label} active={filterDomain === opt.val}
                onClick={() => setFilterDomain(filterDomain === opt.val ? null : opt.val)} dark={dark} />
            ))}
          </div>

          <Eyebrow color={T.faint} style={{ marginBottom: 9 }}>Status</Eyebrow>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <FilterChip label="All" active={!filterStatus} onClick={() => setFilterStatus(null)} dark={dark} />
            {statusOptions.map(opt => (
              <FilterChip key={opt.val} label={opt.label} active={filterStatus === opt.val}
                onClick={() => setFilterStatus(filterStatus === opt.val ? null : opt.val)} dark={dark} />
            ))}
          </div>
        </div>

        {/* items */}
        {filtered.length === 0 ? (
          <div style={{ padding: '40px 22px', textAlign: 'center' }}>
            <div style={{ fontFamily: F.sans, fontSize: 15, color: T.faint }}>No items match your filters.</div>
          </div>
        ) : (
          <div style={{ padding: '20px 22px 0' }}>
            <div style={{ background: T.listCard, borderRadius: 16, overflow: 'hidden', border: T.listBorder }}>
              {filtered.map((item, idx) => {
                const on = !!done[item.id];
                const isExp = !!expanded[item.id];
                const bColor = bucketColor[item.bucket] || T.faint;
                const pColor = item.priority === 'high'
                  ? (dark ? '#FF6B6B' : '#C0392B')
                  : item.priority === 'medium'
                  ? (dark ? '#FFD93D' : '#D4800A')
                  : (dark ? '#6BCB77' : '#27AE60');

                return (
                  <div key={item.id} style={{ borderTop: idx ? `1px solid ${T.hair}` : 'none' }}>
                    <TapRow onClick={() => toggle(item.id)} style={{ display: 'block' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: '13px 15px' }}>
                        <div style={{ paddingTop: 1 }}>
                          <Checkbox on={on} dark={dark} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: F.sans, fontSize: 14, lineHeight: 1.4,
                            color: on ? T.faint : T.text,
                            textDecoration: on ? 'line-through' : 'none',
                            textDecorationColor: T.faint, marginBottom: 5 }}>
                            {item.label}
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '.04em',
                              textTransform: 'uppercase', color: bColor, fontWeight: 700 }}>
                              {item.bucket}
                            </span>
                            <span style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '.04em',
                              textTransform: 'uppercase', color: pColor, fontWeight: 700 }}>
                              {item.priority}
                            </span>
                            <span style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '.04em',
                              textTransform: 'uppercase', color: T.faint }}>
                              {item.domain.split(' ').slice(-2).join(' ')}
                            </span>
                          </div>
                        </div>
                        {item.note ? (
                          <button onClick={(e) => { e.stopPropagation(); toggleNote(item.id); }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer',
                              fontFamily: F.mono, fontSize: 16, color: T.faint, padding: '0 2px',
                              flexShrink: 0, WebkitTapHighlightColor: 'transparent', marginTop: 1 }}>
                            {isExp ? '−' : '+'}
                          </button>
                        ) : null}
                      </div>
                    </TapRow>
                    {item.note && isExp && (
                      <div style={{ padding: '2px 15px 13px 52px', fontFamily: F.sans, fontSize: 13,
                        lineHeight: 1.55, color: T.muted, background: T.pageBg }}>
                        {item.note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Screen>
    );
  }

  window.SCREENS = window.SCREENS || {};
  window.SCREENS.Checklist = Checklist;
})();
