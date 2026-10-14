/* Field y Fieldset · 7.3 Estructura de campos
   Field: etiqueta + control + ayuda / contador + error. Lo usan TextField y cualquier control nuevo.
   Fieldset: agrupa controles bajo una pregunta (legend). Lo usan ChoiceList y los pasos del bloque 3. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('field', [
    '.dsm-field{display:flex;flex-direction:column;gap:var(--ds-space-2);min-width:0}',
    '.dsm-field__label{font:var(--ds-component-field-label);color:var(--ds-color-text-primary)}',
    '.dsm-field__opt{font:var(--ds-type-small);color:var(--ds-color-text-secondary)}',
    '.dsm-field__foot{display:flex;justify-content:space-between;gap:var(--ds-space-3);font:var(--ds-type-small);color:var(--ds-color-text-secondary)}',
    '.dsm-field__count{flex-shrink:0;font-variant-numeric:tabular-nums}',
    '.dsm-field__error{display:flex;align-items:flex-start;gap:var(--ds-space-1);font:var(--ds-type-small);font-weight:500;color:var(--ds-color-status-error-text)}',
    '.dsm-fieldset{margin:0;padding:0;border:0;min-width:0;display:flex;flex-direction:column;gap:var(--ds-space-3)}',
    '.dsm-fieldset__legend{padding:0;margin-bottom:var(--ds-space-2);font:var(--ds-type-label);color:var(--ds-color-text-primary)}',
    '.dsm-fieldset__legend--title{font:var(--ds-type-title)}',
    '.dsm-fieldset__desc{margin:0;font:var(--ds-type-caption);color:var(--ds-color-text-body)}'
  ].join('\n'));

  NS.Field = function Field(p) {
    var foot = p.help || p.counter ? h('div', { className: 'dsm-field__foot' },
      h('span', { id: p.helpId }, p.help || ''),
      p.counter ? h('span', { className: 'dsm-field__count', 'aria-hidden': 'true' }, p.counter) : null) : null;
    return h('div', { className: 'dsm-root dsm-field' },
      h('label', { className: 'dsm-field__label', htmlFor: p.htmlFor, id: p.labelId },
        p.label, p.optional ? h('span', { className: 'dsm-field__opt' }, ' (opcional)') : null),
      p.children,
      p.error ? h('div', { className: 'dsm-field__error', id: p.errorId }, h(NS.Icon, { name: 'info', size: 'xs' }), h('span', null, p.error)) : null,
      foot);
  };

  NS.Fieldset = function Fieldset(p) {
    var descId = NS.useId('fs-desc'), errId = NS.useId('fs-err');
    return h('fieldset', { className: 'dsm-root dsm-fieldset', 'aria-describedby': NS.cx(p.description && descId, p.error && errId) || undefined },
      h('legend', { className: NS.cx('dsm-fieldset__legend', p.legendStyle === 'title' && 'dsm-fieldset__legend--title') }, p.legend),
      p.description ? h('p', { className: 'dsm-fieldset__desc', id: descId }, p.description) : null,
      p.children,
      p.error ? h('div', { className: 'dsm-field__error', id: errId }, h(NS.Icon, { name: 'info', size: 'xs' }), h('span', null, p.error)) : null);
  };
})();
