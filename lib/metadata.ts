import type { Metadata } from 'next'

/**
 * Small helper to create Metadata with sane defaults.
 * Accepts a partial Metadata and returns a complete Metadata object.
 * Keeps merging shallow fields and applies base defaults for title/description.
 */
export function createMetadata(input: Partial<Metadata>): Metadata {
  const defaults: Partial<Metadata> = {
    title: 'Megicode',
    description: 'Megicode Software Solutions',
  }

  // Shallow merge: specific nested merges can be added as needed later.
  const merged = {
    ...defaults,
    ...input,
  } as Metadata

  return merged
}

export default createMetadata
