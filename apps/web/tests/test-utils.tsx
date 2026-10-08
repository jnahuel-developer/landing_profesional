import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';

import messages from '../src/messages/es.json';
import { PreferencesProvider } from '../src/preferences/preferences-provider';

export function renderWithIntl(element: ReactElement) {
  return render(
    <NextIntlClientProvider locale="es" messages={messages}>
      <PreferencesProvider>{element}</PreferencesProvider>
    </NextIntlClientProvider>,
  );
}
