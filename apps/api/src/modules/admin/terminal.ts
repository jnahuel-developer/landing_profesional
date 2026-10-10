import { emitKeypressEvents } from 'node:readline';
import type { ReadStream, WriteStream } from 'node:tty';
import type { AdminInput } from './commands.js';

export function terminalInput(
  input: ReadStream = process.stdin,
  output: WriteStream = process.stdout,
): AdminInput {
  if (!input.isTTY || !output.isTTY || typeof input.setRawMode !== 'function')
    throw new Error('ADMIN_TTY_REQUIRED');
  emitKeypressEvents(input);
  return {
    read: (label, hidden) =>
      new Promise<string>((resolve, reject) => {
        const wasRaw = input.isRaw;
        const wasPaused = input.isPaused();
        let value = '';
        output.write(label);
        input.setRawMode(true);
        input.resume();
        function cleanup() {
          input.off('keypress', onKey);
          input.off('end', onEnd);
          input.setRawMode(wasRaw);
          if (wasPaused) input.pause();
          output.write('\n');
        }
        function onEnd() {
          cleanup();
          reject(new Error('ADMIN_INPUT_CANCELLED'));
        }
        function onKey(
          text: string | undefined,
          key: { name?: string; ctrl?: boolean; meta?: boolean },
        ) {
          if (key.ctrl && (key.name === 'c' || key.name === 'd')) {
            onEnd();
            return;
          }
          if (key.name === 'return' || key.name === 'enter') {
            cleanup();
            resolve(value);
            return;
          }
          if (key.name === 'backspace') {
            value = [...value].slice(0, -1).join('');
            if (!hidden) output.write('\b \b');
            return;
          }
          if (
            key.ctrl ||
            key.meta ||
            !text ||
            [...text].some(
              (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
            )
          )
            return;
          // Bounded input; reject instead of silently truncating credentials.
          if ([...(value + text)].length > (hidden ? 128 : 100)) {
            cleanup();
            reject(new Error('ADMIN_INPUT_TOO_LONG'));
            return;
          }
          value += text;
          if (!hidden) output.write(text);
        }
        input.on('keypress', onKey);
        input.once('end', onEnd);
      }),
  };
}
