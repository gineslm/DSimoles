/* BottomNav y BottomNavItem · 7.5 Navegación · HF: 1 Base - Navegacion Inferior + 1 Base - Tab Boton
   Navegación principal entre las tres secciones. Se oculta dentro de los flujos 3–5 y 8–9 (task de adopción).
   Ubicación actual: aria-current="page" + color + pastilla detrás del icono (señal no cromática). */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('bottom-nav', [
    '.dsm-bnav{display:block;background:var(--ds-color-bg-surface);border-top:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);padding:var(--ds-space-1) var(--ds-space-2) var(--ds-space-2)}',
    '.dsm-bnav__list{display:flex;justify-content:space-around;gap:var(--ds-space-1);margin:0;padding:0;list-style:none}',
    '.dsm-bnav__list>li{flex:1;display:flex;justify-content:center}',
    '.dsm-tab{display:flex;flex-direction:column;align-items:center;gap:var(--ds-space-1);min-width:var(--ds-size-target-min);min-height:var(--ds-size-target-min);padding:var(--ds-space-1) var(--ds-space-2);border-radius:var(--ds-radius-button);color:var(--ds-color-text-secondary);text-decoration:none;cursor:pointer}',
    '.dsm-tab__pill{display:flex;align-items:center;justify-content:center;width:calc(var(--ds-size-icon-lg) + var(--ds-space-5));height:calc(var(--ds-size-icon-lg) + var(--ds-space-1));border-radius:var(--ds-radius-pill)}',
    '.dsm-tab__label{font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase}',
    '.dsm-tab:hover .dsm-tab__pill,.dsm-tab.is-hover .dsm-tab__pill{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-tab[aria-current="page"]{color:var(--ds-color-brand-text)}',
    '.dsm-tab[aria-current="page"] .dsm-tab__pill{background:var(--ds-color-brand-tint);color:var(--ds-color-brand-primary)}'
  ].join('\n'));

  NS.BottomNavItem = function BottomNavItem(p) {
    var cls = NS.cx('dsm-root dsm-reset dsm-focus dsm-tab', NS.state(p.demoState));
    var kids = [h('span', { key: 'p', className: 'dsm-tab__pill' }, h(NS.Icon, { name: p.icon || 'home', size: 'lg' })), h('span', { key: 'l', className: 'dsm-tab__label' }, p.label)];
    var cur = p.active ? 'page' : undefined;
    if (p.href) return h('a', { className: cls, href: p.href, 'aria-current': cur, onClick: p.onClick }, kids);
    return h('button', { type: 'button', className: cls, 'aria-current': cur, onClick: p.onClick }, kids);
  };

  var DEFAULT = 'home::Inicio::home | view_list::Seguimientos::follow-ups | person::Perfil::profile';
  NS.BottomNav = function BottomNav(p) {
    var items = NS.list(p.items || DEFAULT).map(function (s) { var f = NS.fields(s); return { icon: f[0], label: f[1], id: f[2] || f[1] }; });
    var v = NS.useControlled(p.active, p.defaultActive || items[0].id, p.onNavigate);
    return h('nav', { className: 'dsm-root dsm-bnav', 'aria-label': p.label || 'Principal' },
      h('ul', { className: 'dsm-bnav__list' }, items.map(function (it) {
        return h('li', { key: it.id }, h(NS.BottomNavItem, { icon: it.icon, label: it.label, active: it.id === v[0], onClick: function () { v[1](it.id); } }));
      })));
  };
})();
