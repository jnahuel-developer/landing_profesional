# ADR-020 — Experiencia pública continua y movimiento progresivo

**Estado:** Aceptada  
**Fecha:** 2026-10-08

## Contexto

El shell inicial validó navegación, internacionalización, preferencias y accesibilidad, pero la separación de cada contenido comercial en una página independiente produjo una experiencia fragmentada y excesivamente estática. Los controles públicos de apariencia también ocuparon más espacio que el contenido principal y trasladaron al visitante decisiones internas que no aportan valor comercial.

El portfolio debe comunicar capacidad técnica mediante una experiencia atractiva, fluida y comprensible, sin convertir la navegación en una demostración experimental difícil de usar.

## Decisión

- La experiencia comercial principal será una única página narrativa de desplazamiento continuo.
- Inicio, Soluciones, Experiencia, Cómo trabajo, Sobre mí y Contacto serán secciones ordenadas de esa página.
- La navegación persistente utilizará anclas estables e independientes del idioma: `#home`, `#solutions`, `#experience`, `#process`, `#about` y `#contact`.
- La sección activa se determinará con `IntersectionObserver`. El historial y el fragmento de URL se actualizarán sin generar una entrada por cada cambio automático.
- La navegación iniciada por el usuario respetará Atrás, Adelante, enlaces profundos, teclado y reducción de movimiento.
- Privacidad, Laboratorio y Administración conservarán rutas independientes.
- Las antiguas rutas comerciales independientes se retirarán o redirigirán a la sección equivalente, sin mantener dos versiones canónicas del mismo contenido.
- La cabecera pública mostrará solamente identidad, navegación, selector compacto de idioma, conmutador claro/oscuro y acceso al Laboratorio.
- Densidad y movimiento no se expondrán como preferencias públicas. La densidad del sitio comercial será fija y la reducción de movimiento seguirá `prefers-reduced-motion`.
- En una primera visita, el tema podrá resolverse según el sistema. Después de una elección explícita, el control público alternará únicamente entre claro y oscuro y persistirá el resultado.
- El pie será compacto. El cierre comercial pertenecerá a la sección Contacto y no al pie legal.
- El movimiento se implementará como mejora progresiva mediante CSS, SVG, `IntersectionObserver` y componentes cliente acotados. Se utilizará `motion` únicamente cuando simplifique escenas vinculadas al scroll y se cargará de forma localizada; CSS seguirá siendo la primera opción para transiciones sencillas.
- No se implementarán scroll-jacking, smooth-scroll global, WebGL, video de fondo ni dependencias multimedia.
- El contenido esencial será legible y operable sin animaciones y no dependerá de efectos hover.

## Justificación

La página continua permite presentar el posicionamiento, las capacidades y las demostraciones como un relato único. Los enlaces profundos conservan acceso directo sin obligar al visitante a recorrer pantallas desconectadas. La mejora progresiva mantiene accesibilidad y rendimiento, mientras que el uso acotado de movimiento aporta identidad sin comprometer el control del navegador.

## Consecuencias

- `mod007` deberá refactorizar el shell público antes de completar el hero.
- `mod008` y `mod009` implementarán secciones de la home, no páginas comerciales independientes.
- El sitemap incluirá documentos indexables, no fragmentos de sección.
- La metadata principal se definirá por idioma para la home; las secciones no tendrán metadata independiente.
- Las pruebas end-to-end deberán cubrir anclas, sección activa, historial, cambio de idioma, tema y ausencia de errores de consola.
- La aceptación estética continuará siendo responsabilidad del propietario; las automatizaciones verificarán comportamiento, accesibilidad y rendimiento.
