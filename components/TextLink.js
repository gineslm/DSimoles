/* TextLink · 7.1 Acciones · HF: «Ver el análisis ›» en 2 Entidad - Accion (detalle) */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('text-link', [
    '.dsm-link{display:inline-flex;align-items:center;gap:var(--ds-space-1);min-height:var(--ds-size-icon-lg);font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;color:var(--ds-color-link-default);text-decoration:none;cursor:pointer;border-radius:var(--ds-radius-xs)}',
    '.dsm-link:hover,.dsm-link.is-hover{color:var(--ds-color-link-hover);text-decoration:underline;text-underline-offset:3px}',
    '.dsm-link:active,.dsm-link.is-pressed{color:var(--ds-color-link-pressed)}'
  ].join('\n'));

  NS.TextLink = function TextLink(p) {
    var cls = NS.cx('dsm-root dsm-reset dsm-focus dsm-target dsm-link', NS.state(p.demoState));
    var kids = [h('span', { key: 't' }, p.label != null ? p.label : p.children)];
    if (p.icon !== 'none') kids.push(h(NS.Icon, { key: 'i', name: p.icon || 'chevron_right', size: 'xs' }));
    if (p.href) return h('a', { className: cls, href: p.href, onClick: p.onClick }, kids);
    return h('button', { type: 'button', className: cls, onClick: p.onClick }, kids);
  };
})();
