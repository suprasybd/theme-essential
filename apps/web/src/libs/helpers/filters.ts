export function activeFilters(
  filters: Array<{ value: string; key: string; isActive: boolean }>
): Record<string, any> {
  const finalObject: Record<string, any> = {};
  for (const filter of filters) {
    if (filter.isActive) {
      finalObject[`filters[${filter.key}]`] = filter.value;
    }
  }

  return finalObject;
}
