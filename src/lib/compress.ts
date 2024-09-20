export function compress(gql: TemplateStringsArray | string) {
  return gql
    .toString()
    .replace(/(\b|\B)\s+(\b|\B)/gm, " ")
    .replace(/(\B)\s+(\B)|(\b)\s+(\B)|(\B)\s+(\b)/gm, "")
    .trim();
}
