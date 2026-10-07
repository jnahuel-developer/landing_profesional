import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from './utils.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled,
    loading = false,
    size = 'md',
    type = 'button',
    variant = 'primary',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-busy={loading || undefined}
      className={cx('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? <span aria-hidden="true" className="ui-spinner ui-spinner--inline" /> : null}
      <span>{children}</span>
    </button>
  );
});
type AccessibleName = { 'aria-label': string } | { 'aria-labelledby': string };
export type IconButtonProps = Omit<ButtonProps, 'children'> &
  AccessibleName & { children: ReactNode };
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, className, ...props },
  ref,
) {
  return (
    <Button ref={ref} className={cx('ui-icon-button', className)} {...props}>
      {children}
    </Button>
  );
});
export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  emphasis?: 'default' | 'strong';
};
export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(function TextLink(
  { className, emphasis = 'default', ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cx('ui-text-link', `ui-text-link--${emphasis}`, className)}
      {...props}
    />
  );
});
