type Dictionary = Record<string, unknown>;

function isDictionary(value: unknown): value is Dictionary {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function compareDictionaries(canonical: unknown, candidate: unknown, path = ''): string[] {
  const errors: string[] = [];
  if (!isDictionary(canonical) || !isDictionary(candidate)) {
    return [`${path || '<root>'}: ambos valores deben ser objetos de diccionario`];
  }
  const canonicalKeys = Object.keys(canonical).sort();
  const candidateKeys = Object.keys(candidate).sort();
  for (const key of canonicalKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in candidate)) {
      errors.push(`${currentPath}: clave faltante`);
      continue;
    }
    const expected = canonical[key];
    const received = candidate[key];
    if (isDictionary(expected)) {
      if (!isDictionary(received)) errors.push(`${currentPath}: namespace incompatible`);
      else errors.push(...compareDictionaries(expected, received, currentPath));
    } else if (typeof expected !== 'string' || typeof received !== 'string') {
      errors.push(`${currentPath}: los mensajes deben ser strings`);
    }
  }
  for (const key of candidateKeys) {
    if (!(key in canonical)) errors.push(`${path ? `${path}.` : ''}${key}: clave extra`);
  }
  return errors;
}
