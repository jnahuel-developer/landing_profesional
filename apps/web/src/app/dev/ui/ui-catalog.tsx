'use client';

import {
  Alert,
  Badge,
  Button,
  Callout,
  Card,
  Checkbox,
  CloseIcon,
  Container,
  Dialog,
  DropdownMenu,
  EmptyState,
  Grid,
  IconButton,
  InfoIcon,
  Input,
  LoadingIndicator,
  RadioGroup,
  Select,
  Separator,
  Skeleton,
  Stack,
  Tabs,
  Textarea,
  TextLink,
  ToastProvider,
  Tooltip,
  WarningIcon,
  applyAppearance,
  type Density,
  type Theme,
  useToast,
} from '@portfolio/ui';
import { useRef, useState } from 'react';

const themes: Theme[] = ['light', 'dark', 'high-contrast'];
const densities: Density[] = ['comfortable', 'compact'];

function CatalogContent() {
  const rootRef = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [density, setDensity] = useState<Density>('comfortable');
  const { notify } = useToast();

  function changeAppearance(nextTheme: Theme, nextDensity: Density) {
    if (rootRef.current)
      applyAppearance(rootRef.current, { density: nextDensity, theme: nextTheme });
    setTheme(nextTheme);
    setDensity(nextDensity);
  }

  return (
    <main ref={rootRef} className="catalog" data-density={density} data-theme={theme}>
      <Container>
        <Stack gap="lg">
          <header className="catalog__header">
            <div>
              <p className="catalog__eyebrow">Herramienta de desarrollo</p>
              <h1>Sistema visual compartido</h1>
              <p>Tokens, estados y comportamiento accesible de la API pública.</p>
            </div>
            <div className="catalog__controls">
              <fieldset>
                <legend>Tema</legend>
                {themes.map((item) => (
                  <Button
                    aria-pressed={theme === item}
                    key={item}
                    onClick={() => changeAppearance(item, density)}
                    size="sm"
                    variant={theme === item ? 'primary' : 'secondary'}
                  >
                    {item}
                  </Button>
                ))}
              </fieldset>
              <fieldset>
                <legend>Densidad</legend>
                {densities.map((item) => (
                  <Button
                    aria-pressed={density === item}
                    key={item}
                    onClick={() => changeAppearance(theme, item)}
                    size="sm"
                    variant={density === item ? 'primary' : 'secondary'}
                  >
                    {item}
                  </Button>
                ))}
              </fieldset>
            </div>
          </header>

          <section aria-labelledby="tokens-title">
            <h2 id="tokens-title">Tokens</h2>
            <Grid columns={4}>
              {[
                'background',
                'surface',
                'surface-raised',
                'action',
                'info',
                'success',
                'warning',
                'danger',
              ].map((token) => (
                <Card className="catalog__swatch" key={token}>
                  <span style={{ background: `var(--ui-color-${token})` }} />
                  <code>{token}</code>
                </Card>
              ))}
            </Grid>
            <div className="catalog__type">
              <span className="catalog__display">Jerarquía tipográfica</span>
              <span>Texto operativo legible en interfaces densas.</span>
              <code>
                Espacio 4 / 8 / 12 / 16 / 24 / 32 · radios 6 / 10 / 16 · capas 20 / 40 / 60 / 80
              </code>
            </div>
            <Grid columns={3}>
              <Card className="catalog__shadow catalog__shadow--sm">Elevación sm</Card>
              <Card className="catalog__shadow catalog__shadow--md">Elevación md</Card>
              <Card className="catalog__shadow catalog__shadow--lg">Elevación lg</Card>
            </Grid>
          </section>

          <Separator />
          <section aria-labelledby="actions-title">
            <h2 id="actions-title">Acciones y feedback</h2>
            <Stack direction="row">
              <Button>Primaria</Button>
              <Button variant="secondary">Secundaria</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Peligro</Button>
              <Button disabled>Deshabilitada</Button>
              <Button loading>Cargando</Button>
              <IconButton aria-label="Cerrar ejemplo">
                <CloseIcon />
              </IconButton>
              <TextLink href="#forms">Enlace tipográfico</TextLink>
            </Stack>
            <Stack direction="row">
              <Badge tone="info">Info</Badge>
              <Badge tone="success">Éxito</Badge>
              <Badge tone="warning">Advertencia</Badge>
              <Badge tone="danger">Peligro</Badge>
              <Badge>Neutral</Badge>
            </Stack>
            <Alert title="Información" tone="info">
              Incluye icono y texto.
            </Alert>
            <Alert title="Revisar dato" tone="danger">
              El estado no depende sólo del color.
            </Alert>
            <Callout title="Referencia compacta">
              <p>Una nota técnica para composición.</p>
            </Callout>
          </section>

          <Separator />
          <section aria-labelledby="forms-title" id="forms">
            <h2 id="forms-title">Formularios</h2>
            <Grid columns={3}>
              <Input
                data-testid="persistent-input"
                defaultValue="Estado persistente"
                description="Ayuda asociada"
                label="Entrada"
              />
              <Input error="Corregí este valor" label="Entrada con error" />
              <Textarea label="Texto largo" />
              <Select
                label="Selección"
                options={[
                  { label: 'Primera opción', value: 'one' },
                  { label: 'Segunda opción', value: 'two' },
                ]}
                placeholder="Elegir"
              />
              <Checkbox label="Confirmación" />
              <RadioGroup
                defaultValue="one"
                label="Prioridad"
                options={[
                  { label: 'Normal', value: 'one' },
                  { label: 'Alta', value: 'two' },
                ]}
              />
            </Grid>
          </section>

          <Separator />
          <section aria-labelledby="overlays-title">
            <h2 id="overlays-title">Interacción compleja</h2>
            <Stack direction="row">
              <Dialog
                description="El foco queda contenido y vuelve al disparador."
                title="Diálogo accesible"
                trigger={<Button>Abrir diálogo</Button>}
              >
                <Input autoFocus label="Nombre interno" />
              </Dialog>
              <DropdownMenu
                items={[
                  { label: 'Editar', value: 'edit' },
                  { label: 'Archivar', value: 'archive' },
                ]}
                label="Acciones del registro"
                trigger={<Button variant="secondary">Abrir menú</Button>}
              />
              <Tooltip content="Ayuda contextual">
                <Button variant="ghost">Mostrar ayuda</Button>
              </Tooltip>
            </Stack>
            <Tabs
              defaultValue="first"
              items={[
                { content: <p>Contenido del primer panel.</p>, label: 'Resumen', value: 'first' },
                {
                  content: <p>Contenido del segundo panel.</p>,
                  label: 'Actividad',
                  value: 'second',
                },
              ]}
              label="Secciones del ejemplo"
            />
          </section>

          <Separator />
          <section aria-labelledby="states-title">
            <h2 id="states-title">Carga y vacío</h2>
            <Grid columns={3}>
              <Card>
                <Skeleton style={{ height: '5rem' }} />
              </Card>
              <Card>
                <LoadingIndicator label="Procesando datos" />
              </Card>
              <Card>
                <EmptyState
                  description="Todavía no hay elementos para mostrar."
                  title="Sin resultados"
                />
              </Card>
            </Grid>
            <Button
              onClick={() =>
                notify({
                  description: 'El anuncio usa una región accesible.',
                  title: 'Cambio guardado',
                })
              }
            >
              Mostrar notificación
            </Button>
          </section>

          <Separator />
          <section aria-labelledby="layout-title">
            <h2 id="layout-title">Composición e iconos</h2>
            <Grid columns={2}>
              <Card>
                <Stack>
                  <InfoIcon />
                  <strong>Icono informativo</strong>
                  <span>Texto que explica su significado.</span>
                </Stack>
              </Card>
              <Card>
                <Stack>
                  <WarningIcon />
                  <strong>Icono de advertencia</strong>
                  <span>Estado reforzado con contenido.</span>
                </Stack>
              </Card>
            </Grid>
          </section>
        </Stack>
      </Container>
    </main>
  );
}

export function UiCatalog() {
  return (
    <ToastProvider>
      <CatalogContent />
    </ToastProvider>
  );
}
