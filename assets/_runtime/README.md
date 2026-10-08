# Runtime vendorizado

Archivos que necesitan las páginas `.dc.html` (Design Components) de `sections/`. Se versionan aquí para no depender de servicios externos.

| Archivo | Origen | Versión | Licencia |
| --- | --- | --- | --- |
| `react.production.min.js` | https://unpkg.com/react@18.3.1/umd/react.production.min.js | 18.3.1 | MIT |
| `react-dom.production.min.js` | https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js | 18.3.1 | MIT |

Integridad (SHA-384), la misma que declara `sections/<categoria>/support.js`:
- react: `sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z`
- react-dom: `sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1`

`npm run check` calcula el SHA-384 de estos archivos y falla si no coincide con el que declara `support.js`: así, si Claude Design actualiza React en un `support.js` nuevo, hay que actualizar también estos archivos antes de integrar.

Cada `.dc.html` los carga con `<script>` antes de `./support.js`. Si ya existen `window.React` y `window.ReactDOM`, `support.js` no descarga nada. `support.js` es un archivo generado por Claude Design: no se edita a mano y todas sus copias deben ser idénticas.
