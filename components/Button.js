/* Act-Button · 7.4 · HF: 1 Base - Boton + menú «more_vert» de 2 Entidad - Cabecera Seguimiento
   Unifica Button e IconButton (decisión del owner, 2026-10-15).
   Composiciones: solo texto · icono + texto (iconPosition start|end) · solo icono (iconOnly; label obligatorio, nombre accesible).
   Variantes: primary · secondary · destructive (alias temporal: alert) · clear (sin fondo; fondo solo en hover y pressed).
   Tamaños: md 44 (por defecto) · sm 36 · xs 28. Icono: xs 16, sm y md 20; solo icono: md 24, sm 20, xs 16. Ancho: auto (por defecto) | full.
   Disabled con aria-disabled (sigue recibiendo foco). Loading: aria-busy y Spinner en lugar del icono. */
(function () {
  var NS = window.DSimoles, h = NS.h, R = window.React;
  NS.css('button', [
    '.dsm-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--ds-space-2);padding-block:var(--ds-space-1);border:var(--ds-border-width-thick) solid transparent;border-radius:var(--ds-radius-button);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;text-align:center;cursor:pointer;user-select:none}',
    '.dsm-btn--full{display:flex;width:100%}',
    '.dsm-btn--md{min-height:var(--ds-size-control-md);padding-inline:var(--ds-space-5);font:var(--ds-component-button-label-md)}',
    '.dsm-btn--sm{min-height:var(--ds-size-control-sm);padding-inline:var(--ds-space-4);gap:var(--ds-space-1);font:var(--ds-component-button-label-sm)}',
    '.dsm-btn--xs{min-height:var(--ds-size-control-xs);padding-inline:var(--ds-space-3);gap:var(--ds-space-1);font:var(--ds-component-button-label-xs)}',
    '.dsm-btn--icon{padding-inline:0;border-radius:var(--ds-radius-pill)}',
    '.dsm-btn--icon.dsm-btn--md{width:var(--ds-size-control-md)}',
    '.dsm-btn--icon.dsm-btn--sm{width:var(--ds-size-control-sm)}',
    '.dsm-btn--icon.dsm-btn--xs{width:var(--ds-size-control-xs)}',
    '.dsm-btn--primary{background:var(--ds-color-action-primary);color:var(--ds-color-text-inverse)}',
    '.dsm-btn--primary:hover,.dsm-btn--primary.is-hover{background:var(--ds-color-action-primary-hover)}',
    '.dsm-btn--primary:active,.dsm-btn--primary.is-pressed{background:var(--ds-color-action-primary-pressed)}',
    '.dsm-btn--destructive{background:var(--ds-color-action-alert);color:var(--ds-color-text-inverse)}',
    '.dsm-btn--destructive:hover,.dsm-btn--destructive.is-hover{background:var(--ds-color-action-alert-hover)}',
    '.dsm-btn--destructive:active,.dsm-btn--destructive.is-pressed{background:var(--ds-color-action-alert-pressed)}',
    '.dsm-btn--secondary{background:var(--ds-color-bg-surface);border-color:var(--ds-color-action-primary);color:var(--ds-color-brand-text)}',
    '.dsm-btn--secondary:hover,.dsm-btn--secondary.is-hover{background-image:linear-gradient(var(--ds-color-action-secondary-hover),var(--ds-color-action-secondary-hover))}',
    '.dsm-btn--secondary:active,.dsm-btn--secondary.is-pressed{background-image:linear-gradient(var(--ds-color-action-secondary-pressed),var(--ds-color-action-secondary-pressed))}',
    '.dsm-btn--clear{background:none;color:var(--ds-color-brand-text)}',
    '.dsm-btn--clear:hover,.dsm-btn--clear.is-hover{background-image:linear-gradient(var(--ds-color-action-secondary-hover),var(--ds-color-action-secondary-hover))}',
    '.dsm-btn--clear:active,.dsm-btn--clear.is-pressed,.dsm-btn--clear[aria-expanded="true"],.dsm-btn--clear[aria-pressed="true"]{background-image:linear-gradient(var(--ds-color-action-secondary-pressed),var(--ds-color-action-secondary-pressed))}',
    '.dsm-btn--on-dark.dsm-btn--clear{color:var(--ds-component-on-dark-text)}',
    '.dsm-btn--on-dark.dsm-btn--clear:hover,.dsm-btn--on-dark.dsm-btn--clear.is-hover{background:var(--ds-component-button-on-dark-hover)}',
    '.dsm-btn[aria-disabled="true"],.dsm-btn[aria-disabled="true"]:hover,.dsm-btn[aria-disabled="true"]:active{background:var(--ds-color-disabled-bg);border-color:transparent;color:var(--ds-color-disabled-text);cursor:not-allowed}',
    '.dsm-btn--clear[aria-disabled="true"],.dsm-btn--clear[aria-disabled="true"]:hover,.dsm-btn--clear[aria-disabled="true"]:active{background:none;color:var(--ds-color-text-disabled)}',
    '.dsm-btn[aria-busy="true"]{cursor:progress}'
  ].join('\n'));

  var VARIANTS = { primary: 1, secondary: 1, destructive: 1, clear: 1 };
  var warned = {};
  NS.Button = R.forwardRef(function Button(p, ref) {
    var variant = p.variant === 'alert' ? 'destructive' : (VARIANTS[p.variant] ? p.variant : 'primary');
    var size = { md: 'md', sm: 'sm', xs: 'xs', lg: 'md' }[p.size] || 'md';
    var disabled = !!p.disabled, loading = !!p.loading;
    var label = p.label != null ? p.label : p.children;
    var iconOnly = !!p.iconOnly;
    if (iconOnly && !p.label && !warned.label) { warned.label = true; console.warn('DSimoles.Button: un botón solo icono necesita label (nombre accesible).'); }
    var iconEl = loading ? h(NS.Spinner, { key: 'i' }) : (p.icon ? h(NS.Icon, { key: 'i', name: p.icon, size: iconOnly ? { md: 'lg', sm: 'md', xs: 'xs' }[size] : (size === 'xs' ? 'xs' : 'md') }) : null);
    var end = p.iconPosition === 'end';
    var text = iconOnly ? null : h('span', { key: 't' }, loading && p.loadingLabel ? p.loadingLabel : label);
    var onClick = function (e) { if (disabled || loading) { e.preventDefault(); return; } if (p.onClick) p.onClick(e); };
    return h('button', {
      ref: ref,
      type: p.type || 'button',
      className: NS.cx('dsm-root dsm-reset dsm-focus dsm-btn', iconOnly && 'dsm-target dsm-btn--icon', 'dsm-btn--' + variant, 'dsm-btn--' + size, !iconOnly && p.width === 'full' && 'dsm-btn--full', p.tone === 'on-dark' && 'dsm-btn--on-dark', NS.state(p.demoState)),
      'aria-label': iconOnly ? p.label : undefined,
      'aria-disabled': disabled || undefined,
      'aria-busy': loading || undefined,
      'aria-expanded': p.expanded == null ? undefined : !!p.expanded,
      'aria-pressed': p.pressed == null ? undefined : !!p.pressed,
      'aria-haspopup': p.haspopup,
      'aria-controls': p.controls,
      onClick: onClick,
      onKeyDown: p.onKeyDown
    }, end ? [text, iconEl] : [iconEl, text]);
  });
})();
