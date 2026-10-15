/* FollowUpHeader · 9.4 (iMoles) · HF: 2 Entidad - Cabecera Seguimiento
   Título de la pantalla de un seguimiento con su ubicación, sus datos y el menú de opciones. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('follow-up-header', [
    '.dsm-fhead{display:flex;flex-direction:column;gap:var(--ds-space-1)}',
    '.dsm-fhead__top{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--ds-space-3)}',
    '.dsm-fhead__title{margin:0;flex:1;min-width:0;font:var(--ds-type-title);color:var(--ds-color-text-primary)}',
    '.dsm-fhead__loc{font:var(--ds-type-body);color:var(--ds-color-text-body)}',
    '.dsm-fhead__meta{font:var(--ds-type-caption);color:var(--ds-color-text-secondary)}'
  ].join('\n'));

  NS.FollowUpHeader = function FollowUpHeader(p) {
    var Tag = 'h' + (p.headingLevel || 1);
    var menu = p.menuItems ? h(NS.OptionsMenu, { title: p.menuTitle || 'Opciones del seguimiento', items: p.menuItems, triggerLabel: p.menuLabel || 'Opciones del seguimiento', onSelect: p.onSelect }) : null;
    return h('div', { className: 'dsm-root dsm-fhead' },
      h('div', { className: 'dsm-fhead__top' }, h(Tag, { className: 'dsm-fhead__title' }, p.title), menu),
      p.location ? h('span', { className: 'dsm-fhead__loc' }, p.location) : null,
      p.meta ? h('span', { className: 'dsm-fhead__meta' }, p.meta) : null);
  };
})();
