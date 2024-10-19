export const range = (attr: { min?: number; max: number }) => {
  let { min = 0, max } = attr;
  let result = [];
  for (let index = min; index < max; index++) {
    result.push(index);
  }
  return result;
};

export function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

// Remove undefined on object example
// Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
