import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { InfoIcon, WarningIcon } from './icons.js';
import { cx } from './utils.js';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Card(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('ui-card', className)} {...props} />;
});
export type StatusTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
}
export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return <span className={cx('ui-badge', `ui-tone--${tone}`, className)} {...props} />;
}
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  tone?: StatusTone;
}
export function Alert({ children, className, title, tone = 'info', ...props }: AlertProps) {
  return (
    <div
      className={cx('ui-alert', `ui-tone--${tone}`, className)}
      role={tone === 'danger' ? 'alert' : 'status'}
      {...props}
    >
      <span className="ui-alert__icon">
        {tone === 'warning' || tone === 'danger' ? <WarningIcon /> : <InfoIcon />}
      </span>
      <div>
        <strong>{title}</strong>
        {children ? <div>{children}</div> : null}
      </div>
    </div>
  );
}
export interface CalloutProps extends HTMLAttributes<HTMLElement> {
  icon?: ReactNode;
  title?: string;
  tone?: StatusTone;
}
export function Callout({
  children,
  className,
  icon = <InfoIcon />,
  title,
  tone = 'neutral',
  ...props
}: CalloutProps) {
  return (
    <aside className={cx('ui-callout', `ui-tone--${tone}`, className)} {...props}>
      <span className="ui-callout__icon">{icon}</span>
      <div>
        {title ? <strong>{title}</strong> : null}
        {children}
      </div>
    </aside>
  );
}
