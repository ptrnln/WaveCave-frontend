export default function routeToAPI(url) {
    const matchData = url.match(/^(?:\/api)(.*)/)
    debugger
    return process.env.NODE_ENV === "production" ?
        "https://api.ph4se.dev/wavecave" + matchData?.[1] ?? ""
        :
        url
}