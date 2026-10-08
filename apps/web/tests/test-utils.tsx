import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';

import messages from '../src/messages/es.json';

export function renderWithIntl(element: ReactElement) {
  return render(
    <NextIntlClientProvider locale="es" messages={messages}>
      {element}
    </NextIntlClientProvider>,
  );
}
