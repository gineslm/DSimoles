/* Nav-BottomTab y BottomTabItem · 7.9 (antes Nav-BottomNav; renombrado por el owner el 2026-10-15; BottomNav y BottomNavItem quedan como alias) · HF: 1 Base - Navegacion Inferior + 1 Base - Tab Boton
   Navegación principal entre 3 y 5 destinos de primer nivel en móvil. items obligatorio, sin destinos por defecto.
   items: "icono::Texto::id::href | …" o [{icon, label, id, href}]. Destinos como enlaces (href); botón solo si no hay URL.
   Ubicación actual: aria-current="page", color e icono relleno (2026-10-15): icono y etiqueta pasan juntos de text.secondary a brand.text, sin fondo; el icono relleno es la señal no cromática.
   Icono y etiqueta son una unidad: un único color y un único fondo (hover, pressed) que llega hasta el anillo de foco (offset 0). Cuándo se oculta: patrón 8.6. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('bottom-nav', [
    '.dsm-bnav{display:block;background:var(--ds-color-bg-surface);border-top:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);padding:var(--ds-space-1) var(--ds-space-2) var(--ds-space-2)}',
    '.dsm-bnav__list{display:flex;justify-content:space-around;gap:var(--ds-space-1);margin:0;padding:0;list-style:none}',
    '.dsm-bnav__list>li{flex:1;display:flex;justify-content:center}',
    '.dsm-tab{display:flex;flex-direction:column;align-items:center;width:fit-content;gap:var(--ds-space-1);min-width:var(--ds-size-target-min);min-height:var(--ds-size-target-min);padding:var(--ds-space-1) var(--ds-space-2);border-radius:var(--ds-radius-button);color:var(--ds-color-text-secondary);text-decoration:none;cursor:pointer}',
    '.dsm-tab__pill{display:flex;align-items:center;justify-content:center;width:calc(var(--ds-size-icon-lg) + var(--ds-space-5));height:calc(var(--ds-size-icon-lg) + var(--ds-space-1));color:inherit}',
    '.dsm-tab.dsm-focus:focus-visible,.dsm-tab.dsm-focus.is-focus{outline-offset:0}',
    '.dsm-tab__label{font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase}',
    /* hover y pressed: un solo fondo sobre todo el destino (icono + etiqueta), hasta el anillo de foco */
    '.dsm-tab:hover,.dsm-tab.is-hover{background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover))}',
    '.dsm-tab:active,.dsm-tab.is-pressed{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-tab[aria-current="page"]{color:var(--ds-color-brand-text)}'
  ].join('\n'));

  NS.BottomTabItem = function BottomTabItem(p) {
    var cls = NS.cx('dsm-root dsm-reset dsm-focus dsm-tab', NS.state(p.demoState));
    var kids = [h('span', { key: 'p', className: 'dsm-tab__pill' }, h(NS.Icon, { name: p.icon || 'home', size: 'lg', filled: !!p.active })), h('span', { key: 'l', className: 'dsm-tab__label' }, p.label)];
    var cur = p.active ? 'page' : undefined;
    if (p.href) return h('a', { className: cls, href: p.href, 'aria-current': cur, onClick: p.onClick }, kids);
    return h('button', { type: 'button', className: cls, 'aria-current': cur, onClick: p.onClick }, kids);
  };

  var warned = false;
  NS.BottomTab = function BottomTab(p) {
    if (!p.items && !warned) { warned = true; console.warn('DSimoles.BottomTab: items es obligatorio.'); }
    var items = NS.list(p.items).map(function (s) { if (typeof s !== 'string') return Object.assign({ id: s.label }, s); var f = NS.fields(s); return { icon: f[0], label: f[1], id: f[2] || f[1], href: f[3] }; });
    var v = NS.useControlled(p.active, p.defaultActive || (items[0] || {}).id, p.onNavigate);
    if (!items.length) return null;
    return h('nav', { className: 'dsm-root dsm-bnav', 'aria-label': p.label || 'Principal' },
      h('ul', { className: 'dsm-bnav__list' }, items.map(function (it) {
        return h('li', { key: it.id }, h(NS.BottomTabItem, { icon: it.icon, label: it.label, href: it.href, active: it.id === v[0], onClick: function () { v[1](it.id); } }));
      })));
  };
  NS.BottomNav = NS.BottomTab;
  NS.BottomNavItem = NS.BottomTabItem;
})();
