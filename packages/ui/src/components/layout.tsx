import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from './utils.js';
export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Container({ className, ...props }, ref) {
    return <div ref={ref} className={cx('ui-container', className)} {...props} />;
  },
);
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end' | 'stretch';
  direction?: 'row' | 'column';
  gap?: 'sm' | 'md' | 'lg';
}
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { align = 'stretch', className, direction = 'column', gap = 'md', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        'ui-stack',
        `ui-stack--${direction}`,
        `ui-stack--${gap}`,
        `ui-stack--${align}`,
        className,
      )}
      {...props}
    />
  );
});
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
}
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { className, columns = 2, ...props },
  ref,
) {
  return <div ref={ref} className={cx('ui-grid', `ui-grid--${columns}`, className)} {...props} />;
});
export function Separator({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx('ui-separator', className)} {...props} />;
}
