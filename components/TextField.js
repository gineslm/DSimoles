/* Form-TextField · 7.12 · HF: 1 Base - Campo Texto
   Entrada de una línea dentro de Form-Field. type nativo para el teclado adecuado; autocomplete solo si el uso lo indica (WCAG 1.3.5).
   Estados: normal · hover · focus · error · disabled · readonly. multiline: alias temporal de Form-TextArea (7.12).
   El CSS .dsm-input es común a TextField, TextArea y Select. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('text-field', [
    '.dsm-input{display:block;width:100%;min-height:var(--ds-size-control-md);margin:0;padding:var(--ds-space-2) var(--ds-space-4);border:var(--ds-border-width-thin) solid var(--ds-color-border-control);border-radius:var(--ds-radius-field);background:var(--ds-color-bg-surface);font:var(--ds-type-body);color:var(--ds-color-text-primary);-webkit-appearance:none;appearance:none}',
    '.dsm-input::placeholder{color:var(--ds-color-text-secondary);opacity:1}',
    '.dsm-input:hover,.dsm-input.is-hover{border-color:var(--ds-color-border-control-hover)}',
    '.dsm-input:focus,.dsm-input.is-focus{outline:none;border-color:var(--ds-color-selection-border);box-shadow:inset 0 0 0 var(--ds-border-width-thin) var(--ds-color-selection-border)}',
    '.dsm-input[aria-invalid="true"]{border-color:var(--ds-color-status-error-fill);box-shadow:inset 0 0 0 var(--ds-border-width-thin) var(--ds-color-status-error-fill)}',
    '.dsm-input:read-only:not(select):hover{border-color:var(--ds-color-border-control)}',
    '.dsm-input:disabled{background:var(--ds-color-disabled-bg);border-color:var(--ds-color-disabled-bg);color:var(--ds-color-disabled-text);cursor:not-allowed}'
  ].join('\n'));

  /* Props comunes de un control de texto dentro de Field. */
  NS.textControlProps = function (p, ids, v, max) {
    var len = String(v[0] || '').length;
    return {
      id: ids.id,
      className: NS.cx('dsm-focus-none dsm-input', NS.state(p.demoState)),
      value: v[0],
      placeholder: p.placeholder,
      maxLength: max || undefined,
      disabled: !!p.disabled,
      readOnly: !!p.readOnly || undefined,
      required: !!p.required,
      autoComplete: p.autoComplete,
      'aria-invalid': p.error ? true : undefined,
      'aria-describedby': NS.describedBy(ids, { error: p.error, help: p.help, count: len, max: max }),
      onChange: function (e) { v[1](e.target.value); }
    };
  };

  NS.TextField = function TextField(p) {
    if (p.multiline && NS.TextArea) return h(NS.TextArea, p);
    var ids = NS.useFieldIds('tf');
    var v = NS.useControlled(p.value, p.defaultValue || '', p.onChange);
    var max = p.maxLength ? Number(p.maxLength) : null;
    var control = h('input', Object.assign(NS.textControlProps(p, ids, v, max), { type: p.type || 'text', inputMode: p.inputMode }));
    return h(NS.Field, {
      label: p.label, htmlFor: ids.id, help: p.help, helpId: ids.helpId, error: p.error, errorId: ids.errorId, liveId: ids.liveId, optional: p.optional,
      count: String(v[0] || '').length, max: max
    }, control);
  };
})();
