export function createObjectPath (root: object, path: string[]) {
  return path.reduce((acc: any, nextPath: string) => {
    acc[nextPath] = acc[nextPath] || {}
    return acc[nextPath]
  }, root)
}
