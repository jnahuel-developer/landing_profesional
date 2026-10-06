# ADR-009 — Analítica propia

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- La analítica será first-party y se almacenará en PostgreSQL, esquema `platform`.
- No se utilizarán Google Analytics, Meta Pixel, Hotjar ni servicios equivalentes.
- La recolección opcional comenzará únicamente después del consentimiento del visitante.
- Los eventos se enviarán en lotes pequeños al backend y se validarán contra una taxonomía versionada.
- Los eventos crudos se conservarán 180 días; los resúmenes de sesión, 24 meses; los agregados diarios podrán conservarse mientras sigan siendo útiles.

## Datos admitidos

- nombre de evento;
- fecha y hora;
- sesión analítica pseudónima;
- página, demo, módulo, rol y escenario;
- idioma, tema, clase de dispositivo y familia de navegador;
- dominio de referencia y parámetros UTM permitidos;
- resultado categórico y duración agregada.

No se almacenarán IP, texto libre, nombres, correos, mensajes, firmas, fotografías ni contenido interno de las demos como datos analíticos.

## Justificación

La plataforma necesita un panel propio y eventos específicos de las demos. Una solución interna ofrece control sobre el modelo, la retención y la privacidad sin incorporar scripts de terceros.
