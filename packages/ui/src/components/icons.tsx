import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;
function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      {children}
    </svg>
  );
}
export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </Icon>
  );
}
export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m7 9 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </Icon>
  );
}
export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </Icon>
  );
}
export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11v6m0-10h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </Icon>
  );
}
export function WarningIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 3 2.8 20h18.4L12 3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M12 9v4m0 3h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </Icon>
  );
}
export function EmptyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M4 7h16v12H4zM8 4h8M9 12h6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
}
