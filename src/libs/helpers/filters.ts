export function activeFilters(
  filters: Array<{ value: string; key: string; isActive: boolean }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalObject: Record<string, any> = {};
  for (const filter of filters) {
    if (filter.isActive) {
      finalObject[`filters[${filter.key}]`] = filter.value;
    }
  }

  return finalObject;
}
