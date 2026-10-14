/* InlineAlert · 7.6 Feedback · HF: 1 Base - Aviso Inline («ubicación incompleta» 3.3, «marcas cercanas» 3.5)
   La etiqueta nombra el tipo («Aviso · …», «Error · …»): el color no es la única señal.
   live: off (el aviso está desde que carga la pantalla) | polite | assertive (aparece después de una acción). */
(function () {
  var NS = window.DSimoles, h = NS.h;
  var T = { warning: 'warning', error: 'error', info: 'info' };
  NS.css('inline-alert', [
    '.dsm-alert{display:flex;flex-direction:column;gap:var(--ds-space-1);padding:var(--ds-space-3) var(--ds-space-4);border-radius:var(--ds-radius-card)}',
    '.dsm-alert__label{font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase}',
    '.dsm-alert__text{margin:0;font:var(--ds-type-body)}',
    '.dsm-alert--warning{background:var(--ds-color-status-warning-tint)}.dsm-alert--warning .dsm-alert__label{color:var(--ds-color-status-warning-text)}.dsm-alert--warning .dsm-alert__text{color:var(--ds-color-status-warning-body)}',
    '.dsm-alert--error{background:var(--ds-color-status-error-tint)}.dsm-alert--error .dsm-alert__label{color:var(--ds-color-status-error-text)}.dsm-alert--error .dsm-alert__text{color:var(--ds-color-status-error-body)}',
    '.dsm-alert--info{background:var(--ds-color-status-info-tint)}.dsm-alert--info .dsm-alert__label,.dsm-alert--info .dsm-alert__text{color:var(--ds-color-status-info-text)}'
  ].join('\n'));

  NS.InlineAlert = function InlineAlert(p) {
    var type = T[p.type] || 'warning';
    var live = p.live || 'off';
    var role = live === 'assertive' ? 'alert' : (live === 'polite' ? 'status' : undefined);
    return h('div', { className: NS.cx('dsm-root dsm-alert', 'dsm-alert--' + type), role: role },
      h('span', { className: 'dsm-alert__label' }, p.label || { warning: 'Aviso', error: 'Error', info: 'Información' }[type]),
      h('p', { className: 'dsm-alert__text' }, p.text != null ? p.text : p.children));
  };
})();
