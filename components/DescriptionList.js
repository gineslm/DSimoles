/* Data-DescriptionList · 7.15 · HF: filas etiqueta / valor de «Ampliar información», «Datos de la captura» y «Datos de la acción»
   Pares término–valor de un mismo objeto. rows: "Etiqueta::Valor | …" o [{label, value}]. Un salto de línea en el valor se respeta.
   layout stacked para valores largos o pantallas estrechas. tone: default | error (tono semántico genérico; risk-high es alias temporal). */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('description-list', [
    '.dsm-dl{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,auto);gap:var(--ds-space-2) var(--ds-space-4);margin:0;font:var(--ds-type-caption)}',
    '.dsm-dl dt{margin:0;color:var(--ds-color-text-body)}',
    '.dsm-dl dd{margin:0;text-align:right;white-space:pre-line;color:var(--ds-color-text-primary)}',
    '.dsm-dl--error dt,.dsm-dl--error dd{color:var(--ds-color-status-error-body)}',
    '.dsm-dl--stacked{grid-template-columns:minmax(0,1fr)}',
    '.dsm-dl--stacked dd{text-align:left;margin-bottom:var(--ds-space-2)}',
    '.dsm-dl--stacked dt{color:var(--ds-color-text-secondary)}'
  ].join('\n'));

  NS.DescriptionList = function DescriptionList(p) {
    var rows = NS.list(p.rows).map(function (r) {
      if (typeof r !== 'string') return r;
      var f = NS.fields(r);
      return { label: f[0], value: (f[1] || '').replace(/\\n/g, '\n') };
    });
    var kids = [];
    rows.forEach(function (r, i) {
      kids.push(h('dt', { key: 't' + i }, r.label));
      kids.push(h('dd', { key: 'd' + i }, r.value));
    });
    return h('dl', { className: NS.cx('dsm-root dsm-dl', (p.tone === 'error' || p.tone === 'risk-high') && 'dsm-dl--error', p.layout === 'stacked' && 'dsm-dl--stacked') }, kids);
  };
})();
