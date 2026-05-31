/* CFP Study — placeholder content. Swap real content in later. */
window.DATA = {
  exam: { label: 'November 2026', date: '2026-11-15' },

  /* ── Checklist: tracks content that still needs to be built ── */
  checklist: [
    {
      id: 'cl-cards', title: 'Flashcards', area: 'cards',
      items: [
        { id: 'c1', label: 'General Principles — 25 cards', done: true },
        { id: 'c2', label: 'Risk Management & Insurance — 30 cards', done: true },
        { id: 'c3', label: 'Investment Planning — 28 cards', done: false },
        { id: 'c4', label: 'Tax Planning — 26 cards', done: false },
        { id: 'c5', label: 'Retirement & Employee Benefits — 30 cards', done: false },
        { id: 'c6', label: 'Estate Planning — 24 cards', done: false },
      ],
    },
    {
      id: 'cl-calc', title: 'Calculations', area: 'calc',
      items: [
        { id: 'k1', label: 'Time Value of Money guide', done: true },
        { id: 'k2', label: 'Retirement needs analysis', done: false },
        { id: 'k3', label: 'Education funding', done: false },
        { id: 'k4', label: 'Bond valuation & yield', done: false },
        { id: 'k5', label: 'Tax liability walkthrough', done: false },
        { id: 'k6', label: 'Net worth & cash-flow statements', done: false },
      ],
    },
    {
      id: 'cl-refs', title: 'References', area: 'refs',
      items: [
        { id: 'r1', label: 'Traditional vs Roth IRA table', done: true },
        { id: 'r2', label: 'Roth conversion decision tree', done: true },
        { id: 'r3', label: 'Account titling comparison', done: false },
        { id: 'r4', label: 'Trust selection decision tree', done: false },
        { id: 'r5', label: 'Education funding options table', done: false },
      ],
    },
  ],

  /* ── Flashcards: decks of front/back cards ── */
  decks: [
    {
      id: 'gp', title: 'General Principles', count: 25,
      cards: [
        { f: 'What are the 7 steps of the financial planning process?', b: '1) Understand the client\u2019s circumstances  2) Identify & select goals  3) Analyze current course & alternatives  4) Develop recommendations  5) Present recommendations  6) Implement  7) Monitor & update.' },
        { f: 'Fiduciary standard vs. suitability standard?', b: 'Fiduciary: must act in the client\u2019s best interest. Suitability: recommendations need only be suitable for the client \u2014 not necessarily the best option.' },
        { f: 'Emergency fund rule of thumb?', b: '3\u20136 months of nondiscretionary (fixed) living expenses held in liquid, low-risk accounts.' },
        { f: 'Define the time value of money.', b: 'A dollar available today is worth more than the same dollar in the future because of its capacity to earn a return.' },
      ],
    },
    {
      id: 'rm', title: 'Risk Management & Insurance', count: 30,
      cards: [
        { f: 'What is adverse selection?', b: 'The tendency of higher-risk individuals to seek insurance more than lower-risk individuals, distorting the risk pool.' },
        { f: 'Define the principle of indemnity.', b: 'Insurance should restore the insured to their pre-loss financial position \u2014 no more, no less \u2014 preventing profit from a loss.' },
        { f: 'HO-3 vs HO-5 homeowners policy?', b: 'HO-3 covers the dwelling on an open-perils basis and personal property on a named-perils basis. HO-5 covers both on an open-perils basis.' },
      ],
    },
    {
      id: 'ip', title: 'Investment Planning', count: 28,
      cards: [
        { f: 'What does standard deviation measure?', b: 'Total risk \u2014 the variability (dispersion) of an investment\u2019s returns around its mean.' },
        { f: 'What does beta measure?', b: 'Systematic (non-diversifiable, market) risk of a security relative to the overall market (market beta = 1.0).' },
        { f: 'Sharpe ratio formula?', b: '(Rp \u2212 Rf) / \u03c3p \u2014 excess return earned per unit of total risk (standard deviation).' },
      ],
    },
    { id: 'tp', title: 'Tax Planning', count: 26, cards: [] },
    { id: 'rp', title: 'Retirement & Employee Benefits', count: 30, cards: [] },
    { id: 'ep', title: 'Estate Planning', count: 24, cards: [] },
  ],

  /* ── References: comparison tables + decision trees ── */
  references: [
    {
      id: 'ira', title: 'Traditional vs. Roth IRA', kind: 'table',
      blurb: 'Side-by-side of the two individual retirement accounts.',
      columns: ['Traditional IRA', 'Roth IRA'],
      rows: [
        ['Contributions', 'Pre-tax / deductible (subject to limits)', 'After-tax (never deductible)'],
        ['Growth', 'Tax-deferred', 'Tax-free'],
        ['Qualified withdrawals', 'Taxed as ordinary income', 'Tax-free'],
        ['RMDs', 'Begin at age 73', 'None during owner\u2019s lifetime'],
        ['Early-withdrawal penalty', '10% before 59\u00bd (exceptions apply)', '10% on earnings before 59\u00bd / 5-yr rule'],
        ['Income limits to contribute', 'None (deduction may phase out)', 'Phases out at higher MAGI'],
      ],
    },
    {
      id: 'roth-conv', title: 'Roth Conversion — Should You?', kind: 'tree',
      blurb: 'Walk the decision to convert a Traditional IRA to Roth.',
      tree: {
        start: 'q1',
        nodes: {
          q1: { shortLabel: 'Higher tax in retirement?', q: 'Do you expect your tax rate to be HIGHER in retirement than today?', yes: 'q2', no: 'o-wait' },
          q2: { shortLabel: 'Non-IRA funds to pay tax?', q: 'Can you pay the conversion tax from outside (non-IRA) funds?', yes: 'q3', no: 'o-partial' },
          q3: { shortLabel: '5+ year time horizon?', q: 'Is your time horizon long enough to recover the upfront tax (5+ years)?', yes: 'o-convert', no: 'o-partial' },
          'o-convert': { shortLabel: 'Convert now', outcome: 'Conversion is likely favorable. Paying tax now at a lower rate and growing tax-free can win over a long horizon.' },
          'o-partial': { shortLabel: 'Partial conversion', outcome: 'Consider a partial / multi-year conversion to fill up lower tax brackets without a large one-time tax hit.' },
          'o-wait': { shortLabel: 'Don\'t convert', outcome: 'Converting may not help. If your future rate is lower, deferring tax in the Traditional IRA is usually better.' },
        },
      },
    },
    { id: 'titling', title: 'Account Titling & Ownership', kind: 'table', blurb: 'Placeholder — add comparison content.', columns: ['', ''], rows: [] },
    { id: 'trust', title: 'Trust Selection', kind: 'tree', blurb: 'Placeholder — add decision logic.', tree: null },
    { id: 'edu', title: 'Education Funding Options', kind: 'table', blurb: 'Placeholder — add comparison content.', columns: ['', ''], rows: [] },
  ],

  /* ── Calculations: step-by-step problem guides ── */
  calcs: [
    {
      id: 'tvm', title: 'Time Value of Money — Future Value',
      blurb: 'Grow a single sum forward at a fixed rate.',
      formula: 'FV = PV \u00d7 (1 + i)\u207f',
      steps: [
        { t: 'Identify the variables', b: 'PV = present value (today\u2019s amount), i = periodic interest rate, n = number of periods, FV = future value (the unknown).' },
        { t: 'Write the formula', b: 'FV = PV \u00d7 (1 + i)\u207f. Make sure i and n use the same period (annual with annual, monthly with monthly).' },
        { t: 'Plug in the example', b: 'A client invests $10,000 (PV) at 6% annually (i = 0.06) for 15 years (n = 15).' },
        { t: 'Solve', b: 'FV = 10,000 \u00d7 (1.06)\u00b9\u2075 = 10,000 \u00d7 2.3966 = $23,966.' },
        { t: 'Interpret', b: 'The $10,000 more than doubles over 15 years. On a financial calculator: PV = \u201210000, I/Y = 6, N = 15, PMT = 0, solve CPT FV.' },
      ],
    },
    { id: 'rna', title: 'Retirement Needs Analysis', blurb: 'Placeholder — add step-by-step content.', formula: '', steps: [] },
    { id: 'edu', title: 'Education Funding', blurb: 'Placeholder — add step-by-step content.', formula: '', steps: [] },
    { id: 'bond', title: 'Bond Valuation & Yield', blurb: 'Placeholder — add step-by-step content.', formula: '', steps: [] },
    { id: 'tax', title: 'Tax Liability Walkthrough', blurb: 'Placeholder — add step-by-step content.', formula: '', steps: [] },
  ],
};
