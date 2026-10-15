/* Vis-Chip · 7.3 · nuevo el 2026-10-15; reúne Data-StatusChip y Data-FilterChips (decisión del owner, 2026-10-15).
   Valor breve en forma de pastilla, en caja normal, con el ancho de su contenido. Dos usos distintos:
   estático (no recibe foco; lleva siempre un tono de 1.1: info (por defecto) · success · warning · error · unknown · on-fill; sin tono neutral desde el 2026-10-15) y
   Borde sólido de 1 px con el color del tono (texto del estado; neutro: border.control.hover) para que la forma se lea sobre el fondo; el foco es un anillo exterior.
   eliminable (sin tono), p. ej. valores elegidos o filtros activos: al quitarlo desaparece.
   removable: icono close detrás del valor; el área interactiva es la x («Quitar {valor}», onRemove),
   pero hover, pressed, focus y disabled se pintan en todo el chip (el anillo de foco rodea el chip).
   El foco tras quitar un chip lo coordina el patrón (8.3): al siguiente, al anterior o al campo de origen.
   solid (2026-10-15): relleno sólido con text.inverse. Estático: status.*.fill (info: brand.primary).
   Eliminable: brand.primary; hover y pressed oscurecen el relleno (brand-700 y brand-800) para mantener el texto blanco ≥ 4,5:1. No aplica a on-fill. */
(function () {
  var NS = window.DSimoles, h = NS.h, R = window.React;
  NS.css('chip', [
    '.dsm-vchip{display:inline-flex;align-items:center;gap:var(--ds-space-1);width:fit-content;max-width:100%;min-height:var(--ds-size-control-xs);padding:var(--ds-space-1) var(--ds-space-3);border:var(--ds-border-width-thin) solid var(--ds-color-border-control-hover);border-radius:var(--ds-radius-pill);background:var(--ds-color-chip-neutral-bg);color:var(--ds-color-text-body);font:var(--ds-type-small)}',
    '.dsm-vchip--removable{padding-right:var(--ds-space-1)}',
    '.dsm-vchip__text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.dsm-vchip__x{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:24px;height:24px;border-radius:var(--ds-radius-pill);color:inherit;cursor:pointer}',
    '.dsm-vchip__x:focus{outline:none}',
    '.dsm-vchip--removable:has(.dsm-vchip__x:hover),.dsm-vchip.is-hover{background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover))}',
    '.dsm-vchip--removable:has(.dsm-vchip__x:active),.dsm-vchip.is-pressed{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-vchip--removable:has(.dsm-vchip__x:focus-visible),.dsm-vchip.is-focus{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}',
    '.dsm-vchip--info{background:var(--ds-color-status-info-tint);border-color:var(--ds-color-status-info-text);color:var(--ds-color-status-info-text)}',
    '.dsm-vchip--success{background:var(--ds-color-status-success-tint);border-color:var(--ds-color-status-success-text);color:var(--ds-color-status-success-text)}',
    '.dsm-vchip--warning{background:var(--ds-color-status-warning-tint);border-color:var(--ds-color-status-warning-text);color:var(--ds-color-status-warning-text)}',
    '.dsm-vchip--error{background:var(--ds-color-status-error-tint);border-color:var(--ds-color-status-error-text);color:var(--ds-color-status-error-text)}',
    '.dsm-vchip--unknown{background:var(--ds-color-status-unknown-tint);border-color:var(--ds-color-status-unknown-text);color:var(--ds-color-status-unknown-text)}',
    '.dsm-vchip--on-fill{background:var(--ds-color-bg-surface);border-color:transparent;color:var(--ds-color-text-primary)}',
    '.dsm-vchip--solid{background:var(--ds-color-brand-primary);border-color:var(--ds-color-brand-primary);color:var(--ds-color-text-inverse)}',
    '.dsm-vchip--solid.dsm-vchip--success{background:var(--ds-color-status-success-fill);border-color:var(--ds-color-status-success-fill);color:var(--ds-color-text-inverse)}',
    '.dsm-vchip--solid.dsm-vchip--warning{background:var(--ds-color-status-warning-fill);border-color:var(--ds-color-status-warning-fill);color:var(--ds-color-text-inverse)}',
    '.dsm-vchip--solid.dsm-vchip--error{background:var(--ds-color-status-error-fill);border-color:var(--ds-color-status-error-fill);color:var(--ds-color-text-inverse)}',
    '.dsm-vchip--solid.dsm-vchip--unknown{background:var(--ds-color-status-unknown-fill);border-color:var(--ds-color-status-unknown-fill);color:var(--ds-color-text-inverse)}',
    '.dsm-vchip--solid.dsm-vchip--removable:has(.dsm-vchip__x:hover),.dsm-vchip--solid.is-hover{background-image:none;background-color:var(--ds-color-brand-700);border-color:var(--ds-color-brand-700)}',
    '.dsm-vchip--solid.dsm-vchip--removable:has(.dsm-vchip__x:active),.dsm-vchip--solid.is-pressed{background-image:none;background-color:var(--ds-color-brand-800);border-color:var(--ds-color-brand-800)}',
    '.dsm-vchip--solid.dsm-vchip--disabled{background:var(--ds-color-disabled-bg);border-color:var(--ds-color-disabled-bg);color:var(--ds-color-disabled-text)}',
    '.dsm-vchip--disabled{background:none;border-color:var(--ds-color-disabled-bg);color:var(--ds-color-disabled-text)}',
    '.dsm-vchip--disabled .dsm-vchip__x{cursor:not-allowed}'
  ].join('\n'));

  var TONES = { info: 1, success: 1, warning: 1, error: 1, unknown: 1, 'on-fill': 1 };
  NS.CHIP_TONES = Object.keys(TONES);
  NS.Chip = R.forwardRef(function Chip(p, ref) {
    var label = p.label != null ? p.label : p.children;
    var removable = !!p.removable;
    var disabled = !!p.disabled;
    var tone = removable ? null : (TONES[p.tone] ? p.tone : 'info');
    var solid = !!p.solid && tone !== 'on-fill';
    return h('span', { className: NS.cx('dsm-root dsm-vchip', tone && 'dsm-vchip--' + tone, solid && 'dsm-vchip--solid', p.className, removable && 'dsm-vchip--removable', disabled && 'dsm-vchip--disabled', removable && !disabled && NS.state(p.demoState)), title: typeof label === 'string' ? label : undefined },
      h('span', { className: 'dsm-vchip__text' }, label),
      removable ? h('button', {
        ref: ref, type: 'button',
        className: 'dsm-reset dsm-target dsm-vchip__x',
        'aria-label': (p.removeLabel || 'Quitar') + ' ' + (typeof label === 'string' ? label : ''),
        'aria-disabled': disabled || undefined,
        onClick: function (e) { if (disabled) return; if (p.onRemove) p.onRemove(e); }
      }, h(NS.Icon, { name: 'close', size: 'xs' })) : null);
  });
})();
