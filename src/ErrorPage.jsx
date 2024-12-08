import { useRouteError } from "react-router-dom"
import "./reset.css"
import "./index.css"
import "./app.css"
import "./ErrorPage.css";


export default function ErrorPage() {
    const error = useRouteError();
    

    function renderSwitch(status) {
        
        switch(status) {
            case 404:
               return <img src="/images/404_img.svg" alt="404" title={`"Missing link"`} />
        }

    }


    return (
            <>
            <h1>{ error.status } - { error.statusText }</h1>
            { renderSwitch(error.status) }
            </>
    )
}