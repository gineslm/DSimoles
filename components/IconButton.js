/* IconButton · alias temporal de Act-Button (7.3), unificado el 2026-10-15. Requiere Button.js.
   Traduce los tamaños antiguos (lg 44 → md, md 36 → sm, xs 28 → xs) y usa la variante clear, solo icono.
   Se retira cuando no queden usos. */
(function () {
  var NS = window.DSimoles, h = NS.h, R = window.React;
  NS.IconButton = R.forwardRef(function IconButton(p, ref) {
    var size = { '2xs': 'xs', xs: 'xs', sm: 'sm', md: 'sm', lg: 'md', xl: 'md' }[p.size] || 'md';
    return h(NS.Button, Object.assign({}, p, { ref: ref, variant: 'clear', iconOnly: true, icon: p.icon || 'more_vert', size: size }));
  });
})();
