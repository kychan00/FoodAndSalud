export interface DailySuggestionCatalogItem {
  id: string;

  name: string;

  isFavorite: boolean;
}

export function rankDailySuggestions<T extends DailySuggestionCatalogItem>(
  recentIds: string[],
  catalog: T[],
  limit = 10,
): T[] {
  const byId = new Map(catalog.map((item) => [item.id, item]));

  const result: T[] = [];

  const used = new Set<string>();

  const add = (item: T | undefined) => {
    if (!item || used.has(item.id) || result.length >= limit) {
      return;
    }

    used.add(item.id);

    result.push(item);
  };

  /*
   * Primero:
   *
   * historial real de uso.
   */
  for (const id of recentIds) {
    add(byId.get(id));
  }

  /*
   * Después:
   *
   * favoritos que no hayan aparecido ya.
   */
  for (const item of catalog) {
    if (item.isFavorite) {
      add(item);
    }
  }

  /*
   * Finalmente:
   *
   * resto del catálogo activo.
   */
  for (const item of catalog) {
    add(item);
  }

  return result;
}

export function normalizeSuggestionText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-MX");
}
