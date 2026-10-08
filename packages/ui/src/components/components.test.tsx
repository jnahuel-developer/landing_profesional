import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, IconButton } from './button';
import { Checkbox, Input, RadioGroup, Select } from './fields';
import { ToastProvider, useToast } from './feedback';
import { Dialog, DropdownMenu, Tabs } from './overlays';

afterEach(cleanup);

describe('componentes base', () => {
  it('preserva atributos, ref, variantes y estado loading', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} aria-label="Guardar" data-track="save" loading>
        Guardar
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-track', 'save');
    expect(ref.current).toBe(button);
  });

  it('exige y expone un nombre accesible en IconButton', () => {
    render(
      <IconButton aria-label="Abrir opciones">
        <span aria-hidden="true">+</span>
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Abrir opciones' })).toBeInTheDocument();
  });

  it('asocia ayuda y error de formulario', () => {
    render(<Input description="Ayuda" error="Dato inválido" label="Nombre" />);
    const input = screen.getByRole('textbox', { name: 'Nombre' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Ayuda Dato inválido');
  });

  it('activa checkbox y navega RadioGroup por teclado', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox label="Aceptar" />
        <RadioGroup
          defaultValue="one"
          label="Opciones"
          options={[
            { label: 'Uno', value: 'one' },
            { label: 'Dos', value: 'two' },
          ]}
        />
      </>,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Aceptar' }));
    expect(screen.getByRole('checkbox', { name: 'Aceptar' })).toBeChecked();
    const second = screen.getByRole('radio', { name: 'Dos' });
    second.focus();
    await user.keyboard(' ');
    expect(second).toBeChecked();
  });

  it('gestiona foco inicial, Escape y retorno de foco en Dialog', async () => {
    const user = userEvent.setup();
    render(
      <Dialog description="Detalle" title="Edición" trigger={<Button>Abrir diálogo</Button>}>
        <Input autoFocus label="Campo" />
      </Dialog>,
    );
    const trigger = screen.getByRole('button', { name: 'Abrir diálogo' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Edición' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Campo' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });

  it('selecciona una opción con teclado', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        label="Estado"
        onValueChange={onValueChange}
        options={[
          { label: 'Uno', value: 'one' },
          { label: 'Dos', value: 'two' },
        ]}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Estado' });
    trigger.focus();
    await user.keyboard('{Enter}');
    screen.getByRole('option', { name: 'Dos' }).focus();
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('two');
  });

  it('navega tabs y dropdown por teclado', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(
      <>
        <Tabs
          defaultValue="a"
          label="Secciones"
          items={[
            { content: 'Panel A', label: 'A', value: 'a' },
            { content: 'Panel B', label: 'B', value: 'b' },
          ]}
        />
        <DropdownMenu
          items={[{ label: 'Primera', onSelect: select, value: 'one' }]}
          label="Acciones"
          trigger={<Button>Menú</Button>}
        />
      </>,
    );
    screen.getByRole('tab', { name: 'A' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: 'Menú' }));
    screen.getByRole('menuitem', { name: 'Primera' }).focus();
    await user.keyboard('{Enter}');
    expect(select).toHaveBeenCalledOnce();
  });

  it('anuncia feedback no bloqueante', async () => {
    function Demo() {
      const { notify } = useToast();
      return (
        <Button onClick={() => notify({ description: 'Detalle', title: 'Guardado' })}>
          Notificar
        </Button>
      );
    }
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Notificar' }));
    expect(screen.getByText('Guardado')).toBeInTheDocument();
    expect(screen.getByText('Detalle')).toBeInTheDocument();
  });

  it('preserva estado al volver a renderizar el contenedor', async () => {
    function Demo() {
      const [theme, setTheme] = useState('light');
      return (
        <div data-theme={theme}>
          <Button onClick={() => setTheme('dark')}>Tema</Button>
          <Input defaultValue="persistente" label="Dato" />
        </div>
      );
    }
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Tema' }));
    expect(screen.getByRole('textbox', { name: 'Dato' })).toHaveValue('persistente');
  });
});
