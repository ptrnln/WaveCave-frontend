import routeToAPI from "./api";

async function csrfFetch(url, options = {}) {
    options.headers ||= {};
    options.method ||= 'GET'
    options.credentials = "include"

    const optionsResponse = await fetch(`${__API_BASE__}/csrf/restore`)

    if (optionsResponse.ok) {
        if (optionsResponse.headers.get('X-CSRF-Token')) sessionStorage.setItem('X-CSRF-Token', optionsResponse.headers.get('X-CSRF-Token'))
    }

    if (options.method.toUpperCase() !== 'GET') {
        if (options.body?.constructor?.name !== 'FormData') options.headers['Content-Type'] ||= 'application/json'

        const csrfToken = sessionStorage.getItem('X-CSRF-Token')
        if (csrfToken) options.headers['X-CSRF-Token'] = csrfToken
    }
    
    const res = await fetch(routeToAPI(url), options);
    storeCSRFToken(res)
    return res;
}

export async function restoreCSRF() {
    const response = await csrfFetch('/api/session')
    storeCSRFToken(response)
    return response;
}

export function storeCSRFToken(response) {
    const csrfToken = response.headers.get('X-CSRF-Token')
    if (csrfToken) sessionStorage.setItem('X-CSRF-Token', csrfToken)
}

export default csrfFetch;