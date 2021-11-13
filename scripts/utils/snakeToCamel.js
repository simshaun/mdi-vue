exports.snakeToCamel = (str) =>
  str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase())
