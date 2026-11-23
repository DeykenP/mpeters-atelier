# catalog-extractor

Convierte los catálogos PDF de M. Peters (la tabla _Producto · Imagen · Código · Detalles · Largo/Talla · Precio_) en los productos del sitio, con su foto recortada, opciones y precio por variante. Lee la geometría del PDF (bordes de celda, posición del texto y de las imágenes); no usa OCR ni servicios externos.

## Qué hace

1. Los bordes verticales dan las columnas; su función (nombre, foto, código, detalles, talla, precio) se deduce de lo que contiene cada una.
2. Los bordes horizontales que cruzan la columna de la foto separan los productos; los de dentro, las variantes (un código cada una).
3. Las filas de título color durazno son las series ("Stainless Steel Rope Chain - 18K Series").
4. La foto de cada producto se renderiza tal como aparece en su celda, se recorta y se guarda en WebP.
5. El mismo diseño en otro color, ancho, quilataje o largo se une en **un solo producto con opciones** (Color, Width, Length, Size, Carat), cada combinación con su código y su precio.

Los PDF son partes consecutivas de un catálogo maestro: pásalos en orden. Los tres `MP_06_Accesorios_Parte*.pdf` repiten el contenido de `MP_06_Aretes_Accesorios.pdf`; no hace falta pasarlos.

## Actualizar el catálogo del sitio

```bash
python3 -m venv .venv
```

```bash
.venv/bin/pip install -r tools/catalog-extractor/requirements.txt
```

```bash
.venv/bin/python -I tools/catalog-extractor/extract.py --out /tmp/mpeters-catalog ~/Downloads/01_Cadenas_y_Pulseras.pdf ~/Downloads/02_Tennis_y_Circonias.pdf ~/Downloads/MP_03_Aretes_Moissanita.pdf ~/Downloads/MP_04_Anillos_Moissanita.pdf ~/Downloads/MP_05_Collares_Moissanita.pdf ~/Downloads/MP_06_Aretes_Accesorios.pdf
```

```bash
rsync -a --delete /tmp/mpeters-catalog/images/ public/catalog/
```

```bash
cp /tmp/mpeters-catalog/products.json src/data/catalog.json
```

Revisa `report.txt` (casos que conviene mirar a mano) y `groups.json` (lo leído en cada fila del PDF) en la carpeta de salida.

## Salida

- `products.json` → `src/data/catalog.json`: productos, opciones, variantes (código + precio), especificaciones y el tono de cada foto (`light` = fondo blanco de estudio, `dark` = foto ambientada).
- `images/*.webp` → `public/catalog/`: una foto por imagen distinta del catálogo.

Las piezas en existencia con fotos propias (relojes, etc.) no vienen de aquí: están en `src/data/products.ts`.
