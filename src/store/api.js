export default function routeToAPI(path) {
  if (path.startsWith('/api'))  {
    path = path.slice(4)
    const base =  __API_BASE__ || '/api'
    return `${base}${path}`
  }
  return path;
}