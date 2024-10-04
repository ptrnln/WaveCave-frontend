import { useRouteError } from "react-router-dom"

export default function ErrorPage() {
    const error = useRouteError();

    return (
        <>
        <h1>{error.status}</h1>
        <p>{error.data?.message}</p>
        {error.status === 404 &&
            <img src="/images/404_img.svg" alt="404" />
        }
        </>
    )
}