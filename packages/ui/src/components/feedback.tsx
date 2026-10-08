import * as ToastPrimitive from '@radix-ui/react-toast';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button } from './button.js';
import { EmptyIcon } from './icons.js';
import { cx } from './utils.js';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cx('ui-skeleton', className)} {...props} />;
}
export interface LoadingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}
export function LoadingIndicator({ className, label, ...props }: LoadingIndicatorProps) {
  return (
    <div aria-live="polite" className={cx('ui-loading', className)} role="status" {...props}>
      <span aria-hidden="true" className="ui-spinner" />
      <span>{label}</span>
    </div>
  );
}
export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  action?: ReactNode;
  description?: string;
  title: string;
}
export function EmptyState({ action, className, description, title, ...props }: EmptyStateProps) {
  return (
    <div className={cx('ui-empty', className)} {...props}>
      <EmptyIcon className="ui-empty__icon" />
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  );
}
interface ToastMessage {
  actionLabel?: string;
  description?: string;
  id: number;
  onAction?: () => void;
  title: string;
}
interface ToastContextValue {
  notify: (message: Omit<ToastMessage, 'id'>) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const notify = useCallback(
    (next: Omit<ToastMessage, 'id'>) => setMessage({ ...next, id: Date.now() }),
    [],
  );
  const value = useMemo(() => ({ notify }), [notify]);
  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {message ? (
          <ToastPrimitive.Root
            className="ui-toast"
            duration={5000}
            key={message.id}
            onOpenChange={(open) => {
              if (!open) setMessage(null);
            }}
            open
          >
            <ToastPrimitive.Title className="ui-toast__title">{message.title}</ToastPrimitive.Title>
            {message.description ? (
              <ToastPrimitive.Description>{message.description}</ToastPrimitive.Description>
            ) : null}
            {message.actionLabel ? (
              <ToastPrimitive.Action altText={message.actionLabel} asChild>
                <Button onClick={message.onAction} size="sm" variant="secondary">
                  {message.actionLabel}
                </Button>
              </ToastPrimitive.Action>
            ) : null}
          </ToastPrimitive.Root>
        ) : null}
        <ToastPrimitive.Viewport aria-label="Notificaciones" className="ui-toast__viewport" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast debe utilizarse dentro de ToastProvider.');
  return value;
}
