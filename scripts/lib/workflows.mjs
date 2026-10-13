/**
 * Converte un filtro di GitHub Actions per branch e tag in una RegExp:
 * `*` qualsiasi sequenza senza `/`, `**` qualsiasi sequenza, `?` e `+`
 * ripetono il carattere precedente, `[...]` è un insieme; il filtro deve
 * coincidere con l'intero nome.
 * @param {string} filter
 * @returns {RegExp}
 */
export function githubFilterToRegExp(filter) {
  let source = "";
  for (let index = 0; index < filter.length; index += 1) {
    const char = filter[index] ?? "";
    if (char === "*") {
      const double = filter[index + 1] === "*";
      source += double ? ".*" : "[^/]*";
      if (double) index += 1;
    } else if (char === "[") {
      const end = filter.indexOf("]", index);
      source += filter.slice(index, end + 1);
      index = end;
    } else if (char === "?" || char === "+") {
      source += char;
    } else {
      source += char.replace(/[.^$|(){}\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${source}$`);
}

/**
 * @param {string} workflow
 * @returns {string[]}
 */
export function tagFilters(workflow) {
  const line = /^\s*tags:\s*\[(.*)\]\s*$/m.exec(workflow)?.[1] ?? "";
  return [...line.matchAll(/"([^"]+)"/g)].map((match) => match[1] ?? "");
}
