/* CFP Study — References (visual decision tree + comparison tables) */
(function () {
  const { COLORS, F, getTheme, Icon, Eyebrow, Screen, TapRow } = window.UI;

  /* ── Reference list ── */
  function References({ nav, dark }) {
    const T = getTheme(dark);
    return (
      <Screen title="References" eyebrow="Decision trees & tables" onBack={nav.back} dark={dark}>
        <div style={{ padding: '18px 22px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {window.DATA.references.map((r) => {
            const empty = r.kind === 'table' && (!r.rows || !r.rows.length) || r.kind === 'tree' && !r.tree;
            return (
              <TapRow key={r.id} onClick={() => !empty && nav.go('reference', { id: r.id })}
              style={{ background: T.listCard, borderRadius: 16, padding: '16px 17px',
                border: T.listBorder, opacity: empty ? .6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: dark ? COLORS.creamHair : COLORS.navyFaintLt,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={r.kind === 'tree' ? 'refs' : 'checklist'} size={18} stroke={dark ? COLORS.cream : COLORS.navy} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: F.serif, fontSize: 19, fontWeight: 600, color: T.text, lineHeight: 1.1 }}>{r.title}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 12.5, color: T.muted, marginTop: 3 }}>{r.blurb}</div>
                  </div>
                  {!empty && <Icon name="chevron" size={16} stroke={T.muted} sw={2} />}
                </div>
              </TapRow>);

          })}
        </div>
      </Screen>);

  }

  /* ── Detail: dispatch to table or tree ── */
  function Reference({ nav, dark, params }) {
    const r = window.DATA.references.find((x) => x.id === params.id);
    return (
      <Screen title={r.title} eyebrow={r.kind === 'tree' ? 'Decision tree' : 'Comparison table'} onBack={nav.back} dark={dark}>
        {r.kind === 'table' ? <FullTable r={r} dark={dark} /> : <Flowchart r={r} dark={dark} />}
      </Screen>);

  }

  /* ── Comparison table (with clear banding in both modes) ── */
  function FullTable({ r, dark }) {
    const T = getTheme(dark);
    return (
      <div style={{ padding: '20px 18px 0' }}>
        <p style={{ fontFamily: F.sans, fontSize: 14, color: T.muted, margin: '0 4px 18px', lineHeight: 1.5 }}>{r.blurb}</p>
        <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${T.tableHair}` }}>
          {/* header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: COLORS.navy }}>
            <TableCell head />
            {r.columns.map((c, i) => <TableCell key={i} head bold>{c}</TableCell>)}
          </div>
          {r.rows.map((row, ri) =>
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            background: ri % 2 ? T.tableBandB : T.tableBandA,
            borderTop: `1px solid ${T.tableHair}` }}>
              {row.map((cell, ci) => <TableCell key={ci} dark={dark} label={ci === 0}>{cell}</TableCell>)}
            </div>
          )}
        </div>
      </div>);

  }

  function TableCell({ children, head, bold, label, dark }) {
    const color = head ? COLORS.cream :
    label ? dark ? COLORS.creamMute : COLORS.navyMute :
    dark ? COLORS.cream : COLORS.navy;
    return (
      <div style={{ padding: '11px 12px', fontFamily: bold || label ? F.mono : F.sans,
        fontSize: bold ? 11 : label ? 10.5 : 13, fontWeight: bold ? 600 : label ? 500 : 400,
        letterSpacing: bold || label ? '.02em' : 0, color, lineHeight: 1.4,
        textTransform: label ? 'uppercase' : 'none' }}>{children}</div>);

  }

  /* ── Visual flowchart decision tree ── */
  function Flowchart({ r, dark }) {
    const T = getTheme(dark);
    /* ── palette ── */
    const lineCol = dark ? 'rgba(237,230,214,.4)' : 'rgba(28,43,74,.3)';
    const qBg = dark ? COLORS.navy2 : COLORS.softNavy; /* question = lighter navy */
    const qText = COLORS.cream;
    const outBg = dark ? COLORS.cream : COLORS.navy; /* outcome  = strong/result */
    const outText = dark ? COLORS.navy : COLORS.cream;
    const pillBg = dark ? COLORS.navy : COLORS.paper; /* matches page bg, masks line */
    const pillText = dark ? COLORS.cream : COLORS.navy;

    /* ── geometry (SVG units; scales to fit via viewBox) ── */
    const VW = 340,QX = 8,QW = 174,QCX = QX + QW / 2;
    const OX = 214,OW = 118;
    const nodes = r.tree.nodes;

    function wrap(text, max) {
      const words = String(text).split(' ');
      const lines = [];let cur = '';
      for (const w of words) {
        const t = cur ? cur + ' ' + w : w;
        if (t.length > max && cur) {lines.push(cur);cur = w;} else cur = t;
      }
      if (cur) lines.push(cur);
      return lines;
    }
    const boxH = (lines, fs, padY) => padY * 2 + lines.length * fs * 1.32;

    /* build SVG element list */
    const els = [];let k = 0;
    const rect = (x, y, w, h, fill) =>
      els.push(<rect key={k++} x={x} y={y} width={w} height={h} rx={11} fill={fill} />);
    const line = (x1, y1, x2, y2) =>
    els.push(<line key={k++} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lineCol} strokeWidth={2} />);
    const txt = (cx, top, lines, fs, ff, fw, color, padY) => {
      const base = top + padY + fs * 0.95;
      els.push(
        <text key={k++} textAnchor="middle"
        style={{ fontFamily: ff, fontSize: fs, fontWeight: fw, fill: color }}>
          {lines.map((ln, i) => <tspan key={i} x={cx} y={base + i * fs * 1.32} style={{ fontFamily: "Spectral" }}>{ln}</tspan>)}
        </text>
      );
    };
    const pill = (cx, cy, label) => {
      const w = label.length * 6 + 14,h = 16;
      rect(cx - w / 2, cy - h / 2, w, h, pillBg);
      els.push(
        <text key={k++} x={cx} y={cy + 3.6} textAnchor="middle"
        style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 700, fill: pillText, letterSpacing: '.06em' }}>
          {label}
        </text>
      );
    };

    /* ── layout walk: vertical spine, exits branch right ── */
    let y = 6,nodeId = r.tree.start,guard = 0;
    while (nodeId && guard++ < 24) {
      const node = nodes[nodeId];
      if (!node || node.outcome) break;

      const qLines = wrap(node.shortLabel || node.q, 26);
      const qh = boxH(qLines, 12.5, 11);
      const qTop = y,qMid = qTop + qh / 2,qBot = qTop + qh;
      rect(QX, qTop, QW, qh, qBg);
      txt(QCX, qTop, qLines, 12.5, F.sans, 600, qText, 11);

      const yesNode = nodes[node.yes],noNode = nodes[node.no];
      const yesQ = yesNode && !yesNode.outcome;
      const noQ = noNode && !noNode.outcome;

      if (yesQ !== noQ) {
        /* one branch continues (question), one exits (outcome) → off-ramp right */
        const contId = yesQ ? node.yes : node.no;
        const contLabel = yesQ ? 'YES' : 'NO';
        const exitNode = yesQ ? noNode : yesNode;
        const exitLabel = yesQ ? 'NO' : 'YES';

        const oLines = wrap(exitNode.shortLabel, 15);
        const oh = boxH(oLines, 12, 10);
        const oTop = qMid - oh / 2;
        line(QX + QW, qMid, OX, qMid);
        pill((QX + QW + OX) / 2, qMid, exitLabel);
        rect(OX, oTop, OW, oh, outBg);
        txt(OX + OW / 2, oTop, oLines, 12, F.serif, 600, outText, 10);

        const branchY = Math.max(qBot, oTop + oh) + 28;
        line(QCX, qBot, QCX, branchY);
        pill(QCX, (qBot + branchY) / 2, contLabel);
        y = branchY;nodeId = contId;
        continue;
      }

      if (!yesQ && !noQ) {
        /* terminal: both children are outcomes → NO right, YES straight down */
        const noLines = wrap(noNode.shortLabel, 15);
        const noh = boxH(noLines, 12, 10);
        const noTop = qMid - noh / 2;
        line(QX + QW, qMid, OX, qMid);
        pill((QX + QW + OX) / 2, qMid, 'NO');
        rect(OX, noTop, OW, noh, outBg);
        txt(OX + OW / 2, noTop, noLines, 12, F.serif, 600, outText, 10);

        const yLines = wrap(yesNode.shortLabel, 26);
        const yh = boxH(yLines, 13.5, 12);
        const branchY = Math.max(qBot, noTop + noh) + 28;
        line(QCX, qBot, QCX, branchY);
        pill(QCX, (qBot + branchY) / 2, 'YES');
        rect(QX, branchY, QW, yh, outBg);
        txt(QCX, branchY, yLines, 13.5, F.serif, 600, outText, 12);
        y = branchY + yh;
        break;
      }
      break; /* both questions — not used by current data */
    }
    const totalH = y + 8;

    /* outcome detail cards below the diagram */
    const outcomes = Object.entries(nodes).filter(([, n]) => n.outcome);

    return (
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontFamily: F.sans, fontSize: 14, color: T.muted, margin: '0 0 22px', lineHeight: 1.5 }}>
          {r.blurb}
        </p>

        {/* ── flowchart diagram (SVG, always scales to fit) ── */}
        <svg viewBox={`0 0 ${VW} ${totalH}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
          {els}
        </svg>

        {/* ── full recommendations ── */}
        <div style={{ marginTop: 30 }}>
          <Eyebrow color={T.faint} style={{ marginBottom: 14 }}>Recommendations in full</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {outcomes.map(([id, n]) =>
            <div key={id} style={{ background: T.listCard, border: T.listBorder,
              borderRadius: 14, padding: '15px 16px' }}>
                <div style={{ fontFamily: F.serif, fontSize: 15, fontWeight: 600,
                color: T.text, marginBottom: 7 }}>{n.shortLabel}</div>
                <div style={{ fontFamily: F.sans, fontSize: 14, color: T.muted,
                lineHeight: 1.55, textWrap: 'pretty' }}>{n.outcome}</div>
              </div>
            )}
          </div>
        </div>
      </div>);

  }

  window.SCREENS = window.SCREENS || {};
  window.SCREENS.References = References;
  window.SCREENS.Reference = Reference;
})();