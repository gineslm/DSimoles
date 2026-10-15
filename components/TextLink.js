/* Nav-TextLink · 7.5 · HF: «Ver el análisis ›» en 2 Entidad - Accion (detalle)
   Navega a una página, una sección o un recurso: href obligatorio (las acciones van en Act-Button clear).
   Sin icono por defecto; icon="chevron_right" para abrir un detalle. external: open_in_new y aviso oculto «(se abre en otra ventana)».
   Los enlaces dentro de texto corrido no usan TextLink: usan el estilo base de a. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('text-link', [
    '.dsm-link{display:inline-flex;align-items:center;gap:var(--ds-space-1);min-height:var(--ds-size-icon-lg);font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;color:var(--ds-color-link-default);text-decoration:none;cursor:pointer;border-radius:var(--ds-radius-xs);padding-inline:var(--ds-space-1);margin-inline:calc(var(--ds-space-1) * -1)}',
    '.dsm-link:hover,.dsm-link.is-hover{color:var(--ds-color-link-hover);text-decoration:underline;text-underline-offset:3px}',
    '.dsm-link:active,.dsm-link.is-pressed{color:var(--ds-color-link-pressed)}'
  ].join('\n'));

  var warned = false;
  NS.TextLink = function TextLink(p) {
    if (!p.href && !warned) { warned = true; console.warn('DSimoles.TextLink: href es obligatorio; para una acción usa Button variant="clear".'); }
    var external = !!p.href && (p.external === true || p.external === 'true');
    var cls = NS.cx('dsm-root dsm-reset dsm-focus dsm-target dsm-link', NS.state(p.demoState));
    var kids = [h('span', { key: 't' }, p.label != null ? p.label : p.children)];
    if (external) kids.push(h('span', { key: 's', className: 'dsm-sr' }, ' (se abre en otra ventana)'));
    var icon = external ? 'open_in_new' : (p.icon && p.icon !== 'none' ? p.icon : null);
    if (icon) kids.push(h(NS.Icon, { key: 'i', name: icon, size: 'xs' }));
    return h('a', Object.assign({ className: cls, href: p.href || undefined, onClick: p.onClick }, external ? { target: '_blank', rel: 'noopener noreferrer' } : {}), kids);
  };
})();
