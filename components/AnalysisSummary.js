/* AnalysisSummary · 7.4 Presentación · HF: 2 Entidad - Analisis Resumen
   Resultado de un análisis: nivel de riesgo, indicación, explicación y los datos del análisis por capas. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('analysis-summary', [
    '.dsm-analysis{display:flex;flex-direction:column;gap:var(--ds-space-3)}',
    '.dsm-analysis__title{margin:0;font:var(--ds-type-title);color:var(--ds-color-text-primary)}',
    '.dsm-analysis__desc{margin:0;font:var(--ds-type-body);color:var(--ds-color-text-body)}'
  ].join('\n'));

  NS.AnalysisSummary = function AnalysisSummary(p) {
    var level = p.level || 'high';
    var Tag = 'h' + (p.headingLevel || 2);
    return h('div', { className: 'dsm-root dsm-analysis' },
      h(NS.RiskBadge, { level: level, label: p.badgeLabel, size: 'md' }),
      h(Tag, { className: 'dsm-analysis__title' }, p.title),
      p.description ? h('p', { className: 'dsm-analysis__desc' }, p.description) : null,
      p.rows ? h(NS.Disclosure, { tone: level === 'high' ? 'risk-high' : 'neutral', rows: p.rows, open: p.open }) : null);
  };
})();
