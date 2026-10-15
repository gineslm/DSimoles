/* Form-TextArea · 7.13 · separado de TextField (multiline) el 2026-10-15. Requiere Field.js y TextField.js.
   Entrada multilínea dentro de Form-Field: rows 4, alto mínimo 120 (--ds-component-textarea-min-height), resize vertical.
   Mismos estados que Form-TextField. Enter inserta un salto de línea. maxLength activa el contador de Field. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('text-area', [
    'textarea.dsm-input{min-height:var(--ds-component-textarea-min-height);padding-block:var(--ds-space-3);resize:vertical}'
  ].join('\n'));

  NS.TextArea = function TextArea(p) {
    var ids = NS.useFieldIds('ta');
    var v = NS.useControlled(p.value, p.defaultValue || '', p.onChange);
    var max = p.maxLength ? Number(p.maxLength) : null;
    var control = h('textarea', Object.assign(NS.textControlProps(p, ids, v, max), { rows: Number(p.rows) || 4 }));
    return h(NS.Field, {
      label: p.label, htmlFor: ids.id, help: p.help, helpId: ids.helpId, error: p.error, errorId: ids.errorId, liveId: ids.liveId, optional: p.optional,
      count: String(v[0] || '').length, max: max
    }, control);
  };
})();
