/* TextField · 7.2 Entrada y selección · HF: 1 Base - Campo Texto (referencia personal, 3.5)
   Input o textarea nativo dentro de Field. Contador visible y anunciado solo al acercarse al límite. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('text-field', [
    '.dsm-input{display:block;width:100%;min-height:var(--ds-size-control-md);margin:0;padding:var(--ds-space-2) var(--ds-space-4);border:var(--ds-border-width-thin) solid var(--ds-color-border-control);border-radius:var(--ds-radius-field);background:var(--ds-color-bg-surface);font:var(--ds-type-body);color:var(--ds-color-text-primary);-webkit-appearance:none;appearance:none}',
    'textarea.dsm-input{padding-block:var(--ds-space-3)}',
    '.dsm-input::placeholder{color:var(--ds-color-text-secondary);opacity:1}',
    'textarea.dsm-input{min-height:var(--ds-component-textarea-min-height);resize:vertical}',
    '.dsm-input:hover,.dsm-input.is-hover{border-color:var(--ds-color-border-control-hover)}',
    '.dsm-input:focus,.dsm-input.is-focus{outline:none;border-color:var(--ds-color-selection-border);box-shadow:inset 0 0 0 var(--ds-border-width-thin) var(--ds-color-selection-border)}',
    '.dsm-input[aria-invalid="true"]{border-color:var(--ds-color-status-error-fill);box-shadow:inset 0 0 0 var(--ds-border-width-thin) var(--ds-color-status-error-fill)}',
    '.dsm-input:disabled{background:var(--ds-color-disabled-bg);border-color:var(--ds-color-disabled-bg);color:var(--ds-color-disabled-text);cursor:not-allowed}'
  ].join('\n'));

  NS.TextField = function TextField(p) {
    var id = NS.useId('tf'), helpId = id + '-help', errId = id + '-err', liveId = id + '-live';
    var v = NS.useControlled(p.value, p.defaultValue || '', p.onChange);
    var max = p.maxLength ? Number(p.maxLength) : null;
    var len = String(v[0] || '').length;
    var near = max && max - len <= Math.max(5, Math.round(max * 0.1));
    var Tag = p.multiline ? 'textarea' : 'input';
    var control = h(Tag, {
      id: id,
      className: NS.cx('dsm-focus-none dsm-input', NS.state(p.demoState)),
      value: v[0],
      placeholder: p.placeholder,
      maxLength: max || undefined,
      disabled: !!p.disabled,
      required: !!p.required,
      'aria-invalid': p.error ? true : undefined,
      'aria-describedby': NS.cx(p.error && errId, p.help && helpId, near && liveId) || undefined,
      onChange: function (e) { v[1](e.target.value); },
      type: p.multiline ? undefined : (p.type || 'text'),
      rows: p.multiline ? 4 : undefined,
      autoComplete: p.autoComplete || 'off'
    });
    return h(NS.Field, {
      label: p.label, htmlFor: id, help: p.help, helpId: helpId, error: p.error, errorId: errId, optional: p.optional,
      counter: max ? len + '/' + max : null
    }, control, max ? h('span', { id: liveId, className: 'dsm-sr', 'aria-live': 'polite' }, near ? 'Quedan ' + (max - len) + ' caracteres' : '') : null);
  };
})();
