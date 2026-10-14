/* OptionsMenu · 7.7 Revelado y superposición · HF: 1 Base - Menu Opciones
   Patrón menu button: IconButton con aria-haspopup + role="menu". Flechas, Inicio/Fin, Esc y Tab cierran; el foco vuelve al botón.
   items: "icono::Texto::Descripción | …" (icono y descripción opcionales). standalone: solo el panel, para documentar. */
(function () {
  var NS = window.DSimoles, h = NS.h, R = window.React;
  NS.css('options-menu', [
    '.dsm-menuwrap{position:relative;display:inline-flex;flex-shrink:0}',
    '.dsm-menu{min-width:var(--ds-component-menu-min-width);margin:0;padding:0;list-style:none;background:var(--ds-color-bg-surface);border:var(--ds-border-width-thin) solid var(--ds-color-border-emphasis);border-radius:var(--ds-radius-card);box-shadow:var(--ds-component-menu-elevation);overflow:hidden;text-align:left}',
    '.dsm-menuwrap>.dsm-menu{position:absolute;right:0;top:calc(100% + var(--ds-space-1));z-index:20}',
    '.dsm-menu__title{padding:var(--ds-space-3) var(--ds-space-4) var(--ds-space-2);font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;color:var(--ds-color-text-secondary)}',
    '.dsm-menu__item{display:flex;align-items:center;gap:var(--ds-space-3);width:100%;min-height:var(--ds-size-target-min);padding:var(--ds-space-3) var(--ds-space-4);border-top:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);cursor:pointer}',
    '.dsm-menu__item:hover,.dsm-menu__item.is-hover{background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover))}',
    '.dsm-menu__item:active,.dsm-menu__item.is-pressed{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-menu__item:focus-visible,.dsm-menu__item.is-focus{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:calc(var(--ds-focus-ring-width) * -1 - var(--ds-space-half));border-radius:calc(var(--ds-radius-card) - var(--ds-space-1))}',
    '.dsm-menu__icon{color:var(--ds-color-brand-text)}',
    '.dsm-menu__text{display:flex;flex-direction:column;gap:var(--ds-space-half);min-width:0}',
    '.dsm-menu__label{font:var(--ds-type-body);color:var(--ds-color-text-primary)}',
    '.dsm-menu__desc{font:var(--ds-type-small);color:var(--ds-color-text-secondary)}'
  ].join('\n'));

  function parse(items) {
    return NS.list(items).map(function (s) {
      if (typeof s !== 'string') return s;
      var f = NS.fields(s);
      if (f.length > 1 && /^[a-z_]+$/.test(f[0])) return { icon: f[0], label: f[1], description: f[2] };
      return { label: f[0], description: f[1] };
    });
  }

  function Panel(p) {
    var items = parse(p.items);
    return h('div', { id: p.id, role: 'menu', 'aria-labelledby': p.labelledBy, 'aria-label': p.labelledBy ? undefined : p.title, className: 'dsm-root dsm-menu', ref: p.panelRef, onKeyDown: p.onKeyDown },
      p.title ? h('div', { className: 'dsm-menu__title', 'aria-hidden': 'true' }, p.title) : null,
      items.map(function (it, i) {
        return h('button', {
          key: i, type: 'button', role: 'menuitem', tabIndex: -1,
          className: NS.cx('dsm-reset dsm-menu__item', p.demoIndex === i && NS.state(p.demoState)),
          onClick: function () { if (p.onPick) p.onPick(it, i); }
        },
          it.icon && NS.ICONS.indexOf(it.icon) >= 0 ? h(NS.Icon, { name: it.icon, size: 'md', className: 'dsm-menu__icon' }) : null,
          h('span', { className: 'dsm-menu__text' },
            h('span', { className: 'dsm-menu__label' }, it.label),
            it.description ? h('span', { className: 'dsm-menu__desc' }, it.description) : null));
      }));
  }

  NS.OptionsMenu = function OptionsMenu(p) {
    var st = R.useState(!!p.defaultOpen);
    var open = st[0], setOpen = st[1];
    var trigger = R.useRef(null), panel = R.useRef(null), wrap = R.useRef(null);
    var id = NS.useId('menu');
    var focusItem = function (i) {
      var els = panel.current ? panel.current.querySelectorAll('[role="menuitem"]') : [];
      if (!els.length) return;
      els[(i + els.length) % els.length].focus();
    };
    var close = function (refocus) { setOpen(false); if (refocus && trigger.current) trigger.current.focus(); };
    R.useEffect(function () {
      if (!open || p.standalone) return;
      if (!p.defaultOpen || document.activeElement === trigger.current) focusItem(0);
      var onDoc = function (e) { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', onDoc);
      return function () { document.removeEventListener('mousedown', onDoc); };
    }, [open]);
    var onKey = function (e) {
      var els = [].slice.call(panel.current.querySelectorAll('[role="menuitem"]'));
      var i = els.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusItem(0); }
      else if (e.key === 'End') { e.preventDefault(); focusItem(els.length - 1); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') { setOpen(false); }
    };
    var pick = function (it, i) { close(true); if (p.onSelect) p.onSelect(it.label, i); };
    if (p.standalone) return h(Panel, { items: p.items, title: p.title, demoIndex: p.demoIndex, demoState: p.demoState, onPick: function () {} });
    return h('span', { className: 'dsm-root dsm-menuwrap', ref: wrap },
      h(NS.IconButton, {
        ref: trigger, icon: 'more_vert', label: p.triggerLabel || 'Más opciones', haspopup: 'menu', expanded: open, controls: open ? id : undefined,
        onClick: function () { setOpen(!open); },
        onKeyDown: function (e) { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true); } }
      }),
      open ? h(Panel, { id: id, items: p.items, title: p.title, panelRef: panel, onKeyDown: onKey, onPick: pick }) : null);
  };
})();
