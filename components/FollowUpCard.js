/* FollowUpCard · 9.5 (iMoles) · HF: 2 Entidad - Tarjeta Seguimiento
   Un seguimiento en una lista: foto, nombre de la marca · ubicación, fotos y nivel de riesgo del último análisis. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('follow-up-card', [
    '.dsm-fcard{display:flex;align-items:stretch;gap:var(--ds-space-3);width:100%;padding:var(--ds-space-2);border:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-card);background:var(--ds-color-bg-surface);text-align:left;color:var(--ds-color-text-primary)}',
    '.dsm-fcard .dsm-thumb{border-radius:calc(var(--ds-radius-card) - var(--ds-space-2))}',
    '.dsm-fcard--interactive,.dsm-fcard--raised{box-shadow:var(--ds-elevation-interactive)}',
    '.dsm-fcard--interactive{cursor:pointer;text-decoration:none}',
    '.dsm-fcard--interactive:hover,.dsm-fcard--interactive.is-hover{background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover))}',
    '.dsm-fcard--interactive:active,.dsm-fcard--interactive.is-pressed{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-fcard__body{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:var(--ds-space-1);padding-block:var(--ds-space-1)}',
    '.dsm-fcard__line{font:var(--ds-type-small);color:var(--ds-color-text-secondary)}',
    '.dsm-fcard__title{font:var(--ds-type-label);color:var(--ds-color-text-primary)}',
    '.dsm-fcard__meta{display:flex;align-items:center;gap:var(--ds-space-2)}',
    '.dsm-fcard__info{color:var(--ds-color-brand-text)}',
    '.dsm-fcard__end{align-self:center;padding-right:var(--ds-space-1);color:var(--ds-color-brand-primary)}'
  ].join('\n'));

  NS.FollowUpCard = function FollowUpCard(p) {
    var interactive = p.interactive !== false;
    var meta = null;
    if (p.level) meta = h(NS.RiskBadge, { level: p.level, label: p.meta, size: 'inline' });
    else if (p.meta) meta = h(NS.StatusChip, { tone: 'neutral', label: p.meta });
    var body = h('span', { className: 'dsm-fcard__body' },
      h('span', { className: 'dsm-fcard__line' }, h('span', { className: 'dsm-fcard__title' }, p.title), p.location ? ' · ' + p.location : null),
      p.subtitle ? h('span', { className: 'dsm-fcard__line' }, p.subtitle) : null,
      meta ? h('span', { className: 'dsm-fcard__meta' }, meta, p.info ? h(NS.Icon, { name: 'info', size: 'xs', className: 'dsm-fcard__info', label: p.infoLabel || 'Tiene información sobre la primera foto' }) : null) : null);
    var kids = [h(NS.Thumb, { key: 't', src: p.image, size: p.size || 'lg' }), h(R_Fragment, { key: 'b' }, body)];
    if (interactive) kids.push(h('span', { key: 'e', className: 'dsm-fcard__end' }, h(NS.Icon, { name: 'chevron_right', size: 'md' })));
    var cls = NS.cx('dsm-root dsm-fcard', interactive && 'dsm-reset dsm-focus dsm-fcard--interactive', !interactive && p.raised && 'dsm-fcard--raised', interactive && NS.state(p.demoState));
    if (!interactive) return h('div', { className: cls }, kids);
    if (p.href) return h('a', { className: cls, href: p.href, onClick: p.onClick }, kids);
    return h('button', { type: 'button', className: cls, onClick: p.onClick }, kids);
  };
  var R_Fragment = window.React.Fragment;
})();
