import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
import { IconButton } from './button.js';
import { CloseIcon } from './icons.js';

export interface DialogProps extends DialogPrimitive.DialogProps {
  children: ReactNode;
  description?: string;
  title: string;
  trigger: ReactNode;
}
export function Dialog({ children, description, title, trigger, ...props }: DialogProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="ui-dialog__overlay" />
        <DialogPrimitive.Content className="ui-dialog__content">
          <DialogPrimitive.Title className="ui-dialog__title">{title}</DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="ui-dialog__description">
              {description}
            </DialogPrimitive.Description>
          ) : null}
          {children}
          <DialogPrimitive.Close asChild>
            <IconButton aria-label="Cerrar" className="ui-dialog__close" variant="ghost">
              <CloseIcon />
            </IconButton>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
export interface DropdownItem {
  disabled?: boolean;
  label: string;
  onSelect?: () => void;
  value: string;
}
export interface DropdownMenuProps {
  items: DropdownItem[];
  label: string;
  trigger: ReactNode;
}
export function DropdownMenu({ items, label, trigger }: DropdownMenuProps) {
  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger asChild>{trigger}</DropdownPrimitive.Trigger>
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content aria-label={label} className="ui-popover" sideOffset={6}>
          {items.map((item) => (
            <DropdownPrimitive.Item
              className="ui-menu-item"
              disabled={Boolean(item.disabled)}
              key={item.value}
              {...(item.onSelect ? { onSelect: item.onSelect } : {})}
            >
              {item.label}
            </DropdownPrimitive.Item>
          ))}
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    </DropdownPrimitive.Root>
  );
}
export interface TabItem {
  content: ReactNode;
  label: string;
  value: string;
}
export interface TabsProps extends TabsPrimitive.TabsProps {
  items: TabItem[];
  label: string;
}
export function Tabs({ items, label, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root className="ui-tabs" {...props}>
      <TabsPrimitive.List aria-label={label} className="ui-tabs__list">
        {items.map((item) => (
          <TabsPrimitive.Trigger className="ui-tabs__trigger" key={item.value} value={item.value}>
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content className="ui-tabs__content" key={item.value} value={item.value}>
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}
export function Tooltip({ children, content }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content className="ui-tooltip" sideOffset={6}>
            {content}
            <TooltipPrimitive.Arrow className="ui-tooltip__arrow" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
