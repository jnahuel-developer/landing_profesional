# @portfolio/config

Configuraciones compartidas y públicas de ESLint y TypeScript.

## Entradas públicas

- `@portfolio/config/eslint/base`: reglas comunes para TypeScript.
- `@portfolio/config/eslint/next`: reglas comunes más las recomendaciones de Next.js.
- `@portfolio/config/typescript/base.json`: opciones estrictas compartidas.
- `@portfolio/config/typescript/next.json`: base para aplicaciones Next.js.
- `@portfolio/config/typescript/node.json`: base compilable para procesos Node.js.

Los consumidores deben extender o importar estas entradas; los archivos internos del paquete no forman parte del contrato público.
