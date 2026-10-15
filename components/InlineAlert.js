/* Fb-InlineAlert · 7.20 · HF: 1 Base - Aviso Inline
   Mensaje contextual: error, warning, info o success (añadido el 2026-10-15). Sin botón de cerrar ni icono.
   El error de un campo concreto va en Form-Field; InlineAlert es para avisos de zona o el resumen de errores.
   La etiqueta nombra el tipo («Aviso · …», «Error · …»): el color no es la única señal.
   Borde de 1 px con el color de la etiqueta del tipo (status.*.text), como Vis-Chip (2026-10-15).
   solid (2026-10-15): relleno status.*.fill (info: brand.primary) con etiqueta y texto en text.inverse; borde del color del relleno.
   live: off (el aviso está desde que carga la pantalla) | polite | assertive (aparece después de una acción). */
(function () {
  var NS = window.DSimoles, h = NS.h;
  var T = { warning: 'warning', error: 'error', info: 'info', success: 'success' };
  NS.css('inline-alert', [
    '.dsm-alert{display:flex;flex-direction:column;gap:var(--ds-space-1);padding:var(--ds-space-3) var(--ds-space-4);border:var(--ds-border-width-thin) solid transparent;border-radius:var(--ds-radius-card)}',
    '.dsm-alert__label{font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase}',
    '.dsm-alert__text{margin:0;font:var(--ds-type-body)}',
    '.dsm-alert--warning{background:var(--ds-color-status-warning-tint);border-color:var(--ds-color-status-warning-text)}.dsm-alert--warning .dsm-alert__label{color:var(--ds-color-status-warning-text)}.dsm-alert--warning .dsm-alert__text{color:var(--ds-color-status-warning-body)}',
    '.dsm-alert--error{background:var(--ds-color-status-error-tint);border-color:var(--ds-color-status-error-text)}.dsm-alert--error .dsm-alert__label{color:var(--ds-color-status-error-text)}.dsm-alert--error .dsm-alert__text{color:var(--ds-color-status-error-body)}',
    '.dsm-alert--success{background:var(--ds-color-status-success-tint);border-color:var(--ds-color-status-success-text)}.dsm-alert--success .dsm-alert__label{color:var(--ds-color-status-success-text)}.dsm-alert--success .dsm-alert__text{color:var(--ds-color-status-success-body)}',
    '.dsm-alert--info{background:var(--ds-color-status-info-tint);border-color:var(--ds-color-status-info-text)}.dsm-alert--info .dsm-alert__label,.dsm-alert--info .dsm-alert__text{color:var(--ds-color-status-info-text)}',
    '.dsm-alert--solid .dsm-alert__label,.dsm-alert--solid .dsm-alert__text{color:var(--ds-color-text-inverse)}',
    '.dsm-alert--solid.dsm-alert--warning{background:var(--ds-color-status-warning-fill);border-color:var(--ds-color-status-warning-fill)}',
    '.dsm-alert--solid.dsm-alert--error{background:var(--ds-color-status-error-fill);border-color:var(--ds-color-status-error-fill)}',
    '.dsm-alert--solid.dsm-alert--success{background:var(--ds-color-status-success-fill);border-color:var(--ds-color-status-success-fill)}',
    '.dsm-alert--solid.dsm-alert--info{background:var(--ds-color-brand-primary);border-color:var(--ds-color-brand-primary)}'
  ].join('\n'));

  NS.InlineAlert = function InlineAlert(p) {
    var type = T[p.type] || 'warning';
    var live = p.live || 'off';
    var role = live === 'assertive' ? 'alert' : (live === 'polite' ? 'status' : undefined);
    return h('div', { className: NS.cx('dsm-root dsm-alert', 'dsm-alert--' + type, p.solid && 'dsm-alert--solid'), role: role },
      h('span', { className: 'dsm-alert__label' }, p.label || { warning: 'Aviso', error: 'Error', info: 'Información', success: 'Hecho' }[type]),
      h('p', { className: 'dsm-alert__text' }, p.text != null ? p.text : p.children));
  };
})();
