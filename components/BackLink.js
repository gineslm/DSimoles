/* Nav-BackLink · 7.6 · HF: 1 Base - Nav Volver
   Vuelve a la pantalla anterior y la nombra: label obligatorio (nombre de la pantalla de destino); nombre accesible «Volver: {label}».
   Con href es un enlace; sin href, un botón (volver en el historial). tone on-dark: sobre fondo oscuro o imagen. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('back-link', [
    '.dsm-back{display:inline-flex;align-items:center;gap:var(--ds-space-1);min-height:var(--ds-size-icon-lg);font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;color:var(--ds-color-brand-text);text-decoration:none;cursor:pointer;border-radius:var(--ds-radius-xs);text-align:left;padding-inline:var(--ds-space-1);margin-inline:calc(var(--ds-space-1) * -1)}',
    '.dsm-back:hover,.dsm-back.is-hover{color:var(--ds-color-link-hover)}',
    '.dsm-back:active,.dsm-back.is-pressed{color:var(--ds-color-link-pressed)}',
    '.dsm-back--on-dark{color:var(--ds-component-on-dark-text)}',
    '.dsm-back--on-dark:hover,.dsm-back--on-dark.is-hover{color:var(--ds-color-text-inverse)}',
    '.dsm-back--on-dark:focus-visible,.dsm-back--on-dark.is-focus{outline-color:var(--ds-component-on-dark-text)}'
  ].join('\n'));

  NS.BackLink = function BackLink(p) {
    var cls = NS.cx('dsm-root dsm-reset dsm-focus dsm-target dsm-back', p.tone === 'on-dark' && 'dsm-back--on-dark', NS.state(p.demoState));
    var kids = [h(NS.Icon, { key: 'i', name: 'arrow_back', size: 'xs' }), h('span', { key: 't' }, p.label || 'Atrás')];
    var a11y = p.srPrefix === false ? {} : { 'aria-label': 'Volver: ' + (p.label || 'pantalla anterior') };
    if (p.href) return h('a', Object.assign({ className: cls, href: p.href, onClick: p.onClick }, a11y), kids);
    return h('button', Object.assign({ type: 'button', className: cls, onClick: p.onClick }, a11y), kids);
  };
})();
