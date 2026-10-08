import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as RadioPrimitive from '@radix-ui/react-radio-group';
import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { CheckIcon, ChevronDownIcon } from './icons.js';
import { cx } from './utils.js';

interface Meta {
  description?: string | undefined;
  error?: string | undefined;
  label: string;
}
function ids(id: string, description?: string, error?: string) {
  return (
    [description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') ||
    undefined
  );
}
function FieldMessages({
  description,
  error,
  id,
}: {
  description?: string | undefined;
  error?: string | undefined;
  id: string;
}) {
  return (
    <>
      {description ? (
        <span className="ui-field__description" id={`${id}-description`}>
          {description}
        </span>
      ) : null}
      {error ? (
        <span className="ui-field__error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </>
  );
}
export type InputProps = InputHTMLAttributes<HTMLInputElement> & Meta;
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, description, error, id: given, label, ...props },
  ref,
) {
  const generated = useId();
  const id = given ?? generated;
  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={ref}
        aria-describedby={ids(id, description, error)}
        aria-invalid={Boolean(error)}
        className={cx('ui-input', className)}
        id={id}
        {...props}
      />
      <FieldMessages description={description} error={error} id={id} />
    </div>
  );
});
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & Meta;
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, description, error, id: given, label, ...props },
  ref,
) {
  const generated = useId();
  const id = given ?? generated;
  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        ref={ref}
        aria-describedby={ids(id, description, error)}
        aria-invalid={Boolean(error)}
        className={cx('ui-input ui-textarea', className)}
        id={id}
        {...props}
      />
      <FieldMessages description={description} error={error} id={id} />
    </div>
  );
});

export interface SelectOption {
  disabled?: boolean;
  label: string;
  value: string;
}
export interface SelectProps {
  description?: string;
  disabled?: boolean;
  error?: string;
  label: string;
  name?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
}
export function Select({
  description,
  disabled,
  error,
  label,
  name,
  onValueChange,
  options,
  placeholder,
  value,
}: SelectProps) {
  const id = useId();
  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <SelectPrimitive.Root
        disabled={Boolean(disabled)}
        {...(name ? { name } : {})}
        {...(onValueChange ? { onValueChange } : {})}
        {...(value !== undefined ? { value } : {})}
      >
        <SelectPrimitive.Trigger
          aria-describedby={ids(id, description, error)}
          aria-invalid={Boolean(error)}
          className="ui-input ui-select__trigger"
          id={id}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="ui-popover" position="popper">
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  className="ui-menu-item"
                  disabled={Boolean(option.disabled)}
                  key={option.value}
                  value={option.value}
                >
                  <SelectPrimitive.ItemIndicator>
                    <CheckIcon />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <FieldMessages description={description} error={error} id={id} />
    </div>
  );
}

export interface CheckboxProps extends Omit<CheckboxPrimitive.CheckboxProps, 'children'>, Meta {}
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { description, error, id: given, label, ...props },
  ref,
) {
  const generated = useId();
  const id = given ?? generated;
  return (
    <div className="ui-choice-field">
      <CheckboxPrimitive.Root
        ref={ref}
        aria-describedby={ids(id, description, error)}
        aria-invalid={Boolean(error)}
        className="ui-checkbox"
        id={id}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <CheckIcon />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label htmlFor={id}>{label}</label>
      <FieldMessages description={description} error={error} id={id} />
    </div>
  );
});
export interface RadioOption {
  disabled?: boolean;
  label: string;
  value: string;
}
export interface RadioGroupProps extends RadioPrimitive.RadioGroupProps {
  label: string;
  options: RadioOption[];
}
export function RadioGroup({ label, options, ...props }: RadioGroupProps) {
  return (
    <fieldset className="ui-fieldset">
      <legend className="ui-field__label">{label}</legend>
      <RadioPrimitive.Root className="ui-radio-group" {...props}>
        {options.map((option) => (
          <label className="ui-radio" key={option.value}>
            <RadioPrimitive.Item
              className="ui-radio__control"
              disabled={option.disabled}
              value={option.value}
            >
              <RadioPrimitive.Indicator className="ui-radio__indicator" />
            </RadioPrimitive.Item>
            <span>{option.label}</span>
          </label>
        ))}
      </RadioPrimitive.Root>
    </fieldset>
  );
}
