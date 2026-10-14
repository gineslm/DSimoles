/* ListRow · 7.4 Presentación · HF: 1 Base - Fila Lista
   Slot inicial: miniatura o vacío. Slot final: chevron (la fila entera es interactiva), botón (solo el botón lo es) o nada. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('list-row', [
    '.dsm-row{display:flex;align-items:stretch;gap:var(--ds-space-3);width:100%;padding:var(--ds-space-2);border:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-card);background:var(--ds-color-bg-surface);text-align:left;color:var(--ds-color-text-primary)}',
    '.dsm-row--interactive{box-shadow:var(--ds-elevation-interactive);cursor:pointer;text-decoration:none}',
    '.dsm-row--interactive:hover,.dsm-row--interactive.is-hover{background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover))}',
    '.dsm-row--interactive:active,.dsm-row--interactive.is-pressed{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-row__body{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:var(--ds-space-half);padding-block:var(--ds-space-1)}',
    '.dsm-row--no-thumb .dsm-row__body{padding-left:var(--ds-space-2)}',
    '.dsm-row__title{font:var(--ds-type-label);color:var(--ds-color-text-primary)}',
    '.dsm-row__subtitle{font:var(--ds-type-small);color:var(--ds-color-text-secondary)}',
    '.dsm-row__end{flex-shrink:0;align-self:center;display:flex;align-items:center;padding-right:var(--ds-space-1)}',
    '.dsm-row__end--button{width:auto}',
    /* ListGroup: filas agrupadas en una card; una sola sombra, filas sin borde, radio ni sombra, separadas por border.subtle */
    '.dsm-lgroup{width:100%;border:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-card);background:var(--ds-color-bg-surface);box-shadow:var(--ds-elevation-interactive);overflow:hidden}',
    '.dsm-lgroup__head{display:flex;align-items:center;justify-content:space-between;gap:var(--ds-space-3);min-height:var(--ds-size-control-md);padding:var(--ds-space-2) var(--ds-space-4);border-bottom:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);background:var(--ds-color-bg-tint)}',
    '.dsm-lgroup__title{margin:0;font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;color:var(--ds-color-text-secondary)}',
    '.dsm-lgroup__list{list-style:none;margin:0;padding:0}',
    '.dsm-lgroup__item+.dsm-lgroup__item{border-top:var(--ds-border-width-thin) solid var(--ds-color-border-subtle)}',
    '.dsm-lgroup .dsm-row{border:0;border-radius:0;box-shadow:none}',
    '.dsm-lgroup .dsm-row:focus-visible,.dsm-lgroup .dsm-row.is-focus{outline-offset:calc(var(--ds-focus-ring-width) * -1)}'
  ].join('\n'));

  NS.ListRow = function ListRow(p) {
    var end = p.end || 'chevron';
    var thumb = p.thumb === false || p.thumb === 'none' ? null : h(NS.Thumb, { src: p.image, size: p.thumbSize || 'lg' });
    var interactive = end !== 'button' && p.interactive !== false;
    var body = h('span', { className: 'dsm-row__body' },
      h('span', { className: 'dsm-row__title' }, p.title),
      p.subtitle ? h('span', { className: 'dsm-row__subtitle' }, p.subtitle) : null);
    var endEl = null;
    if (end === 'chevron') endEl = h('span', { className: 'dsm-row__end dsm-chevron' }, h(NS.Icon, { name: 'chevron_right', size: 'md' }));
    if (end === 'button') endEl = h('span', { className: 'dsm-row__end dsm-row__end--button' }, h(NS.Button, { variant: p.buttonVariant || 'secondary', size: 'md', width: 'auto', label: p.endLabel || 'Elegir', onClick: p.onClick }));
    var cls = NS.cx('dsm-root dsm-row', interactive && 'dsm-reset dsm-focus dsm-row--interactive', !thumb && 'dsm-row--no-thumb', interactive && NS.state(p.demoState));
    var kids = [thumb, body, endEl];
    if (!interactive) return h('div', { className: cls }, kids);
    if (p.href) return h('a', { className: cls, href: p.href, onClick: p.onClick }, kids);
    return h('button', { type: 'button', className: cls, onClick: p.onClick }, kids);
  };

  /* ListGroup · filas agrupadas en una card con cabecera opcional (título + acción xs). ul/li; el título nombra la lista. */
  NS.ListGroup = function ListGroup(p) {
    var R = window.React;
    var id = R.useId ? R.useId() : 'lg';
    var head = p.title ? h('div', { className: 'dsm-lgroup__head' },
      h('h3', { id: id, className: 'dsm-lgroup__title' }, p.title),
      p.actionLabel ? h(NS.Button, { variant: 'secondary', size: 'xs', width: 'auto', icon: p.actionIcon, label: p.actionLabel, onClick: p.onAction }) : null) : null;
    var items = p.rows ? p.rows.map(function (r, i) { return h(NS.ListRow, Object.assign({ key: i }, r)); }) : R.Children.toArray(p.children);
    return h('div', { className: 'dsm-root dsm-lgroup' }, head,
      h('ul', { className: 'dsm-lgroup__list', 'aria-labelledby': p.title ? id : undefined, 'aria-label': p.title ? undefined : p.label },
        items.map(function (c, i) { return h('li', { key: i, className: 'dsm-lgroup__item' }, c); })));
  };
})();
