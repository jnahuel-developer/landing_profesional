import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from '../src/app/page';

describe('página técnica', () => {
  it('presenta el estado operativo con una estructura semántica', () => {
    render(<HomePage />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Nahuel Martínez' })).toBeInTheDocument();
    expect(screen.getByText('La plataforma base está operativa.')).toBeInTheDocument();
    expect(
      screen.getByText('Esta página temporal confirma el arranque de la aplicación web.'),
    ).toBeInTheDocument();
  });
});
