export default function routeToAPI(url) {
    const matchData = url.match(/^(\/api)(.*)/)
    return window.env["environment"] === "production" && matchData ?
        "https://api.ph4se.dev/wavecave" + matchData[2]
        :
        url

}