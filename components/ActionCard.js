/* ActionCard · 9.6 (iMoles) · HF: 2 Entidad - Accion (formatos lista, bloque y contexto)
   Algo que la persona tiene que hacer. Ejecutable (pendiente o vencida): relleno de acción.
   Color (tasks de adopción): action.primary para todas; action.alert solo para pedir cita presencial (riesgo alto). */
(function () {
  var NS = window.DSimoles, h = NS.h;
  var MES = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
  var DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  NS.weekdayDate = function (d) {
    var m = /^(\d{1,2}) ([a-z]{3}) (\d{4})$/.exec(d || '');
    if (!m || MES[m[2]] == null) return d || '';
    return DIA[new Date(+m[3], MES[m[2]], +m[1]).getDay()] + ' ' + d;
  };
  NS.css('action-card', [
    '.dsm-action{display:flex;align-items:center;gap:var(--ds-space-3);width:100%;border-radius:var(--ds-radius-card);text-align:left;color:var(--ds-color-text-primary)}',
    '.dsm-action--list{padding:var(--ds-space-3) var(--ds-space-4)}',
    '.dsm-action--block{padding:var(--ds-space-4)}',
    '.dsm-action--read{background:var(--ds-color-bg-surface);border:var(--ds-border-width-thin) solid var(--ds-color-border-subtle)}',
    '.dsm-action--block.dsm-action--read{border:var(--ds-border-width-thick) solid var(--ds-color-border-emphasis)}',
    'button.dsm-action--read,a.dsm-action--read{box-shadow:var(--ds-elevation-interactive);cursor:pointer}',
    'button.dsm-action--read:hover,button.dsm-action--read.is-hover{background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover))}',
    'button.dsm-action--read:active,button.dsm-action--read.is-pressed{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-action--primary,.dsm-action--alert{color:var(--ds-color-text-inverse);box-shadow:var(--ds-elevation-interactive-solid);cursor:pointer;border:0}',
    '.dsm-action--primary{background:var(--ds-color-action-primary)}',
    '.dsm-action--primary:hover,.dsm-action--primary.is-hover{background:var(--ds-color-action-primary-hover)}',
    '.dsm-action--primary:active,.dsm-action--primary.is-pressed{background:var(--ds-color-action-primary-pressed)}',
    '.dsm-action--alert{background:var(--ds-color-action-alert)}',
    '.dsm-action--alert:hover,.dsm-action--alert.is-hover{background:var(--ds-color-action-alert-hover)}',
    '.dsm-action--alert:active,.dsm-action--alert.is-pressed{background:var(--ds-color-action-alert-pressed)}',
    '.dsm-action__body{flex:1;min-width:0;display:flex;flex-direction:column;gap:var(--ds-space-1)}',
    '.dsm-action__top{display:flex;justify-content:space-between;align-items:center;gap:var(--ds-space-2)}',
    '.dsm-action__date{min-width:0;font:var(--ds-type-caption);font-weight:500}',
    '.dsm-action__title{font:var(--ds-type-label)}',
    '.dsm-action__btitle{font:var(--ds-component-button-label);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase}',
    '.dsm-action__support{font:var(--ds-type-caption)}',
    '.dsm-action__reason{font:var(--ds-type-small)}',
    '.dsm-action--read .dsm-action__support,.dsm-action--read .dsm-action__reason{color:var(--ds-color-text-body)}',
    '.dsm-action__chev{color:inherit}',
    '.dsm-action--read .dsm-action__chev{color:var(--ds-color-icon-inactive)}',
    '.dsm-actx{display:flex;flex-direction:column;gap:var(--ds-space-3);padding:var(--ds-space-4);border:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-card);background:var(--ds-color-bg-surface);box-shadow:var(--ds-elevation-interactive)}',
    '.dsm-actx__link{display:flex;align-items:center;gap:var(--ds-space-3);width:100%;text-align:left;cursor:pointer;border-radius:var(--ds-radius-sm)}',
    '.dsm-actx__link:hover .dsm-actx__title{text-decoration:underline;text-underline-offset:3px}',
    '.dsm-actx__text{flex:1;min-width:0;display:flex;flex-direction:column;gap:var(--ds-space-half)}',
    '.dsm-actx__title{font:var(--ds-type-label);color:var(--ds-color-text-primary)}',
    '.dsm-actx__loc{font:var(--ds-type-small);color:var(--ds-color-text-secondary)}',
    '.dsm-actx__status{display:flex;align-items:center;gap:var(--ds-space-2)}'
  ].join('\n'));

  var STATUS = { upcoming: 'Próxima', pending: 'Pendiente', overdue: 'Vencida', 'in-progress': 'En curso', archived: 'Archivada' };
  NS.ACTION_TYPES = {
    'book-in-person': { title: 'Pedir cita presencial', support: 'Pide cita lo antes posible en tu centro de salud' },
    'request-remote': { title: 'Consulta telemática', support: 'Un profesional revisará las fotos de este seguimiento y te enviará su valoración.' },
    'read-report': { title: 'Leer el informe del profesional', support: 'El informe queda en la documentación del seguimiento' },
    'take-photo': { title: 'Hacer una nueva foto', support: 'Abre la cámara con el encuadre guardado' },
    'first-photo': { title: 'Hacer la primera foto', support: 'Será la referencia de este seguimiento' },
    'annual-review': { title: 'Acudir a la revisión anual', support: 'Revisión de tu plan preventivo' }
  };

  function model(p) {
    var type = NS.ACTION_TYPES[p.type] ? p.type : 'book-in-person';
    var status = STATUS[p.status] ? p.status : 'overdue';
    var exec = status === 'pending' || status === 'overdue';
    var t = NS.ACTION_TYPES[type];
    var date = p.date || '';
    var dateText = NS.weekdayDate(date);
    if (status === 'overdue') dateText = 'Límite ' + date;
    else if (status === 'pending') dateText = NS.weekdayDate(date);
    else if (status === 'in-progress' && type === 'request-remote') dateText = 'Respuesta antes del ' + date;
    var support = p.support || t.support;
    if (status === 'archived') support = 'De un análisis anterior. Las acciones vigentes son las del último análisis.';
    else if (!exec && type === 'take-photo') support = 'Te avisaremos ese día para hacer la foto';
    return {
      type: type, status: status, exec: exec, title: p.title || t.title, support: support, date: date, dateText: dateText,
      fill: exec ? (type === 'book-in-person' ? 'alert' : 'primary') : 'read',
      statusText: STATUS[status],
      reason: p.reason ? ((p.reasonType === 'preventive' ? 'Motivo · Plan preventivo' : 'Motivo · Seguimiento') + ': ' + p.reason) : ''
    };
  }

  /* Chip sobre el relleno de la tarjeta: tono on-fill de la base; el color del texto lo pone este componente de producto. */
  NS.css('action-card-chip', '.dsm-chip.dsm-action__chip--alert{color:var(--ds-color-risk-high-text)}.dsm-chip.dsm-action__chip--brand{color:var(--ds-color-brand-text)}');
  function chip(m) {
    if (m.exec) return h(NS.StatusChip, { tone: 'on-fill', label: m.statusText, className: m.fill === 'alert' ? 'dsm-action__chip--alert' : 'dsm-action__chip--brand' });
    return h(NS.StatusChip, { tone: m.status === 'upcoming' ? 'info' : 'neutral', label: m.statusText });
  }

  function interactive(tag, cls, p, kids) {
    if (p.href) return h('a', { className: cls, href: p.href, onClick: p.onClick, style: { textDecoration: 'none' } }, kids);
    return h('button', { type: 'button', className: cls, onClick: p.onClick }, kids);
  }

  function List(p, m) {
    var cls = NS.cx('dsm-root dsm-reset dsm-focus dsm-action dsm-action--list', 'dsm-action--' + m.fill, NS.state(p.demoState));
    return interactive('button', cls, p, [
      h('span', { key: 'b', className: 'dsm-action__body' },
        h('span', { className: 'dsm-action__top' }, h('span', { className: 'dsm-action__date' }, m.dateText), chip(m)),
        h('span', { className: 'dsm-action__title' }, m.title),
        m.reason ? h('span', { className: 'dsm-action__reason' }, m.reason) : null),
      h(NS.Icon, { key: 'c', name: 'chevron_right', size: m.exec ? 'lg' : 'md', className: 'dsm-action__chev' })
    ]);
  }

  function Block(p, m) {
    var body = h('span', { key: 'b', className: 'dsm-action__body' },
      m.exec ? null : h(NS.StatusChip, { tone: m.status === 'upcoming' ? 'info' : 'neutral', label: m.status === 'upcoming' && m.date ? 'Próxima · ' + m.date : (m.status === 'in-progress' && p.sentDate ? 'Enviada el ' + p.sentDate : m.statusText) }),
      h('span', { className: 'dsm-action__btitle' }, m.title),
      h('span', { className: 'dsm-action__support' }, m.support));
    if (!m.exec) return h('div', { className: 'dsm-root dsm-action dsm-action--block dsm-action--read' }, body);
    var cls = NS.cx('dsm-root dsm-reset dsm-focus dsm-action dsm-action--block', 'dsm-action--' + m.fill, NS.state(p.demoState));
    return interactive('button', cls, p, [body, h(NS.Icon, { key: 'c', name: 'chevron_right', size: 'lg', className: 'dsm-action__chev' })]);
  }

  function Context(p, m) {
    var level = p.level || 'high';
    var badge = { high: 'Riesgo estimado alto · consulta preferente', medium: 'Riesgo estimado intermedio', low: 'Riesgo estimado bajo' }[level];
    return h('div', { className: 'dsm-root dsm-actx' },
      h('button', { type: 'button', className: 'dsm-reset dsm-focus dsm-actx__link', onClick: p.onOpenFollowUp },
        h('span', { className: 'dsm-actx__text' },
          h('span', { className: 'dsm-actx__title' }, p.followUpTitle),
          p.followUpLocation ? h('span', { className: 'dsm-actx__loc' }, p.followUpLocation) : null),
        h(NS.Icon, { name: 'chevron_right', size: 'md', className: 'dsm-chevron' })),
      h(NS.RiskBadge, { level: level, label: badge, size: 'inline' }),
      p.rows ? h(NS.Disclosure, { rows: p.rows }) : null,
      h('div', { className: 'dsm-actx__status' },
        h(NS.StatusChip, { tone: m.exec ? (m.fill === 'alert' ? 'error' : 'info') : 'neutral', label: m.statusText }),
        h('span', { className: 'dsm-action__date' }, m.dateText)),
      Block(Object.assign({}, p, { demoState: null }), m));
  }

  NS.ActionCard = function ActionCard(p) {
    var m = model(p);
    var f = p.format || 'list';
    if (f === 'block') return Block(p, m);
    if (f === 'context') return Context(p, m);
    return List(p, m);
  };
})();
