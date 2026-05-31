/* CFP Study — Checklist with filters */
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
    const [filterType, setFilterType] = useState(null);     /* null = all */
    const [filterPriority, setFilterPriority] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null); /* null = all, 'done' or 'todo' */

    const groups = window.DATA.checklist;
    const all = groups.flatMap(g => g.items);

    /* Apply filters */
    const filtered = all.filter(item => {
      if (filterType && item.type !== filterType) return false;
      if (filterPriority && item.priority !== filterPriority) return false;
      if (filterStatus === 'done' && !done[item.id]) return false;
      if (filterStatus === 'todo' && done[item.id]) return false;
      return true;
    });

    const doneCount = filtered.filter(i => done[i.id]).length;
    const pct = filtered.length ? Math.round((doneCount / filtered.length) * 100) : 0;

    const typeOptions = [
      { val: 'flashcards', label: 'Flashcards' },
      { val: 'references', label: 'References' },
      { val: 'calculations', label: 'Calculations' },
    ];
    const priorityOptions = [
      { val: 'high', label: 'High' },
      { val: 'medium', label: 'Medium' },
      { val: 'low', label: 'Low' },
    ];
    const statusOptions = [
      { val: 'todo', label: 'To Do' },
      { val: 'done', label: 'Done' },
    ];

    return (
      <Screen title="Checklist" eyebrow="Content to build" onBack={nav.back} dark={dark}>
        {/* overall progress */}
        <div style={{ padding: '20px 22px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
            <div style={{ fontFamily: F.serif, fontSize: 17, color: T.text }}>
              {doneCount} of {filtered.length} complete
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 13, color: T.faint }}>{pct}%</div>
          </div>
          <Bar pct={pct} track={T.barTrack} fill={T.barFill} h={5} />
        </div>

        {/* ── Filter section ── */}
        <div style={{ padding: '0 22px 20px', borderBottom: `1px solid ${T.hair}` }}>
          {/* Type filter */}
          <Eyebrow color={T.faint} style={{ marginBottom: 9 }}>Type</Eyebrow>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <FilterChip label="All" active={!filterType} onClick={() => setFilterType(null)} dark={dark} />
            {typeOptions.map(opt => (
              <FilterChip key={opt.val} label={opt.label} active={filterType === opt.val}
                onClick={() => setFilterType(filterType === opt.val ? null : opt.val)} dark={dark} />
            ))}
          </div>

          {/* Priority filter */}
          <Eyebrow color={T.faint} style={{ marginBottom: 9 }}>Priority</Eyebrow>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <FilterChip label="All" active={!filterPriority} onClick={() => setFilterPriority(null)} dark={dark} />
            {priorityOptions.map(opt => (
              <FilterChip key={opt.val} label={opt.label} active={filterPriority === opt.val}
                onClick={() => setFilterPriority(filterPriority === opt.val ? null : opt.val)} dark={dark} />
            ))}
          </div>

          {/* Status filter */}
          <Eyebrow color={T.faint} style={{ marginBottom: 9 }}>Status</Eyebrow>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <FilterChip label="All" active={!filterStatus} onClick={() => setFilterStatus(null)} dark={dark} />
            {statusOptions.map(opt => (
              <FilterChip key={opt.val} label={opt.label} active={filterStatus === opt.val}
                onClick={() => setFilterStatus(filterStatus === opt.val ? null : opt.val)} dark={dark} />
            ))}
          </div>
        </div>

        {/* ── Filtered items ── */}
        {filtered.length === 0 ? (
          <div style={{ padding: '40px 22px', textAlign: 'center' }}>
            <div style={{ fontFamily: F.sans, fontSize: 15, color: T.faint }}>
              No items match your filters.
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px 22px 0' }}>
            <div style={{ background: T.listCard, borderRadius: 16, overflow: 'hidden', border: T.listBorder }}>
              {filtered.map((item, idx) => {
                const on = !!done[item.id];
                const priorityColor = item.priority === 'high' ? (dark ? '#FF6B6B' : '#E63946')
                  : item.priority === 'medium' ? (dark ? '#FFD93D' : '#F77F00')
                  : (dark ? '#6BCB77' : '#2A9D8F');
                return (
                  <TapRow key={item.id} onClick={() => toggle(item.id)} style={{ display: 'block' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px',
                      borderTop: idx ? `1px solid ${T.hair}` : 'none' }}>
                      <Checkbox on={on} dark={dark} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: F.sans, fontSize: 14.5, color: on ? T.faint : T.text,
                          textDecoration: on ? 'line-through' : 'none',
                          textDecorationColor: T.faint, marginBottom: 4 }}>{item.label}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '.04em',
                            textTransform: 'uppercase', color: priorityColor, fontWeight: 700 }}>
                            {item.priority}
                          </span>
                          <span style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '.04em',
                            textTransform: 'uppercase', color: T.faint }}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TapRow>
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
