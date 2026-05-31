/* CFP Study — app shell: router + shared state */
(function () {
  const { useState, useMemo } = React;
  const { useLS } = window.UI;
  const S = window.SCREENS;

  const MAP = {
    home: S.Home, checklist: S.Checklist,
    flashcards: S.Flashcards, deck: S.Deck,
    references: S.References, reference: S.Reference,
    calculations: S.Calculations, calcguide: S.CalcGuide,
  };

  function defaultDone() {
    const m = {};
    window.DATA.checklist.forEach(g => g.items.forEach(i => { if (i.done) m[i.id] = true; }));
    return m;
  }

  function App() {
    const [stack, setStack] = useState([{ name: 'home', params: {} }]);
    const [appearance, setAppearance] = useLS('cfp.appearance', 'paper');
    const [done, setDone] = useLS('cfp.checklist', defaultDone());
    const [mastery, setMastery] = useLS('cfp.mastery', {});

    // dark is true ONLY when appearance is exactly 'navy'; anything else (including initial state) = light mode
    const dark = appearance === 'navy';
    const toggleAppearance = () => setAppearance(a => a === 'navy' ? 'paper' : 'navy');

    const nav = useMemo(() => ({
      go: (name, params = {}) => setStack(s => [...s, { name, params }]),
      back: () => setStack(s => s.length > 1 ? s.slice(0, -1) : s),
      home: () => setStack([{ name: 'home', params: {} }]),
    }), []);

    const toggle = (id) => setDone(d => ({ ...d, [id]: !d[id] }));

    const stats = useMemo(() => {
      const D = window.DATA;
      const allItems = D.checklist.flatMap(g => g.items);
      const clDone = allItems.filter(i => done[i.id]).length;
      const cl = { done: clDone, total: allItems.length, pct: Math.round(clDone / allItems.length * 100) };

      const totalCards = D.decks.reduce((n, d) => n + d.cards.length, 0);
      const masteredCards = D.decks.reduce((n, d) =>
        n + d.cards.reduce((k, _, i) => k + (mastery[`${d.id}:${i}`] === 'got' ? 1 : 0), 0), 0);
      const cards = { mastered: masteredCards, total: totalCards,
        pct: totalCards ? Math.round(masteredCards / totalCards * 100) : 0 };

      const builtRefs = D.references.filter(r => (r.kind === 'table' ? r.rows && r.rows.length : r.tree)).length;
      const refs = { built: builtRefs, total: D.references.length, pct: Math.round(builtRefs / D.references.length * 100) };

      const builtCalc = D.calcs.filter(c => c.steps && c.steps.length).length;
      const calc = { built: builtCalc, total: D.calcs.length, pct: Math.round(builtCalc / D.calcs.length * 100) };

      const overall = Math.round((cl.pct + cards.pct + refs.pct + calc.pct) / 4);
      return { cl, cards, refs, calc, overall };
    }, [done, mastery]);

    const top = stack[stack.length - 1];
    const Comp = MAP[top.name];

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#1C2B4A' }}>
        <div key={stack.length + ':' + top.name}
          style={{ position: 'absolute', inset: 0, animation: 'fade .26s ease' }}>
          <Comp nav={nav} params={top.params} dark={dark} stats={stats}
            done={done} toggle={toggle} mastery={mastery} setMastery={setMastery}
            onToggle={toggleAppearance} />
        </div>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
