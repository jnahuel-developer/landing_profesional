import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import { GlobalErrorContent } from '../src/app/global-error';
import { ContactForm } from '../src/components/home/contact-form';
import { FinalSections } from '../src/components/home/final-sections';
import { LaboratoryDocument, PrivacyDocument } from '../src/components/public-documents';
import spanish from '../src/messages/es.json';
import english from '../src/messages/en.json';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  useParams: () => ({ locale: 'es' }),
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

for (const [locale, messages] of [
  ['es', spanish],
  ['en', english],
] as const) {
  function localized(element: React.ReactElement) {
    return render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        {element}
      </NextIntlClientProvider>,
    );
  }
  describe(`superficie pública final ${locale}`, () => {
    it('renderiza About y Contacto con identificadores estables', () => {
      const { container } = localized(<FinalSections />);
      expect([...container.querySelectorAll('section')].map(({ id }) => id)).toEqual([
        'about',
        'contact',
      ]);
      expect(screen.getByText(messages.Home.about.responsibility)).toBeVisible();
      expect(screen.getByText(messages.Home.about.collaboration)).toBeVisible();
    });
    it('valida, asocia errores, enfoca y confirma el envio sin almacenamiento local', async () => {
      const fetch = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify({ received: true }), { status: 201 }));
      const storage = vi.spyOn(Storage.prototype, 'setItem');
      localized(<ContactForm />);
      fireEvent.click(screen.getByRole('button', { name: messages.Contact.submit }));
      expect(screen.getByRole('alert')).toBeVisible();
      const name = screen.getByLabelText(messages.Contact.fields.name);
      expect(name).toHaveFocus();
      expect(name).toHaveAttribute('aria-describedby', 'contact-name-error');
      fireEvent.change(name, { target: { value: 'Visitante' } });
      fireEvent.change(screen.getByLabelText(messages.Contact.fields.email), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(messages.Contact.fields.message), {
        target: { value: 'Consulta sobre un proyecto' },
      });
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: messages.Contact.submit }));
      expect(screen.queryByRole('alert')).toBeNull();
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent(messages.Contact.success),
      );
      expect(name).toHaveValue('');
      expect(fetch).toHaveBeenCalledOnce();
      expect(storage).not.toHaveBeenCalled();
      fetch.mockRestore();
      storage.mockRestore();
    });
    it('publica privacidad completa y catálogo sin controles de inicio', () => {
      const { unmount } = localized(<PrivacyDocument />);
      for (const topic of Object.values(messages.Privacy.topics)) {
        expect(screen.getByRole('heading', { name: topic.title })).toBeVisible();
        expect(screen.getByText(topic.body)).toBeVisible();
      }
      unmount();
      localized(<LaboratoryDocument />);
      expect(screen.getAllByRole('article')).toHaveLength(2);
      for (const article of screen.getAllByRole('article')) {
        expect(within(article).getByText(messages.Laboratory.soon)).toBeVisible();
        expect(within(article).queryByRole('button')).toBeNull();
        expect(within(article).queryByRole('link')).toBeNull();
      }
    });
    it('el error global funciona sin proveedores y permite reintentar', () => {
      const reset = vi.fn();
      render(<GlobalErrorContent locale={locale} reset={reset} />);
      expect(screen.getByRole('heading', { name: messages.States.errorTitle })).toBeVisible();
      fireEvent.click(screen.getByRole('button', { name: messages.States.retry }));
      expect(reset).toHaveBeenCalledOnce();
      expect(screen.getByRole('link', { name: messages.States.contact })).toHaveAttribute(
        'href',
        locale === 'en' ? '/en#contact' : '/#contact',
      );
    });
  });
}
