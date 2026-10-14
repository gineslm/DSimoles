/* ChoiceList · 7.2 Entrada y selección · HF: 1 Base - Campo Opcion (zona, subzona, lado, superficie)
   Grupo radio con tabindex itinerante: Tab entra en la opción marcada, las flechas mueven y marcan (task de adopción).
   La selección lleva borde doble, fondo y un check: no depende solo del color. */
(function () {
  var NS = window.DSimoles, h = NS.h, R = window.React;
  NS.css('choice-list', [
    '.dsm-choices{display:flex;flex-direction:column;gap:var(--ds-space-2)}',
    '.dsm-choice{display:flex;align-items:center;justify-content:space-between;gap:var(--ds-space-3);width:100%;min-height:var(--ds-size-control-md);padding:var(--ds-space-2) var(--ds-space-4);border:var(--ds-border-width-thin) solid var(--ds-color-border-control);border-radius:var(--ds-radius-field);background:var(--ds-color-bg-surface);font:var(--ds-type-body);color:var(--ds-color-text-primary);text-align:left;cursor:pointer}',
    '.dsm-choice:hover,.dsm-choice.is-hover{border-color:var(--ds-color-border-control-hover);background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover))}',
    '.dsm-choice:active,.dsm-choice.is-pressed{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-choice[aria-checked="true"]{border-color:var(--ds-color-selection-border);box-shadow:inset 0 0 0 var(--ds-border-width-thin) var(--ds-color-selection-border);background:var(--ds-color-selection-bg);color:var(--ds-color-selection-text);font-weight:500}',
    '.dsm-choice__check{color:var(--ds-color-selection-border)}',
    '.dsm-choice[aria-disabled="true"]{background:var(--ds-color-disabled-bg);border-color:var(--ds-color-disabled-bg);color:var(--ds-color-disabled-text);cursor:not-allowed}'
  ].join('\n'));

  NS.ChoiceOption = function ChoiceOption(p) {
    return h('button', {
      type: 'button', role: 'radio', 'aria-checked': !!p.selected, 'aria-disabled': p.disabled || undefined,
      tabIndex: p.tabIndex, ref: p.innerRef,
      className: NS.cx('dsm-root dsm-reset dsm-focus dsm-choice', NS.state(p.demoState)),
      onClick: p.onClick, onKeyDown: p.onKeyDown
    }, h('span', null, p.label), p.selected ? h(NS.Icon, { name: 'check', size: 'md', className: 'dsm-choice__check' }) : null);
  };

  NS.ChoiceList = function ChoiceList(p) {
    var opts = NS.list(p.options);
    var v = NS.useControlled(p.value, p.defaultValue, p.onChange);
    var refs = R.useRef([]);
    var labelId = NS.useId('cl');
    var sel = opts.indexOf(v[0]);
    var focusable = sel >= 0 ? sel : 0;
    var move = function (i) { var n = (i + opts.length) % opts.length; v[1](opts[n]); if (refs.current[n]) refs.current[n].focus(); };
    var onKey = function (i) {
      return function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); move(i + 1); }
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); move(i - 1); }
        else if (e.key === ' ') { e.preventDefault(); v[1](opts[i]); }
      };
    };
    return h('div', { className: 'dsm-root dsm-choices' },
      p.label ? h('span', { id: labelId, className: 'dsm-sr' }, p.label) : null,
      h('div', { role: 'radiogroup', 'aria-labelledby': p.label ? labelId : undefined, className: 'dsm-choices' },
        opts.map(function (o, i) {
          return h(NS.ChoiceOption, {
            key: o, label: o, selected: i === sel, tabIndex: i === focusable ? 0 : -1,
            innerRef: function (el) { refs.current[i] = el; },
            onClick: function () { v[1](o); }, onKeyDown: onKey(i)
          });
        })));
  };
})();
