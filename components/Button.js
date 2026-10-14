/* Button · 7.1 Acciones · HF: 1 Base - Boton
   Tamaños: md 44 (acción principal, mismo alto que los campos) · sm 36 · xs 28. Icono: xs 16, sm y md 20. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('button', [
    '.dsm-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--ds-space-2);padding-block:var(--ds-space-1);border:var(--ds-border-width-thick) solid transparent;border-radius:var(--ds-radius-button);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;text-align:center;cursor:pointer;user-select:none}',
    '.dsm-btn--full{display:flex;width:100%}',
    '.dsm-btn--md{min-height:var(--ds-size-control-md);padding-inline:var(--ds-space-5);font:var(--ds-component-button-label-md)}',
    '.dsm-btn--sm{min-height:var(--ds-size-control-sm);padding-inline:var(--ds-space-4);gap:var(--ds-space-1);font:var(--ds-component-button-label-sm)}',
    '.dsm-btn--xs{min-height:var(--ds-size-control-xs);padding-inline:var(--ds-space-3);gap:var(--ds-space-1);font:var(--ds-component-button-label-xs)}',
    '.dsm-btn--primary{background:var(--ds-color-action-primary);color:var(--ds-color-text-inverse)}',
    '.dsm-btn--primary:hover,.dsm-btn--primary.is-hover{background:var(--ds-color-action-primary-hover)}',
    '.dsm-btn--primary:active,.dsm-btn--primary.is-pressed{background:var(--ds-color-action-primary-pressed)}',
    '.dsm-btn--alert{background:var(--ds-color-action-alert);color:var(--ds-color-text-inverse)}',
    '.dsm-btn--alert:hover,.dsm-btn--alert.is-hover{background:var(--ds-color-action-alert-hover)}',
    '.dsm-btn--alert:active,.dsm-btn--alert.is-pressed{background:var(--ds-color-action-alert-pressed)}',
    '.dsm-btn--secondary{background:var(--ds-color-bg-surface);border-color:var(--ds-color-action-primary);color:var(--ds-color-brand-text)}',
    '.dsm-btn--secondary:hover,.dsm-btn--secondary.is-hover{background-image:linear-gradient(var(--ds-color-action-secondary-hover),var(--ds-color-action-secondary-hover))}',
    '.dsm-btn--secondary:active,.dsm-btn--secondary.is-pressed{background-image:linear-gradient(var(--ds-color-action-secondary-pressed),var(--ds-color-action-secondary-pressed))}',
    '.dsm-btn[aria-disabled="true"],.dsm-btn[aria-disabled="true"]:hover,.dsm-btn[aria-disabled="true"]:active{background:var(--ds-color-disabled-bg);border-color:transparent;color:var(--ds-color-disabled-text);cursor:not-allowed}',
    '.dsm-btn[aria-busy="true"]{cursor:progress}'
  ].join('\n'));

  NS.Button = function Button(p) {
    var variant = p.variant || 'primary';
    var size = p.size === 'lg' || !p.size ? 'md' : p.size; /* lg retirado el 2026-10-14: la acción principal usa md (44) */
    var disabled = !!p.disabled, loading = !!p.loading;
    var label = p.label != null ? p.label : p.children;
    var onClick = function (e) { if (disabled || loading) { e.preventDefault(); return; } if (p.onClick) p.onClick(e); };
    return h('button', {
      type: p.type || 'button',
      className: NS.cx('dsm-root dsm-reset dsm-focus dsm-btn', 'dsm-btn--' + variant, 'dsm-btn--' + size, p.width !== 'auto' && 'dsm-btn--full', NS.state(p.demoState)),
      'aria-disabled': disabled || undefined,
      'aria-busy': loading || undefined,
      onClick: onClick
    },
      loading ? h(NS.Spinner) : (p.icon ? h(NS.Icon, { name: p.icon, size: size === 'xs' ? 'xs' : 'md' }) : null),
      h('span', null, loading && p.loadingLabel ? p.loadingLabel : label));
  };
})();
