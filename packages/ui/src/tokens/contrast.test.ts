import { describe, expect, it } from 'vitest';

const themes = {
  light: {
    background: '#f7f9fc',
    surface: '#ffffff',
    text: '#0b1633',
    muted: '#52617a',
    action: '#006adc',
    onAction: '#ffffff',
  },
  dark: {
    background: '#0b1120',
    surface: '#121b2e',
    text: '#f6f8fc',
    muted: '#aebbd0',
    action: '#6db7ff',
    onAction: '#07111f',
  },
  'high-contrast': {
    background: '#000000',
    surface: '#000000',
    text: '#ffffff',
    muted: '#f2f2f2',
    action: '#00d9ff',
    onAction: '#000000',
  },
} as const;

function luminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  if (!channels || channels.length !== 3) {
    throw new Error(`Color hexadecimal inválido: ${hex}.`);
  }

  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function contrast(first: string, second: string): number {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

describe('contraste de tokens principales', () => {
  it.each(Object.entries(themes))('%s cumple WCAG AA', (_name, colors) => {
    expect(contrast(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.text, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.muted, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.onAction, colors.action)).toBeGreaterThanOrEqual(4.5);
  });
});
