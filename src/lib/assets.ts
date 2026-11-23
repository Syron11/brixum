/** Keep editable public paths portable between a domain root and a GitHub project subpath. */
export function publicAsset(path: string, base = import.meta.env.BASE_URL): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${base.replace(/\/$/, '')}${path}`;
}
