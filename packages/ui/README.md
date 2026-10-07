# @portfolio/ui

Sistema visual compartido del portfolio, el panel administrativo y el laboratorio. El paquete publica ESM con exports explícitos y una hoja CSS única de tokens semánticos.

## Consumo

La aplicación importa `@portfolio/ui/styles.css` una sola vez y utiliza los exports desde `@portfolio/ui`, sin rutas profundas. Los componentes consumen exclusivamente variables `--ui-*`.

```tsx
import { applyAppearance } from '@portfolio/ui';
import '@portfolio/ui/styles.css';

applyAppearance(document.documentElement, {
  theme: 'dark',
  density: 'compact',
});
```

Los temas disponibles son `light`, `dark` y `high-contrast`; las densidades son `comfortable` y `compact`. El cambio modifica atributos del mismo elemento y no remonta React.

## Criterio de tokens

- La paleta base deriva de la referencia clara aprobada: fondo frío, superficies blancas, texto azul tinta y acción azul.
- Oscuro y contraste reforzado son extensiones funcionales exigidas por la especificación y mantienen contraste AA.
- Los estados agregan superficies tonales además de color para que icono y texto puedan comunicar significado.
- La escala espacial de 4 px, los radios moderados y las elevaciones suaves sostienen tanto la home amplia como interfaces densas.
- `--ui-hit-target` permanece en 44 px aun en densidad compacta; la densidad reduce altura visual y padding, no el área operable.
- Los z-index forman una escala cerrada para sticky, dropdown, dialog y toast, evitando valores arbitrarios.
- Los breakpoints documentan la base desktop de 1280 px y la referencia amplia de 1440 px.

La fuente local es Geist Variable, distribuida bajo SIL Open Font License 1.1. Se carga mediante `next/font/local`, sin solicitudes de red en runtime ni build.

## API pública

- Acciones: `Button`, `IconButton`, `TextLink`.
- Formularios: `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`.
- Superficies y estado: `Card`, `Badge`, `Alert`, `Callout`.
- Interacción compleja: `Dialog`, `DropdownMenu`, `Tabs`, `Tooltip`.
- Feedback: `Skeleton`, `LoadingIndicator`, `EmptyState`, `ToastProvider`, `useToast`.
- Composición: `Container`, `Stack`, `Grid`, `Separator`.
- Iconos: `CheckIcon`, `ChevronDownIcon`, `CloseIcon`, `EmptyIcon`, `InfoIcon`, `WarningIcon`.

Los controles nativos preservan atributos HTML y `ref`. Los campos reciben `label`, `description` y `error`, y generan las relaciones accesibles. `IconButton` requiere `aria-label` o `aria-labelledby` en TypeScript. Dialog, menús, selección, tabs, radio, tooltip y toast usan Radix UI para conservar teclado, portales y foco.
