/* Data-StatusChip · alias temporal de Vis-Chip (7.3) estático con tono, unificado el 2026-10-15. Requiere Chip.js.
   Tonos antiguos de iMoles (upcoming, overdue, risk-*) ya no existen en la base; el producto asigna su significado a los tonos genéricos. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.STATUS_TONES = NS.CHIP_TONES;
  NS.StatusChip = function StatusChip(p) {
    return h(NS.Chip, { tone: p.tone, className: p.className, label: p.label != null ? p.label : p.children });
  };
})();
