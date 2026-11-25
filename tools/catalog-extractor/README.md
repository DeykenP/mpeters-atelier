# catalog-extractor

Convierte los catálogos PDF de M. Peters (la tabla _Producto · Imagen · Código · Detalles · Largo/Talla · Precio_) en los productos del sitio, con su foto recortada, opciones y precio por variante. Lee la geometría del PDF (bordes de celda, posición del texto y de las imágenes); no usa OCR ni servicios externos.

## Qué hace

1. Los bordes verticales dan las columnas; su función (nombre, foto, código, detalles, talla, precio) se deduce de lo que contiene cada una.
2. Los bordes horizontales que cruzan la columna de la foto separan los productos; los de dentro, las variantes (un código cada una).
3. Las filas de título color durazno son las series ("Stainless Steel Rope Chain - 18K Series").
4. La foto de cada producto se renderiza tal como aparece en su celda y se recorta.
5. El mismo diseño en otro color, ancho, quilataje o largo se une en **un solo producto con opciones** (Color, Width, Length, Size, Carat), cada combinación con su código y su precio.
6. Con `--upscaler`, las fotos (unos 450 px en el PDF) se agrandan con [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) y se mezclan 60 % IA / 40 % original. La IA pura inventa textura en el pavé de piedras pequeñas ("hielo partido"); la mezcla conserva casi toda la nitidez sin ese efecto. Se publican dos tamaños: 1200 px para la ficha y 600 px para grillas y miniaturas.

Los PDF son partes consecutivas de un catálogo maestro: pásalos en orden. Los tres `MP_06_Accesorios_Parte*.pdf` repiten el contenido de `MP_06_Aretes_Accesorios.pdf`; no hace falta pasarlos.

## Actualizar el catálogo del sitio

```bash
python3 -m venv .venv
```

```bash
.venv/bin/pip install -r tools/catalog-extractor/requirements.txt
```

Para mejorar las fotos, descarga Real-ESRGAN de la [versión v0.2.5.0](https://github.com/xinntao/Real-ESRGAN/releases/tag/v0.2.5.0) (`realesrgan-ncnn-vulkan-20220424-macos.zip`, `-windows.zip` o `-ubuntu.zip`) y descomprímelo fuera del repositorio, por ejemplo en `~/tools/realesrgan`. Usa la GPU: en una Mac con Apple Silicon tarda unos 6 s por foto (cerca de 1 h 45 min para todo el catálogo); con una tarjeta gráfica dedicada, bastante menos. Mientras corre muestra el avance (`412/997 · about 30 min left`).

```bash
.venv/bin/python -I tools/catalog-extractor/extract.py --out ~/mpeters-catalogo --upscaler ~/tools/realesrgan/realesrgan-ncnn-vulkan ~/Downloads/01_Cadenas_y_Pulseras.pdf ~/Downloads/02_Tennis_y_Circonias.pdf ~/Downloads/MP_03_Aretes_Moissanita.pdf ~/Downloads/MP_04_Anillos_Moissanita.pdf ~/Downloads/MP_05_Collares_Moissanita.pdf ~/Downloads/MP_06_Aretes_Accesorios.pdf
```

En Windows el ejecutable es `realesrgan-ncnn-vulkan.exe` y Python está en `.venv\Scripts\python`.

Las fotos ya mejoradas quedan en `~/mpeters-catalogo/_upscale/done/`. Si la corrida se corta, al volver a lanzarla continúa donde quedó; para terminarla en otra computadora, copia esa carpeta `_upscale` dentro de la carpeta `--out` de la otra. Usa una carpeta fuera de iCloud: si sincroniza mientras se escriben miles de archivos, aparecen copias duplicadas ("… 2.webp").

Sin `--upscaler` corre en un par de minutos y publica las fotos en su tamaño original.

```bash
rsync -a --delete ~/mpeters-catalogo/images/ public/catalog/
```

```bash
cp ~/mpeters-catalogo/products.json src/data/catalog.json
```

Revisa `report.txt` (casos que conviene mirar a mano) y `groups.json` (lo leído en cada fila del PDF) en la carpeta de salida.

## Salida

- `products.json` → `src/data/catalog.json`: productos, opciones, variantes (código + precio), especificaciones y el tono de cada foto (`light` = fondo blanco de estudio, `dark` = foto ambientada).
- `images/*.webp` (1200 px) e `images/sm/*.webp` (600 px) → `public/catalog/`: una foto por imagen distinta del catálogo.
- `_png/`: fotos sin pérdida tal como salen del PDF, y `names.json` con el nombre publicado de cada una.
- `_upscale/done/`: fotos ya mejoradas por Real-ESRGAN, por nombre; permiten retomar una corrida, también en otra computadora.

Las piezas en existencia con fotos propias (relojes, etc.) no vienen de aquí: están en `src/data/products.ts`.
