# M. Peters Atelier

Sitio de M. Peters Atelier: joyería por encargo (moissanita, plata 925 y acabados en oro) y una pequeña selección de relojes. Next.js 16 (App Router), Tailwind CSS 4, sin base de datos: todo el catálogo es estático.

## Desarrollo

```bash
npm install
```

```bash
npm run dev
```

Abre <http://localhost:3000>.

## Productos

| Origen | Archivo | Qué contiene |
| --- | --- | --- |
| Catálogo por encargo | `src/data/catalog.json` + `public/catalog/` | Generado desde los PDF con [`tools/catalog-extractor`](tools/catalog-extractor/README.md): ~530 diseños con opciones (color, ancho, largo, talla, quilates), código y precio por variante. Las fotos se agrandan con Real-ESRGAN y se publican en dos tamaños: `public/catalog/` (1200 px, ficha) y `public/catalog/sm/` (600 px, grillas). |
| Piezas en existencia | `src/data/products.ts` | Productos cargados a mano con fotos propias. |

`src/lib/catalog.ts` une ambos y es lo que usan las páginas.

## Páginas

- `/` — película de portada, índice de categorías y piezas seleccionadas.
- `/collections` y `/collections/[categoria]` — catálogo con búsqueda por nombre o código (`MPAT-0014…`), filtros de material y color y orden por precio.
- `/products/[slug]` — fotos, selección de opciones con precio y código exactos, y pedido por WhatsApp con el código de la variante.

## Transiciones

Las navegaciones usan la View Transitions API (`experimental.viewTransition` en `next.config.ts` y `<ViewTransition>` de React): la página se funde como un corte de película y la foto del producto viaja de la grilla a su ficha. Los estilos están en `src/app/globals.css`; con "reducir movimiento" activado se desactivan.
