/* IconButton · 7.1 Acciones · HF: menú «more_vert» de 2 Entidad - Cabecera Seguimiento */
(function () {
  var NS = window.DSimoles, h = NS.h, R = window.React;
  NS.css('icon-button', [
    '.dsm-iconbtn{display:inline-flex;align-items:center;justify-content:center;width:var(--ds-size-icon-button);height:var(--ds-size-icon-button);border-radius:var(--ds-radius-pill);color:var(--ds-color-brand-text);cursor:pointer}',
    '.dsm-iconbtn--xs{width:var(--ds-size-icon-button-xs);height:var(--ds-size-icon-button-xs)}',
    '.dsm-iconbtn--md{width:var(--ds-size-icon-button-md);height:var(--ds-size-icon-button-md)}',
    '.dsm-iconbtn--lg{width:var(--ds-size-icon-button-lg);height:var(--ds-size-icon-button-lg)}',
    '.dsm-iconbtn:hover,.dsm-iconbtn.is-hover{background-image:linear-gradient(var(--ds-color-action-secondary-hover),var(--ds-color-action-secondary-hover))}',
    '.dsm-iconbtn:active,.dsm-iconbtn.is-pressed,.dsm-iconbtn[aria-expanded="true"],.dsm-iconbtn[aria-pressed="true"]{background-image:linear-gradient(var(--ds-color-action-secondary-pressed),var(--ds-color-action-secondary-pressed))}',
    '.dsm-iconbtn--on-dark{color:var(--ds-component-on-dark-text)}',
    '.dsm-iconbtn--on-dark:hover,.dsm-iconbtn--on-dark.is-hover{background:var(--ds-component-icon-button-on-dark-hover)}',
    '.dsm-iconbtn[aria-disabled="true"]{color:var(--ds-color-text-disabled);background:none;cursor:not-allowed}'
  ].join('\n'));

  NS.IconButton = R.forwardRef(function IconButton(p, ref) {
    var disabled = !!p.disabled;
    /* xs 28 · md 36 · lg 44 (por defecto en iMoles). 2xs, sm y xl retirados el 2026-10-14 */
    var size = { '2xs': 'xs', xs: 'xs', sm: 'md', md: 'md', lg: 'lg', xl: 'lg' }[p.size] || 'lg';
    return h('button', {
      ref: ref,
      type: 'button',
      className: NS.cx('dsm-root dsm-reset dsm-focus dsm-target dsm-iconbtn', 'dsm-iconbtn--' + size, p.tone === 'on-dark' && 'dsm-iconbtn--on-dark', NS.state(p.demoState)),
      'aria-label': p.label,
      'aria-expanded': p.expanded == null ? undefined : !!p.expanded,
      'aria-haspopup': p.haspopup,
      'aria-controls': p.controls,
      'aria-disabled': disabled || undefined,
      onClick: function (e) { if (disabled) return; if (p.onClick) p.onClick(e); },
      onKeyDown: p.onKeyDown
    }, h(NS.Icon, { name: p.icon || 'more_vert', size: size }));
  });
})();
