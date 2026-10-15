/* Form-Field (7.9) y Form-Fieldset (7.10)
   Form-Field: etiqueta + control + error + ayuda y contador. Lo usan Form-TextField, Form-TextArea, Form-Select y cualquier control nuevo.
   El contador lo presenta Field (count + max): visible «n/max» oculto al lector y aviso en vivo «Quedan N caracteres» solo cerca del límite.
   El control impone el límite (maxLength) y le pasa la longitud. Ids para aria-describedby: error, ayuda, contador (en ese orden).
   Form-Fieldset: agrupa controles relacionados bajo una pregunta o un título (fieldset + legend), con descripción y error de grupo. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('field', [
    /* 6 px entre etiqueta, control, error y pie (space-2 − space-half; decisión del owner, 2026-10-15) */
    '.dsm-field{display:flex;flex-direction:column;gap:calc(var(--ds-space-2) - var(--ds-space-half));min-width:0}',
    '.dsm-field__label{font:var(--ds-component-field-label);color:var(--ds-color-text-primary)}',
    '.dsm-field__opt{font:var(--ds-type-small);color:var(--ds-color-text-secondary)}',
    '.dsm-field__foot{display:flex;justify-content:space-between;gap:var(--ds-space-3);font:var(--ds-type-small);color:var(--ds-color-text-secondary)}',
    '.dsm-field__count{flex-shrink:0;margin-left:auto;font-variant-numeric:tabular-nums}',
    '.dsm-field__error{display:flex;align-items:flex-start;gap:var(--ds-space-1);font:var(--ds-type-small);font-weight:500;color:var(--ds-color-status-error-text)}',
    '.dsm-fieldset{margin:0;padding:0;border:0;min-width:0;display:flex;flex-direction:column;gap:var(--ds-space-3)}',
    '.dsm-fieldset__legend{padding:0;margin-bottom:var(--ds-space-2);font:var(--ds-type-label);color:var(--ds-color-text-primary)}',
    '.dsm-fieldset__legend--title{font:var(--ds-type-title)}',
    '.dsm-fieldset__desc{margin:0;font:var(--ds-type-caption);color:var(--ds-color-text-body)}'
  ].join('\n'));

  /* Ids y aria-describedby comunes a cualquier control dentro de Field. */
  NS.useFieldIds = function (prefix) {
    var id = NS.useId(prefix || 'fld');
    return { id: id, helpId: id + '-help', errorId: id + '-err', liveId: id + '-live' };
  };
  NS.counterNear = function (count, max) { return !!max && max - count <= Math.max(5, Math.round(max * 0.1)); };
  NS.describedBy = function (ids, p) {
    var near = NS.counterNear(p.count || 0, p.max);
    return NS.cx(p.error && ids.errorId, p.help && ids.helpId, near && ids.liveId) || undefined;
  };

  NS.Field = function Field(p) {
    var max = p.max ? Number(p.max) : null, count = Number(p.count) || 0;
    var counter = max ? count + '/' + max : p.counter;
    var near = NS.counterNear(count, max);
    var foot = p.help || counter ? h('div', { className: 'dsm-field__foot' },
      p.help ? h('span', { id: p.helpId }, p.help) : null,
      counter ? h('span', { className: 'dsm-field__count', 'aria-hidden': 'true' }, counter) : null) : null;
    return h('div', { className: 'dsm-root dsm-field' },
      h('label', { className: 'dsm-field__label', htmlFor: p.htmlFor, id: p.labelId },
        p.label, p.optional ? h('span', { className: 'dsm-field__opt' }, ' (opcional)') : null),
      p.children,
      p.error ? h('div', { className: 'dsm-field__error', id: p.errorId }, h(NS.Icon, { name: 'error', size: 'xs' }), h('span', null, p.error)) : null,
      foot,
      max ? h('span', { id: p.liveId, className: 'dsm-sr', 'aria-live': 'polite' }, near ? 'Quedan ' + (max - count) + ' caracteres' : '') : null);
  };

  NS.Fieldset = function Fieldset(p) {
    var descId = NS.useId('fs-desc'), errId = NS.useId('fs-err');
    return h('fieldset', { className: 'dsm-root dsm-fieldset', 'aria-describedby': NS.cx(p.description && descId, p.error && errId) || undefined },
      h('legend', { className: NS.cx('dsm-fieldset__legend', p.legendStyle === 'title' && 'dsm-fieldset__legend--title') }, p.legend),
      p.description ? h('p', { className: 'dsm-fieldset__desc', id: descId }, p.description) : null,
      p.children,
      p.error ? h('div', { className: 'dsm-field__error', id: errId }, h(NS.Icon, { name: 'error', size: 'xs' }), h('span', null, p.error)) : null);
  };
})();
