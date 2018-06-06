import { isArray, reduce } from 'slapdash'

export function createObjectPath (root, path) {
  path = isArray(path) ? path : path.split('.')
  return reduce(path, function (acc, nextPath) {
    acc[nextPath] = acc[nextPath] || {}
    return acc[nextPath]
  }, root)
}
