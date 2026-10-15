/* Form-Select · 7.14 · nuevo el 2026-10-15; sustituye a ChoiceList. Requiere Field.js y TextField.js (CSS .dsm-input).
   Select nativo dentro de Form-Field: un único valor de una lista cerrada. La lista desplegada es la del sistema.
   Sin valor inicial: primera opción vacía «Selecciona una opción» (no seleccionable). Admite grupos (optgroup).
   options: "Valor | …", "valor::Texto | …" o [{value, label, group}]. El filtrado al escribir es el patrón 8.2 Autocompletado. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('select', [
    '.dsm-select{position:relative;display:block}',
    '.dsm-select .dsm-input{padding-right:calc(var(--ds-space-4) + var(--ds-size-icon-md) + var(--ds-space-2));cursor:pointer}',
    '.dsm-select .dsm-input:disabled{cursor:not-allowed}',
    '.dsm-select__icon{position:absolute;right:var(--ds-space-3);top:50%;transform:translateY(-50%);pointer-events:none;color:var(--ds-color-text-secondary)}'
  ].join('\n'));

  function parse(options) {
    return NS.list(options).map(function (o) {
      if (typeof o !== 'string') return { value: String(o.value), label: o.label != null ? o.label : String(o.value), group: o.group };
      var f = NS.fields(o);
      return f.length > 1 ? { value: f[0], label: f[1], group: f[2] } : { value: f[0], label: f[0] };
    });
  }

  NS.Select = function Select(p) {
    var ids = NS.useFieldIds('sel');
    var v = NS.useControlled(p.value, p.defaultValue || '', p.onChange);
    var opts = parse(p.options);
    var groups = [], byGroup = {};
    opts.forEach(function (o) { var g = o.group || ''; if (!byGroup[g]) { byGroup[g] = []; groups.push(g); } byGroup[g].push(o); });
    var optEl = function (o) { return h('option', { key: o.value, value: o.value }, o.label); };
    var kids = [h('option', { key: '__empty', value: '', disabled: true }, p.placeholder || 'Selecciona una opción')];
    groups.forEach(function (g) { kids.push(g ? h('optgroup', { key: 'g-' + g, label: g }, byGroup[g].map(optEl)) : byGroup[g].map(optEl)); });
    var control = h('span', { className: 'dsm-select' },
      h('select', {
        id: ids.id,
        className: NS.cx('dsm-focus-none dsm-input', NS.state(p.demoState)),
        value: v[0] || '',
        disabled: !!p.disabled,
        required: !!p.required,
        autoComplete: p.autoComplete,
        'aria-invalid': p.error ? true : undefined,
        'aria-describedby': NS.describedBy(ids, { error: p.error, help: p.help }),
        onChange: function (e) { v[1](e.target.value); }
      }, kids),
      h(NS.Icon, { name: 'expand_more', size: 'md', className: 'dsm-select__icon' }));
    return h(NS.Field, {
      label: p.label, htmlFor: ids.id, help: p.help, helpId: ids.helpId, error: p.error, errorId: ids.errorId, optional: p.optional
    }, control);
  };
})();
