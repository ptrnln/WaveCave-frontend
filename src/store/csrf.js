import routeToAPI from "./api";

async function csrfFetch(url, options = {}) {
    options.headers ||= {};
    options.method ||= 'GET'

    if(window.env["environment"] === "production") options.credentials = "include"

    if(options.method.toUpperCase() !== 'GET' ) {
        if(!(options.body?.constructor?.name === 'FormData')) options.headers['Content-Type'] ||= 'application/json'
        if(window.env["environment"] !== "production") options.headers['X-CSRF-Token'] = sessionStorage.getItem('X-CSRF-Token')
    }
  
    const res = await fetch(routeToAPI(url), options);

    return res;

}

export async function restoreCSRF() {
    const response = await csrfFetch(routeToAPI('/api/session'))
    storeCSRFToken(response)
    return response;
}

export function storeCSRFToken(response) {
    const csrfToken = response.headers.get('X-CSRF-Token')
    if (csrfToken) sessionStorage.setItem('X-CSRF-Token', csrfToken)
}

export default csrfFetch;