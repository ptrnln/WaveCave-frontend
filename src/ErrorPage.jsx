import { useRouteError } from "react-router-dom"
import "./ErrorPage.css";


export default function ErrorPage() {
    const error = useRouteError();
    

    function renderSwitch(status) {
        
        switch(status) {
            case 404:
                
               return <>
               <h1>{ error.status } - Not Found </h1>
                <p>Oops! You're in uncharted waters, best return to port!</p>
                <object data="/images/shark_fin.svg" height={"350em"}/>
               </>
        }

    }


    return (
            <div className="error page">
                { renderSwitch(error.status) }
            </div>
    )
}