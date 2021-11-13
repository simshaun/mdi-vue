export function snakeToCamel(str) {
  return str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase())
}
